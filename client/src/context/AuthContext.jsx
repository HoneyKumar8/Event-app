import { createContext, useState, useEffect } from "react";
import axios from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in when the app starts
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const stored = localStorage.getItem("user");
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  // Login function with error handling
  const login = async (email, password) => {
    try {
      const res = await axios.post("/auth/login", { email, password });
      
      // Store user data (including token) in localStorage
      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
      
      return { success: true };
    } catch (error) {
      // Extract specific error message from your backend (e.g., "Invalid credentials")
      const message = error.response?.data?.message || "Login failed. Please try again.";
      return { success: false, message };
    }
  };

  // Register function with error handling
  const register = async (name, email, password) => {
    try {
      const res = await axios.post("/auth/register", {
        name,
        email,
        password,
      });
      
      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed. Please try again.";
      return { success: false, message };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {/* We only render children once loading is complete 
        to prevent protected routes from redirecting incorrectly 
      */}
      {!loading && children}
    </AuthContext.Provider>
  );
};