const mongoose = require('mongoose');

const { Schema } = mongoose;

const lobby = new Schema({
  name: { type: String },
  maxNumUsers: { type: Number, default: 5 },
  entryFee: { type: Number, default: 10 },
  winner: { type: String, default: '' },
  priceMoney: { type: Number, default: 0 },
  users: [{ type: String }],
});

module.exports = mongoose.model('Lobby', lobby);
