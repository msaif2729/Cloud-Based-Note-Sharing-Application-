import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";

const AddFile = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    try {
      setLoading(true);
      const loadingToast = toast.loading("Uploading file...");

      const res = await api.post("/files/upload-url", {
        fileName: file.name,
      });

      const { uploadUrl, blobName } = res.data;

      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "x-ms-blob-type": "BlockBlob",
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadRes.ok) throw new Error("Upload failed");

      await api.post("/files/save", {
        name: file.name,
        type: file.type,
        size: file.size,
        blobName,
      });

      toast.dismiss(loadingToast);
      toast.success("Upload successful 🎉");

      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      console.error(err);
      toast.error("Upload failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#0f172a] text-white">
      
      <div className="w-full max-w-lg bg-[#111827] rounded-xl shadow-lg p-8">

        {/* Back */}
        <button
          onClick={() => navigate("/")}
          className="text-blue-400 mb-4 hover:underline"
        >
          ← Back
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold mb-2">
          Upload file
        </h2>
        <p className="text-gray-400 mb-6 text-sm">
          Please upload files you have permission to share
        </p>

        {/* Upload Box */}
        <div
          className="border-2 border-dashed border-gray-600 rounded-xl p-10 flex flex-col items-center justify-center text-center hover:border-blue-500 transition cursor-pointer"
          onClick={() => document.getElementById("fileInput").click()}
        >
          {/* Icon */}
          <div className="text-4xl mb-3">📁</div>

          <p className="text-gray-300 mb-2">
            Drag & drop file here or
          </p>

          {/* Browse Button */}
          <button
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-sm"
            disabled={loading}
          >
            Browse files
          </button>

          {/* Hidden input */}
          <input
            id="fileInput"
            type="file"
            disabled={loading}
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
          />

          {/* File Info */}
          {file && (
            <p className="mt-4 text-sm text-green-400">
              Selected: {file.name}
            </p>
          )}
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={loading}
          className={`w-full mt-6 py-2 rounded ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-500"
          }`}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

        {/* Footer Info */}
        <p className="text-xs text-gray-500 mt-4 text-center">
          Max file size: 50MB • Supported: PDF, Images, Docs
        </p>

      </div>
    </div>
  );
};

export default AddFile;