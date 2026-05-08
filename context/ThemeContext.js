import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem('@finance_app_theme');
        if (saved !== null) setIsDarkMode(JSON.parse(saved));
      } catch (error) {
        console.warn('Failed to load theme:', error);
      }
    };
    loadTheme();
  }, []);

  const toggleDarkMode = async () => {
    try {
      const newMode = !isDarkMode;
      setIsDarkMode(newMode);
      await AsyncStorage.setItem('@finance_app_theme', JSON.stringify(newMode));
    } catch (error) {
      console.warn('Failed to save theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);