import create from "zustand";
import { persist } from "zustand/middleware";
import { LocalStorageItems } from "../shared/constants";

type UserState = {
  userId: string | null;
  set: (userId: string) => void;
  delete: () => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      userId: null,
      set: (userId) => set({ userId }),
      delete: () => set({ userId: null }),
    }),
    {
      name: LocalStorageItems.USER,
    }
  )
);
