const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  about: { type: String },
  dateOfJoin: { type: Date, default: Date.now },
  profilePicture: { type: String },
});

module.exports = mongoose.model('User', userSchema);
