import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FileLogs = ({ fileId: propFileId }) => {
  const params = useParams();
  const fileId = propFileId || params.fileId;

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true); // 🔥 NEW

  useEffect(() => {
    if (fileId) fetchLogs();
  }, [fileId]);

  const fetchLogs = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/files/${fileId}/logs`);

      const cleaned = res.data.filter(
        (log) => log.action !== "BlobPreflightRequest"
      );

      setLogs(cleaned);
    } catch (err) {
      console.error("LOG ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  const getActionText = (action) => {
    switch (action) {
      case "upload":
      case "PutBlob":
        return "Uploaded file";
      case "view":
      case "GetBlob":
        return "Downloaded file";
      case "download":
        return "Downloaded file";
      case "delete":
      case "DeleteBlob":
        return "Deleted file";
      default:
        return action;
    }
  };

  const getIcon = (action) => {
    switch (action) {
      case "upload":
      case "PutBlob":
        return "upload";
      case "view":
      case "GetBlob":
        return "eye";
      case "download":
        return "download";
      case "delete":
      case "DeleteBlob":
        return "trash";
      default:
        return "circle";
    }
  };

  return (
    <div className="text-white">
      <h2 className="text-lg font-semibold mb-4">File Activity</h2>

      {/* 🔥 LOADING STATE */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[#1f2937] p-3 rounded-lg animate-pulse"
            >
              <div className="h-3 bg-gray-600 rounded w-2/3 mb-2"></div>
              <div className="h-2 bg-gray-700 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : logs.length === 0 ? (
        <p className="text-gray-400">No activity yet</p>
      ) : (
        <div className="flex flex-col gap-3">
          {logs.map((log, i) => (
            <div
              key={i}
              className="flex items-start gap-3 bg-[#1f2937] p-3 rounded-lg hover:bg-[#374151] transition"
            >
              {/* ICON */}
              <div className="mt-1 text-blue-400">
                <FontAwesomeIcon icon={getIcon(log.action)} />
              </div>

              {/* CONTENT */}
              <div className="flex-1">
                <p className="text-sm">
                  {log.source === "app" ? (
                    <>
                      <span className="text-blue-400 font-medium">
                        {log.userEmail}
                      </span>{" "}
                      {getActionText(log.action)}
                    </>
                  ) : (
                    <>
                      <span className="text-gray-400 font-medium">
                        Azure
                      </span>{" "}
                      {getActionText(log.action)}
                    </>
                  )}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {new Date(log.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileLogs;