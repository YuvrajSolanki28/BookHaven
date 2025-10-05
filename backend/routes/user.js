// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("../models/User");
const { sendVerificationEmail } = require("../utils/sendemail");
const passport = require('passport');
const router = express.Router();

// In-memory storage for verification codes (Use Redis or DB for production)
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


// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        // Check if the user exists
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Check if email is verified
        if (!user.isVerified) {
            // Optional: Generate and send verification code
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            verificationCodes[email] = code;
            sendVerificationEmail(email, code);

            // Save token in DB
            user.verificationToken = code;
            await user.save();

            return res.status(403).json({
                error: "Email not verified. Verification email sent.",
            });
        }

        // If verified, generate JWT
        const token = jwt.sign(
            { userId: user._id, email: user.email, isAdmin: user.isAdmin },
            process.env.JWT_SECRET
        );

        res.json({ token, isAdmin: user.isAdmin });

    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ error: "Server error during login" });
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
            // Find the user by email
            const user = await Users.findOne({ email });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            // Generate new JWT token (optional: update token on verification success)
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

            // Save the token to the user's record
            user.token = token;
            await user.save();


            res.json({ message: "Verification successful. Login complete.", token });
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
        // Fetch user by token
        const userProfile = await Users.findOne({ token });
        if (!userProfile) {
            return res.status(404).send('User not found');
        }

        res.json(userProfile); // Return user data as JSON
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

// Admin Login Route
router.post("/admin/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const user = await Users.findOne({ email });
        if (!user || !user.isAdmin) {
            return res.status(401).json({ error: "Invalid admin credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid admin credentials" });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, isAdmin: true },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.json({ 
            token, 
            isAdmin: true,
            user: { id: user._id, fullName: user.fullName, email: user.email }
        });

    } catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({ error: "Server error during admin login" });
    }
});


//google login oauth Routes
router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/auth/google/failure" }),
  async (req, res) => {
    try {
      const user = req.user;

      // Generate JWT
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          name: user.fullName,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // 🔹 Save token to user in DB
      user.token = token;
      await user.save();

      // Redirect to frontend with token
      const redirectUrl = `${process.env.FRONTEND_URL}/oauth/callback?token=${token}`;
      return res.redirect(redirectUrl);
    } catch (error) {
      console.error("Google callback error:", error);
      res.redirect("/auth/google/failure");
    }
  }
);



router.get("/google/failure", (req, res) => {
  res.status(401).send("Google authentication failed");
});


module.exports = router;