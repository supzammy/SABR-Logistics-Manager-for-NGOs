import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
  progress?: { current: number; total: number; label?: string };
  glowColor?: string; // e.g., "52, 211, 153"
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, description, children, className, progress, glowColor }) => {
  const progressPercentage = progress ? (progress.current / progress.total) * 100 : 0;
  
  const getProgressColor = (percentage: number) => {
      if (percentage > 85) return 'bg-red-500';
      if (percentage > 60) return 'bg-yellow-500';
      return 'bg-green-500';
  }

  const cardClasses = [
    'relative',
    'bg-white dark:bg-gray-800',
    'p-6 rounded-lg border border-gray-200 dark:border-gray-700',
    'transition-all duration-300 ease-in-out',
    'hover:shadow-lg hover:scale-[1.02]',
    'flex flex-col justify-between',
    glowColor ? 'glow-on-hover' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
        className={cardClasses}
        style={glowColor ? { '--glow-color': glowColor } as React.CSSProperties : {}}
    >
        <div>
            <div className="flex items-baseline space-x-2">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
            {children}
        </div>
        {progress && (
            <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span>{progress.label || `${progress.current.toLocaleString()} / ${progress.total.toLocaleString()}`}</span>
                    <span>{progressPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                        className={`h-2 rounded-full ${getProgressColor(progressPercentage)} transition-all duration-500`}
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
            </div>
        )}
    </div>
  );
};