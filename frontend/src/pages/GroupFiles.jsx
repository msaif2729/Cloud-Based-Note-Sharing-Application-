import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

import FileDetail from "../components/layout/FileDetail";
import GroupHeader from "../components/groups/GroupHeader";
import toast from "react-hot-toast";
import ConfirmModal from "../components/ui/ConfirmModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const GroupFiles = ({ user }) => {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [confirmOpen, setConfirmOpen] = useState(false);   
  const [fileToDelete, setFileToDelete] = useState(null);

  const [files, setFiles] = useState([]);
  const [group, setGroup] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // ================= ROLE LOGIC =================

  const currentUserId = user?.uid;

  const currentMember = group?.members.find(
    (m) => m.userId === currentUserId
  );

  const isOwner = group?.ownerId === currentUserId;
  const isContributor = currentMember?.role === "contributor";

  const canUpload = isOwner || isContributor;
  const canDelete = isOwner || isContributor;

  // ================= FETCH =================

  useEffect(() => {
    fetchFiles();
    fetchGroup();
  }, [groupId]);

  const fetchFiles = async () => {
    try {
      const res = await api.get(`/groups/${groupId}/files`);
      setFiles(res.data);
    } catch (err) {
      console.error("FILES ERROR:", err);
    }
  };

  const fetchGroup = async () => {
    try {
      const res = await api.get(`/groups/${groupId}`);
      setGroup(res.data);
    } catch (err) {
      console.error("GROUP ERROR:", err);
    }
  };

  // ================= DELETE =================

  const handleDelete = async () => {
    try {
        await api.delete(`/files/${fileToDelete}`);
        fetchFiles();
        setConfirmOpen(false);
        setFileToDelete(null);
    } catch (err) {
        console.error(err);
    }
    };

  // ================= FILE ICON =================

  const getFileTypeIcon = (type, name) => {
    const ext = name.split(".").pop().toLowerCase();

    if (type?.includes("pdf")) return "📄";
    if (type?.includes("image")) return "🖼️";

    if (["doc", "docx"].includes(ext)) return "📝";
    if (["xls", "xlsx"].includes(ext)) return "📊";

    return "📁";
  };

  // ================= UI =================

  return (
    <div
      className="flex gap-6 text-white"
      onClick={() => setSelectedFile(null)}
    >
      {/* LEFT */}
      <div className="flex-1">

        {/* HEADER */}
        {group && (
          <GroupHeader
            group={group}
            refreshGroup={fetchGroup}
            user={user}
          />
        )}

        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Group Files</h2>

          {canUpload && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/groups/${groupId}/add`);
              }}
              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
            >
              + Upload File
            </button>
          )}
        </div>

        {/* EMPTY */}
        {files.length === 0 ? (
          <div className="flex items-center justify-center h-[60vh] text-gray-400 text-lg">
            No Files Found
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
                className={`relative bg-[#1f2937] p-4 rounded-xl cursor-pointer hover:bg-[#374151] transition h-[180px] flex flex-col justify-between
                ${selectedFile?._id === file._id ? "ring-2 ring-blue-500" : ""}`}
              >
                {/* DELETE BUTTON */}
                {canDelete && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setFileToDelete(file._id);
                            setConfirmOpen(true);
                        }}
                        className="absolute top-2 right-2 text-red-400 hover:text-red-300"
                        >
                        <FontAwesomeIcon icon="trash" className="text-red-400 hover:text-red-600" />
                    </button>
                )}

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

                <p className="text-xs text-gray-500 truncate mt-1">
                    Uploaded by: {file.ownerEmail || "Unknown"}
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
          className="w-80"
          onClick={(e) => e.stopPropagation()}
        >
          <FileDetail file={selectedFile} />
        </div>
      )}

      <ConfirmModal
        isOpen={confirmOpen}
        title="Delete File"
        message="Are you sure you want to delete this file?"
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
        />
    </div>
  );
};

export default GroupFiles;