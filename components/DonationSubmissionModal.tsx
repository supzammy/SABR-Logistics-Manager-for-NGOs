import React, { useState } from 'react';
import { Modal } from './Modal';
import { Icon } from './Icon';
import type { DonationSubmission } from '../types';

interface DonationSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<DonationSubmission, 'id' | 'donorId' | 'status' | 'createdAt'>) => void;
}

const InputField: React.FC<{ label: string; name: string; value: string; onChange: any; type?: string; required?: boolean }> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">{label}</label>
        <input {...props} className="w-full py-2 px-3 text-gray-800 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
);

const SelectField: React.FC<{ label: string; name: string; value: string; onChange: any; options: string[] }> = ({ label, options, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">{label}</label>
        <select {...props} className="w-full py-2 px-3 text-gray-800 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

const TextareaField: React.FC<{ label: string; name: string; value: string; onChange: any; rows?: number }> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">{label}</label>
        <textarea {...props} className="w-full py-2 px-3 text-gray-800 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
);

export const DonationSubmissionModal: React.FC<DonationSubmissionModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    category: 'Food',
    name: '',
    quantity: 1,
    unit: 'kg',
    expiryDate: '',
    storageNotes: '',
    pickupStart: '',
    pickupEnd: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = {
        items: [{
            category: formData.category as 'Food' | 'Clothing' | 'Medical' | 'Other',
            name: formData.name,
            quantity: Number(formData.quantity),
            unit: formData.unit,
            expiryDate: formData.expiryDate || undefined,
            storageNotes: formData.storageNotes,
        }],
        pickupWindow: {
            start: new Date(formData.pickupStart).toISOString(),
            end: new Date(formData.pickupEnd).toISOString(),
        }
    };
    onSubmit(submissionData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Submit a New Donation">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">Item Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField label="Item Type" name="category" value={formData.category} onChange={handleChange} options={['Food', 'Clothing', 'Medical', 'Other']} />
            <InputField label="Item Name" name="name" value={formData.name} onChange={handleChange} required />
            <InputField label="Quantity" name="quantity" type="number" value={String(formData.quantity)} onChange={handleChange} required />
            <InputField label="Unit (e.g., kg, cans)" name="unit" value={formData.unit} onChange={handleChange} required />
        </div>
         <InputField label="Expiry Date (if applicable)" name="expiryDate" type="date" value={formData.expiryDate} onChange={handleChange} />
         <TextareaField label="Storage Requirements / Special Instructions" name="storageNotes" value={formData.storageNotes} onChange={handleChange} rows={2} />

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-4 pt-4">Pickup Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Available Pickup From" name="pickupStart" type="datetime-local" value={formData.pickupStart} onChange={handleChange} required />
            <InputField label="Available Pickup Until" name="pickupEnd" type="datetime-local" value={formData.pickupEnd} onChange={handleChange} required />
        </div>
        
        <div className="flex justify-end space-x-3 pt-6">
          <button type="button" onClick={onClose} className="py-2 px-4 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold" title="Cancel donation submission">Cancel</button>
          <button type="submit" className="flex items-center py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold" title="Submit this donation for review">
            <Icon icon="package" className="w-5 h-5 mr-2" title="Submit Donation" />
            Submit Donation
          </button>
        </div>
      </form>
    </Modal>
  );
};