import axios from "axios";

const API = "http://localhost:8000/api";

export const fetchUniversities = (params) =>
  axios.get(`${API}/universities`, { params });

export const fetchApplications = (params) =>
  axios.get(`${API}/applications`, { params });

export const applyUniversity = (data) =>
  axios.post(`${API}/applications`, data);
