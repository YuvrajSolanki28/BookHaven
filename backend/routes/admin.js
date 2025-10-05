const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("../models/User");
const router = express.Router();

// Add to backend/routes/user.js

// Admin Login Route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid admin credentials" });
        }

        if (!user.isAdmin) {
            return res.status(403).json({ error: "Access denied. Admin privileges required." });
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
