import { useEffect, useState } from "react";
import api from "../api";
import FileLogs from "./FileLogs";

const SharedFiles = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    const res = await api.get("/groups/all-files");
    setFiles(res.data);
    setLoading(false);
  };

  const getFileIcon = (type) => {
    if (type.includes("pdf")) return "📄";
    if (type.includes("image")) return "🖼️";
    return "📁";
  };

  if (loading) {
    return (
      <div className="grid mt-14 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-[#1f2937] p-4 rounded-lg shadow"
          >
            {/* File icon placeholder */}
            <div className="bg-gray-700 h-32 rounded mb-4"></div>

            {/* File name */}
            <div className="bg-gray-700 h-4 rounded w-3/4 mb-2"></div>

            {/* File size / date */}
            <div className="bg-gray-700 h-3 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-6 text-white">

      {/* LEFT */}
      <div className="flex-1" onClick={() => setSelectedFile(null)}>
        <h2 className="text-xl mb-6 font-semibold">Shared Files</h2>

        {files.length === 0 ? (
          <div className="h-[60vh] flex items-center justify-center text-gray-400">
            No shared files
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {files.map((file) => (
              <div
                key={file._id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(file);
                }}
                className="bg-[#1f2937] p-4 rounded-xl cursor-pointer hover:bg-[#374151] transition h-[180px] flex flex-col justify-between"
              >
                <div className="flex flex-col items-center justify-center flex-1">
                  <div className="text-5xl">{getFileIcon(file.type)}</div>

                  <p className="text-xs text-gray-400 mt-2 uppercase">
                    {file.name.split(".").pop()}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium truncate">
                    {file.name}
                  </p>

                  <p className="text-xs text-blue-400">
                    {file.groupId?.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT PANEL */}
      {selectedFile && (
        <div className="w-96" onClick={(e) => e.stopPropagation()}>
          <FileLogs fileId={selectedFile._id} />
        </div>
      )}
    </div>
  );
};

export default SharedFiles;