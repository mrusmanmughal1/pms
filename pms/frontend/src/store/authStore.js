import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { apiInstance } from "../service";
import toast from "react-hot-toast";

/**
 * Zustand store for authentication.
 * Persists user and token in localStorage under the key 'auth-storage'.
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: localStorage.getItem("token") || null,
      loading: true,
      // Set user object
      setUser: (user) => set({ user }),
      // Set token and update axios defaults
      setToken: (token) => {
        set({ token });
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          apiInstance.defaults.headers.common["Authorization"] =
            `Bearer ${token}`;
        } else {
          delete axios.defaults.headers.common["Authorization"];
          delete apiInstance.defaults.headers.common["Authorization"];
        }
      },
      // Loading state helper
      setLoading: (loading) => set({ loading }),

      // Login action
      login: async (email, password) => {
        try {
          const apiBase =
            import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
          const res = await axios.post(`${apiBase}/auth/login`, {
            email,
            password,
          });
          const { token, user } = res.data;
          // Update store
          localStorage.setItem("token", token);

          get().setToken(token);
          localStorage.setItem("user", JSON.stringify(user));
          get().setUser(user);
          return true;
        } catch (error) {
          console.error(
            "Login failed:",
            error.response?.data?.message || error.message,
          );
          return false;
        }
      },

      // Logout clears user and tokenss
      logout: () => {
        set({ user: null, token: null });
        delete axios.defaults.headers.common["Authorization"];
        // Persisted storage will be cleared on next reload by persist middleware
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      },
    }),
    {
      name: "auth-storage", // key in localStorage
      getStorage: () => localStorage,
    },
  ),
);
