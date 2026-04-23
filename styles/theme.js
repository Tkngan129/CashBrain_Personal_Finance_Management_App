export const lightTheme = {
  backgroundStart: '#e8f0fb',
  backgroundMid: '#f4f8ff',
  backgroundEnd: '#e0f3f7',
  primary: '#1C4D8D',
  accent: '#9ED3DC',
  incomeBg: '#f0fdf4',
  expenseBg: '#fef2f2',
  glassBg: 'rgba(255,255,255,0.92)',
  glassShadow: 'rgba(28,77,141,0.07)',
  textPrimary: '#1C4D8D',
  textSecondary: '#64748B',
  cardBg: '#fff',
  borderColor: '#e2e8f0',
};

export const darkTheme = {
  backgroundStart: '#0f172a',
  backgroundMid: '#1e2937',
  backgroundEnd: '#334155',
  primary: '#60a5fa',
  accent: '#67e8f9',
  incomeBg: '#052e16',
  expenseBg: '#450a0a',
  glassBg: 'rgba(15,23,42,0.85)',
  glassShadow: 'rgba(96,165,250,0.15)',
  textPrimary: '#f1f5f9',
  textSecondary: '#cbd5e1',
  cardBg: '#1e2937',
  borderColor: '#334155',
};

export const getTheme = (isDark) => (isDark ? darkTheme : lightTheme);