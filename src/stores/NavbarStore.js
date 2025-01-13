import { create } from "zustand";

export const useNavbarStore = create((set) => ({
    isOpen: false,
    toggle: () =>
        set((state) => ({
            isOpen: !state.isOpen,
        })),
}));
