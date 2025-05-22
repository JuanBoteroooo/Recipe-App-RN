import React, { createContext, useContext } from 'react';
import { darkTheme } from '../theme/darkTheme';

const ThemeContext = createContext(darkTheme);

export const ThemeProvider = ({ children }) => (
  <ThemeContext.Provider value={darkTheme}>
    {children}
  </ThemeContext.Provider>
);

export const useTheme = () => useContext(ThemeContext);
