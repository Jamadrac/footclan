import create from "zustand";

export const useAuthStore = create((set) => ({
  auth: {
    username: "",
    email: "",
    // roles: [],
    active: false,
  },
  setUser: (userData) => set({ auth: { ...userData } }),
  setUsername: (username) =>
    set((state) => ({ auth: { ...state.auth, username } })),
  logout: () =>
    set({ auth: { username: "", email: "", roles: [], active: false } }),
}));
