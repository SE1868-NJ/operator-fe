import { create } from "zustand";

export const useUserStore = create((set) => ({
    token: "",
    isAuthenticated: false,
    setToken: (token) =>
        set(() => ({
            token: token,
            isAuthenticated: true,
        })),
    removeToken: () =>
        set(() => ({
            token: "",
            isAuthenticated: false,
        })),
}));
