import React, { createContext, useState, useContext, useEffect } from 'react';

export const AuthContext = createContext();

// Создаем кастомный хук
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem("themeMode");
    return saved ? saved : 'light';
  });

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  const loginUser = (userData) => {
    setUser(userData);
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <AuthContext.Provider value={{
      user,
      loginUser,
      logoutUser,
      toggleTheme,
      mode
    }}>
      {children}
    </AuthContext.Provider>
  );
};