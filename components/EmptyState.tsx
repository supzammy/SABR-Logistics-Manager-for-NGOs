import React from 'react';
import { Icon } from './Icon';

interface EmptyStateProps {
  icon: React.ComponentProps<typeof Icon>['icon'];
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message, actionText, onAction }) => {
  return (
    <div className="text-center py-16 px-6">
      <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700/50 rounded-full flex items-center justify-center animate-subtle-pulse">
        <Icon icon={icon} className="w-8 h-8 text-gray-400 dark:text-gray-500" title={title} />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">{message}</p>
      {actionText && onAction && (
        <div className="mt-6">
          <button
            onClick={onAction}
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            title={actionText}
          >
            <Icon icon="plus" className="-ml-1 mr-2 h-5 w-5" title="Add" />
            {actionText}
          </button>
        </div>
      )}
    </div>
  );
};
