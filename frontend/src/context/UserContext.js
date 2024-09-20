'use client'
import React, { createContext, useContext, useState,  } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  // Initialize user state with data from local storage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('userInfo');
    return storedUser ? JSON.parse(storedUser) : { id: '', name: '', email: '' };
  });

  const updateUser = (userData) => {
    setUser(userData);
    // Store user data in local storage
    localStorage.setItem('userInfo', JSON.stringify(userData));
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
