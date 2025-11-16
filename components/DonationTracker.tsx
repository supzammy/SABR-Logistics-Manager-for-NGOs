import React from 'react';
import { Icon } from './Icon';
import type { DonationSubmission } from '../types';

interface DonationTrackerProps {
  submission: DonationSubmission;
}

const statusSteps: DonationSubmission['status'][] = ['Matched', 'Collected', 'In Transit', 'Delivered'];

const getStepIcon = (status: DonationSubmission['status']): React.ComponentProps<typeof Icon>['icon'] => {
    switch(status) {
        case 'Matched': return 'confirm';
        case 'Collected': return 'package';
        case 'In Transit': return 'truck';
        case 'Delivered': return 'beneficiaries';
        default: return 'confirm';
    }
}

export const DonationTracker: React.FC<DonationTrackerProps> = ({ submission }) => {
  const currentStatusIndex = statusSteps.indexOf(submission.status);
  const mainItem = submission.items[0];

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="mb-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">Tracking Donation ID: <span className="font-mono text-xs text-gray-400 dark:text-gray-500">{submission.id}</span></p>
        <p className="text-lg font-bold text-gray-800 dark:text-white">
          {mainItem.quantity} {mainItem.unit} of {mainItem.name} heading to <span className="text-blue-500">{submission.matchDetails?.name || 'beneficiary'}</span>
        </p>
      </div>
      <div className="flex items-center justify-between">
        {statusSteps.map((step, index) => {
          const isActive = index <= currentStatusIndex;
          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors duration-500 ${isActive ? 'bg-green-100 dark:bg-green-500/20 border-green-500 text-green-500' : 'bg-gray-200 dark:bg-gray-700 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500'}`}>
                  <Icon icon={getStepIcon(step)} className="w-6 h-6" title={step} />
                </div>
                <p className={`mt-2 text-xs font-semibold transition-colors duration-500 ${isActive ? 'text-gray-800 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>{step}</p>
              </div>
              {index < statusSteps.length - 1 && (
                <div className={`flex-1 h-1 mx-2 rounded-full transition-colors duration-500 ${isActive ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
