import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

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
        } else {
          delete axios.defaults.headers.common["Authorization"];
        }
      },
      // Loading state helper
      setLoading: (loading) => set({ loading }),

      // Login action
      login: async (email, password) => {
        try {
          const apiBase = import.meta.env.VITE_API_BASE;
          const res = await axios.post(`${apiBase}/auth/login`, {
            email,
            password,
          });
          const { token, user } = res.data;
          // Update store
          get().setToken(token);
          localStorage.setItem("token", token);
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

      // Register action
      register: async (name, email, password, role = "User") => {
        try {
          const apiBase = import.meta.env.VITE_API_BASE;
          const res = await axios.post(`${apiBase}/auth/register`, {
            name,
            email,
            password,
            role,
          });
          const { token, user } = res.data;
          get().setToken(token);
          get().setUser(user);
          return true;
        } catch (error) {
          console.error(
            "Registration failed:",
            error.response?.data?.message || error.message,
          );
          return false;
        }
      },

      // Logout clears user and token
      logout: () => {
        set({ user: null, token: null });
        delete axios.defaults.headers.common["Authorization"];
        // Persisted storage will be cleared on next reload by persist middleware
        localStorage.removeItem("token");
      },
    }),
    {
      name: "auth-storage", // key in localStorage
      getStorage: () => localStorage,
    },
  ),
);
