// index.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');  // JWT for token management
const { protect } = require('./middleware/authMiddleware');

dotenv.config();
connectDB();

const app = express();
const corsOptions = {
  origin: 'http://localhost:5173',  // Frontend URL
  credentials: true,  // Allow credentials (cookies, authorization headers)
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Route for checking if the user is authenticated
app.get('/api/users/check-auth', protect, (req, res) => {
  if (req.user) {
    res.json({ isAuthenticated: true, userId: req.user._id });
  } else {
    res.status(401).json({ isAuthenticated: false });
  }
});

// Route to get current authenticated user details
app.get('/api/users/me', protect, (req, res) => {
  if (req.user) {
    res.json({ isAuthenticated: true, userId: req.user._id });
  } else {
    res.status(401).json({ isAuthenticated: false });
  }
});

// Logout route to clear the JWT cookie
app.post('/api/users/logout', (req, res) => {
  res.clearCookie('jwt');
  res.json({ message: 'Logged out successfully' });
});

// Apply the JWT middleware to the post routes (or any other routes you want protected)
app.use('/api/posts', protect, postRoutes);  // Protecting postRoutes with JWT authentication
app.use('/api/users', userRoutes);  // User routes (e.g., login, register) don't need authentication

// Start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
