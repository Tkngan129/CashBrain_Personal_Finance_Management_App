export const parseWithAI = async (text) => {
  return {
    title: text,
    amount: Number(text.match(/\d+/)?.[0] || 0) * 1000,
    type: 'expense'
  };
};