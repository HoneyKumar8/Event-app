import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// ✅ Attach token automatically
instance.interceptors.request.use(
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

// ✅ Auto logout if token expired
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default instance;
