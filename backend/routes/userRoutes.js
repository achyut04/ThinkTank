const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  getUserById,
  getCommentsByUser,
  upload,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.get('/comments/:id',protect, getCommentsByUser);
router.get('/:id', getUserById);

router.put('/profile', protect,upload.single('profilePicture'), updateUserProfile);
router.delete('/profile', protect, deleteUserProfile);

module.exports = router;
