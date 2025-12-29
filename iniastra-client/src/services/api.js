import axios from "axios";

const API =
  window.location.hostname === "localhost"
    ? "http://localhost:8000/api"
    : "https://university-platform-ecg1.onrender.com/api";

const api = axios.create({
  baseURL: API,
});

export const fetchUniversities = (params) =>
  api.get("/universities", { params });

export const fetchApplications = (params) =>
  api.get("/applications", { params });

export const applyUniversity = (data) =>
  api.post("/applications", data);

export default api;
