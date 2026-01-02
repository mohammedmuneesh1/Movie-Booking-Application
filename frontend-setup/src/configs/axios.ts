
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";


const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, // set true ONLY if you use cookies
});

/**
 * REQUEST INTERCEPTOR
 * Attach token if it exists
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // change key if needed

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * RESPONSE INTERCEPTOR
 * Handle auth errors globally
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // token expired / invalid
      localStorage.removeItem("token");
      // optional hard redirect
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
