import React, { useState, useMemo } from 'react';
import { Modal } from './Modal';
import { Icon } from './Icon';
import type { Donor } from '../types';

interface DonorRegistrationWizardProps {
  onSave: (data: Omit<Donor, 'id'>) => void;
  onClose: () => void;
}

type FormData = Omit<Donor, 'id'>;
type DonationType = 'Food' | 'Clothing' | 'Medical' | 'Other';
const ALL_DONATION_TYPES: DonationType[] = ['Food', 'Clothing', 'Medical', 'Other'];

const ProgressBar: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => {
    return (
        <div className="flex items-center mb-6">
            {Array.from({ length: totalSteps }, (_, i) => {
                const step = i + 1;
                const isCompleted = step < currentStep;
                const isActive = step === currentStep;
                return (
                    <React.Fragment key={step}>
                        <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${isCompleted ? 'bg-green-500' : isActive ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-700'}`}>
                                {isCompleted ? <Icon icon="confirm" className="w-5 h-5 text-white" title="Step Complete" /> : <span className="font-bold text-white">{step}</span>}
                            </div>
                        </div>
                        {step < totalSteps && (
                            <div className={`flex-1 h-1 transition-colors duration-300 ${isCompleted ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

const InputField: React.FC<{ label: string; name: string; value: string; onChange: any; error?: string; type?: string; required?: boolean }> = ({ label, error, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">{label}</label>
        <input {...props} className={`w-full py-2 px-3 text-gray-800 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 border  rounded-md focus:outline-none focus:ring-2 ${error ? 'border-red-500 ring-red-500' : 'border-gray-300 dark:border-gray-700 focus:ring-blue-500'}`} />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);


export const DonorRegistrationWizard: React.FC<DonorRegistrationWizardProps> = ({ onSave, onClose }) => {
  const [step, setStep] = useState(1);
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

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};
    if (currentStep === 1) {
        if (!formData.name) newErrors.name = 'Organization name is required.';
        if (!formData.contactPerson) newErrors.contactPerson = 'Contact person is required.';
        if (!formData.email) newErrors.email = 'Email is required.';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid.';
    }
    if (currentStep === 3) {
        if (!formData.address.street) newErrors.street = 'Street is required.';
        if (!formData.address.city) newErrors.city = 'City is required.';
        if (!formData.address.zip) newErrors.zip = 'ZIP code is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNext = () => {
      if (validateStep(step)) {
          setStep(prev => prev + 1);
      }
  };

  const handleBack = () => setStep(prev => prev - 1);
  const handleSubmit = () => {
    if (validateStep(3) && validateStep(1)) { // Re-validate all previous steps on submit
      onSave(formData);
    }
  };
  
  const isNextDisabled = useMemo(() => {
      if (step === 1) return !formData.name || !formData.contactPerson || !formData.email;
      if (step === 3) return !formData.address.street || !formData.address.city || !formData.address.zip;
      return false;
  }, [step, formData]);


  return (
    <Modal isOpen={true} onClose={onClose} title="Register a New Donor">
      <div className="p-2">
        <ProgressBar currentStep={step} totalSteps={4} />
        
        {step === 1 && (
            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">1. Basic Information</h3>
                <InputField label="Organization / Individual Name" name="name" value={formData.name} onChange={handleChange} error={errors.name} required />
                <InputField label="Contact Person" name="contactPerson" value={formData.contactPerson} onChange={handleChange} error={errors.contactPerson} required />
                <InputField label="Contact Email" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} required />
                <InputField label="Contact Phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
            </div>
        )}

        {step === 2 && (
             <div className="space-y-4">
                 <h3 className="text-xl font-semibold text-gray-900 dark:text-white">2. Donation Preferences</h3>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">What types of items can you donate?</label>
                    <div className="grid grid-cols-2 gap-2">
                        {ALL_DONATION_TYPES.map(type => (
                            <label key={type} className={`flex items-center p-3 rounded-md border cursor-pointer transition-colors ${formData.donationPreferences.donationTypes?.includes(type) ? 'bg-blue-500/20 border-blue-500' : 'bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700'}`}>
                                <input type="checkbox" checked={formData.donationPreferences.donationTypes?.includes(type)} onChange={() => handleDonationTypeChange(type)} className="w-4 h-4 text-blue-500 bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700 rounded focus:ring-blue-500" />
                                <span className="ml-3 text-gray-800 dark:text-white">{type}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">Transportation</label>
                     <div className="flex space-x-4">
                        <label>
                            <input type="radio" name="transportation" value="Pickup required" checked={formData.donationPreferences.transportation === 'Pickup required'} onChange={(e) => setFormData(p => ({...p, donationPreferences: {...p.donationPreferences, transportation: 'Pickup required'}}))} />
                            <span className="ml-2 text-gray-800 dark:text-white">We require pickup</span>
                        </label>
                         <label>
                            <input type="radio" name="transportation" value="Self-deliver" checked={formData.donationPreferences.transportation === 'Self-deliver'} onChange={(e) => setFormData(p => ({...p, donationPreferences: {...p.donationPreferences, transportation: 'Self-deliver'}}))} />
                            <span className="ml-2 text-gray-800 dark:text-white">We can self-deliver</span>
                        </label>
                     </div>
                </div>
            </div>
        )}
        
        {step === 3 && (
            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">3. Location & Tax Details</h3>
                <InputField label="Street Address" name="street" value={formData.address.street} onChange={(e) => handleNestedChange(e, 'address')} error={errors.street} required />
                <div className="grid grid-cols-2 gap-4">
                    <InputField label="City" name="city" value={formData.address.city} onChange={(e) => handleNestedChange(e, 'address')} error={errors.city} required />
                    <InputField label="ZIP / Postal Code" name="zip" value={formData.address.zip} onChange={(e) => handleNestedChange(e, 'address')} error={errors.zip} required />
                </div>
                <InputField label="Tax EIN (for businesses)" name="ein" value={formData.taxInfo.ein} onChange={(e) => handleNestedChange(e, 'taxInfo')} />
            </div>
        )}
        
        {step === 4 && (
             <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">4. Review & Confirm</h3>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-2 text-sm">
                    <p><strong>Name:</strong> <span className="text-gray-700 dark:text-gray-300">{formData.name}</span></p>
                    <p><strong>Contact:</strong> <span className="text-gray-700 dark:text-gray-300">{formData.contactPerson} ({formData.email})</span></p>
                    <p><strong>Address:</strong> <span className="text-gray-700 dark:text-gray-300">{formData.address.street}, {formData.address.city}, {formData.address.zip}</span></p>
                    <p><strong>Preferences:</strong> <span className="text-gray-700 dark:text-gray-300">{formData.donationPreferences.donationTypes?.join(', ')} ({formData.donationPreferences.transportation})</span></p>
                    <p><strong>EIN:</strong> <span className="text-gray-700 dark:text-gray-300">{formData.taxInfo.ein || 'N/A'}</span></p>
                </div>
                 <p className="text-xs text-gray-500">By submitting, you agree to our terms of service and partnership guidelines.</p>
            </div>
        )}

        <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
          <button type="button" onClick={handleBack} disabled={step === 1} className="py-2 px-4 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed" title="Go to the previous step">
            Back
          </button>
          
          {step < 4 && (
            <button type="button" onClick={handleNext} disabled={isNextDisabled} className="py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed" title="Go to the next step">
              Next Step
            </button>
          )}

          {step === 4 && (
            <button type="button" onClick={handleSubmit} className="flex items-center py-2 px-4 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold" title="Finalize and submit your registration">
              <Icon icon="check-circle" className="w-5 h-5 mr-2" title="Submit Registration" />
              Submit Registration
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};