import React from 'react';
import type { Achievement } from '../types';
import { Icon } from './Icon';

interface AchievementBadgeProps {
  achievement: Achievement;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement }) => {
  const { name, description, unlocked, icon } = achievement;

  const colorClass = unlocked ? 'bg-orange-500/20 text-orange-500' : 'bg-gray-700 text-gray-500';
  const iconColorClass = unlocked ? 'text-orange-500' : 'text-gray-500';

  return (
    <div className="flex flex-col items-center flex-shrink-0 text-center">
      <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 relative ${colorClass}`}>
        <Icon icon={icon} className={`w-10 h-10 ${iconColorClass}`} title={unlocked ? description : `${name} (Locked)`} />
        {!unlocked && (
          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        )}
      </div>
      <p className={`mt-2 text-xs font-semibold ${unlocked ? 'text-gray-800 dark:text-white' : 'text-gray-500'}`}>{name}</p>
    </div>
  );
};
