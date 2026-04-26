const File = require("../models/File");
const { generateUploadSAS } = require("../services/sasService");
const { generateReadSAS } = require("../services/sasService");
const { getContainerClient } = require("../services/azureBlobService");
const FileLog = require("../models/FileLog");
const Group = require("../models/Group");
const { getAzureLogs } = require("../services/azureLogsService");
const { generateShareSAS } = require("../services/sasService");

exports.generateShareLink = async (req, res) => {
  try {
    // console.log("BODY:", req.body);
    // console.log("FILE ID:", req.params.id);

    console.log("🔥 generateShareLink HIT");

    const { startTime, expiryTime, ip } = req.body;

    const file = await File.findById(req.params.id);
    // console.log("FILE:", file);

    const blobName = file.blobUrl.split("/notes/")[1];
    // console.log("BLOB NAME:", blobName);

    const sasUrl = generateShareSAS(blobName, {
      startTime,
      expiryTime,
      ip,
    });

    res.json({ url: sasUrl });

  } catch (err) {
    console.error("SHARE ERROR:", err); // 🔥 THIS WILL SHOW REAL ISSUE
    res.status(500).json({ error: err.message });
  }
};

// ================= COMBINED LOGS =================
exports.getCombinedLogs = async (req, res) => {
  try {
    const fileId = req.params.fileId;

    console.log("🔥 getCombinedLogs HIT");

    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ msg: "File not found" });

    // Mongo logs
    const mongoLogs = await FileLog.find({ fileId });

    // Azure logs
    const azureLogs = await getAzureLogs(file.blobUrl);

    // 🔥 FORMAT MONGO
    const formattedMongo = mongoLogs.map((log) => ({
      source: "app",
      action: log.action,
      userEmail: log.userEmail,
      createdAt: log.createdAt,
    }));

    // 🔥 FORMAT AZURE
    const formattedAzure = azureLogs.map((log) => ({
      source: "azure",
      action: log[1],
      createdAt: log[0],
    }));

    // 🔥 MERGE
    const combined = [...formattedMongo, ...formattedAzure].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json(combined);

  } catch (err) {
    console.error("LOG ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


// ================= LOG HELPER =================
const logAction = async ({ fileId, user, action }) => {
  try {
    await FileLog.create({
      fileId,
      userId: user.uid,
      userEmail: user.email,
      action,
    });
  } catch (err) {
    console.error("LOG ERROR:", err);
  }
};

exports.getAzureFileLogs = async (req, res) => {
  try {
    
    console.log("🔥 getAzureFileLogs HIT");
    
    const file = await File.findById(req.params.fileId);

    if (!file) {
      return res.status(404).json({ msg: "File not found" });
    }

    const logs = await getAzureLogs(file.blobName);

    const formatted = logs.map((log) => ({
      time: log[0],
      action: log[1],
    }));

    res.json(formatted);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteFile = async (req, res) => {
  try {

    console.log("🔥 deleteFile HIT");

    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ msg: "File not found" });
    }

    // 🔥 If file belongs to group
    if (file.groupId) {
      const group = await Group.findById(file.groupId);

      const isOwner = group.ownerId === req.user.uid;

      const member = group.members.find(
        (m) => m.userId === req.user.uid
      );

      const isContributor = member?.role === "contributor";

      if (!isOwner && !isContributor) {
        return res.status(403).json({
          msg: "Only owner or contributor can delete",
        });
      }
    }

    // ✅ delete (soft delete recommended)
    file.isDeleted = true;
    await file.save();


    res.json({ msg: "File moved to trash" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


exports.getDownloadUrl = async (req, res) => {
  try {

    console.log("🔥 getDownloadUrl HIT");

    const file = await File.findById(req.params.id);

    // 🔥 fallback for old broken data
    let blobName = file.blobName;

    if (!blobName && file.blobUrl) {
      blobName = file.blobUrl.split("/notes/")[1];
    }

    // console.log("FINAL BLOB:", blobName);

    const downloadUrl = await generateReadSAS(blobName, file.type);

    // 🔥 LOG DOWNLOAD
    await logAction({
      fileId: file._id,
      user: req.user,
      action: "download",
    });

    res.json({ downloadUrl });
  } catch (err) {
    console.error("DOWNLOAD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.getFileLogs = async (req, res) => {
  try {

    console.log("🔥 getFileLogs HIT");

    const logs = await FileLog.find({
      fileId: req.params.id,
    }).sort({ createdAt: -1 });

    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getGroupFiles = async (req, res) => {
  try {

    console.log("🔥 getGroupFiles HIT");

    const files = await File.find({
      groupId: req.params.groupId,
      isDeleted: false,
    }).sort({ createdAt: -1 });

    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.saveGroupFile = async (req, res) => {
  try {

      console.log("🔥 saveGroupFile HIT");

    const { name, type, size, blobName } = req.body;

    const blobUrl = `https://${process.env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/${process.env.AZURE_CONTAINER_NAME}/${blobName}`;

    const file = await File.create({
      name,
      type,
      size,
      blobName,   // ✅ ADD THIS
      blobUrl,    // ✅ FIXED
      ownerId: req.user.uid,
      groupId: req.params.groupId,
      ownerEmail : req.user.email, // 🔥 ADD THIS
    });

    // 🔥 LOG GROUP UPLOAD
    await logAction({
      fileId: file._id,
      user: req.user,
      action: "upload",
    });

    res.json(file);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📤 Generate upload URL for group file
exports.getGroupUploadUrl = async (req, res) => {
  try {

    console.log("🔥 getGroupUploadUrl HIT");

    const { fileName } = req.body;

    const blobName = `groups/${req.params.groupId}/${Date.now()}-${fileName}`;

    const uploadUrl = await generateUploadSAS(blobName);

    res.json({
      uploadUrl,
      blobName,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ❌ Permanent delete
exports.permanentDelete = async (req, res) => {
  try {

    console.log("🔥 permanentDelete HIT");

    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ msg: "File not found" });
    }

    // 🔥 FIX: get blobName properly
    let blobName = file.blobName;

    // fallback for old data
    if (!blobName && file.blobUrl) {
      blobName = file.blobUrl.split("/notes/")[1];
    }

    // console.log("DELETING BLOB:", blobName);

    const containerClient = getContainerClient();
    const blobClient = containerClient.getBlockBlobClient(blobName); // ✅ FIXED

    await blobClient.deleteIfExists();

    await file.deleteOne();

    // 🔥 LOG DELETE
    await logAction({
      fileId: file._id,
      user: req.user,
      action: "delete",
    });

    res.json({ msg: "File permanently deleted" });

  } catch (err) {
    console.error("PERMANENT DELETE ERROR:", err);
    res.status(500).json({ msg: "Delete failed" });
  }
};


// // 👁️ Get file preview URL
// exports.getFilePreviewUrl = async (req, res) => {
//   try {
//     const file = await File.findById(req.params.id);

//     const previewUrl = await generateReadSAS(
//       file.blobName,
//       file.type
//     );

//     // ✅ ADD LOG HERE
//     await logFileAction({
//       fileId: file._id,
//       userId: req.user.uid,
//       action: "view",
//     });

//     res.json({ previewUrl });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// 💾 Save file metadata
exports.saveFile = async (req, res) => {
  try {

    console.log("🔥 saveFile HIT");

    const { name, type, size, blobName } = req.body;

    const blobUrl = `https://${process.env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/${process.env.AZURE_CONTAINER_NAME}/${blobName}`;

    const file = await File.create({
      name,
      type,
      size,
      blobName,
      blobUrl,                // ✅ FULL URL
      ownerId: req.user.uid,
    });

    // 🔥 LOG UPLOAD
    await logAction({
      fileId: file._id,
      user: req.user,
      action: "upload",
    });

    res.json(file);
  } catch (err) {
    console.error("SAVE FILE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// 📤 Generate Upload URL
exports.getUploadUrl = async (req, res) => {
  try {

    console.log("🔥 getUploadUrl HIT");

    const { fileName } = req.body;

    const blobName = `${req.user.uid}/${Date.now()}-${fileName}`;

    const uploadUrl = await generateUploadSAS(blobName);

    res.json({
      uploadUrl,
      blobName,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Get Recent Files
exports.getRecentFiles = async (req, res) => {
  try {

    console.log("🔥 getRecentFiles HIT");

    const files = await File.find({
      ownerId: req.user.uid,
      isDeleted: false,
    }).sort({ createdAt: -1 });

    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ⭐ Toggle Favorite
exports.toggleFavorite = async (req, res) => {
  try {

    console.log("🔥 toggleFavorite HIT");

    const file = await File.findById(req.params.id);

    if (!file) return res.status(404).json({ msg: "File not found" });

    file.isFavorite = !file.isFavorite;
    await file.save();

    res.json(file);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🗑️ Move to Trash (Soft Delete)
exports.deleteFile = async (req, res) => {
  try {

    console.log("🔥 deleteFile HIT");

    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ msg: "File not found" });
    }

    // 🔥 SOFT DELETE ONLY
    file.isDeleted = true;
    file.deletedAt = new Date();

    await file.save();

    // console.log("FILE MOVED TO TRASH:", file._id);

    res.json({ msg: "File moved to trash" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ msg: "Delete failed" });
  }
};

// 👁️ View File Details
exports.getFileById = async (req, res) => {
  try {

    console.log("🔥 getFileById HIT");

    const file = await File.findById(req.params.id);

    if (!file) return res.status(404).json({ msg: "File not found" });

    res.json(file);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTrashFiles = async (req, res) => {
  try {

    console.log("🔥 getTrashFiles HIT");

    // console.log("USER:", req.user); // 🔥 DEBUG

    const files = await File.find({
      ownerId: req.user.uid,   // ✅ MUST BE uid
      isDeleted: true,
    }).sort({ deletedAt: -1 });

    // console.log("TRASH FILES:", files); // 🔥 DEBUG

    res.json(files);
  } catch (err) {
    console.error("TRASH ERROR:", err);
    res.status(500).json({ msg: "Error fetching trash" });
  }
};

exports.getFavoriteFiles = async (req, res) => {
  try {
    console.log("🔥 getFavoriteFiles HIT");
    const files = await File.find({
      ownerId: req.user.uid,
      isFavorite: true,
      isDeleted: false, // 🔥 IMPORTANT
    }).sort({ createdAt: -1 });

    res.json(files);
  } catch (err) {
    console.error("FAV ERROR:", err);
    res.status(500).json({ msg: "Error fetching favourites" });
  }
};

exports.restoreFile = async (req, res) => {
  try {
    console.log("🔥 restoreFile HIT");
    const file = await File.findById(req.params.id);

    if (!file) return res.status(404).json({ msg: "File not found" });

    file.isDeleted = false;
    file.deletedAt = null;

    await file.save();

    res.json({ msg: "File restored" });
  } catch (err) {
    console.error("RESTORE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};