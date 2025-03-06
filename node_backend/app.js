const dotenv = require('dotenv');
const cors = require('cors');
const express = require('express');
const passport = require('./config/passport.js');
const authRoutes = require('./routes/auth.js');
const { authMiddleware } = require('./middlewares/auth.js');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

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