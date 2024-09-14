var mongoose = require("mongoose");
const { Timestamp } = require("mongodb");
const bcrypt = require("bcrypt");
var Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Number,
    required: true,
  },
  picture: {
    type: String,
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
  status: {
    type: Number,
    required: true,
  },
  temporarytoken: {
    type: String,
    required: true,
  },
});

module.exports = User = mongoose.model("user_collections", userSchema);
