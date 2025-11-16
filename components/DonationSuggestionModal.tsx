import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Icon } from './Icon';
import type { ShelterNeed, DonationSuggestion } from '../types';
import { generateDonationSuggestions } from '../services/aiService';

interface DonationSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  needs: ShelterNeed[];
}

export const DonationSuggestionModal: React.FC<DonationSuggestionModalProps> = ({ isOpen, onClose, needs }) => {
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<DonationSuggestion[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchSuggestions = async () => {
        setLoading(true);
        setError(null);
        try {
          const result = await generateDonationSuggestions(needs);
          setSuggestions(result);
        } catch (err) {
          console.error(err);
          setError('Could not fetch donation ideas at this time.');
        } finally {
          setLoading(false);
        }
      };
      fetchSuggestions();
    }
  }, [isOpen, needs]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Donation Ideas">
      <div>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Here are a few ideas for high-impact donations based on the current needs of our community partners:</p>
        
        {loading && (
          <div className="flex items-center justify-center h-48">
            <Icon icon="loading" className="w-8 h-8 animate-spin text-blue-500" title="Generating ideas..." />
            <p className="ml-3 text-gray-700 dark:text-gray-300">Generating ideas...</p>
          </div>
        )}

        {error && <p className="text-red-500 text-center">{error}</p>}

        {!loading && !error && (
            <div className="space-y-3">
                {suggestions.map((s, index) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h4 className="font-bold text-orange-500">{s.itemName}</h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{s.reason}</p>
                    </div>
                ))}
            </div>
        )}

        <div className="text-right mt-6">
            <button type="button" onClick={onClose} className="py-2 px-6 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold" title="Close this window">
                Close
            </button>
        </div>
      </div>
    </Modal>
  );
};