import React from 'react';
import { Icon } from './Icon';

interface ImpactCardProps {
  icon: 'dollar-sign' | 'gift' | 'beneficiaries';
  value: string;
  title: string;
  description: string;
  colorClass: string;
  glowColor: string; // e.g., "52, 211, 153" for green
}

export const ImpactCard: React.FC<ImpactCardProps> = ({ icon, value, title, description, colorClass, glowColor }) => {
  return (
    <div 
        className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center space-x-6 shadow-md hover:shadow-xl hover:scale-[1.03] transition-all duration-300 glow-on-hover"
        style={{ '--glow-color': glowColor } as React.CSSProperties}
    >
        <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center ${colorClass}`}>
            <Icon icon={icon} className="w-8 h-8 text-white" title={title} />
        </div>
        <div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
    </div>
  );
};
