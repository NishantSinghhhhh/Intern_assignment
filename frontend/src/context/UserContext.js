'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ id: '', name: '', email: '' });

  useEffect(() => {
    // Access localStorage only after the component has mounted
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []); // Run only once after mount

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
