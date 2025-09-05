import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('userId'));
  // this is only logged in time / create the login id and remove it when the log out - in localy
  const login = (userId) => {
    localStorage.setItem('userId', userId);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
  };
  // Authprovider wraps your whole apps in index.js
  //makes all components wrapped inside
  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}> 
      {children}  
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);