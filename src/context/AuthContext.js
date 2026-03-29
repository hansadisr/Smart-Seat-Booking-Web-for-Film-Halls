import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const parsedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const legacyUserId = localStorage.getItem('userId');

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token') || !!legacyUserId);
  const [user, setUser] = useState(parsedUser || (legacyUserId ? { userId: Number(legacyUserId) } : null));

  const login = (token, userId, userName, userEmail) => {
    // Backward-compatible support for old login(userId) calls.
    if (userId === undefined && userName === undefined && userEmail === undefined) {
      const legacyId = token;
      localStorage.setItem('userId', legacyId);
      setIsLoggedIn(true);
      setUser({ userId: Number(legacyId) });
      return;
    }

    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('user', JSON.stringify({ userId, userName, userEmail }));
    setIsLoggedIn(true);
    setUser({ userId, userName, userEmail });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
  };

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // AuthProvider wraps your whole apps in index.js
  // makes all components wrapped inside
  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, getAuthHeader }}> 
      {children}  
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);