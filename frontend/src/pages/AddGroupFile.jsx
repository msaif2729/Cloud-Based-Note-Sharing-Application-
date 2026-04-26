import { useState,useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";

const AddGroupFile = ({ user }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { groupId } = useParams();

  const [group, setGroup] = useState(null);

  if (!user) {
    return <div className="text-white p-6">Loading user...</div>;
    }

    useEffect(() => {
    fetchGroup();
    }, []);

    const fetchGroup = async () => {
    const res = await api.get(`/groups/${groupId}`);
    setGroup(res.data);
    };

    const currentUserId = user?.uid;

    const currentMember = group?.members.find(
    (m) => m.userId === currentUserId
    );

    const isOwner = group?.ownerId === currentUserId;
    const isContributor = currentMember?.role === "contributor";

    const canUpload = isOwner || isContributor;

    if (group && !canUpload) {
    return (
        <div className="text-white p-6">
        You do not have permission to upload files ❌
        </div>
    );
    }

  const handleUpload = async () => {
    try {
      if (!file) return toast.error("Select a file");

      setLoading(true);
      const loadingToast = toast.loading("Uploading...");

      // ✅ 1. Get upload URL (GROUP)
      const res = await api.post(`/groups/${groupId}/upload-url`, {
        fileName: file.name,
      });

      const { uploadUrl, blobName } = res.data;

      // ✅ 2. Upload to Azure
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "x-ms-blob-type": "BlockBlob",
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadRes.ok) {
        toast.dismiss(loadingToast);
        toast.error("Upload failed ❌");
        setLoading(false);
        return;
      }

      // ✅ 3. Save file (GROUP)
      await api.post(`/groups/${groupId}/save`, {
        name: file.name,
        type: file.type,
        size: file.size,
        blobName,
      });

      toast.dismiss(loadingToast);
      toast.success("File uploaded 🎉");

      // ✅ Redirect back to group
      setTimeout(() => {
        navigate(`/groups/${groupId}`);
      }, 1000);

    } catch (err) {
      console.error(err);
      toast.error("Upload failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">
      <div className="bg-[#111827] p-8 rounded-xl w-[400px]">


        <button
          onClick={() => navigate(`/groups/${groupId}`)}
          className="text-blue-400 mb-4"
        >
          ← Back
        </button>

        <h2 className="text-xl mb-4">Upload to Group</h2>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4 w-full"
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full bg-blue-600 py-2 rounded hover:bg-blue-500 disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

      </div>
    </div>
  );
};

export default AddGroupFile;