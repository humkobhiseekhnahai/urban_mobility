const dotenv = require('dotenv');
const cors = require('cors');
const express = require('express');
const passport = require('./config/passport.js');
const authRoutes = require('./routes/auth.js');
const { authMiddleware } = require('./middlewares/auth.js');
const session = require("express-session")

dotenv.config();

const app = express();

app.use(session({
  secret:"delhi se hu behenchod",
  cookie:{
    httpOnly:true,
    secure:false,
  },
  saveUninitialized:true,
  resave:false
}))

// Middleware
app.use(cors({origin:"*"}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(session({
  secret:"delhi se hu behenchod",
  cookie:{
    httpOnly:true,
    secure:false,
  },
  saveUninitialized:true,
  resave:false
}))

// Routes
app.use('/auth', authRoutes);

// Protected route example
app.get('/profile', authMiddleware, (req, res) => {
  res.json(req.user);
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));