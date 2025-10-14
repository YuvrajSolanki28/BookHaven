const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Admin = require("../models/Admin");

// Add to backend/routes/user.js

// Update login to use Admin model
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const admin = await Admin.findOne({ email, isActive: true });
        if (!admin) {
            return res.status(401).json({ error: "Invalid admin credentials" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid admin credentials" });
        }

        const token = jwt.sign(
            { userId: admin._id, email: admin.email, isAdmin: true },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.json({ 
            token, 
            isAdmin: true,
            user: { id: admin._id, fullName: admin.fullName, email: admin.email }
        });

    } catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({ error: "Server error during admin login" });
    }
});

// Admin Signup Route (Only accessible by existing admins)
router.post("/signup", async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ error: "Admin already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        
        const newAdmin = new Admin({
            fullName,
            email,
            password: hashedPassword,
        });

        await newAdmin.save();

        res.status(201).json({ 
            message: "Admin created successfully",
            admin: { id: newAdmin._id, fullName: newAdmin.fullName, email: newAdmin.email }
        });

    } catch (error) {
        console.error("Admin signup error:", error);
        res.status(500).json({ error: "Server error during admin creation" });
    }
});

// Admin verification middleware
const verifyAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Access token required" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!decoded.isAdmin) {
            return res.status(403).json({ error: "Admin access required" });
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};

module.exports = router;