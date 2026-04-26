import axios from "axios";
import { auth } from "./firebase";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// 🔥 Attach Firebase token
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;

  if (user) {
    const token = await user.getIdToken();
    // console.log("Sending token:", token); // DEBUG

    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;