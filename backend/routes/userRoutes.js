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
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');


router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.get('/comments/:id',protect, getCommentsByUser);
router.get('/:id', getUserById);

router.put('/profile', protect, updateUserProfile);
router.delete('/profile', protect, deleteUserProfile);

module.exports = router;
