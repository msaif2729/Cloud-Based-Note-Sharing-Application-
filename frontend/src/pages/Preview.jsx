import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

const Preview = () => {
  const { id } = useParams();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    fetchFile();
  }, []);

  const fetchFile = async () => {
    try {
      const fileRes = await api.get(`/files/${id}`);
      setFile(fileRes.data);

      const previewRes = await api.get(`/files/${id}/preview`);
      setPreviewUrl(previewRes.data.previewUrl);
    } catch (err) {
      console.error(err);
    }
  };

  if (!file) return <div className="text-white">Loading...</div>;

  return (
    <div className="h-screen bg-[#0f172a] p-6 text-white">
      <h2 className="text-xl mb-4">{file.name}</h2>

      <div className="bg-gray-900 h-[85vh] rounded overflow-hidden">
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
            <div className="flex items-center justify-center h-full">
              No preview available
            </div>
          )
        ) : (
          <div className="flex items-center justify-center h-full">
            Loading preview...
          </div>
        )}
      </div>
    </div>
  );
};

export default Preview;