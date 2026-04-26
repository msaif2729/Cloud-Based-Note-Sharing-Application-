import { NavLink } from "react-router-dom";
import { auth } from "../../firebase";
import { useState } from "react";

const Sidebar = ({ user }) => {

    // console.log("Sidebar user:", user); // DEBUG
    // console.log("Sidebar user:", user.photoURL);
    const [imgError, setImgError] = useState(false);
    

  const linkClass =
    "block px-3 py-2 rounded hover:bg-gray-800";

  const activeClass =
    "block px-3 py-2 rounded bg-gray-800";

  return (
    <div className="w-64 bg-[#111827] border-r border-gray-800 p-5 flex flex-col justify-between">

      {/* TOP */}
      <div>
        <div className="flex items-center gap-3 mb-11">
          <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M18 20V10M12 20V4M6 20v-6" />
            </svg>
          </div>
          <span className="font-['Sora',sans-serif] font-semibold text-[17px] text-slate-100 tracking-tight">Cloud Notes</span>
        </div>

        <div className="space-y-2">
          <p className="text-gray-400 text-sm">File Manager</p>

          <NavLink to="/" end className={({ isActive }) => isActive ? activeClass : linkClass}>
            My Files
          </NavLink>

          {/* <NavLink to="/recents" className={({ isActive }) => isActive ? activeClass : linkClass}>
            Recents
          </NavLink> */}

          <NavLink to="/favourites" className={({ isActive }) => isActive ? activeClass : linkClass}>
            Favourites
          </NavLink>

          <NavLink to="/trash" className={({ isActive }) => isActive ? activeClass : linkClass}>
            Trash
          </NavLink>

          <p className="text-gray-400 text-sm mt-6">Shared Files</p>

          <NavLink to="/groups" className={({ isActive }) => isActive ? activeClass : linkClass}>
            Groups
          </NavLink>

          <NavLink to="/shared-file" className={({ isActive }) => isActive ? activeClass : linkClass}>
            Shared File
          </NavLink>
        </div>
      </div>

      {/* 🔻 BOTTOM USER */}
      <div className="border-t border-gray-700 pt-4">
        <div className="flex items-center gap-3 mb-3">

           {/* USER IMAGE */}
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
            <p className="text-sm font-medium">{user?.displayName}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={() => auth.signOut()}
          className="w-full bg-red-500/20 text-red-400 py-2 rounded hover:bg-red-500/30"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;