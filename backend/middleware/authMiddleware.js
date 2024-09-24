// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  console.log('Cookies:', req.cookies); // Debug: Check incoming cookies

  if (req.cookies.jwt) {
    try {
      token = req.cookies.jwt;
      console.log('JWT Token:', token); // Debug: Check token

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      console.log('Authenticated user:', req.user); // Debug: Check authenticated user

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      next();
    } catch (error) {
      console.error('Error in protect middleware:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};


module.exports = { protect };
