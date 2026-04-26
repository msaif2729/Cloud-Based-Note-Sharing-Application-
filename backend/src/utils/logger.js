const FileLog = require("../models/FileLog");
const { trackEvent } = require("../services/logService");

const logFileAction = async ({ fileId, userId, action }) => {
  // Save in MongoDB (for UI)
  await FileLog.create({
    fileId,
    userId,
    action,
  });

  // Send to Azure Monitor
  trackEvent("FileAction", {
    fileId: fileId.toString(),
    userId,
    action,
  });
};

module.exports = { logFileAction };