import create from "zustand";

type UserState = {
  userId: string | null;
  set: (userId: string) => void;
};

export const useUserStore = create<UserState>()((set) => ({
  userId: null,
  set: (userId) => set({ userId }),
}));
