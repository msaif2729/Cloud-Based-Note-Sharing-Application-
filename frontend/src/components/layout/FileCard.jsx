import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FileCard = ({
  file,
  onSelect,
  toggleFavorite,
  handleDelete,
  getFileTypeIcon,
}) => {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect(file);
      }}
      className="bg-[#1f2937] p-4 rounded-xl cursor-pointer hover:bg-[#374151] transition relative h-[180px] flex flex-col justify-between"
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

      {/* 🗑️ Delete */}
      <div className="absolute top-2 right-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(file._id);
          }}
          className="text-red-400"
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

      {/* INFO */}
      <div>
        <p className="text-sm font-medium truncate">
          {file.name}
        </p>

        <p className="text-xs text-gray-400">
          {(file.size / (1024 * 1024)).toFixed(1)} MB
        </p>
      </div>
    </div>
  );
};

export default FileCard;