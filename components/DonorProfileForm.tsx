import React, { useState, useMemo } from 'react';
import { Icon } from './Icon';
import type { Donor } from '../types';

interface DonorProfileFormProps {
  onSave: (data: Omit<Donor, 'id'>) => void;
}

type FormData = Omit<Donor, 'id'>;
type DonationType = 'Food' | 'Clothing' | 'Medical' | 'Other';
const ALL_DONATION_TYPES: DonationType[] = ['Food', 'Clothing', 'Medical', 'Other'];

const InputField: React.FC<{ label: string; name: string; value: string; onChange: any; error?: string; type?: string; required?: boolean; placeholder?: string }> = ({ label, error, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">{label}</label>
        <input {...props} className={`w-full py-2 px-3 text-gray-800 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 border  rounded-md focus:outline-none focus:ring-2 ${error ? 'border-red-500 ring-red-500' : 'border-gray-300 dark:border-gray-700 focus:ring-blue-500'}`} />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
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

const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">{title}</h3>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

export const DonorProfileForm: React.FC<DonorProfileFormProps> = ({ onSave }) => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: { street: '', city: '', zip: '' },
        businessType: 'Supermarket',
        status: 'Pending Verification',
        donationPreferences: {
            transportation: 'Pickup required',
            donationTypes: [],
        },
        taxInfo: { ein: '' },
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.name) newErrors.name = 'Organization name is required.';
        if (!formData.email) newErrors.email = 'Email is required.';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid.';
        if (!formData.address.street) newErrors.street = 'Street is required.';
        if (!formData.address.city) newErrors.city = 'City is required.';
        if (!formData.address.zip) newErrors.zip = 'ZIP code is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
  
    const handleNestedChange = (e: React.ChangeEvent<HTMLInputElement>, parent: 'address' | 'taxInfo') => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [parent]: { ...prev[parent], [name]: value }
        }));
    };
  
    const handleDonationTypeChange = (type: DonationType) => {
        const currentTypes = formData.donationPreferences.donationTypes || [];
        const newTypes = currentTypes.includes(type)
            ? currentTypes.filter(t => t !== type)
            : [...currentTypes, type];
      
        setFormData(prev => ({
            ...prev,
            donationPreferences: { ...prev.donationPreferences, donationTypes: newTypes }
        }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSave(formData);
        }
    };

    const isSubmitDisabled = useMemo(() => {
        return !formData.name || !formData.email || !formData.address.street || !formData.address.city || !formData.address.zip;
    }, [formData]);

    return (
        <form onSubmit={handleSubmit}>
            <FormSection title="Contact Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label="Organization / Individual Name" name="name" value={formData.name} onChange={handleChange} error={errors.name} required />
                        <SelectField label="Business Type" name="businessType" value={formData.businessType} onChange={handleChange} options={['Supermarket', 'Restaurant', 'Farm', 'Individual']} />
                </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label="Contact Person" name="contactPerson" value={formData.contactPerson} onChange={handleChange} />
                        <InputField label="Contact Email" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} required />
                </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label="Contact Phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
                        <InputField label="Tax EIN (for businesses)" name="ein" value={formData.taxInfo.ein} onChange={(e) => handleNestedChange(e, 'taxInfo')} placeholder="e.g., 12-3456789" />
                </div>
            </FormSection>

            <FormSection title="Address">
                <InputField label="Street Address" name="street" value={formData.address.street} onChange={(e) => handleNestedChange(e, 'address')} error={errors.street} required />
                <div className="grid grid-cols-2 gap-4">
                    <InputField label="City" name="city" value={formData.address.city} onChange={(e) => handleNestedChange(e, 'address')} error={errors.city} required />
                    <InputField label="ZIP / Postal Code" name="zip" value={formData.address.zip} onChange={(e) => handleNestedChange(e, 'address')} error={errors.zip} required />
                </div>
            </FormSection>

            <FormSection title="Donation Capabilities">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">What types of items can you typically donate?</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {ALL_DONATION_TYPES.map(type => (
                            <label key={type} className={`flex items-center p-3 rounded-md border cursor-pointer transition-colors ${formData.donationPreferences.donationTypes?.includes(type) ? 'bg-blue-500/20 border-blue-500' : 'bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700'}`}>
                                <input type="checkbox" checked={formData.donationPreferences.donationTypes?.includes(type)} onChange={() => handleDonationTypeChange(type)} className="w-4 h-4 text-blue-500 bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700 rounded focus:ring-blue-500" />
                                <span className="ml-3 text-gray-800 dark:text-white text-sm">{type}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">Transportation</label>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                        <label className="flex items-center p-3 rounded-md border flex-1 cursor-pointer transition-colors bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700">
                            <input type="radio" name="transportation" value="Pickup required" checked={formData.donationPreferences.transportation === 'Pickup required'} onChange={(e) => setFormData(p => ({...p, donationPreferences: {...p.donationPreferences, transportation: 'Pickup required'}}))} />
                            <span className="ml-3 text-gray-800 dark:text-white">We require pickup</span>
                        </label>
                            <label className="flex items-center p-3 rounded-md border flex-1 cursor-pointer transition-colors bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700">
                            <input type="radio" name="transportation" value="Self-deliver" checked={formData.donationPreferences.transportation === 'Self-deliver'} onChange={(e) => setFormData(p => ({...p, donationPreferences: {...p.donationPreferences, transportation: 'Self-deliver'}}))} />
                            <span className="ml-3 text-gray-800 dark:text-white">We can self-deliver</span>
                        </label>
                        </div>
                </div>
            </FormSection>
            
            <div className="flex justify-end pt-4 mt-6 border-t border-gray-200 dark:border-gray-700">
                <button type="submit" disabled={isSubmitDisabled} className="w-full md:w-auto flex items-center justify-center py-3 px-8 rounded-lg bg-green-500 hover:bg-green-600 text-white font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed" title="Complete and submit your donor registration">
                    <Icon icon="check-circle" className="w-6 h-6 mr-3" title="Submit Registration" />
                    Submit Registration
                </button>
            </div>
        </form>
    );
};