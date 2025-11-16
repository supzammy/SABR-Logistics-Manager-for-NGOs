import React from 'react';
import { Modal } from './Modal';
import { Icon } from './Icon';
import type { InventoryItem, ShelterNeed, AiMatch } from '../types';

interface MatchingPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: AiMatch;
  inventory: InventoryItem[];
  needs: ShelterNeed[];
  onConfirmMatch: (donorItemId: string, shelterNeedId: string, quantityToMatch: number) => void;
}

export const MatchingPreviewModal: React.FC<MatchingPreviewModalProps> = ({ isOpen, onClose, match, inventory, needs, onConfirmMatch }) => {
  const item = inventory.find(i => i.id === match.inventoryId);
  const need = needs.find(n => n.id === match.needId);

  if (!item || !need) {
    return null; // Or some error state
  }

  const handleConfirm = () => {
    onConfirmMatch(item.id, need.id, match.quantity);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Review AI Match">
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-400">The AI has recommended the following match based on priority, expiration, and capacity.</p>
        
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
                <div className="text-center px-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">From Inventory</p>
                    <p className="font-bold text-gray-800 dark:text-white text-lg">{item.name}</p>
                    <p className="text-xs text-gray-500">({item.donor})</p>
                </div>
                <div className="flex flex-col items-center">
                    <Icon icon="truck" className="w-8 h-8 text-blue-500" title="In Transit" />
                    <p className="font-bold text-blue-500 mt-1">{match.quantity} {item.unit}</p>
                </div>
                <div className="text-center px-4">
                     <p className="text-sm text-gray-500 dark:text-gray-400">To Beneficiary</p>
                    <p className="font-bold text-gray-800 dark:text-white text-lg">{need.shelterName}</p>
                    <p className="text-xs text-gray-500">({need.address})</p>
                </div>
            </div>
        </div>

        <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-300">AI Rationale</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded-md mt-1 italic">"{match.reason}"</p>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button type="button" onClick={onClose} className="py-2 px-4 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold" title="Cancel and close">Cancel</button>
          <button type="button" onClick={handleConfirm} className="py-2 px-4 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold flex items-center" title="Confirm and finalize this match">
            <Icon icon="confirm" className="w-5 h-5 mr-2" title="Confirm Match" />
            Confirm Match
          </button>
        </div>
      </div>
    </Modal>
  );
};