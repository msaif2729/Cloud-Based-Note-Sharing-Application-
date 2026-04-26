import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faFolder,
  faChevronRight,
  faUsers,
  faTrash,        // 🗑️ delete
  faStar,         // ⭐ filled favorite
  faEllipsisVertical, // ⋮ menu
  faRotateLeft,   // ↩️ restore
  faXmark

} from "@fortawesome/free-solid-svg-icons";

import {
  faStar as faStarRegular // ☆ empty star
} from "@fortawesome/free-regular-svg-icons";

library.add(
  faFolder,
  faChevronRight,
  faUsers,
  faTrash,
  faStar,
  faStarRegular,
  faEllipsisVertical,
  faRotateLeft,
  faXmark
);

import {
  faUpload,
  faEye,
  faDownload,
  faCircle
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faUpload,
  faEye,
  faDownload,
  faCircle
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
  <App />
  <Toaster position="bottom-right" reverseOrder={false} />
  </>

);