import React, { useEffect } from 'react';
import { Icon } from './Icon';

export interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-dismiss after 5 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  const baseClasses = "fixed bottom-5 right-5 z-50 flex items-center p-4 max-w-xs w-full text-white rounded-lg shadow-lg border";
  const typeClasses = {
    success: 'bg-green-500/80 border-green-500',
    error: 'bg-red-800/80 border-red-600',
    info: 'bg-blue-500/80 border-blue-500',
  };
  const icon: 'confirm' | 'alert' = type === 'success' ? 'confirm' : 'alert';

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`} role="alert">
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg bg-black/20">
        <Icon icon={icon} className="w-5 h-5" title={type} />
      </div>
      <div className="ml-3 text-sm font-normal">{message}</div>
      <button 
        type="button" 
        className="ml-auto -mx-1.5 -my-1.5 bg-transparent text-gray-200 hover:text-white rounded-lg p-1.5 inline-flex h-8 w-8" 
        onClick={onClose} 
        aria-label="Close"
        title="Close notification"
      >
        <span className="sr-only">Close</span>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
      </button>
    </div>
  );
};