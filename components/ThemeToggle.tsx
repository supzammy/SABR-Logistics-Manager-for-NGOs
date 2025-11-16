import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { Icon } from './Icon';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 focus:ring-blue-500"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Icon icon="moon" className="w-6 h-6" title="Switch to Dark Mode" />
      ) : (
        <Icon icon="sun" className="w-6 h-6" title="Switch to Light Mode" />
      )}
    </button>
  );
};
