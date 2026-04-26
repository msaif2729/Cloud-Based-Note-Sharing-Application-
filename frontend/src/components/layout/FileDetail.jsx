import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import ShareModal from "../ShareModal";

const FileDetail = ({ file }) => {
  // const [previewUrl, setPreviewUrl] = useState(null);
  const navigate = useNavigate();
  const [showShare, setShowShare] = useState(false);

  // console.log("Preview URL:", previewUrl);
  // console.log("File:", file);

  // useEffect(() => {
  //   if (file) {
  //     getPreview();
  //   }
  // }, [file]);

  // const getPreview = async () => {
  //   try {
  //     const res = await api.get(`/files/${file._id}/preview`);
  //     setPreviewUrl(res.data.previewUrl);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

const handleDownload = async (file) => {
    try {
      const res = await api.get(`/files/${file._id}/download`);

      const link = document.createElement("a");
      link.href = res.data.downloadUrl; // ✅ SAS URL
      link.download = file.name;
      link.target = "_blank";
      link.click();
    } catch (err) {
      console.error(err);
    }
  };

  if (!file) {
    return <div className="text-gray-400">Select a file</div>;
  }

  return (
    <div className="bg-[#1f2937] p-5 rounded-xl h-full">
      <h2 className="text-lg font-semibold mb-4">File Details</h2>

      {/* Name */}
      <p className="text-sm text-gray-400">Name</p>
      <p className="mb-2 truncate">{file.name}</p>

      {/* Type */}
      <p className="text-sm text-gray-400">Type</p>
      <p className="mb-2 truncate">{file.name.split(".").pop().toUpperCase()}</p>

      {/* Size */}
      <p className="text-sm text-gray-400">Size</p>
      <p className="mb-2">
        {(file.size / (1024 * 1024)).toFixed(2)} MB
      </p>

      {/* Created */}
      <p className="text-sm text-gray-400">Created</p>
      <p className="mb-4">
        {new Date(file.createdAt).toLocaleString()}
      </p>

      {/* Preview
      <div className="bg-gray-800 h-48 rounded mb-4 overflow-hidden flex items-center justify-center">
        {previewUrl ? (
          file.type.includes("pdf") ? (
            <iframe
              src={previewUrl}
              title="preview"
              className="w-full h-full"
            />
          ) : file.type.includes("image") ? (
            <img
              src={previewUrl}
              alt="preview"
              className="w-full h-full object-contain"
            />
          ) : (
            <p className="text-gray-400 text-sm">No preview</p>
          )
        ) : (
          <p className="text-gray-400 text-sm">Loading preview...</p>
        )}
      </div> */}

      {/* Buttons */}
     <button
      onClick={() => handleDownload(file)}
      className="w-full bg-green-600 py-2 rounded mb-2 hover:bg-green-500"
    >
      Download
    </button>

      {/* <button onClick={() => setShowShare(true)}>
        Share
      </button> */}
        <button className="w-full border border-gray-600 py-2 rounded hover:bg-gray-700" onClick={() => setShowShare(true)}>
        Share
      </button>

      {showShare && (
        <ShareModal
          fileId={file._id}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  );
};

export default FileDetail;