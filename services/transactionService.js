import { api } from './api';

export const getTransactions = async () => {
  const res = await api.get('/transactions');
  return res.data;
};

export const createTransaction = async (data) => {
  const res = await api.post('/transactions', data);
  return res.data;
};