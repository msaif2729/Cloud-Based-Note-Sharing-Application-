const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true }, // Firebase UID
    email: { type: String, required: true, unique: true },
    name: { type: String },
    photo: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);