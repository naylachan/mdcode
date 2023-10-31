const mongoose = require('mongoose');

const KuisSchema = new mongoose.Schema({
  id: String,
  group: String,
  start: String,
  status: String,
  join: [String],
  kuis: String,
  index: Number,
  jawab: Number
});

module.exports = mongoose.model('Kuis', KuisSchema);