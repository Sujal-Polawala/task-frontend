// models/user.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message: String,
  taskId: {type: mongoose.Schema.Types.ObjectId, ref: 'Task'},
  date: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  // ✅ Add this field
  notifications: [notificationSchema],
});

module.exports = mongoose.model('User', userSchema);