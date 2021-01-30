const mongoose = require('mongoose');

const { Schema } = mongoose;

const user = new Schema({
  auth: {
    name: { type: String, default: 'Admin' },
    password: { type: String, default: 'AdminPassword' },
  },
  houseEarnings: { type: Number, default: 0 },
});

module.exports = mongoose.model('User', user);
