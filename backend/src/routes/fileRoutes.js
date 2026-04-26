const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/fileController");

// ✅ Protected routes (Firebase only)
router.get("/recent", auth, controller.getRecentFiles);

router.post("/:id/share", auth, controller.generateShareLink);

router.post("/upload-url", auth, controller.getUploadUrl);
router.post("/save", auth, controller.saveFile);

//logs
router.get("/files/:fileId/azure-logs", auth, controller.getAzureFileLogs);
router.get("/:fileId/logs", auth, controller.getCombinedLogs);


// router.get("/:id/preview", auth, controller.getFilePreviewUrl);
router.get("/:id/download", auth, controller.getDownloadUrl);

router.patch("/:id/favorite", auth, controller.toggleFavorite);

// Trash
router.get("/trash", auth, controller.getTrashFiles);
router.patch("/:id/restore", auth, controller.restoreFile);

router.delete("/:id", auth, controller.deleteFile);
router.delete("/:id/permanent", auth, controller.permanentDelete);

//Get Favorite Files
router.get("/favorites", auth, controller.getFavoriteFiles);

router.get("/:id", auth, controller.getFileById);

// Logs
// router.get("/:id/logs", auth, controller.getFileLogs);

module.exports = router;