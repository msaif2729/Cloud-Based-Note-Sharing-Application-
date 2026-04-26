import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";

import MyFiles from "./MyFiles";
import Recents from "./Recents";
import Favourites from "./Favourites";
import Trash from "./Trash";
import Groups from "./Groups";
import SharedFile from "./SharedFile";
import AddFile from "./AddFile";
import CreateGroup from "./CreateGroup";
import GroupFiles from "./GroupFiles";
import AddGroupFile from "./AddGroupFile";
import GroupMembers from "./GroupMembers";
import FileLogs from "./FileLogs";



const Dashboard = ({ user }) => {
  return (
    <div className="flex h-screen bg-[#0f172a] text-gray-200">
      
      <Sidebar user={user} />

      <div className="flex-1 p-6 overflow-y-auto">
        <Routes>
          <Route index element={<MyFiles />} />
          {/* <Route path="recents" element={<Recents />} /> */}
          <Route path="favourites" element={<Favourites />} />
          <Route path="trash" element={<Trash />} />
          <Route path="groups" element={<Groups />} />
          <Route path="shared-file" element={<SharedFile />} />
          <Route path="add" element={<AddFile />} />
          <Route path="/trash" element={<Trash />} />
          {/* 🔥 GROUPS */}
          <Route path="/groups" element={<Groups />} />
          <Route path="/groups/create" element={<CreateGroup />} />
          <Route path="/groups/:groupId" element={<GroupFiles user={user}/>} />
          <Route path="/groups/:groupId/add"  element={<AddGroupFile user={user} />} />
          <Route path="/groups/:groupId/members" element={<GroupMembers  />} />
          <Route path="/files/:fileId/logs" element={<FileLogs />} />
        </Routes>
      </div>

    </div>
  );
};

export default Dashboard;