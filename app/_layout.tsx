import { Stack } from 'expo-router';
import React from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { FinanceProvider } from '../context/FinanceContext';
import { ThemeProvider } from '../context/ThemeContext';

// Wrap the Stack with providers
function RootLayoutNav() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return null; // Show splash screen while loading
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <Stack.Screen name="(tabs)" />
      ) : (
        <Stack.Screen name="(auth)" />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <FinanceProvider>
          <RootLayoutNav />
        </FinanceProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
