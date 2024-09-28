const Post = require('../models/Post');
const Comment = require('../models/Comment');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});
const createPost = async (req, res) => {
  const { title, content, tags, links } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required.' });
  }

  try {
    let files = [];
    if (req.files) {
      files = req.files.map(file => ({
        fileName: file.originalname,
        fileUrl: `/uploads/${file.filename}`
      }));
    }

    const post = await Post.create({
      title,
      content,
      author: req.user._id, 
      tags,
      links: JSON.parse(links || '[]'), 
      files: files
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const getAllPosts = async (req, res) => {
  try {
    const { search } = req.query; 

    let filter = {};
    if (search) {
      filter.title = { $regex: search, $options: 'i' }; 
    }

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
      .populate('author', 'email')
      .populate({
        path: 'comments',
        populate: {
          path: 'author', 
          select: 'email _id',  
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

const getPostsByCreator = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.creatorId });
    console.log("I am here");
    console.log(req.params.id);
    console.log(posts);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updatePost = async (req, res) => {
  const { title, content, tags } = req.body;

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.tags = tags || post.tags;

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({ message: 'Post removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


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


const commentOnPost = async (req, res) => {
  const { author, content } = req.body;

  try {
    const comment = await Comment.create({ author, content });
    const post = await Post.findById(req.params.id);

    post.comments.push(comment._id);
    post.totalComments += 1;

    await post.save();
    await comment.populate('author', 'email');

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const editComment = async (req, res) => {
  const { content } = req.body;

  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

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


const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    if (
      req.user._id.toString() !== comment.author.toString() &&
      req.user._id.toString() !== post.author.toString()
    ) {
      return res.status(403).json({ message: 'Unauthorized to delete this comment' });
    }

    post.comments = post.comments.filter((c) => c.toString() !== comment._id.toString());

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
    console.log(`Serving file from: ${filePath}`); 
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
  getPostsByCreator,
};
