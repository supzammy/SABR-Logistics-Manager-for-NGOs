import React from 'react';
import { Icon } from './Icon';
import { Modal } from './Modal';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
      <div className="flex justify-end space-x-4">
        <button
          onClick={onClose}
          className="py-2 px-4 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold transition-colors"
          title="Cancel this action"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="flex items-center py-2 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
          title="Confirm this action"
        >
          <Icon icon="trash" className="w-4 h-4 mr-2" title="Confirm Delete" />
          Confirm Delete
        </button>
      </div>
    </Modal>
  );
};