const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('../config/passport.js');
const { generateToken } = require('../middlewares/auth.js');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Local registration
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'Email exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    const token = generateToken(user);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Local login
router.post('/login', passport.authenticate('local', { session: false }), 
  (req, res) => {
    const token = generateToken(req.user);
    res.json({ token });
  }
);

// Google auth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const token = generateToken(req.user);
    res.redirect(`http://localhost:5173/auth-success?token=${token}`); //redirectURL
  }
);

module.exports = router;
