import React, { useState } from 'react';
import { Icon } from './Icon';

interface ShareableImpactCardProps {
  shareText: string;
}

export const ShareableImpactCard: React.FC<ShareableImpactCardProps> = ({ shareText }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    });
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 text-left">
      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2">Share Your Impact!</h4>
      <p className="text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-3 rounded-md mb-3">
        {shareText}
      </p>
      <button
        onClick={handleCopy}
        title={copied ? 'Copied!' : 'Copy the suggested text to your clipboard'}
        className="w-full flex items-center justify-center py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-colors"
      >
        <Icon icon={copied ? 'confirm' : 'receipt'} className="w-5 h-5 mr-2" title="Copy Share Text" />
        {copied ? 'Copied to Clipboard!' : 'Copy Share Text'}
      </button>
    </div>
  );
};