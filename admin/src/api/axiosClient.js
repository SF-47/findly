import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5192",
});

// This runs before every request sent using axiosClient
axiosClient.interceptors.request.use(
  (config) => {
    // Get admin data from localStorage or sessionStorage
    const storedAdmin =
      localStorage.getItem("admin") || sessionStorage.getItem("admin");

    if (storedAdmin) {
      const admin = JSON.parse(storedAdmin);

      // If token exists, send it to the backend
      if (admin.token) {
        config.headers.Authorization = `Bearer ${admin.token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;

