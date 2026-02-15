import axios from "axios";

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // adjust if your backend URL differs
});

// ✅ REQUEST INTERCEPTOR (Attach Token Automatically)
axiosInstance.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const user = JSON.parse(storedUser);

      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Response interceptor (future-ready)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Auto logout if token expired (optional enhancement)
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
