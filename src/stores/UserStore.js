import { create } from "zustand";

export const useUserStore = create((set) => ({
    email: "",
    setEmail: (email) =>
        set(() => ({
            email: email,
        })),
    removeEmail: () =>
        set(() => ({
            email: "",
        })),
}));
