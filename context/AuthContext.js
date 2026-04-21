import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    if ((email === 'ngan@example.com' || email === 'test@test.com') && password === '123456') {
      setUser({ email, name: 'Ngân' });
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const register = (email, password, name) => {
    setUser({ email, name });
    setIsLoggedIn(true);
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);