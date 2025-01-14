import { create } from "zustand";

export const useNavbarStore = create((set) => ({
    isOpen: true,
    toggle: () =>
        set((state) => ({
            isOpen: !state.isOpen,
        })),
}));
