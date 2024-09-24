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
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/',protect, getAllPosts); // View all posts
router.get('/:id',protect, getPostById); // View a single post

// Protected routes
router.post('/',protect, createPost); // Create a new post
router.put('/:id',protect, updatePost); // Update a post
router.delete('/:id',protect, deletePost); // Delete a post
router.post('/:id/spark',protect, sparkPost); // Spark (like) a post
router.delete('/:id/spark',protect, removeSpark); // Remove spark (unlike) a post
router.post('/:id/comment',protect, commentOnPost); // Comment on a post
router.put('/:id/comment/:commentId',protect, editComment); // Edit a comment
router.delete('/:id/comment/:commentId',protect, deleteComment); // Delete a comment


module.exports = router;
