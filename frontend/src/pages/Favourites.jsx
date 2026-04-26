import { useEffect, useState } from "react";
import api from "../api";
import FileDetail from "../components/layout/FileDetail";
import FileCard from "../components/layout/FileCard";
import toast from "react-hot-toast";

const Favourites = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    const res = await api.get("/files/favorites");
    setFiles(res.data);
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