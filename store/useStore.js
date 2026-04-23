import { create } from 'zustand';

export const useStore = create((set) => ({
  user: null,
  transactions: [],

  login: () => set({ user: { name: 'User' } }),
  logout: () => set({ user: null }),

  addTransaction: (tx) =>
    set((state) => ({
      transactions: [...state.transactions, tx]
    }))
}));