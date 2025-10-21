const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();

// Local modules
const connectDB = require("./config/db");
const authRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const googleAuthRoutes = require("./routes/googleAuth");
const booksRoutes = require("./routes/books");
const ordersRoutes = require("./routes/orders");
const wishlistRoutes = require("./routes/wishlist");
const marketingRoutes = require("./routes/marketing");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: 'https://book-haven-r7yg.vercel.app',
    credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport serialization
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await require('./models/User').findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/auth/admin", adminRoutes);
app.use("/auth", googleAuthRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/marketing", marketingRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
