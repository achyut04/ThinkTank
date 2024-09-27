const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');  
const { protect } = require('./middleware/authMiddleware');
const path = require('path');

dotenv.config();
connectDB();

const app = express();
const corsOptions = {
  origin: 'http://localhost:5173', 
  credentials: true,  
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/api/users/check-auth', protect, (req, res) => {
  if (req.user) {
    res.json({ isAuthenticated: true, userId: req.user._id });
  } else {
    res.status(401).json({ isAuthenticated: false });
  }
});



app.post('/api/users/logout', (req, res) => {
  res.clearCookie('jwt');
  res.json({ message: 'Logged out successfully' });
});

app.use('/api/posts', protect, postRoutes);  
app.use('/api/users', userRoutes);  


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
