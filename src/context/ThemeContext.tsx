import React, { createContext, useCallback, useContext, useState } from 'react';

type ThemeContextType = {
  isDark: boolean;
  setDark: (v: boolean) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  setDark: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setDarkState] = useState(false);
  const setDark = useCallback((v: boolean) => setDarkState(v), []);
  return (
    <ThemeContext.Provider value={{ isDark, setDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export const lightColors = {
  bg: '#eef3f8',
  card: '#ffffff',
  cardBorder: 'rgba(28,77,141,0.07)',
  text: '#1e293b',
  textSecondary: '#64748b',
  textMuted: '#94a3b8',
  border: '#e8edf5',
  inputBg: '#f8fafc',
  navBar: '#ffffff',
  navBorder: '#E2E8F0',
  headerCard: '#ffffff',
  sectionHeading: '#334155',
  groupDate: '#64748b',
  tabsRow: '#ffffff',
  tabBorder: '#e8edf5',
  pill: '#eef2ff',
  pillText: '#1C4D8D',
  transactionCard: '#ffffff',
  calendarCard: '#ffffff',
  overviewCard: '#ffffff',
  barFillInactive: '#d1d5db',
  barFillActive: '#214f95',
  barTrackBg: '#f1f5f9',
  chartCardBorder: 'rgba(28,77,141,0.12)',
  chartLabelText: '#94a3b8',
  switchTrackOff: '#e2e8f0',
};

export const darkColors = {
  bg: '#0d1117',
  card: '#1c2333',
  cardBorder: 'rgba(255,255,255,0.06)',
  text: '#e8edf5',
  textSecondary: '#94a3b8',
  textMuted: '#6b7a90',
  border: '#2d3748',
  inputBg: '#0d1117',
  navBar: '#161b27',
  navBorder: '#2d3748',
  headerCard: '#1c2333',
  sectionHeading: '#e2e8f0',
  groupDate: '#94a3b8',
  tabsRow: '#1c2333',
  tabBorder: '#2d3748',
  pill: '#1e3a5f',
  pillText: '#93bbf0',
  transactionCard: '#1c2333',
  calendarCard: '#1c2333',
  overviewCard: '#1c2333',
  // Chart tokens
  barFillInactive: '#2a3a52',      // deep blue-slate inactive bar
  barFillActive: '#4f8ef7',        // bright pastel blue active bar
  barTrackBg: '#1a2438',           // very dark bar track (makes bars "float")
  chartCardBorder: '#3a4f70',      // visible blue-tinted border on chart cards
  chartLabelText: '#7a93b4',       // pastel chart axis labels
  switchTrackOff: '#4b5563',
};

export function useColors() {
  const { isDark } = useTheme();
  return isDark ? darkColors : lightColors;
}
