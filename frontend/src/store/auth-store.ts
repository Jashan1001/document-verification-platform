import { create } from "zustand";
import { api } from "../services/api";

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });

    const { accessToken } = response.data;

    localStorage.setItem("accessToken", accessToken);

    await set({ isAuthenticated: true });

    // Fetch user info
    const userRes = await api.get("/auth/me");
    set({ user: userRes.data.user });
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const userRes = await api.get("/auth/me");
      set({
        user: userRes.data.user,
        isAuthenticated: true,
      });
    } catch {
      localStorage.removeItem("accessToken");
      set({ user: null, isAuthenticated: false });
    }
  },
}));