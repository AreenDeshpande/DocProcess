import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  register: async (userData) => {
    const response = await api.post("/users/register", userData);
    if (response.data) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post("/users/login", credentials);
    if (response.data) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  },

  logout: () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Clear sessionStorage
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    // Clear all localStorage
    localStorage.clear();

    // Clear all sessionStorage
    sessionStorage.clear();

    // Clear cookies
    document.cookie.split(";").forEach(function (c) {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Force reload to clear any cached states
    window.location.reload();
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  getProfile: async () => {
    const response = await api.get("/users/profile");
    return response.data;
  },
};

export default api;
