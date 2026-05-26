import { create } from "zustand";

type AuthStore = {
  token: string;
  setToken: (token: string) => void;
  clearToken: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  token: "",
  setToken: (token: string) => set({ token }),
  clearToken: () => set({ token: "" }),
}));
