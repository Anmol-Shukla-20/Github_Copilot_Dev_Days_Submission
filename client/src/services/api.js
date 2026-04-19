import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5000"
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("sat_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const authWithGoogle = async ({ idToken, phoneNumber }) => {
  const response = await api.post("/auth/google", { idToken, phoneNumber });
  return response.data;
};

export const updateProfile = async (payload) => {
  const response = await api.put("/auth/profile", payload);
  return response.data;
};

export const fetchAssignments = async (params = {}) => {
  const response = await api.get("/assignments", { params });
  return response.data;
};

export const syncClassroomAssignments = async (accessToken) => {
  const response = await api.post("/assignments/fetch", { accessToken });
  return response.data;
};

export const addAssignment = async (payload) => {
  const response = await api.post("/assignments/add", payload);
  return response.data;
};

export const updateAssignment = async (id, payload) => {
  const response = await api.put(`/assignments/update/${id}`, payload);
  return response.data;
};

export const deleteAssignment = async (id) => {
  const response = await api.delete(`/assignments/delete/${id}`);
  return response.data;
};
