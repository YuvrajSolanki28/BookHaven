const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("../models/User");

const router = express.Router();

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

// Update login to use Admin model
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        // Find user with isAdmin: true
        const user = await Users.findOne({ email, isAdmin: true });
        if (!user) {
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

// Add this route to get all orders for admin
router.get("/orders", verifyAdmin, async (req, res) => {
    try {
        const Order = require("../models/Order");
        const orders = await Order.find().sort({ orderDate: -1 });
        res.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
});

// Get all users
router.get("/users", verifyAdmin, async (req, res) => {
    try {
        const users = await Users.find().select('-password -token').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

// Delete user
router.delete("/users/:id", verifyAdmin, async (req, res) => {
    try {
        const user = await Users.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete user" });
    }
});

// Toggle admin status
router.put("/users/:id/admin", verifyAdmin, async (req, res) => {
    try {
        const { isAdmin } = req.body;
        const user = await Users.findByIdAndUpdate(
            req.params.id, 
            { isAdmin }, 
            { new: true }
        ).select('-password -token');
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json({ message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({ error: "Failed to update user" });
    }
});

module.exports = router;