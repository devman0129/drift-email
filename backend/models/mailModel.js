var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const MailSchema = new Schema({
  mailId: {
    type: String,
    required: true,
  },
  threadId: {
    type: String,
    required: true,
  },
  labelIds: {
    type: Array,
    required: true,
  },
  snippet: {
    type: String,
    required: true,
  },
  sizeEstimate: {
    type: Number,
    required: true,
  },
  historyId: {
    type: String,
    required: true,
  },
  internalDate: {
    type: String,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
    required: false,
  },
  from: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: false,
  },
  message: {
    type: String,
    required: true,
  },
});

module.exports = Mail = mongoose.model("mail_collections", MailSchema);
