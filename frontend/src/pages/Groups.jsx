import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await api.get("/groups");
      setGroups(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="text-white">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-semibold">Groups</h2>

        <button
          onClick={() => navigate("/groups/create")}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
        >
          + Create Group
        </button>
      </div>

      {/* EMPTY STATE */}
      {groups.length === 0 ? (
        <div className="flex items-center justify-center h-[60vh] text-gray-400 text-lg">
          No Groups Found
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {groups.map((group) => (
            <div
              key={group._id}
              onClick={() => navigate(`/groups/${group._id}`)}
              className="bg-[#1f2937] p-5 rounded-xl cursor-pointer hover:bg-[#374151] transition"
            >
              <div className="text-4xl mb-3">
                <FontAwesomeIcon icon="users" className="text-blue-500"/>
                {/* 👥 */}
              </div>

              <p className="font-medium">{group.name}</p>

              <p className="text-xs text-gray-400 mt-1">
                {group.members.length} members
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Groups;