const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.cookies.jwt) {
    try {
      token = req.cookies.jwt;
      console.log('Token found in cookies:', token); 

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded); 

      req.user = await User.findById(decoded.id).select('-password');
      console.log('User found in database:', req.user); 

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      next();
    } catch (error) {
      console.error('Error in protect middleware:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.log('No JWT token found in cookies'); 
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};


module.exports = { protect };
