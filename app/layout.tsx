// app/_layout.tsx
import { Slot } from 'expo-router';
import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import { FinanceProvider } from '../context/FinanceContext';
import { ThemeProvider } from '../context/ThemeContext';
import RootNavigator from '../navigation/RootNavigation';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <FinanceProvider>
          <RootNavigator />
          <Slot />   {/* Giữ lại để Expo Router không lỗi */}
        </FinanceProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}