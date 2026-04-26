import { useEffect, useState } from "react";
import api from "../api";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Trash = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchTrash();
  }, []);

  const fetchTrash = async () => {
    try {
      const res = await api.get("/files/trash");
      setFiles(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const restoreFile = async (id) => {
    try {
      await api.patch(`/files/${id}/restore`);
      toast.success("File restored ♻️");
      fetchTrash();
    } catch (err) {
      toast.error("Restore failed ❌");
    }
  };

  const deleteForever = async (id) => {
    try {
      await api.delete(`/files/${id}/permanent`);
      toast.success("Deleted permanently ❌");
      fetchTrash();
    } catch (err) {
      toast.error("Delete failed ❌");
    }
  };

  // file icon helper
  const getFileTypeIcon = (type, name) => {
    const ext = name.split(".").pop().toLowerCase();

    if (type.includes("pdf")) return "📄";
    if (type.includes("image")) return "🖼️";
    if (["doc", "docx"].includes(ext)) return "📝";
    if (["xls", "xlsx"].includes(ext)) return "📊";

    return "📁";
  };

  const getDaysLeft = (deletedAt) => {
    const deleteAfterDays = 7;

    const deletedDate = new Date(deletedAt);
    const now = new Date();

    const diffTime = now - deletedDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const daysLeft = deleteAfterDays - diffDays;

    return daysLeft > 0 ? daysLeft : 0;
  };

  return (
    <div className="text-white">

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-semibold">Trash</h2>
      </div>

      {/* EMPTY STATE */}
      {files.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="text-6xl mb-4">🗑️</div>

          <h2 className="text-2xl font-semibold text-gray-300">
            Trash is Empty
          </h2>

          <p className="text-gray-500 mt-2">
            Deleted files will appear here
          </p>
        </div>
      ) : (
        /* GRID */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {files.map((file) => (
            <div
              key={file._id}
              className="bg-[#1f2937] p-4 rounded-xl hover:bg-[#374151] transition h-[180px] flex flex-col justify-between relative"
            >
              {/* ACTIONS */}
              <div className="justify-between w-full flex gap-3">

                {/* RESTORE */}
                <button
                  onClick={() => restoreFile(file._id)}
                  className="text-blue-400 hover:text-blue-700"
                  title="Restore"
                >
                  <FontAwesomeIcon icon="rotate-left" />
                </button>

                {/* DELETE FOREVER */}
                <button
                  onClick={() => deleteForever(file._id)}
                  className="text-red-400 hover:text-red-600"
                  title="Delete Permanently"
                >
                  <FontAwesomeIcon icon="trash" />
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

              {/* INFO */}
              <div>
                <p className="text-sm font-medium truncate">
                  {file.name}
                </p>

                <p className="text-xs text-gray-400">
                  {(file.size / (1024 * 1024)).toFixed(1)} MB
                </p>
                <p className="text-xs text-red-400 mt-1">
                  Permanently Deletes in {getDaysLeft(file.deletedAt)} day
                  {getDaysLeft(file.deletedAt) !== 1 && "s"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Trash;