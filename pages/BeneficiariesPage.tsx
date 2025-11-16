import React, { useState, useMemo } from 'react';
import type { ShelterNeed } from '../types';
import { Icon } from '../components/Icon';
import { Modal } from '../components/Modal';
import { ConfirmationModal } from '../components/ConfirmationModal';

interface BeneficiariesPageProps {
    needs: ShelterNeed[];
    setNeeds: React.Dispatch<React.SetStateAction<ShelterNeed[]>>;
    showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

type SortKeys = keyof ShelterNeed;
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

const getPriorityClass = (priority: 'High' | 'Medium' | 'Low') => {
    switch (priority) {
        case 'High': return 'text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/50';
        case 'Medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/50';
        case 'Low': return 'text-green-500 dark:text-green-400 bg-green-100 dark:bg-green-900/50';
    }
};

export const BeneficiariesPage: React.FC<BeneficiariesPageProps> = ({ needs, setNeeds, showToast }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNeed, setEditingNeed] = useState<ShelterNeed | null>(null);
    const [needsToDelete, setNeedsToDelete] = useState<ShelterNeed[] | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: SortKeys; direction: SortDirection } | null>(null);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

    const sortedNeeds = useMemo(() => {
        let sortableItems = [...needs];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [needs, sortConfig]);

     const requestSort = (key: SortKeys) => {
        let direction: SortDirection = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const openModal = (need: ShelterNeed | null = null) => {
        setEditingNeed(need);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setEditingNeed(null);
        setIsModalOpen(false);
    };

    const handleSave = (needData: Omit<ShelterNeed, 'id'>) => {
        if (editingNeed) {
            setNeeds(prev => prev.map(need => need.id === editingNeed.id ? { ...need, ...needData } : need));
            showToast('Beneficiary need updated!', 'success');
        } else {
            const newNeed: ShelterNeed = { ...needData, id: `need${Date.now()}` };
            setNeeds(prev => [newNeed, ...prev]);
            showToast('New need added successfully!', 'success');
        }
        closeModal();
    };

    const handleDelete = () => {
        if (needsToDelete) {
            const idsToDelete = new Set(needsToDelete.map(n => n.id));
            setNeeds(prev => prev.filter(need => !idsToDelete.has(need.id)));
            showToast(`${idsToDelete.size} need(s) removed.`, 'info');
            setNeedsToDelete(null);
            setSelectedItems(new Set());
        }
    };
    
    const handleSelectionChange = (needId: string) => {
        const newSelection = new Set(selectedItems);
        if (newSelection.has(needId)) {
            newSelection.delete(needId);
        } else {
            newSelection.add(needId);
        }
        setSelectedItems(newSelection);
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedItems(new Set(sortedNeeds.map(n => n.id)));
        } else {
            setSelectedItems(new Set());
        }
    };


    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Beneficiary Management</h1>
                <button onClick={() => openModal()} className="flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors" title="Add a new need for a beneficiary">
                    <Icon icon="plus" className="w-5 h-5 mr-2" title="Add New Need" />
                    Add New Need
                </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                {selectedItems.size > 0 && (
                    <div className="flex items-center justify-between bg-blue-50 dark:bg-gray-900 p-3 rounded-md mb-4 border border-blue-200 dark:border-blue-900">
                        <span className="text-sm font-semibold text-blue-800 dark:text-blue-300">{selectedItems.size} need(s) selected</span>
                        <button 
                            onClick={() => setNeedsToDelete(needs.filter(n => selectedItems.has(n.id)))}
                            className="flex items-center text-sm font-bold text-red-500 hover:text-red-700"
                            title={`Delete ${selectedItems.size} selected items`}
                        >
                            <Icon icon="trash" className="w-4 h-4 mr-1.5" title="Delete selected needs" />
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
                                        checked={selectedItems.size > 0 && selectedItems.size === sortedNeeds.length}
                                        aria-label="Select all needs"
                                    />
                                </th>
                                <SortableHeader sortKey="shelterName" title="Beneficiary" sortConfig={sortConfig} requestSort={requestSort} />
                                <SortableHeader sortKey="itemName" title="Item Needed" sortConfig={sortConfig} requestSort={requestSort} />
                                <SortableHeader sortKey="quantityNeeded" title="Quantity" sortConfig={sortConfig} requestSort={requestSort} />
                                <SortableHeader sortKey="address" title="Address" sortConfig={sortConfig} requestSort={requestSort} />
                                <SortableHeader sortKey="priority" title="Priority" sortConfig={sortConfig} requestSort={requestSort} />
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedNeeds.map(need => (
                                <tr key={need.id} className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="w-4 p-4">
                                        <input 
                                            type="checkbox" 
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                            checked={selectedItems.has(need.id)}
                                            onChange={() => handleSelectionChange(need.id)}
                                            aria-label={`Select need from ${need.shelterName}`}
                                        />
                                    </td>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{need.shelterName}</th>
                                    <td className="px-6 py-4">{need.itemName}</td>
                                    <td className="px-6 py-4">{need.quantityNeeded} {need.unit}</td>
                                    <td className="px-6 py-4">{need.address}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${getPriorityClass(need.priority)}`}>
                                            {need.priority.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-1">
                                            <button onClick={() => openModal(need)} className="p-2 rounded-full text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-white dark:focus:ring-offset-gray-800"><Icon icon="pencil" className="w-4 h-4" title="Edit Need" /></button>
                                            <button onClick={() => setNeedsToDelete([need])} className="p-2 rounded-full text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-white dark:focus:ring-offset-gray-800"><Icon icon="trash" className="w-4 h-4" title="Delete Need" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && <BeneficiaryFormModal need={editingNeed} onSave={handleSave} onClose={closeModal} />}
            {needsToDelete && <ConfirmationModal isOpen={!!needsToDelete} onClose={() => setNeedsToDelete(null)} onConfirm={handleDelete} title="Delete Need(s)" message={`Are you sure you want to delete ${needsToDelete.length} need(s)? This action is permanent.`} />}
        </div>
    );
};

// Form Component for Add/Edit Need
const BeneficiaryFormModal: React.FC<{ need: ShelterNeed | null; onSave: (data: any) => void; onClose: () => void; }> = ({ need, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        shelterName: need?.shelterName || '',
        itemName: need?.itemName || '',
        quantityNeeded: need?.quantityNeeded || 0,
        unit: need?.unit || 'kg',
        priority: need?.priority || 'Medium',
        address: need?.address || '',
        capacity: need?.capacity || 1000,
        currentStock: need?.currentStock || 0,
        dietaryNeeds: need?.dietaryNeeds.join(', ') || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalData = {
            ...formData,
            quantityNeeded: Number(formData.quantityNeeded),
            capacity: Number(formData.capacity),
            currentStock: Number(formData.currentStock),
            dietaryNeeds: formData.dietaryNeeds.split(',').map(s => s.trim()).filter(Boolean),
        };
        onSave(finalData);
    };

    return (
        <Modal isOpen={true} onClose={onClose} title={need ? 'Edit Need' : 'Add New Need'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Beneficiary Name" name="shelterName" value={formData.shelterName} onChange={handleChange} required />
                    <InputField label="Item Needed" name="itemName" value={formData.itemName} onChange={handleChange} required />
                    <InputField label="Quantity Needed" name="quantityNeeded" type="number" value={String(formData.quantityNeeded)} onChange={handleChange} />
                    <InputField label="Unit" name="unit" value={formData.unit} onChange={handleChange} />
                    <SelectField label="Priority" name="priority" value={formData.priority} onChange={handleChange} options={['Low', 'Medium', 'High']} />
                    <InputField label="Address" name="address" value={formData.address} onChange={handleChange} />
                    <InputField label="Total Capacity" name="capacity" type="number" value={String(formData.capacity)} onChange={handleChange} />
                    <InputField label="Current Stock" name="currentStock" type="number" value={String(formData.currentStock)} onChange={handleChange} />
                </div>
                <InputField label="Dietary Needs (comma-separated)" name="dietaryNeeds" value={formData.dietaryNeeds} onChange={handleChange} />
                <div className="flex justify-end space-x-3 pt-4">
                    <button type="button" onClick={onClose} className="py-2 px-4 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold" title="Discard changes and close">Cancel</button>
                    <button type="submit" className="py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold" title={need ? 'Save changes to this need' : 'Add this new need'}>{need ? 'Save Changes' : 'Add Need'}</button>
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