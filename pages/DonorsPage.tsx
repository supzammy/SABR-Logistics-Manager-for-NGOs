import React, { useMemo, useState } from 'react';
import type { Donor } from '../types';
import { Icon } from '../components/Icon';
import { Modal } from '../components/Modal';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { DonorRegistrationWizard } from '../components/DonorRegistrationWizard';

interface DonorsPageProps {
    donors: Donor[];
    setDonors: React.Dispatch<React.SetStateAction<Donor[]>>;
    onCreateDonor: (donorData: Omit<Donor, 'id'>) => void;
    onUpdateDonor: (donorData: Donor) => void;
    showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

type SortKeys = keyof Donor;
type SortDirection = 'ascending' | 'descending';

const SortableHeader: React.FC<{
    sortKey: SortKeys;
    title: string;
    sortConfig: { key: SortKeys; direction: SortDirection } | null;
    requestSort: (key: SortKeys) => void;
}> = ({ sortKey, title, sortConfig, requestSort }) => {
    const isSorted = sortConfig?.key === sortKey;
    const icon = isSorted ? (sortConfig.direction === 'ascending' ? 'chevron-up' : 'chevron-down') : 'chevron-down';
    const tooltip = isSorted && sortConfig.direction === 'ascending' ? `Sorted by ${title} descending. Click to sort ascending.` : `Click to sort by ${title} ascending.`;
    return (
        <th scope="col" className="px-6 py-3">
            <button className="flex items-center uppercase" onClick={() => requestSort(sortKey)} title={tooltip}>
                {title}
                <Icon icon={icon} className={`w-4 h-4 ml-1.5 ${isSorted ? 'text-gray-800 dark:text-white' : 'text-gray-500'}`} title="Change sort direction" />
            </button>
        </th>
    );
};

const getStatusClass = (status: 'Active' | 'Inactive' | 'Pending Verification') => {
    switch (status) {
        case 'Active': return 'text-green-500 dark:text-green-400 bg-green-100 dark:bg-green-900/50';
        case 'Inactive': return 'text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-700';
        case 'Pending Verification': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/50';
    }
};

export const DonorsPage: React.FC<DonorsPageProps> = ({ donors, setDonors, onCreateDonor, onUpdateDonor, showToast }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [editingDonor, setEditingDonor] = useState<Donor | null>(null);
    const [donorsToDelete, setDonorsToDelete] = useState<Donor[] | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: SortKeys; direction: SortDirection } | null>(null);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    
    const sortedDonors = useMemo(() => {
        let sortableItems = [...donors];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const valA = a[sortConfig.key];
                const valB = b[sortConfig.key];
                if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [donors, sortConfig]);
    
    const requestSort = (key: SortKeys) => {
        let direction: SortDirection = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const openEditModal = (donor: Donor) => {
        setEditingDonor(donor);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditingDonor(null);
        setIsEditModalOpen(false);
    };

    const handleEditSave = (updatedDonor: Donor) => {
        onUpdateDonor(updatedDonor);
        closeEditModal();
    };

    const handleCreateSave = (newDonorData: Omit<Donor, 'id'>) => {
        onCreateDonor(newDonorData);
        setIsWizardOpen(false);
        showToast('New donor successfully registered!', 'success');
    };
    
    const handleDelete = () => {
        if (donorsToDelete) {
            const idsToDelete = new Set(donorsToDelete.map(d => d.id));
            setDonors(prev => prev.filter(d => !idsToDelete.has(d.id)));
            showToast(`${idsToDelete.size} donor(s) removed.`, 'info');
            setDonorsToDelete(null);
            setSelectedItems(new Set());
        }
    };
    
    const handleSelectionChange = (donorId: string) => {
        const newSelection = new Set(selectedItems);
        if (newSelection.has(donorId)) {
            newSelection.delete(donorId);
        } else {
            newSelection.add(donorId);
        }
        setSelectedItems(newSelection);
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedItems(new Set(sortedDonors.map(d => d.id)));
        } else {
            setSelectedItems(new Set());
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Donor Management</h1>
                <button onClick={() => setIsWizardOpen(true)} className="flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors" title="Open the donor registration wizard">
                    <Icon icon="plus" className="w-5 h-5 mr-2" title="Register New Donor" />
                    Register New Donor
                </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                {selectedItems.size > 0 && (
                    <div className="flex items-center justify-between bg-blue-50 dark:bg-gray-900 p-3 rounded-md mb-4 border border-blue-200 dark:border-blue-900">
                        <span className="text-sm font-semibold text-blue-800 dark:text-blue-300">{selectedItems.size} donor(s) selected</span>
                        <button 
                            onClick={() => setDonorsToDelete(donors.filter(d => selectedItems.has(d.id)))}
                            className="flex items-center text-sm font-bold text-red-500 hover:text-red-700"
                            title={`Delete ${selectedItems.size} selected items`}
                        >
                            <Icon icon="trash" className="w-4 h-4 mr-1.5" title="Delete selected donors" />
                            Delete Selected
                        </button>
                    </div>
                )}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600 dark:text-gray-400">
                        <thead className="text-xs text-gray-500 dark:text-gray-300 uppercase bg-gray-100 dark:bg-gray-900">
                            <tr>
                                <th scope="col" className="p-4">
                                    <input 
                                        type="checkbox" 
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        onChange={handleSelectAll}
                                        checked={selectedItems.size > 0 && selectedItems.size === sortedDonors.length}
                                        aria-label="Select all donors"
                                    />
                                </th>
                                <SortableHeader sortKey="name" title="Organization/Name" sortConfig={sortConfig} requestSort={requestSort} />
                                <SortableHeader sortKey="contactPerson" title="Contact Person" sortConfig={sortConfig} requestSort={requestSort} />
                                <SortableHeader sortKey="businessType" title="Type" sortConfig={sortConfig} requestSort={requestSort} />
                                <SortableHeader sortKey="status" title="Status" sortConfig={sortConfig} requestSort={requestSort} />
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedDonors.map(donor => (
                                <tr key={donor.id} className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                     <td className="w-4 p-4">
                                        <input 
                                            type="checkbox" 
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                            checked={selectedItems.has(donor.id)}
                                            onChange={() => handleSelectionChange(donor.id)}
                                            aria-label={`Select donor ${donor.name}`}
                                        />
                                    </td>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{donor.name}</th>
                                    <td className="px-6 py-4">{donor.contactPerson}<br/><span className="text-xs text-gray-500">{donor.email}</span></td>
                                    <td className="px-6 py-4">{donor.businessType}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${getStatusClass(donor.status)}`}>
                                            {donor.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-1">
                                            <button onClick={() => openEditModal(donor)} className="p-2 rounded-full text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-white dark:focus:ring-offset-gray-800"><Icon icon="pencil" className="w-4 h-4" title="Edit Donor" /></button>
                                            <button onClick={() => setDonorsToDelete([donor])} className="p-2 rounded-full text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-white dark:focus:ring-offset-gray-800"><Icon icon="trash" className="w-4 h-4" title="Delete Donor" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isWizardOpen && <DonorRegistrationWizard onSave={handleCreateSave} onClose={() => setIsWizardOpen(false)} />}
            {isEditModalOpen && editingDonor && <DonorFormModal donor={editingDonor} onSave={handleEditSave} onClose={closeEditModal} />}
            {donorsToDelete && <ConfirmationModal isOpen={!!donorsToDelete} onClose={() => setDonorsToDelete(null)} onConfirm={handleDelete} title="Delete Donor(s)" message={`Are you sure you want to delete ${donorsToDelete.length} donor(s)? This will not affect past donation records but will remove them from active lists.`} />}
        </div>
    );
};


const DonorFormModal: React.FC<{ donor: Donor; onSave: (data: Donor) => void; onClose: () => void; }> = ({ donor, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        name: donor?.name || '',
        contactPerson: donor?.contactPerson || '',
        email: donor?.email || '',
        phone: donor?.phone || '',
        address: donor?.address ? `${donor.address.street}, ${donor.address.city}, ${donor.address.zip}` : '',
        businessType: donor?.businessType || 'Supermarket',
        status: donor?.status || 'Pending Verification',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const addressParts = formData.address.split(',').map(part => part.trim());
        const finalData: Donor = {
            ...donor,
            name: formData.name,
            contactPerson: formData.contactPerson,
            email: formData.email,
            phone: formData.phone,
            businessType: formData.businessType as Donor['businessType'],
            status: formData.status as Donor['status'],
            address: {
                street: addressParts[0] || '',
                city: addressParts[1] || '',
                zip: addressParts[2] || '',
            },
        };
        onSave(finalData);
    };

    return (
        <Modal isOpen={true} onClose={onClose} title={'Edit Donor Profile'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Organization/Individual Name" name="name" value={formData.name} onChange={handleChange} required />
                    <SelectField label="Business Type" name="businessType" value={formData.businessType} onChange={handleChange} options={['Supermarket', 'Restaurant', 'Farm', 'Individual']} />
                    <InputField label="Contact Person" name="contactPerson" value={formData.contactPerson} onChange={handleChange} required />
                    <InputField label="Contact Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                    <InputField label="Contact Phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
                    <SelectField label="Status" name="status" value={formData.status} onChange={handleChange} options={['Active', 'Inactive', 'Pending Verification']} />
                </div>
                 <InputField label="Address (Street, City, ZIP)" name="address" value={formData.address} onChange={handleChange} />
                <div className="flex justify-end space-x-3 pt-4">
                    <button type="button" onClick={onClose} className="py-2 px-4 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold" title="Discard changes and close">Cancel</button>
                    <button type="submit" className="py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold" title="Save changes to donor profile">Save Changes</button>
                </div>
            </form>
        </Modal>
    );
};

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