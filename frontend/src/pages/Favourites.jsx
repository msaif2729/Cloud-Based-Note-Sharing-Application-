import { useEffect, useState } from "react";
import api from "../api";
import FileDetail from "../components/layout/FileDetail";
import FileCard from "../components/layout/FileCard";
import toast from "react-hot-toast";

const Favourites = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    setLoading(true);
    const res = await api.get("/files/favorites");
    setFiles(res.data);
    setLoading(false);
  };

  const toggleFavorite = async (id) => {
    await api.patch(`/files/${id}/favorite`);
    fetchFavorites();
  };

  const handleDelete = async (id) => {
    await api.delete(`/files/${id}`);
    toast.success("Moved to Trash");
    fetchFavorites();
  };

  const getFileTypeIcon = (type, name) => {
    const ext = name.split(".").pop().toLowerCase();

    if (type.includes("pdf")) return "📄";
    if (type.includes("image")) return "🖼️";
    if (["doc", "docx"].includes(ext)) return "📝";
    if (["xls", "xlsx"].includes(ext)) return "📊";

    return "📁";
  };


  if (loading) {
    return (
      <div className="grid mt-12 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
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
    <div className="flex gap-6">
      
      {/* LEFT */}
      <div className="flex-1">
        <h2 className="text-xl mb-6">⭐ Favourite Files</h2>

        {files.length === 0 ? (
          <p className="text-gray-400">No favourites yet</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {files.map((file) => (
              <FileCard
                key={file._id}
                file={file}
                onSelect={setSelectedFile}
                toggleFavorite={toggleFavorite}
                handleDelete={handleDelete}
                getFileTypeIcon={getFileTypeIcon}
              />
            ))}
          </div>
        )}
      </div>

      {/* RIGHT PANEL */}
      {selectedFile && (
        <div className="w-80">
          <FileDetail file={selectedFile} />
        </div>
      )}
    </div>
  );
};

export default Favourites;