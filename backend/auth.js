const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');

// Passport config
const configurePassport = (passportInstance) => {
  passportInstance.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          const googleId = profile.id;

          let user = await User.findOne({ $or: [{ googleId }, { email }] });

          if (user) {
            if (!user.googleId) {
              user.googleId = googleId;
              await user.save();
            }
            return done(null, user);
          }

          user = new User({
            googleId,
            email,
            fullName: profile.displayName,
            picture: profile.photos?.[0]?.value,
          });
          await user.save();
          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  passportInstance.serializeUser((user, done) => done(null, user.id));
  passportInstance.deserializeUser(async (id, done) => {
    try {
      const u = await User.findById(id);
      done(null, u);
    } catch (err) {
      done(err);
    }
  });
};


module.exports = configurePassport;
