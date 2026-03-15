const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: [{ type: String, required: true }]
}, { timestamps: true }); // To track when each message was added

const chatSchema = new mongoose.Schema({
  userid: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  messages: [messageSchema],
}, { timestamps: true }); // To track session creation & update times

module.exports = mongoose.model('hiveChat', chatSchema);
