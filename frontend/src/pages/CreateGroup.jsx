import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";

const CreateGroup = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
   const [imgError, setImgError] = useState(false);

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleUser = (user) => {
    const exists = selectedUsers.find((u) => u.uid === user.uid);

    if (exists) {
      setSelectedUsers(selectedUsers.filter((u) => u.uid !== user.uid));
    } else {
      setSelectedUsers([
        ...selectedUsers,
        { ...user, role: "viewer" },
      ]);
    }
  };

  const updateRole = (uid, role) => {
    setSelectedUsers((prev) =>
      prev.map((u) =>
        u.uid === uid ? { ...u, role } : u
      )
    );
  };

  const handleCreate = async () => {
    try {
      if (!name.trim()) {
        return toast.error("Group name is required");
      }

      setLoading(true);

      await api.post("/groups", {
        name,
        description,
        members: selectedUsers.map((u) => ({
          userId: u.uid,
          email: u.email,
          role: u.role,
        })),
      });

      toast.success("Group created 🎉");
      navigate("/groups");

    } catch (err) {
      console.error(err);
      toast.error("Failed to create group ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6">

      {/* HEADER */}
      <h2 className="text-2xl font-semibold mb-6">
        Create New Group
      </h2>

      {/* 🔥 GROUP INFO SECTION */}
      <div className="bg-[#111827] p-6 rounded-xl mb-6">
        <h3 className="mb-4 text-lg font-medium">Group Info</h3>

        <input
          type="text"
          placeholder="Enter group name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 p-3 bg-gray-800 rounded outline-none"
        />

        <textarea
          placeholder="Enter description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 bg-gray-800 rounded outline-none"
        />
      </div>

      {/* 🔍 USER SEARCH */}
      <div className="bg-[#111827] p-6 rounded-xl mb-6">
        <h3 className="mb-4 text-lg font-medium">Add Members</h3>

        <input
          type="text"
          placeholder="Search users by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-4 p-3 bg-gray-800 rounded"
        />

        {/* USER LIST */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[250px] overflow-y-auto">
          {filteredUsers.map((user) => {
            const isSelected = selectedUsers.find(
              (u) => u.uid === user.uid
            );

            return (
              <div
                key={user.uid}
                onClick={() => toggleUser(user)}
                className={`p-3 rounded cursor-pointer border transition flex items-center gap-3
                  ${isSelected
                    ? "bg-blue-600 border-blue-400"
                    : "bg-[#1f2937] border-gray-700 hover:bg-[#374151]"
                  }`}
              >
                {user?.photoURL && !imgError ? (
                <img
                    src={user.photoURL}
                    alt="profile"
                    className="w-10 h-10 rounded-full object-cover"
                    onError={() => setImgError(true)}
                />
                ) : (
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    {(user?.displayName || user?.email || "U")[0].toUpperCase()}
                </div>
                )}
                <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 👥 SELECTED USERS */}
      {selectedUsers.length > 0 && (
        <div className="bg-[#111827] p-6 rounded-xl mb-6">
          <h3 className="mb-4 text-lg font-medium">Selected Members</h3>

          <div className="space-y-3">
            {selectedUsers.map((u) => (
              <div
                key={u.uid}
                className="flex justify-between items-center bg-gray-800 p-3 rounded"
              >
                <div>
                  <p className="text-sm">{u.name}</p>
                  <p className="text-xs text-gray-400">{u.email}</p>
                </div>

                <select
                  value={u.role}
                  onChange={(e) =>
                    updateRole(u.uid, e.target.value)
                  }
                  className="bg-gray-700 px-2 py-1 rounded"
                >
                  <option value="viewer">Viewer</option>
                  <option value="contributor">Contributor</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🚀 ACTION */}
      <button
        onClick={handleCreate}
        disabled={loading}
        className="bg-blue-600 px-6 py-3 rounded hover:bg-blue-500 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Group"}
      </button>
    </div>
  );
};

export default CreateGroup;