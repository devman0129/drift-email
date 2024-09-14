var mongoose = require("mongoose");
const { Timestamp } = require("mongodb");
var Schema = mongoose.Schema;

const typeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  keyword: {
    type: Array,
    required: true,
  },
  color: {
    type: Object,
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
  isDeleted: {
    type: Number,
    default: 0,
    required: true,
  },
});

module.exports = Type = mongoose.model("type_collections", typeSchema);
