const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Main authentication middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Access denied' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch fresh user data from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.sub }
    });

    if (!user) throw new Error('User not found');
    
    // Add the complete user object to the request
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Role verification middlewares
const isUser = (req, res, next) => {
  if (req.user.user_type !== 'user') {
    return res.status(403).json({ error: 'User access required' });
  }
  next();
};

const isOperator = (req, res, next) => {
  if (req.user.user_type !== 'operator') {
    return res.status(403).json({ error: 'Operator access required' });
  }
  next();
};

const isPartner = (req, res, next) => {
  if (req.user.user_type !== 'partner') {
    return res.status(403).json({ error: 'Partner access required' });
  }
  next();
};

// Token generator
const generateToken = (user) => {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      user_type: user.user_type
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

module.exports = {
  authMiddleware,
  generateToken,
  isUser,
  isOperator,
  isPartner
};