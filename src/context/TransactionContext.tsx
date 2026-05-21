import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Transaction } from '../app/components/TransactionDetailScreen';

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 1, title: 'Coffee & Breakfast', category: 'Food & Drinks', amount: -45000, date: '2026-05-09', time: '09:30' },
  { id: 2, title: 'Online Course', category: 'Education', amount: -399000, date: '2026-05-08', time: '14:15' },
  { id: 3, title: 'Monthly Allowance', category: 'Income', amount: 4000000, date: '2026-04-30', time: '08:00' },
  { id: 4, title: 'Grab to Uni', category: 'Transportation', amount: -25000, date: '2026-04-09', time: '08:30' },
  { id: 5, title: 'New Clothes', category: 'Shopping', amount: -250000, date: '2026-04-09', time: '15:45' },
  { id: 6, title: 'Coffee & Breakfast', category: 'Food & Drinks', amount: -45000, date: '2026-04-11', time: '09:30' },
];

interface TransactionContextType {
  transactions: Transaction[];
  updateTransaction: (updatedTx: Transaction) => void;
  deleteTransaction: (id: string | number) => void;
  addTransaction: (tx: Transaction) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);

  const updateTransaction = (updatedTx: Transaction) => {
    setTransactions((prev) => prev.map((tx) => (tx.id === updatedTx.id ? updatedTx : tx)));
  };

  const deleteTransaction = (id: string | number) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  };

  const addTransaction = (tx: Transaction) => {
    setTransactions((prev) => [tx, ...prev]);
  };

  return (
    <TransactionContext.Provider value={{ transactions, updateTransaction, deleteTransaction, addTransaction }}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
}
