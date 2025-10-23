// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("../models/User");
const { sendVerificationEmail, sendPasswordResetEmail  } = require("../utils/sendemail");
const crypto = require('crypto');

const resetTokens = {};
const router = express.Router();

const verificationCodes = {};



//signup
router.post("/signup", async (req, res) => {
    try {
        const { fullName, email, password, termsAccepted, } = req.body;

        // Check if the email is already registered
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email is already registered" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new Users({
            fullName,
            email,
            password: hashedPassword,
            termsAccepted,
        });

        // Save the new user to the database
        await newUser.save();

        // Generate a JWT token
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

        // Respond with success message and token
        res.status(201).json({ message: "User registered successfully!", token });
    } catch (error) {
        console.error("Error in signup:", error);
        res.status(500).json({ error: "Server error during signup" });
    }
});

//login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Check for local users with expired verification
        if (user.authProvider === "local" && typeof user.isVerificationExpired === "function" && user.isVerificationExpired()) {
            user.isVerified = false;
            user.verifiedAt = null;
            await user.save();

            // Generate and send a new code
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            verificationCodes[email] = code;

            try {
                await sendVerificationEmail(email, code);
            } catch (err) {
                console.error("Error sending verification email:", err);
                return res.status(500).json({
                    error: "Could not send new verification email. Please try again later.",
                });
            }

            return res.status(403).json({
                error: "Email verification expired. A new verification code was sent.",
            });
        }

        // If the user isn’t verified yet
        if (user.authProvider === "local" && !user.isVerified) {
            return res.status(403).json({
                error: "Email not verified. Please verify your account.",
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                isAdmin: user.isAdmin,
                isVerified: user.isVerified,
            },
        });
    } catch (error) {
        console.error("Error in login:", error);
        return res.status(500).json({ error: "Server error during login" });
    }
});

// Verify code
router.post("/verify", async (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ error: "Email and code are required" });
    }

    if (verificationCodes[email] === code) {
        try {
            const user = await Users.findOne({ email });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            // Set verification with timestamp
            user.isVerified = true;
            user.verifiedAt = new Date();
            
            const token = jwt.sign(
                { userId: user._id, email: user.email, isAdmin: user.isAdmin }, 
                process.env.JWT_SECRET, 
                { expiresIn: "7d" }
            );

            user.token = token;
            await user.save();

            delete verificationCodes[email];

            res.json({ 
                message: "Verification successful.", 
                token,
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    isVerified: user.isVerified
                }
            });
        } catch (error) {
            console.error("Error during verification:", error);
            res.status(500).json({ error: "Server error during verification" });
        }
    } else {
        return res.status(400).json({ error: "Invalid or expired verification code" });
    }
});

//profile
router.get('/profile/:token', async (req, res) => {
    const { token } = req.params;

    if (!token) {
        return res.status(400).send('Token is required');
    }

    try {
        // Decode JWT to get user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id || decoded.userId;
        
        // Fetch user by ID instead of token
        const userProfile = await Users.findById(userId).select('-password -token');
        if (!userProfile) {
            return res.status(404).send('User not found');
        }

        res.json(userProfile);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).send('Server error');
    }
});

// Change Password
router.post("/change-password", async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const user = await Users.findById(decoded.id || decoded.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // Hash and save new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully!" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Forgot Password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    resetTokens[resetToken] = { email, expires: Date.now() + 3600000 }; // 1 hour

    await sendPasswordResetEmail(email, resetToken);
    res.json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Error in forgot password:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Reset Password
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    const tokenData = resetTokens[token];
    if (!tokenData || tokenData.expires < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const user = await Users.findOne({ email: tokenData.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Remove used token
    delete resetTokens[token];

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error in reset password:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update User Profile
router.put("/update-profile", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const user = await Users.findById(decoded.id || decoded.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Always allow updating name
    if (fullName) user.fullName = fullName;

    // If email is being changed → require password check
    if (email && email !== user.email) {
      if (!password) {
        return res.status(400).json({ error: "Password required to change email" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Password is incorrect" });
      }

      user.email = email;
    }

    await user.save();

    res.json({
      message: "Profile updated successfully!",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// backend/routes/user.js - Add these routes
router.get('/preferences/:userId', async (req, res) => {
  try {
    const user = await Users.findById(req.params.userId).select('preferences');
    res.json(user.preferences || {});
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch preferences' });
  }
});

router.put('/preferences/:userId', async (req, res) => {
  try {
    await Users.findByIdAndUpdate(req.params.userId, { preferences: req.body });
    res.json({ message: 'Preferences updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

module.exports = router;