import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import FileDetail from "../components/layout/FileDetail";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MyFiles = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);


  const clearSelection = () => setSelectedFile(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const res = await api.get("/files/recent");
      setFiles(res.data);
    } catch (err) {
      console.error(err);
    }finally {
    setLoading(false);
  }
  };

  const toggleFavorite = async (id) => {
    try {
      await api.patch(`/files/${id}/favorite`);
      fetchFiles();
    } catch (err) {
      console.error(err);
    }
  };

  // File icon helper
  const getFileTypeIcon = (type, name) => {
    const ext = name.split(".").pop().toLowerCase();

    if (type.includes("pdf")) return "📄";
    if (type.includes("image")) return "🖼️";

    if (["doc", "docx"].includes(ext)) return "📝";
    if (["xls", "xlsx"].includes(ext)) return "📊";
    if (["odt"].includes(ext)) return "📄";

    return "📁";
  };


  if (loading) {
    return (
      <div className="grid mt-18 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
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

const handleDelete = async (id) => {
  try {
    const res = await api.delete(`/files/${id}`);

    toast.success(res.data.msg || "Moved to Trash 🗑️");

    fetchFiles();
  } catch (err) {
    console.error("DELETE ERROR:", err.response?.data || err.message);

    toast.error(
      err.response?.data?.msg || "Delete failed ❌"
    );
  }
};

  return (
    <div className="flex gap-6" onClick={clearSelection}>
      
      {/* LEFT SECTION */}
      <div className="flex-1">
        
        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-semibold">My Files</h2>

          <button
            onClick={() => navigate("/add")}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
          >
            + Add File
          </button>
        </div>

        {/* EMPTY STATE */}
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="text-6xl mb-4">📂</div>

            <h2 className="text-2xl font-semibold text-gray-300">
              No Files Found
            </h2>

            <p className="text-gray-500 mt-2">
              Upload your first file to get started
            </p>

            <button
              onClick={() => navigate("/add")}
              className="mt-4 bg-blue-600 px-5 py-2 rounded hover:bg-blue-500"
            >
              + Upload File
            </button>
          </div>
        ) : (
          /* GRID */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {files.map((file) => (
              <div
                key={file._id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(file);
                }}
                className={`bg-[#1f2937] p-4 rounded-xl cursor-pointer hover:bg-[#374151] transition relative h-[180px] flex flex-col justify-between
                ${selectedFile?._id === file._id ? "ring-2 ring-blue-500" : ""}`}

              >
                {/* ⭐ Favourite */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(file._id);
                  }}
                  className="absolute top-2 left-2 text-yellow-400 text-lg"
                >
                  <FontAwesomeIcon
                    icon={file.isFavorite ? "star" : ["far", "star"]}
                    className="text-yellow-300 text-lg hover:text-yellow-500"
                  />
                </button>

                {/* ⋮ Menu */}
                <div className="absolute top-2 right-2 text-gray-400 ">
                  <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(file._id);
                    }}
                    
                    >
                    <FontAwesomeIcon icon="trash" className="text-red-400 hover:text-red-600" />
                </button>
                </div>

                {/* ICON */}
                <div className="flex flex-col items-center justify-center flex-1">
                  <div className="text-5xl">
                    {getFileTypeIcon(file.type, file.name)}
                  </div>

                  <p className="text-xs text-gray-400 mt-2 uppercase">
                    {file.name.split(".").pop()}
                  </p>
                </div>

                {/* FILE INFO */}
                <div>
                  <p className="text-sm font-medium truncate">
                    {file.name}
                  </p>

                  <p className="text-xs text-gray-400">
                    {(file.size / (1024 * 1024)).toFixed(1)} MB
                  </p>
                </div>
                
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT PANEL */}
      {selectedFile && (
        <div
          className="w-80 transition-all duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <FileDetail file={selectedFile} />
        </div>
      )}
    </div>
  );
};

export default MyFiles;