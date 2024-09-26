const Post = require('../models/Post');
const Comment = require('../models/Comment');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directory where files will be saved
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // Limit file size to 10MB
});
const createPost = async (req, res) => {
  const { title, content, tags, links } = req.body;

  // Ensure title and content are provided
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required.' });
  }

  try {
    let files = [];
    if (req.files) {
      files = req.files.map(file => ({
        fileName: file.originalname,
        fileUrl: `/uploads/${file.filename}` // Adjust the URL based on your server setup
      }));
    }

    const post = await Post.create({
      title,
      content,
      author: req.user._id, // Use req.user._id from the token
      tags,
      links: JSON.parse(links || '[]'), // Safe parsing of links
      files: files
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Export the multer upload middleware for use in your routes
module.exports.upload = upload;



// Get all posts with optional search by title
const getAllPosts = async (req, res) => {
  try {
    const { search } = req.query;  // Get the search query parameter

    // Create a filter object based on whether the search parameter is provided
    let filter = {};
    if (search) {
      filter.title = { $regex: search, $options: 'i' };  // Case-insensitive search
    }

    // Fetch posts using the filter
    const posts = await Post.find(filter)
      .populate('author', 'email')
      .populate('comments');

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'email')  // Populate the post author
      .populate({
        path: 'comments',
        populate: {
          path: 'author',  // Ensure the author of each comment is populated
          select: 'email _id',  // Only select necessary fields
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
// postController.js
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Authorization: Check if the logged-in user is the author of the post
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to delete this post' });
    }

    // Use findByIdAndDelete to remove the post
    await Post.findByIdAndDelete(req.params.id);

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
    const comment = await Comment.create({ author, content });
    const post = await Post.findById(req.params.id);

    post.comments.push(comment._id);
    post.totalComments += 1;

    await post.save();
    await comment.populate('author', 'email'); // Populate author for the frontend

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

    // Only allow post author or comment author to edit
    if (req.user._id.toString() !== comment.author.toString()) {
      return res.status(403).json({ message: 'Unauthorized to edit this comment' });
    }

    comment.content = content || comment.content;
    await comment.save();

    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Delete a comment
// commentController.js
const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Authorization: Check if the logged-in user is the author of the comment or the post
    if (
      req.user._id.toString() !== comment.author.toString() &&
      req.user._id.toString() !== post.author.toString()
    ) {
      return res.status(403).json({ message: 'Unauthorized to delete this comment' });
    }

    // Remove the comment from the post's comments array
    post.comments = post.comments.filter((c) => c.toString() !== comment._id.toString());

    // Use findByIdAndDelete to delete the comment
    await Comment.findByIdAndDelete(req.params.commentId);

    await post.save();

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const handleFiles = async (req, res) => {
  try {
    const filePath = path.join(__dirname, '../uploads', req.params.filename);
    console.log(`Serving file from: ${filePath}`); // Debugging
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Error serving file:', err);
        res.status(404).send('File not found');
      }
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).send('Server error');
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
  upload,
  handleFiles,
};
