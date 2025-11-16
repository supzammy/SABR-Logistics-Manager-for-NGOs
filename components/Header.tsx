import React from 'react';
import { Icon } from './Icon';
import { ThemeToggle } from './ThemeToggle';
import type { Donor, ManagerProfile } from '../types';

type UserRole = 'manager' | 'donor';

interface HeaderProps {
  userProfile: ManagerProfile | Donor;
  userRole: UserRole;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ userProfile, userRole, onLogout }) => {
  const username = userProfile.name;
  const roleDescription = userRole === 'manager' ? "Food Bank Manager" : "Valued Donor";

  return (
    <header className="flex items-center justify-end p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 relative z-10 gap-4">
      <div className="flex-grow" />
      
      <ThemeToggle />

      <div className="flex items-center">
        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full mr-3 flex items-center justify-center font-bold text-gray-800 dark:text-white">
          {username.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{username}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{roleDescription}</p>
        </div>
        <button 
          onClick={onLogout} 
          className="ml-4 p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-white dark:focus:ring-offset-gray-800" 
          title="Logout"
        >
            <Icon icon="logout" className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
