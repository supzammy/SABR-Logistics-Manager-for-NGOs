import React from 'react';
import { Icon } from './Icon';
import { ThemeToggle } from './ThemeToggle';
import type { Donor, ManagerProfile } from '../types';

type UserRole = 'manager' | 'donor';

interface HeaderProps {
  currentUser: UserRole;
  setCurrentUser: (role: UserRole) => void;
  donors: Donor[];
  selectedDonor: string;
  setSelectedDonor: (donor: string) => void;
  managerProfile: ManagerProfile;
}

export const Header: React.FC<HeaderProps> = ({ currentUser, setCurrentUser, donors, selectedDonor, setSelectedDonor, managerProfile }) => {
  const isManager = currentUser === 'manager';
  const username = isManager ? managerProfile.name : (selectedDonor === '__REGISTER__' ? 'New Donor' : selectedDonor);
  const roleDescription = isManager ? "Food Bank Manager" : "Valued Donor";

  return (
    <header className="flex items-center justify-end p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 relative z-10 gap-4">
      <div className="flex-grow" />
      
      {/* User Role Switcher */}
      <div className="flex items-center space-x-2">
        <Icon icon="portal" className="w-5 h-5 text-gray-500 dark:text-gray-400" title="Switch View" />
        <div className="relative flex w-52 items-center rounded-xl bg-gray-100 dark:bg-gray-800 p-1 transition-colors">
          <span
            className={`absolute left-1 top-1 h-[calc(100%-0.5rem)] w-[calc(50%-0.25rem)] rounded-lg bg-white dark:bg-gray-700 shadow-lg ring-1 ring-black/5 dark:ring-white/10 transition-transform duration-300 ease-in-out ${
              currentUser === 'manager' ? 'translate-x-0' : 'translate-x-full'
            }`}
            aria-hidden="true"
          />
          <button
            onClick={() => setCurrentUser('manager')}
            className={`relative z-10 flex-1 py-1.5 text-center text-sm font-semibold transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100 dark:focus-visible:ring-offset-gray-800 ${
              currentUser === 'manager' ? 'text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
            aria-pressed={currentUser === 'manager'}
            title="Switch to Manager View"
          >
            Manager
          </button>
          <button
            onClick={() => setCurrentUser('donor')}
            className={`relative z-10 flex-1 py-1.5 text-center text-sm font-semibold transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100 dark:focus-visible:ring-offset-gray-800 ${
              currentUser === 'donor' ? 'text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
            aria-pressed={currentUser === 'donor'}
            title="Switch to Donor Portal"
          >
            Donor Portal
          </button>
        </div>
      </div>
      
      {!isManager && (
          <select
            value={selectedDonor}
            onChange={(e) => setSelectedDonor(e.target.value)}
            className="py-1 px-2 text-sm text-gray-800 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            title="Select an existing Donor to view their portal or register a new one"
          >
            <option value="__REGISTER__">-- Register New Donor --</option>
            {donors.map(donor => <option key={donor.id} value={donor.name}>{donor.name}</option>)}
          </select>
        )}

      <ThemeToggle />

      <div className="flex items-center">
        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full mr-3 flex items-center justify-center font-bold text-gray-800 dark:text-white">
          {username.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{username}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{roleDescription}</p>
        </div>
      </div>
    </header>
  );
};