import React, { createContext, useState, useEffect } from 'react';
import { IThemeContextType } from './ThemeContext';

type Theme = 'dark' | 'light';

const ThemeContextMain = createContext<IThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
});

export const ThemeProviderMain = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContextMain.Provider value={{ theme, toggleTheme }}>{children}</ThemeContextMain.Provider>
  );
};

export default ThemeContextMain;
