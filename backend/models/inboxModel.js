var mongoose = require('mongoose');
const { Timestamp } = require('mongodb');
var Schema = mongoose.Schema;

const inboxSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    required: true,
  },
  added_date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  updated_date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  token: {
    type: Object,
    required: true,
  },
});

module.exports = User = mongoose.model('inbox_collections', inboxSchema);
