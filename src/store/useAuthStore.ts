"use client";

import { create } from "zustand";
import { authService } from "../api/authService";

type User = any;

interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;

  // actions
  register: (payload: any) => Promise<void>;
  login: (payload: any) => Promise<void>;
  logout: () => void;
  loadFromStorage: () => void;
  updateUser: (user: User) => void;
  openLoginModal: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoggedIn: false,

  // ---------------- REGISTER ----------------
  register: async (payload) => {
    const data = await authService.register(payload);

    localStorage.setItem("user", JSON.stringify(data?.data));
    localStorage.setItem("token", data?.token);

    set({
      user: data?.data,
      token: data?.token,
      isLoggedIn: true,
    });
  },

  // ---------------- LOGIN ----------------
  login: async (payload) => {
    const data = await authService.login(payload);

    localStorage.setItem("user", JSON.stringify(data?.data));
    localStorage.setItem("token", data?.token);

    set({
      user: data?.data,
      token: data?.token,
      isLoggedIn: true,
    });
  },

  // ---------------- LOGOUT ----------------
  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    set({
      user: null,
      token: null,
      isLoggedIn: false,
    });
  },

  // ---------------- LOAD ON APP START ----------------
  loadFromStorage: () => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      set({
        token,
        user: JSON.parse(userStr),
        isLoggedIn: true,
      });
    }
  },

  updateUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },
  openLoginModal: () => {   
    window.dispatchEvent(new Event('open-login-modal'));
  },
}));
