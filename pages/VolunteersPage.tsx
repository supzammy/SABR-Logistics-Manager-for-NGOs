import React, { useState, useMemo } from 'react';
import type { Volunteer } from '../types';
import { Icon } from '../components/Icon';
import { Modal } from '../components/Modal';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { EmptyState } from '../components/EmptyState';

interface VolunteersPageProps {
    volunteers: Volunteer[];
    setVolunteers: React.Dispatch<React.SetStateAction<Volunteer[]>>;
    showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

type SortKeys = keyof Volunteer;
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

const TaskDisplay: React.FC<{ task: Volunteer['task'] }> = ({ task }) => {
    const taskConfig: Record<Volunteer['task'], { icon: React.ComponentProps<typeof Icon>['icon']; color: string; bgColor: string; }> = {
        'Warehouse Sorting': { icon: 'package', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/50' },
        'Donation Pickup': { icon: 'truck', color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-100 dark:bg-orange-900/50' },
        'Delivery Driver': { icon: 'truck', color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/50' },
        'On Call': { icon: 'message-square', color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-100 dark:bg-purple-900/50' },
    };

    const config = taskConfig[task];

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
            <Icon icon={config.icon} className="w-4 h-4 mr-1.5" title={task} />
            {task}
        </span>
    );
};

export const VolunteersPage: React.FC<VolunteersPageProps> = ({ volunteers, setVolunteers, showToast }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVolunteer, setEditingVolunteer] = useState<Volunteer | null>(null);
    const [volunteersToDelete, setVolunteersToDelete] = useState<Volunteer[] | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: SortKeys; direction: SortDirection } | null>(null);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

    const sortedVolunteers = useMemo(() => {
        let sortableItems = [...volunteers];
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
    }, [volunteers, sortConfig]);

    const requestSort = (key: SortKeys) => {
        let direction: SortDirection = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const openModal = (volunteer: Volunteer | null = null) => {
        setEditingVolunteer(volunteer);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setEditingVolunteer(null);
        setIsModalOpen(false);
    };

    const handleSave = (volunteerData: Omit<Volunteer, 'id'>) => {
        if (editingVolunteer) {
            setVolunteers(prev => prev.map(v => v.id === editingVolunteer.id ? { ...v, ...volunteerData } : v));
            showToast('Volunteer updated successfully!', 'success');
        } else {
            const newVolunteer: Volunteer = { ...volunteerData, id: `vol${Date.now()}` };
            setVolunteers(prev => [newVolunteer, ...prev]);
            showToast('New volunteer added!', 'success');
        }
        closeModal();
    };

    const handleDelete = () => {
        if (volunteersToDelete) {
            const idsToDelete = new Set(volunteersToDelete.map(v => v.id));
            setVolunteers(prev => prev.filter(v => !idsToDelete.has(v.id)));
            showToast(`${idsToDelete.size} volunteer(s) removed.`, 'info');
            setVolunteersToDelete(null);
            setSelectedItems(new Set());
        }
    };
    
    const handleSelectionChange = (volunteerId: string) => {
        const newSelection = new Set(selectedItems);
        if (newSelection.has(volunteerId)) {
            newSelection.delete(volunteerId);
        } else {
            newSelection.add(volunteerId);
        }
        setSelectedItems(newSelection);
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedItems(new Set(sortedVolunteers.map(v => v.id)));
        } else {
            setSelectedItems(new Set());
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Volunteer Management</h1>
                <button onClick={() => openModal()} className="flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors" title="Add a new volunteer to the roster">
                    <Icon icon="plus" className="w-5 h-5 mr-2" title="Add New Volunteer" />
                    Add New Volunteer
                </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                {selectedItems.size > 0 && (
                    <div className="flex items-center justify-between bg-blue-50 dark:bg-gray-900 p-3 rounded-md mb-4 border border-blue-200 dark:border-blue-900">
                        <span className="text-sm font-semibold text-blue-800 dark:text-blue-300">{selectedItems.size} volunteer(s) selected</span>
                        <button 
                            onClick={() => setVolunteersToDelete(volunteers.filter(v => selectedItems.has(v.id)))}
                            className="flex items-center text-sm font-bold text-red-500 hover:text-red-700"
                            title={`Delete ${selectedItems.size} selected items`}
                        >
                            <Icon icon="trash" className="w-4 h-4 mr-1.5" title="Delete selected volunteers" />
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
                                        checked={selectedItems.size > 0 && selectedItems.size === sortedVolunteers.length}
                                        aria-label="Select all volunteers"
                                    />
                                </th>
                                <SortableHeader sortKey="name" title="Name" sortConfig={sortConfig} requestSort={requestSort} />
                                <SortableHeader sortKey="email" title="Email" sortConfig={sortConfig} requestSort={requestSort} />
                                <SortableHeader sortKey="phone" title="Phone" sortConfig={sortConfig} requestSort={requestSort} />
                                <SortableHeader sortKey="task" title="Assigned Task" sortConfig={sortConfig} requestSort={requestSort} />
                                <SortableHeader sortKey="status" title="Status" sortConfig={sortConfig} requestSort={requestSort} />
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedVolunteers.length > 0 ? (
                                sortedVolunteers.map(v => (
                                    <tr key={v.id} className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                         <td className="w-4 p-4">
                                            <input 
                                                type="checkbox" 
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                checked={selectedItems.has(v.id)}
                                                onChange={() => handleSelectionChange(v.id)}
                                                aria-label={`Select volunteer ${v.name}`}
                                            />
                                        </td>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{v.name}</th>
                                        <td className="px-6 py-4">{v.email}</td>
                                        <td className="px-6 py-4">{v.phone}</td>
                                        <td className="px-6 py-4">
                                            <TaskDisplay task={v.task} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${v.status === 'Active' ? 'text-green-500 dark:text-green-400 bg-green-100 dark:bg-green-900/50' : 'text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-700'}`}>
                                                {v.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-1">
                                                <button onClick={() => openModal(v)} className="p-2 rounded-full text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-white dark:focus:ring-offset-gray-800"><Icon icon="pencil" className="w-4 h-4" title="Edit Volunteer" /></button>
                                                <button onClick={() => setVolunteersToDelete([v])} className="p-2 rounded-full text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-white dark:focus:ring-offset-gray-800"><Icon icon="trash" className="w-4 h-4" title="Delete Volunteer" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7}>
                                        <EmptyState
                                            icon="volunteers"
                                            title="No Volunteers Found"
                                            message="Add volunteers to your roster to start managing tasks and schedules for pickups and deliveries."
                                            actionText="Add New Volunteer"
                                            onAction={() => openModal()}
                                        />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && <VolunteerFormModal volunteer={editingVolunteer} onSave={handleSave} onClose={closeModal} />}
            {volunteersToDelete && <ConfirmationModal isOpen={!!volunteersToDelete} onClose={() => setVolunteersToDelete(null)} onConfirm={handleDelete} title="Delete Volunteer(s)" message={`Are you sure you want to remove ${volunteersToDelete.length} volunteer(s) from the list?`} />}
        </div>
    );
};

const VolunteerFormModal: React.FC<{ volunteer: Volunteer | null; onSave: (data: any) => void; onClose: () => void; }> = ({ volunteer, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        name: volunteer?.name || '',
        email: volunteer?.email || '',
        phone: volunteer?.phone || '',
        task: volunteer?.task || 'On Call',
        status: volunteer?.status || 'Active',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Modal isOpen={true} onClose={onClose} title={volunteer ? 'Edit Volunteer' : 'Add New Volunteer'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
                    <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} required />
                    <InputField label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
                    <SelectField label="Assigned Task" name="task" value={formData.task} onChange={handleChange} options={['Warehouse Sorting', 'Donation Pickup', 'Delivery Driver', 'On Call']} />
                </div>
                <SelectField label="Status" name="status" value={formData.status} onChange={handleChange} options={['Active', 'Inactive']} />
                <div className="flex justify-end space-x-3 pt-4">
                    <button type="button" onClick={onClose} className="py-2 px-4 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold" title="Discard changes and close">Cancel</button>
                    <button type="submit" className="py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold" title={volunteer ? 'Save changes to this volunteer' : 'Add this new volunteer'}>{volunteer ? 'Save Changes' : 'Add Volunteer'}</button>
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