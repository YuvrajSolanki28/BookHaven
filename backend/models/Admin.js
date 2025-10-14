// backend/models/Admin.js
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' },
    createdAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
});

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;