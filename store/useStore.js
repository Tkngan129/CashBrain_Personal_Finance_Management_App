import { create } from 'zustand';
import { createTransaction, getTransactions } from '../services/transactionService';

export const useStore = create((set) => ({
  user: null,
  transactions: [],

  login: (user) => set({ user }),
  logout: () => set({ user: null }),

  fetchTransactions: async () => {
    const data = await getTransactions();
    set({ transactions: data });
  },

  addTransaction: async (tx) => {
    const newTx = await createTransaction(tx);
    set((state) => ({
      transactions: [newTx, ...state.transactions],
    }));
  },
}));