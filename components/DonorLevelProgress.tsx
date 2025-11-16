import React from 'react';

interface DonorLevelProgressProps {
  levelName: string;
  progress: number; // 0 to 100
  currentValue: number;
  nextLevelValue: number;
}

export const DonorLevelProgress: React.FC<DonorLevelProgressProps> = ({ levelName, progress, currentValue, nextLevelValue }) => {
  const valueToNextLevel = nextLevelValue > 0 ? nextLevelValue - currentValue : 0;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 w-full max-w-sm shadow-sm">
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-sm font-bold text-orange-500">{levelName}</span>
        {valueToNextLevel > 0 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
            ${valueToNextLevel.toLocaleString()} to next level
            </span>
        )}
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-orange-400 to-amber-500 h-2.5 rounded-full animate-progress-bar-fill relative"
          style={{ '--progress-width': `${progress}%` } as React.CSSProperties}
          title={`Progress: ${progress.toFixed(0)}%`}
        >
            <div 
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)',
                    animation: 'shimmer 2.5s infinite',
                    backgroundSize: '2000px 100%',
                }}
            ></div>
        </div>
      </div>
    </div>
  );
};
