const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('../config/passport.js');
const { generateToken, authMiddleware, isUser, isOperator, isPartner } = require('../middlewares/auth.js'); // Added authMiddleware
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

// Google auth callback
router.get('/google/callback', 
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const token = generateToken(req.user);
    
    if (req.user.roleSelected) {
      return res.redirect(`https://uplyft.systems/dashboard?token=${token}`);
    }
    res.redirect(`https://uplyft.systems/role-select?token=${token}`);
  }
);


// Update role endpoint
router.put('/update-role', authMiddleware, async (req, res) => {
  const { role } = req.body;
  const validRoles = ['user', 'operator', 'partner'];

  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role type' });
  }

  try {
    const userId = req.user?.id || req.user?.sub;
    const updatedUser = await prisma.user.update({
      where:{ id: userId},
      data: { 
        user_type: role,
        roleSelected: true // Add this line
      }
    });

    // Send 200 with JSON response
    res.status(200).json({
      success: true,
      role: updatedUser.user_type
    });

  } catch (error) {
    console.error('Role update error:', error);
    res.status(500).json({ 
      error: 'Failed to update role',
      details: error.message 
    });
  }
});

router.get('/check-user', authMiddleware, isUser, (req, res) => {
  res.json({ valid: true, role: 'user' });
});

router.get('/check-operator', authMiddleware, isOperator, (req, res) => {
  res.json({ valid: true, role: 'operator' });
});

router.get('/check-partner', authMiddleware, isPartner, (req, res) => {
  res.json({ valid: true, role: 'partner' });
});

router.get('/check-role', authMiddleware, (req, res) => {
  res.json({ 
    roleSelected: !!req.user.user_type, 
    role: req.user.user_type || null
  });
});


module.exports = router;
