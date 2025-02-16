const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Contains sub, email, user_type
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

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
  generateToken
};
