import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Restore auth state on app launch
  useEffect(() => {
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setIsLoggedIn(true);
      }
    } catch (e) {
      console.warn('Failed to restore auth (AsyncStorage may not be ready):', e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    if ((email === 'ngan@example.com' || email === 'test@test.com') && password === '123456') {
      const userData = { email, name: 'Ngân' };
      try {
        await AsyncStorage.setItem('user', JSON.stringify(userData));
      } catch (error) {
        console.warn('Failed to save user:', error);
      }
      setUser(userData);
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const register = async (email, password, name) => {
    const userData = { email, name };
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.warn('Failed to save registered user:', error);
    }
    setUser(userData);
    setIsLoggedIn(true);
    return true;
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.warn('Failed to logout:', error);
    }
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);