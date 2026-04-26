import { useState } from "react";
import api from "../../api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../ui/ConfirmModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const GroupHeader = ({ group, refreshGroup, user }) => {
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);

    const [confirmOpen, setConfirmOpen] = useState(false);

    const navigate = useNavigate();
    const isOwner = group.ownerId === user?.uid;

    const handleDeleteGroup = async () => {
    try {
        await api.delete(`/groups/${group._id}`);
        toast.success("Group deleted");
        navigate("/groups");
    } catch (err) {
        if (err.response?.status === 400) {
        toast.error(err.response.data.msg);
        } else {
        toast.error("Failed");
        }
    }
    };

  return (
    <div className="mb-6">

      <div className="mb-3 text-sm text-gray-400 flex items-center gap-2">
      {/* Groups */}
        <div
          onClick={() => navigate("/groups")}
          className="flex items-center gap-1 cursor-pointer hover:text-white"
        >
          <span className="text-xl font-medium">Groups</span>
        </div>

        {/* Separator */}
        <span className="text-gray-500 font-bold text-xl">/</span>

        {/* Current Group */}
        <span className="text-white font-bold text-xl truncate max-w-[200px]">
          {group.name}
        </span>  
      
      </div>

      {/* TOP BAR */}
      <div className="flex justify-between items-center mb-4">
        <div>
          {/* <h2 className="text-xl font-semibold">{group.name}</h2> */}
          <p className="text-sm text-gray-400">
            {group.description || "No description"}
          </p>
        </div>

        <div className="flex gap-2">

        {isOwner && (
            <button
            onClick={() => setConfirmOpen(true)}
            className="bg-red-600 px-4 py-2 rounded hover:bg-red-500"
            >
            Delete Group
            </button>
        )}

        {/* ADD MEMBER */}
        <div className="flex gap-2">
            {isOwner && (
                <button
                    onClick={() => navigate(`/groups/${group._id}/members`)}
                    className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
                >
                    Manage Members
                </button>
            )}
        </div>

        </div>
      </div>

      {/* MEMBERS */}
      <div className="flex items-center gap-3 flex-wrap">
        {group.members.map((member) => (
          <div
            key={member.userId}
            className="flex items-center gap-2 bg-[#1f2937] px-3 py-1 rounded"
          >
            {/* Avatar */}
            <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-sm">
              {member.email[0].toUpperCase()}
            </div>

            {/* Email */}
            <span className="text-xs">{member.email}</span>

            {/* Role */}
            <span className="text-[10px] text-gray-400">
              {member.userId === group.ownerId ? "owner" : member.role}
            </span>
          </div>
        ))}
      </div>
      <ConfirmModal
        isOpen={confirmOpen}
        title="Delete Group"
        message="Delete this group permanently?"
        confirmText="Delete"
        onConfirm={handleDeleteGroup}
        onCancel={() => setConfirmOpen(false)}
        />
    </div>
  );
};

export default GroupHeader;