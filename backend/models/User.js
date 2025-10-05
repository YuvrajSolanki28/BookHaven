const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: function() { return !this.googleId; } },
    googleId: { type: String },
    token: { type: String },
    isAdmin: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false }
});

const Users = mongoose.model("Users", userSchema);

module.exports = Users;
