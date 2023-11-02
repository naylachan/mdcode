const mongoose = require('mongoose');

const UlarTanggaSchema = new mongoose.Schema({
  id: String,
  group: String,
  start: String,
  status: String,
  giliran: Number,
  join: [{
    player: Number,
    user: String,
    nomer: Number
  }]  
});

module.exports = mongoose.model('UlarTangga', UlarTanggaSchema);