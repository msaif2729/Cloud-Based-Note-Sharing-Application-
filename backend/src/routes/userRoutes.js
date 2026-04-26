const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const controller = require("../controllers/userController");

// Save user
router.post("/save", controller.saveUser);
router.get("/", auth, controller.getAllUsers);

module.exports = router;