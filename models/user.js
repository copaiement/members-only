const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  userType: { type: String, required: true, enum: ['basic', 'member', 'admin'] },
});

// Export model
module.exports = mongoose.model('User', UserSchema);