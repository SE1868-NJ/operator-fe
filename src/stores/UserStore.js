import { create } from "zustand";

export const useUserStore = create((set) => ({
    token: "",
    setToken: (token) =>
        set(() => ({
            token: token,
        })),
    removeToken: () =>
        set(() => ({
            token: "",
        })),
}));
