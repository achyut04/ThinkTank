const express = require('express');
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  sparkPost,
  removeSpark,
  commentOnPost,
  editComment,
  deleteComment,
  upload, 
  handleFiles
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getAllPosts);
router.get('/:id', protect, getPostById);

router.post('/', protect, upload.array('files', 10), createPost); 
router.put('/:id', protect, updatePost); 
router.delete('/:id', protect, deletePost);
router.post('/:id/spark', protect, sparkPost);
router.delete('/:id/spark', protect, removeSpark);
router.post('/:id/comment', protect, commentOnPost); 
router.put('/:id/comment/:commentId', protect, editComment);
router.delete('/:id/comment/:commentId', protect, deleteComment); 
router.get('/files/:filename',protect, handleFiles);

module.exports = router;
