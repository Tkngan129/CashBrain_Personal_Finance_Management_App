import React, { createContext, useContext, useReducer, useState } from 'react';
import { mockTransactions } from '../utils/mockData';

const FinanceContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    default:
      return state;
  }
};

export const FinanceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, { transactions: mockTransactions });
  const [addModalVisible, setAddModalVisible] = useState(false);

  const totalIncome = state.transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = state.transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const addTransaction = (tx) => dispatch({ type: 'ADD_TRANSACTION', payload: tx });
  const openAddModal = () => setAddModalVisible(true);
  const closeAddModal = () => setAddModalVisible(false);

  return (
    <FinanceContext.Provider
      value={{
        transactions: state.transactions,
        balance,
        totalIncome,
        totalExpense,
        addTransaction,
        addModalVisible,
        openAddModal,
        closeAddModal,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => useContext(FinanceContext);