const { LogsQueryClient } = require("@azure/monitor-query");
const { ClientSecretCredential } = require("@azure/identity");

const credential = new ClientSecretCredential(
  process.env.AZURE_TENANT_ID,
  process.env.AZURE_CLIENT_ID,
  process.env.AZURE_CLIENT_SECRET
);

const client = new LogsQueryClient(credential);

const getAzureLogs = async (blobUrl) => {
  try {
    const pathPart = blobUrl.split("/notes/")[1];

    // console.log("QUERYING AZURE LOGS FOR FILE:", pathPart);

    const query = `
      StorageBlobLogs
      | where TimeGenerated > ago(24h)
      | where tostring(Uri) contains "${pathPart}"
      | project TimeGenerated, OperationName, Uri
      | order by TimeGenerated desc
    `;

    const result = await client.queryWorkspace(
      process.env.LOG_ANALYTICS_WORKSPACE_ID,
      query,
      { duration: "PT24H" }
    );

    // console.log("AZURE RAW RESULT:", result);

    return result.tables[0]?.rows || [];

  } catch (err) {
    console.error("AZURE LOG ERROR:", err);
    return [];
  }
};

module.exports = { getAzureLogs };