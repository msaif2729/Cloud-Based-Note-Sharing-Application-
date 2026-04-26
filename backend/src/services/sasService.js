const {
  generateBlobSASQueryParameters,
  BlobSASPermissions,
  StorageSharedKeyCredential,
} = require("@azure/storage-blob");

const accountName = process.env.AZURE_STORAGE_ACCOUNT;
const accountKey = process.env.AZURE_STORAGE_KEY;
const containerName = process.env.AZURE_CONTAINER_NAME;

const sharedKeyCredential = new StorageSharedKeyCredential(
  accountName,
  accountKey
);

const generateUploadSAS = async (blobName) => {
  const expiresOn = new Date(Date.now() + 15 * 60 * 1000); // 15 min

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName,
      blobName,
      permissions: BlobSASPermissions.parse("cw"), // create + write
      expiresOn,
    },
    sharedKeyCredential
  ).toString();

  const url = `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;

  return url;
};

const generateReadSAS = async (blobName, fileType) => {
  const expiresOn = new Date(Date.now() + 3600 * 1000);

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName,
      blobName,
      permissions: BlobSASPermissions.parse("r"),
      expiresOn,
      contentDisposition: "inline",
      contentType: fileType, // ✅ IMPORTANT
    },
    sharedKeyCredential
  ).toString();

  return `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;
};


const generateShareSAS = (blobName, options) => {
  const { startTime, expiryTime, ip } = options;

  const sas = generateBlobSASQueryParameters(
    {
      containerName,
      blobName,
      permissions: BlobSASPermissions.parse("r"),
      startsOn: new Date(startTime),
      expiresOn: new Date(expiryTime),
      protocol: "https",
      ...(ip && { ipRange: { start: ip, end: ip } }),
    },
    sharedKeyCredential
  ).toString();

  return `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?${sas}`;
};


module.exports = { generateUploadSAS , generateReadSAS , generateShareSAS };