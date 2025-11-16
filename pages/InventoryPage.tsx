import React, { useState, useMemo } from 'react';
import type { InventoryItem, Donor } from '../types';
import { Icon } from '../components/Icon';
import { Modal } from '../components/Modal';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { BarcodeScannerModal } from '../components/BarcodeScannerModal';

interface InventoryPageProps {
    inventory: InventoryItem[];
    setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
    donors: Donor[];
    showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

type SortKeys = keyof InventoryItem;
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

export const InventoryPage: React.FC<InventoryPageProps> = ({ inventory, setInventory, donors, showToast }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
    const [initialFormData, setInitialFormData] = useState<Partial<InventoryItem> | null>(null);
    const [deletingItem, setDeletingItem] = useState<InventoryItem | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: SortKeys; direction: SortDirection } | null>(null);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [itemToDelete, setItemToDelete] = useState<InventoryItem[] | null>(null);


    const sortedAndFilteredInventory = useMemo(() => {
        let sortableItems = [...inventory];
        
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

        return sortableItems
            .filter(item => 
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .filter(item => 
                categoryFilter === 'All' || item.category === categoryFilter
            );
    }, [inventory, searchTerm, categoryFilter, sortConfig]);

    const requestSort = (key: SortKeys) => {
        let direction: SortDirection = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };
    
    const openFormModal = (item: InventoryItem | null = null, initialData: Partial<InventoryItem> | null = null) => {
        setEditingItem(item);
        setInitialFormData(initialData);
        setIsFormModalOpen(true);
    };

    const closeFormModal = () => {
        setEditingItem(null);
        setInitialFormData(null);
        setIsFormModalOpen(false);
    };

    const handleScanSuccess = (scannedData: string) => {
        setIsScannerOpen(false);
        try {
            const parsedData = JSON.parse(scannedData);
            // Basic validation to see if it resembles an item
            if (parsedData.name && parsedData.donor) {
                showToast('Item data scanned successfully!', 'success');
                openFormModal(null, parsedData);
            } else {
                showToast('Scanned QR code has invalid data format.', 'error');
            }
        } catch (error) {
            showToast('Failed to parse QR code. Is it a valid JSON?', 'error');
            console.error("Failed to parse scanned data:", error);
        }
    };
    
    const handleSave = (itemData: Omit<InventoryItem, 'id' | 'isLowStock' | 'donationDate' | 'valuePerUnit'>) => {
        if (editingItem) { // Editing existing item
            setInventory(prev => prev.map(item => item.id === editingItem.id ? { ...item, ...itemData, isLowStock: itemData.quantity < 50 } : item));
            showToast('Item updated successfully!', 'success');
        } else { // Adding new item
            const newItem: InventoryItem = {
                ...itemData,
                id: `inv${Date.now()}`,
                isLowStock: itemData.quantity < 50, // Example low stock logic
                donationDate: new Date().toISOString(),
                valuePerUnit: 0, // Default value, can be improved later
            };
            setInventory(prev => [newItem, ...prev]);
            showToast('New item added!', 'success');
        }
        closeFormModal();
    };

    const handleDelete = () => {
        if (itemToDelete) {
            const idsToDelete = new Set(itemToDelete.map(i => i.id));
            setInventory(prev => prev.filter(item => !idsToDelete.has(item.id)));
            showToast(`${idsToDelete.size} item(s) deleted.`, 'info');
            setItemToDelete(null);
            setSelectedItems(new Set());
        }
    };
    
    const handleSelectionChange = (itemId: string) => {
        const newSelection = new Set(selectedItems);
        if (newSelection.has(itemId)) {
            newSelection.delete(itemId);
        } else {
            newSelection.add(itemId);
        }
        setSelectedItems(newSelection);
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedItems(new Set(sortedAndFilteredInventory.map(i => i.id)));
        } else {
            setSelectedItems(new Set());
        }
    };

    const categories = ['All', ...Array.from(new Set(inventory.map(i => i.category)))];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Inventory Management</h1>
                 <div className="flex space-x-3">
                    <button onClick={() => setIsScannerOpen(true)} className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors" title="Scan a new item using a QR code">
                        <Icon icon="camera" className="w-5 h-5 mr-2" title="Scan new item" />
                        Scan New Item
                    </button>
                    <button onClick={() => openFormModal()} className="flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors" title="Manually add a new item to the inventory">
                        <Icon icon="plus" className="w-5 h-5 mr-2" title="Add new item" />
                        Add New Item
                    </button>
                </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4 mb-4">
                    <div className="relative flex-grow">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <Icon icon="search" className="w-5 h-5 text-gray-500" title="Search Icon" />
                        </span>
                        <input
                        type="text"
                        placeholder="Search inventory..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full py-2 pl-10 pr-4 text-gray-800 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        title="Search inventory by item name"
                        />
                    </div>
                    <select 
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="py-2 px-4 text-gray-800 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        title="Filter inventory by category"
                    >
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                
                 {selectedItems.size > 0 && (
                    <div className="flex items-center justify-between bg-blue-50 dark:bg-gray-900 p-3 rounded-md mb-4 border border-blue-200 dark:border-blue-900">
                        <span className="text-sm font-semibold text-blue-800 dark:text-blue-300">{selectedItems.size} item(s) selected</span>
                        <button 
                            onClick={() => setItemToDelete(inventory.filter(i => selectedItems.has(i.id)))}
                            className="flex items-center text-sm font-bold text-red-500 hover:text-red-700"
                            title={`Delete ${selectedItems.size} selected items`}
                        >
                            <Icon icon="trash" className="w-4 h-4 mr-1.5" title="Delete selected items" />
                            Delete Selected
                        </button>
                    </div>
                )}
                
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600 dark:text-gray-400">
                        <thead className="text-xs text-gray-500 dark:text-gray-300 bg-gray-100 dark:bg-gray-900">
                            <tr>
                                <th scope="col" className="p-4">
                                    <input 
                                        type="checkbox" 
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        onChange={handleSelectAll}
                                        checked={selectedItems.size > 0 && selectedItems.size === sortedAndFilteredInventory.length}
                                        aria-label="Select all items"
                                    />
                                </th>
                                <SortableHeader sortKey="name" title="Item Name" sortConfig={sortConfig} requestSort={requestSort} />
                                <SortableHeader sortKey="category" title="Category" sortConfig={sortConfig} requestSort={requestSort} />
                                <SortableHeader sortKey="quantity" title="Quantity" sortConfig={sortConfig} requestSort={requestSort} />
                                <SortableHeader sortKey="donor" title="Donor" sortConfig={sortConfig} requestSort={requestSort} />
                                <SortableHeader sortKey="expiryDate" title="Expiry Date" sortConfig={sortConfig} requestSort={requestSort} />
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedAndFilteredInventory.map(item => (
                                <tr key={item.id} className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="w-4 p-4">
                                        <input 
                                            type="checkbox" 
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                            checked={selectedItems.has(item.id)}
                                            onChange={() => handleSelectionChange(item.id)}
                                            aria-label={`Select item ${item.name}`}
                                        />
                                    </td>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{item.name}</th>
                                    <td className="px-6 py-4">{item.category}</td>
                                    <td className="px-6 py-4">{item.quantity} {item.unit}</td>
                                    <td className="px-6 py-4">{item.donor}</td>
                                    <td className="px-6 py-4">{new Date(item.expiryDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        {item.isLowStock && <span className="text-xs text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/50 px-2 py-1 rounded-full">LOW STOCK</span>}
                                        {!item.isLowStock && <span className="text-xs text-green-500 dark:text-green-400 bg-green-100 dark:bg-green-900/50 px-2 py-1 rounded-full">IN STOCK</span>}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-1">
                                            <button onClick={() => openFormModal(item)} className="p-2 rounded-full text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-white dark:focus:ring-offset-gray-800"><Icon icon="pencil" className="w-4 h-4" title="Edit Item" /></button>
                                            <button onClick={() => setItemToDelete([item])} className="p-2 rounded-full text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-white dark:focus:ring-offset-gray-800"><Icon icon="trash" className="w-4 h-4" title="Delete Item" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isFormModalOpen && <InventoryFormModal item={editingItem} initialData={initialFormData} donors={donors} onSave={handleSave} onClose={closeFormModal} />}
            {isScannerOpen && <BarcodeScannerModal onScanSuccess={handleScanSuccess} onClose={() => setIsScannerOpen(false)} />}
            {itemToDelete && <ConfirmationModal isOpen={!!itemToDelete} onClose={() => setItemToDelete(null)} onConfirm={handleDelete} title="Delete Inventory Item(s)" message={`Are you sure you want to delete ${itemToDelete.length} item(s)? This action cannot be undone.`} />}
        </div>
    );
};

// Form Component for Add/Edit
const InventoryFormModal: React.FC<{ item: InventoryItem | null; initialData: Partial<InventoryItem> | null; donors: Donor[]; onSave: (data: any) => void; onClose: () => void }> = ({ item, initialData, donors, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        name: item?.name || initialData?.name || '',
        category: item?.category || initialData?.category || 'Produce',
        quantity: item?.quantity || initialData?.quantity || 0,
        unit: item?.unit || initialData?.unit || 'kg',
        donor: item?.donor || initialData?.donor || donors[0]?.name || '',
        expiryDate: (item?.expiryDate || initialData?.expiryDate) ? new Date(item?.expiryDate || initialData?.expiryDate!).toISOString().split('T')[0] : '',
        dietaryRestrictions: (item?.dietaryRestrictions || initialData?.dietaryRestrictions)?.join(', ') || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalData = {
            ...formData,
            quantity: Number(formData.quantity),
            dietaryRestrictions: formData.dietaryRestrictions.split(',').map(s => s.trim()).filter(Boolean),
            expiryDate: new Date(formData.expiryDate).toISOString(),
        };
        onSave(finalData);
    };

    return (
        <Modal isOpen={true} onClose={onClose} title={item ? 'Edit Item' : 'Add New Item'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Item Name" name="name" value={formData.name} onChange={handleChange} required />
                    <SelectField label="Category" name="category" value={formData.category} onChange={handleChange} options={['Produce', 'Canned Goods', 'Bakery', 'Dairy']} />
                    <InputField label="Quantity" name="quantity" type="number" value={String(formData.quantity)} onChange={handleChange} required />
                    <InputField label="Unit (e.g., kg, cans)" name="unit" value={formData.unit} onChange={handleChange} required />
                    <SelectField label="Donor" name="donor" value={formData.donor} onChange={handleChange} options={donors.map(d => d.name)} />
                    <InputField label="Expiry Date" name="expiryDate" type="date" value={formData.expiryDate} onChange={handleChange} required />
                </div>
                <InputField label="Dietary Restrictions (comma-separated)" name="dietaryRestrictions" value={formData.dietaryRestrictions} onChange={handleChange} />
                <div className="flex justify-end space-x-3 pt-4">
                    <button type="button" onClick={onClose} className="py-2 px-4 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold" title="Discard changes and close">Cancel</button>
                    <button type="submit" className="py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold" title={item ? 'Save changes to this item' : 'Add this new item to inventory'}>{item ? 'Save Changes' : 'Add Item'}</button>
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