import React from 'react';
import { Icon } from './Icon';

type Page = 'Dashboard' | 'Inventory' | 'Donors' | 'Beneficiaries' | 'Reports' | 'Matches' | 'Volunteers' | 'Settings' | 'About';

interface NavItemProps {
    icon: any;
    label: Page;
    activePage: Page;
    onClick: (page: Page) => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, activePage, onClick }) => (
  <button
    onClick={() => onClick(label)}
    className={`flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 text-left ${
      activePage === label
        ? 'bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-white'
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-white'
    }`}
  >
    <Icon icon={icon} className="w-5 h-5 mr-3" title={label} />
    {label}
  </button>
);


interface SidebarProps {
    activePage: Page;
    setActivePage: (page: Page) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  return (
    <div className="flex flex-col w-64 h-screen px-4 py-8 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
      <div className="flex items-center mb-8">
         <div className="w-10 h-10 bg-gradient-to-tr from-orange-500 to-blue-500 rounded-full mr-3"></div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">SABR</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Logistics for Good</p>
        </div>
      </div>

      <div className="flex flex-col justify-between flex-1">
        <nav className="space-y-2">
          <NavItem icon="dashboard" label="Dashboard" activePage={activePage} onClick={setActivePage} />
          <NavItem icon="inventory" label="Inventory" activePage={activePage} onClick={setActivePage} />
          <NavItem icon="donors" label="Donors" activePage={activePage} onClick={setActivePage} />
          <NavItem icon="beneficiaries" label="Beneficiaries" activePage={activePage} onClick={setActivePage} />
          <NavItem icon="matches" label="Matches" activePage={activePage} onClick={setActivePage} />
          <NavItem icon="volunteers" label="Volunteers" activePage={activePage} onClick={setActivePage} />
          <NavItem icon="reports" label="Reports" activePage={activePage} onClick={setActivePage} />
          <NavItem icon="info" label="About" activePage={activePage} onClick={setActivePage} />
        </nav>

        <nav>
          <NavItem icon="settings" label="Settings" activePage={activePage} onClick={setActivePage} />
        </nav>
      </div>
    </div>
  );
};
