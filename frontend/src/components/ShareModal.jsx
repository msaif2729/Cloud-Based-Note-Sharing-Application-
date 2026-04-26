import { useState } from "react";
import api from "../api";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ShareModal = ({ fileId, onClose }) => {
  const [expiry, setExpiry] = useState("");
  const [start, setStart] = useState("");
  const [ip, setIp] = useState("");
  const [link, setLink] = useState("");

  const generateLink = async () => {
    try {
      const res = await api.post(`/files/${fileId}/share`, {
        startTime: start,
        expiryTime: expiry,
        ip,
      });

      setLink(res.data.url);
      toast.success("Link generated 🔗");

    } catch (err) {
      toast.error("Failed to generate link");
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(link);
    toast.success("Copied!");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

      <div className="bg-[#1f2937] p-6 rounded-lg w-[400px] text-white">

        <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Share File</h2>
         <button
          onClick={onClose}
          className="text-gray-400 text-sm"
        >
           <FontAwesomeIcon icon="xmark" />
        </button>

        </div>


        {/* START */}
        <label className="text-sm">Start Time</label>
        <input
          type="datetime-local"
          className="w-full p-2 mt-1 mb-3 bg-[#111827] rounded"
          onChange={(e) => setStart(e.target.value)}
        />

        {/* EXPIRY */}
        <label className="text-sm">Expiry Time</label>
        <input
          type="datetime-local"
          className="w-full p-2 mt-1 mb-3 bg-[#111827] rounded"
          onChange={(e) => setExpiry(e.target.value)}
        />

        {/* IP */}
        <label className="text-sm">IP Restriction (optional)</label>
        <input
          type="text"
          placeholder="e.g. 192.168.1.1"
          className="w-full p-2 mt-1 mb-4 bg-[#111827] rounded"
          onChange={(e) => setIp(e.target.value)}
        />

        {/* BUTTON */}
        <button
          onClick={generateLink}
          className="bg-blue-600 w-full py-2 rounded hover:bg-blue-500"
        >
          Generate Link
        </button>

        {/* RESULT */}
        {link && (
          <div className="mt-4">
            <input
              value={link}
              readOnly
              className="w-full p-2 bg-[#111827] rounded text-sm"
            />
            <button
              onClick={copyLink}
              className="mt-2 w-full bg-green-600 py-2 rounded"
            >
              Copy Link
            </button>
          </div>
        )}

       

      </div>
    </div>
  );
};

export default ShareModal;