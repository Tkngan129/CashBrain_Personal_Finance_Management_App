export const parseExpenseMessage = (text) => {
  return { title: text, amount: 10000, type: 'expense' };
};