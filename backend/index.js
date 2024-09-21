const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');  // JWT for token management

dotenv.config();
connectDB();

const app = express();
const corsOptions = {
  origin: 'http://localhost:5173',  // Allow requests only from your frontend
  credentials: true,  // Allow credentials (cookies, authorization headers)
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Middleware to check for JWT token in cookies
const authenticateJWT = (req, res, next) => {
  const token = req.cookies.jwt;  // Get token from cookies

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify token
    req.user = decoded;  // Attach decoded user to the request object
    next();  // Move to the next middleware/route handler
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Route for checking if the user is authenticated
app.get('/api/users/check-auth', (req, res) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ isAuthenticated: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ isAuthenticated: true, userId: decoded.id });
  } catch (err) {
    return res.status(401).json({ isAuthenticated: false });
  }
});

// Logout route to clear the JWT cookie
app.post('/api/users/logout', (req, res) => {
  res.clearCookie('jwt');
  res.json({ message: 'Logged out successfully' });
});

// Apply the JWT middleware to the post routes (or any other routes you want protected)
app.use('/api/posts', authenticateJWT, postRoutes);  // Protecting postRoutes with JWT authentication
app.use('/api/users', userRoutes);  // User routes (e.g., login, register) don't need authentication

// Start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
