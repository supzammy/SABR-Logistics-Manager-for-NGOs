import React, { useState } from 'react';
import type { ManagerProfile } from '../types';

interface SettingsPageProps {
    managerProfile: ManagerProfile;
    setManagerProfile: React.Dispatch<React.SetStateAction<ManagerProfile>>;
    showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const SettingsSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">{title}</h2>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

const Toggle: React.FC<{ label: string; description: string; checked: boolean; onChange: (checked: boolean) => void; }> = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between" title={`Toggle ${label} notifications`}>
        <div>
            <p className="text-gray-800 dark:text-gray-200">{label}</p>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-500/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
        </label>
    </div>
);


export const SettingsPage: React.FC<SettingsPageProps> = ({ managerProfile, setManagerProfile, showToast }) => {
    const [formData, setFormData] = useState<ManagerProfile>(managerProfile);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleToggleChange = (field: keyof ManagerProfile['notifications'], value: boolean) => {
        setFormData(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [field]: value
            }
        }));
    };

    const handleSaveChanges = () => {
        setManagerProfile(formData);
        showToast('Settings saved successfully!', 'success');
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>
            
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700 max-w-3xl mx-auto">
                <SettingsSection title="User Profile">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full py-2 px-3 text-gray-800 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" title="Edit your full name" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Email Address</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full py-2 px-3 text-gray-800 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" title="Edit your email address" />
                        </div>
                    </div>
                </SettingsSection>
                
                <SettingsSection title="Notifications">
                    <Toggle label="Low Stock Alerts" description="Receive an email when inventory is running low." checked={formData.notifications.lowStock} onChange={(value) => handleToggleChange('lowStock', value)} />
                    <Toggle label="New Match Recommendations" description="Get notified about new high-priority needs." checked={formData.notifications.newMatches} onChange={(value) => handleToggleChange('newMatches', value)} />
                    <Toggle label="Weekly Summary" description="Receive a weekly report of all activities." checked={formData.notifications.weeklySummary} onChange={(value) => handleToggleChange('weeklySummary', value)} />
                </SettingsSection>

                <SettingsSection title="Security">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Change Password</label>
                        <input type="password" placeholder="New Password" className="w-full py-2 px-3 text-gray-800 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" title="Enter a new password to update your current one" />
                    </div>
                </SettingsSection>

                <div className="text-right mt-8">
                    <button onClick={handleSaveChanges} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors" title="Save all changes made on this page">Save Changes</button>
                </div>
            </div>
        </div>
    );
};