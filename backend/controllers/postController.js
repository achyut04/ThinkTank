const Post = require('../models/Post');
const Comment = require('../models/Comment');
const mongoose = require('mongoose');

const createPost = async (req, res) => {
  const { title, content, tags } = req.body;

  // Ensure title and content are provided
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required.' });
  }

  try {
    // Automatically set the author from the authenticated user (req.user)
    const post = await Post.create({
      title,
      content,
      author: req.user._id,  // Use req.user._id from the token
      tags,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'email').populate('comments');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'email')  // Populate the author's email
      .populate({
        path: 'comments',
        select: 'content dateOfComment',  // Explicitly select content and dateOfComment
        populate: {
          path: 'author',  // Populate the author of each comment
          select: 'email',  // Only select the email of the author
        },
      });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update a post
const updatePost = async (req, res) => {
  const { title, content, tags } = req.body;

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Update fields
    post.title = title || post.title;
    post.content = content || post.content;
    post.tags = tags || post.tags;

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a post
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    await post.remove();
    res.json({ message: 'Post removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Spark (like) a post
const sparkPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post.sparkedBy.includes(req.body.userId)) {
      post.sparkedBy.push(req.body.userId);
      post.totalSparks += 1;
    } else {
      return res.status(400).json({ message: 'User already sparked this post' });
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove spark (unlike) a post
const removeSpark = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.sparkedBy.includes(req.body.userId)) {
      post.sparkedBy = post.sparkedBy.filter((userId) => userId.toString() !== req.body.userId);
      post.totalSparks -= 1;
    } else {
      return res.status(400).json({ message: 'User has not sparked this post' });
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Comment on a post
const commentOnPost = async (req, res) => {
  const { author, content } = req.body;

  try {
    const comment = await Comment.create({ author, content });  // Ensure the 'author' is a valid User ObjectID
    const post = await Post.findById(req.params.id);

    post.comments.push(comment._id);
    post.totalComments += 1;

    await post.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit a comment
const editComment = async (req, res) => {
  const { content } = req.body;

  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.content = content || comment.content;
    await comment.save();

    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    post.comments = post.comments.filter((c) => c.toString() !== comment._id.toString());
    post.totalComments -= 1;

    await comment.remove();
    await post.save();

    res.json({ message: 'Comment removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};
