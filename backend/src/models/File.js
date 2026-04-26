const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: String, // pdf, ppt, etc
  size: Number,

  blobUrl: {
    type: String, // Azure Blob URL
    required: true,
  },

  ownerId: {
    type: String, // Azure AD user ID
    required: true,
  },

  isDeleted: {
    type: Boolean,
    default: false,
  },

  isFavorite: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  groupId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Group",
  default: null,
    },

  ownerEmail: String, // 🔥 ADD THIS IF NOT PRESENT

  deletedAt: Date,
});

module.exports = mongoose.model("File", fileSchema);