const dotenv = require('dotenv');
const cors = require('cors');
const express = require('express');
const session = require("express-session");
const connectPgSimple = require("connect-pg-simple");
const passport = require('./config/passport.js');
const authRoutes = require('./routes/auth.js');
const { authMiddleware } = require('./middlewares/auth.js');

dotenv.config();

const app = express();

app.set('trust proxy', 1);

// Configure the PostgreSQL session store
const PgSession = connectPgSimple(session);
const sessionStore = new PgSession({
  // Use your PostgreSQL connection string from an environment variable
  conString: process.env.DATABASE_URL,
  // Automatically create the session table if it doesn't exist
  createTableIfMissing: true,
});

// Set up the session middleware with the PostgreSQL store.
// Note: The session middleware must be added before initializing Passport.
app.use(session({
  store: sessionStore,
  secret: process.env.SESSION_SECRET || "delhi se hu behenchod",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production", // secure true if in production and using HTTPS
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24, // Session valid for 24 hours
  },
}));

// Other middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// Initialize Passport after session middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);

// Protected route example
app.get('/profile', authMiddleware, (req, res) => {
  res.json(req.user);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
