export const parseWithAI = async (text) => {
  const amountMatch = text.match(/\\d+/);
  const amount = amountMatch ? Number(amountMatch[0]) * 1000 : 0;

  let category = 'Other';
  if (text.toLowerCase().includes('coffee')) category = 'Food';

  return {
    title: text,
    amount,
    category,
    type: 'expense',
    createdAt: new Date().toISOString(),
  };
};