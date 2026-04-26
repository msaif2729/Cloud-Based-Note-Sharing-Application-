const User = require("../models/User");

// ✅ Save user after login
exports.saveUser = async (req, res) => {
  try {

    console.log("🔥 saveUser HIT");

    const { uid, email, name, photo } = req.body;

    let user = await User.findOne({ uid });

    if (!user) {
      user = await User.create({
        uid,
        email,
        name,
        photo,
      });

      console.log("NEW USER CREATED:", user.email);
    } else {
      console.log("USER ALREADY EXISTS:", user.email);
    }

    res.json(user);
  } catch (err) {
    console.error("SAVE USER ERROR:", err);
    res.status(500).json({ msg: "Error saving user" });
  }
};


exports.getAllUsers = async (req, res) => {
  try {
    console.log("🔥 getAllUsers HIT");
    const users = await User.find({
      uid: { $ne: req.user.uid }, // ❌ exclude current user
    }).select("uid email name photo");

    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching users" });
  }
};