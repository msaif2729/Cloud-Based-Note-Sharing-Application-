const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const controller = require("../controllers/groupController");
const fileController = require("../controllers/fileController");
const checkGroupAccess = require("../middleware/groupAccess");

// ================= GROUPS =================

// Create group
router.post("/", auth, controller.createGroup);

// Get all groups for user
router.get("/", auth, controller.getUserGroups);


router.get("/all-files", auth, controller.getAllGroupFiles);

// Add member
router.post("/:groupId/add-member", auth, controller.addMember);

router.get("/:groupId", auth, controller.getGroupById);
router.delete("/:groupId/member/:userId", auth, controller.removeMember);
router.patch("/:groupId/member/:userId", auth, controller.updateRole);
router.delete("/:groupId", auth, controller.deleteGroup);

// ================= GROUP FILES =================

// Upload URL
router.post(
  "/:groupId/upload-url",
  auth,
  checkGroupAccess("contributor"),
  fileController.getGroupUploadUrl
);

// Save file
router.post(
  "/:groupId/save",
  auth,
  checkGroupAccess("contributor"),
  fileController.saveGroupFile
);

// Get files
router.get(
  "/:groupId/files",
  auth,
  checkGroupAccess("viewer"),
  fileController.getGroupFiles
);

router.delete(
  "/:id",
  auth,
  checkGroupAccess("contributor"),
  fileController.deleteFile // ✅ FIXED
);


module.exports = router;