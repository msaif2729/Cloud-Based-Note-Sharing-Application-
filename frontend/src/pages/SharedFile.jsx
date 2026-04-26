import { useEffect, useState } from "react";
import api from "../api";
import FileLogs from "./FileLogs";

const SharedFiles = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const res = await api.get("/groups/all-files");
    setFiles(res.data);
  };

  const getFileIcon = (type) => {
    if (type.includes("pdf")) return "📄";
    if (type.includes("image")) return "🖼️";
    return "📁";
  };

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