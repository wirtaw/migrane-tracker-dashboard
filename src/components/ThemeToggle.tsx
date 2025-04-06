import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.tsx';

interface IThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className }: IThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const classNameJoined = `rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${className || ''}`;

  return (
    <button onClick={toggleTheme} className={classNameJoined} aria-label="Toggle theme">
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-gray-500" />
      )}
    </button>
  );
}
