const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  user: String,    
  gold: Number,
  star: Number  
});

module.exports = mongoose.model('User', UserSchema);