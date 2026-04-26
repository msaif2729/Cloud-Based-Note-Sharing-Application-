const cron = require("node-cron");
const File = require("../models/File");
const { getContainerClient } = require("../services/azureBlobService");

const runCleanupJob = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("Running trash cleanup job...");

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const files = await File.find({
      isDeleted: true,
      deletedAt: { $lte: sevenDaysAgo },
    });

    const containerClient = getContainerClient();

    for (const file of files) {
      const blobClient = containerClient.getBlockBlobClient(file.blobName);

      await blobClient.deleteIfExists();
      await file.deleteOne();
    }

    console.log(`Deleted ${files.length} old files`);
  });
};

module.exports = runCleanupJob;