const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  const { name, email, password, about } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, about });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 30 * 24 * 60 * 60 * 1000 
    });

    res.status(201).json({ _id: user.id, email: user.email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 30 * 24 * 60 * 60 * 1000, 
    });

    res.json({ _id: user.id, email: user.email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getUserProfile = async (req, res) => {
  console.log('GET /api/users/profile request received.');
  if (req.user) {
    res.json({
      isAuthenticated: true,
      user: {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        about: req.user.about,
      },
    });
  } else {
    res.status(401).json({ isAuthenticated: false });
  }
};



const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password'); 

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  const { password, about, name } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name || user.name;
    user.about = about || user.about;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(`Deleting user: ${user._id}, Email: ${user.email}`); 

    await User.findByIdAndDelete(req.user.id);
    res.clearCookie('jwt');
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user profile:', error.message); 
    res.status(500).json({ message: 'Server error during deletion' });
  }
};
const getCommentsByUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const comments = await Comment.find({ author: userId }).populate('post', '_id title');

    if (!comments) {
      return res.status(404).json({ message: 'No comments found for this user.' });
    }

    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments by user:', error);
    res.status(500).json({ message: 'Error fetching comments' });
  }
};


module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  getUserById,
  getCommentsByUser,
};
