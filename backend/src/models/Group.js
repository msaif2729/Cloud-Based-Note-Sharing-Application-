const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  email: { type: String, required: true }, // ✅ added
  role: {
    type: String,
    enum: ["viewer", "contributor"],
    default: "viewer",
  },
});

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: String,

    ownerId: {
      type: String,
      required: true,
    },

    members: [memberSchema], // ✅ improved
  },
  { timestamps: true }
);

module.exports = mongoose.model("Group", groupSchema);