import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";

const GroupMembers = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGroup();
  }, []);

  const fetchGroup = async () => {
    try {
      const res = await api.get(`/groups/${groupId}`);
      setGroup(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ➕ ADD MEMBER
  const handleAdd = async () => {
    try {
      if (!email) return;

      setLoading(true);

      await api.post(`/groups/${groupId}/add-member`, {
        email,
        role: "viewer",
      });

      toast.success("Member added");
      setEmail("");
      fetchGroup();

    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  };

  // ❌ REMOVE MEMBER
  const handleRemove = async (userId) => {
    try {
      await api.delete(`/groups/${groupId}/member/${userId}`);
      toast.success("Removed");
      fetchGroup();
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    }
  };

  // 🔁 CHANGE ROLE
  const updateRole = async (userId, role) => {
    try {
      await api.patch(`/groups/${groupId}/member/${userId}`, { role });
      fetchGroup();
    } catch (err) {
      console.error(err);
    }
  };

  if (!group) return <div className="text-white p-6">Loading...</div>;

  return (
    <div>
         <button
          onClick={() => navigate(`/groups/${groupId}`)}
          className="block mt-6 text-gray-400 hover:text-white"
        >
          ← Back
        </button>

        <div className="min-h-screen bg-[#0f172a] text-white flex">
            

        {/* LEFT → MEMBERS LIST */}
        <div className="w-1/2 p-6 border-r border-gray-700">
        

            <h2 className="text-xl mb-6">Members</h2>

            <div className="space-y-3">
            {group.members.map((m) => (
                <div
                key={m.userId}
                className="flex justify-between items-center bg-[#1f2937] p-3 rounded"
                >
                <div>
                    <p className="text-sm">{m.email}</p>

                    <select
                    value={m.role}
                    onChange={(e) =>
                        updateRole(m.userId, e.target.value)
                    }
                    className="bg-gray-700 mt-1 px-2 py-1 rounded text-xs"
                    >
                    <option value="viewer">Viewer</option>
                    <option value="contributor">Contributor</option>
                    </select>
                </div>

                <button
                    onClick={() => handleRemove(m.userId)}
                    className="text-red-400 text-sm hover:text-red-300"
                    >
                    Remove
                </button>
                </div>
            ))}
            </div>
        </div>

        {/* RIGHT → ADD MEMBER */}
        <div className="w-1/2 p-6">

            <h2 className="text-xl mb-6">Add Member</h2>

            <input
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 p-3 bg-gray-800 rounded"
            />

            <button
            onClick={handleAdd}
            disabled={loading}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
            >
            {loading ? "Adding..." : "Add Member"}
            </button>

        
        </div>
        </div>
    </div>
  );
};

export default GroupMembers;