const mongoose = require("mongoose");

const fileLogSchema = new mongoose.Schema({
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "File",
  },

  userId: String,
  userEmail: String,

  action: {
    type: String,
    enum: ["upload", "view", "download", "delete"],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("FileLog", fileLogSchema);