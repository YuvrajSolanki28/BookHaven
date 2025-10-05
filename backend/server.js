const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const passport = require('passport');
const configurePassport = require('./auth');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Local modules
const connectDB = require("./config/db");
const authRoutes = require("./routes/user");



dotenv.config();

const app = express();
const PORT = process.env.PORT || 8001;

app.use(express.json());
app.use(cookieParser());


// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// Passport
configurePassport(passport);
app.use(passport.initialize());

// Auth routes
app.use('/auth', authRoutes);

app.get('/api/protected', (req, res) => {
  // Example: you would validate JWT here (middleware)
  res.json({ msg: 'This is a public test endpoint' });
});


// Routes
app.use("/api/auth", authRoutes);


app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
