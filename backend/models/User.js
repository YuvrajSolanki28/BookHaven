const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { 
        type: String, 
        required: function() {
            return this.authProvider === 'local';
        }
    },
    googleId: { type: String },
    profilePicture: { type: String },
    authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
    token: { type: String },
    isAdmin: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    verifiedAt: { type: Date }
});

// Check if verification expired (2 weeks)
userSchema.methods.isVerificationExpired = function() {
    if (!this.isVerified || !this.verifiedAt) return true;
    
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    
    return this.verifiedAt < twoWeeksAgo;
};

const Users = mongoose.model("Users", userSchema);
module.exports = Users;
