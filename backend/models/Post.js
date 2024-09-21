const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true }, // Add content field for the post
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  totalSparks: { type: Number, default: 0 },
  totalComments: { type: Number, default: 0 },
  sparkedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  tags: [{ type: String }],
  dateOfPost: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', postSchema);
