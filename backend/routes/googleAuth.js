const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const Users = require('../models/User');

const router = express.Router();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await Users.findOne({ googleId: profile.id });
        
        if (user) {
            return done(null, user);
        }
        
        user = await Users.findOne({ email: profile.emails[0].value });
        
        if (user) {
            user.googleId = profile.id;
            user.authProvider = 'google';
            user.isVerified = true;
            user.profilePicture = profile.photos[0]?.value;
            await user.save();
            return done(null, user);
        }
        
        user = new Users({
            googleId: profile.id,
            fullName: profile.displayName,
            email: profile.emails[0].value,
            profilePicture: profile.photos[0]?.value,
            authProvider: 'google',
            isVerified: true
        });
        
        await user.save();
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/google/callback', 
    passport.authenticate('google', { session: false }),
    (req, res) => {
        const token = jwt.sign(
            { userId: req.user._id, email: req.user.email, isAdmin: req.user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.redirect(`https://book-haven-r7yg.vercel.app/auth/success?token=${token}`);
    }
);

module.exports = router;