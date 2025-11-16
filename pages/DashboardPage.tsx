import React, { useState } from 'react';
import { Icon } from '../components/Icon';
import { DashboardCard } from '../components/DashboardCard';
import { PredictiveChart } from '../components/PredictiveChart';
import { Modal } from '../components/Modal';
import { AiRecommendations } from '../components/AiRecommendations';
import { MatchingPreviewModal } from '../components/MatchingPreviewModal';
import { DonationSuggestionModal } from '../components/DonationSuggestionModal';
import type { InventoryItem, ShelterNeed, Activity, UsageDataPoint, DonationSubmission, AiMatch } from '../types';

interface DashboardPageProps {
    inventory: InventoryItem[];
    needs: ShelterNeed[];
    activities: Activity[];
    usageData: UsageDataPoint[];
    donationSubmissions: DonationSubmission[];
    onConfirmMatch: (donorItemId: string, shelterNeedId: string, quantityToMatch: number) => void;
    onMatchSubmission: (submission: DonationSubmission, needId: string, ngoName: string) => void;
    showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const ManualMatchModal: React.FC<{
    item: InventoryItem;
    needs: ShelterNeed[];
    onConfirm: (itemId: string, needId: string, quantity: number) => void;
    onClose: () => void;
}> = ({ item, needs, onConfirm, onClose }) => {
    const [selectedNeedId, setSelectedNeedId] = useState<string>('');
    const [quantity, setQuantity] = useState<number>(item.quantity);

    const compatibleNeeds = React.useMemo(() => {
        return needs.filter(n => {
            // Basic item name compatibility
            const isItemCompatible = n.itemName === item.name || n.itemName === 'Anything';
            if (!isItemCompatible) return false;

            // Dietary restriction compatibility
            // The item must have all the dietary restrictions that the need requires.
            const hasAllDietaryNeeds = n.dietaryNeeds.every(needRestriction =>
                item.dietaryRestrictions.includes(needRestriction)
            );

            return hasAllDietaryNeeds;
        });
    }, [item, needs]);

    // Set initial selected need if compatible needs exist
    React.useEffect(() => {
        if (compatibleNeeds.length > 0) {
            setSelectedNeedId(compatibleNeeds[0].id);
        }
    }, [compatibleNeeds]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedNeedId && quantity > 0) {
            onConfirm(item.id, selectedNeedId, quantity);
            onClose();
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose} title={`Create Match for ${item.name}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">Select a beneficiary and confirm the quantity to send from <span className="font-semibold text-gray-800 dark:text-white">{item.donor}</span>'s donation.</p>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Beneficiary Need</label>
                    <select
                        value={selectedNeedId}
                        onChange={(e) => setSelectedNeedId(e.target.value)}
                        className="w-full py-2 px-3 text-gray-800 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        title="Select a compatible beneficiary"
                    >
                        {compatibleNeeds.length > 0 ? compatibleNeeds.map(need => (
                            <option key={need.id} value={need.id}>
                                {need.shelterName} (Needs: {need.quantityNeeded} {need.unit} {need.itemName})
                            </option>
                        )) : <option disabled>No compatible needs found</option>}
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Quantity to Match ({item.unit})</label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        max={item.quantity}
                        min="1"
                        className="w-full py-2 px-3 text-gray-800 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        title={`Enter quantity to match (up to ${item.quantity})`}
                    />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                    <button type="button" onClick={onClose} className="py-2 px-4 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold" title="Cancel match creation">Cancel</button>
                    <button type="submit" disabled={!selectedNeedId || compatibleNeeds.length === 0} className="py-2 px-4 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold disabled:opacity-50" title="Confirm this match">Confirm Match</button>
                </div>
            </form>
        </Modal>
    );
};

const DonationMatchModal: React.FC<{
    submission: DonationSubmission;
    needs: ShelterNeed[];
    onMatch: (submission: DonationSubmission, needId: string, ngoName: string) => void;
    onClose: () => void;
}> = ({ submission, needs, onMatch, onClose }) => {
    const [selectedNeedId, setSelectedNeedId] = useState<string>(needs[0]?.id || '');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const selectedNeed = needs.find(n => n.id === selectedNeedId);
        if (selectedNeed) {
            onMatch(submission, selectedNeed.id, selectedNeed.shelterName);
            onClose();
        }
    };
    
    return (
        <Modal isOpen={true} onClose={onClose} title="Match New Donation">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded-md">
                    <p className="font-semibold text-gray-800 dark:text-white">Donation Details:</p>
                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                        {submission.items.map(item => (
                            <li key={item.name}>{item.quantity} {item.unit} of {item.name}</li>
                        ))}
                    </ul>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Select Beneficiary</label>
                    <select
                        value={selectedNeedId}
                        onChange={(e) => setSelectedNeedId(e.target.value)}
                        className="w-full py-2 px-3 text-gray-800 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        title="Select a beneficiary to receive this donation"
                    >
                         {needs.map(need => (
                            <option key={need.id} value={need.id}>
                                {need.shelterName} - {need.address}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                    <button type="button" onClick={onClose} className="py-2 px-4 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold" title="Cancel matching">Cancel</button>
                    <button type="submit" className="py-2 px-4 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold" title="Confirm match and add items to inventory">Match and Add to Inventory</button>
                </div>
            </form>
        </Modal>
    );
};


export const DashboardPage: React.FC<DashboardPageProps> = ({
    inventory,
    needs,
    activities,
    usageData,
    donationSubmissions,
    onConfirmMatch,
    onMatchSubmission,
    showToast,
}) => {
    const [matchingItem, setMatchingItem] = useState<InventoryItem | null>(null);
    const [matchingSubmission, setMatchingSubmission] = useState<DonationSubmission | null>(null);
    const [matchToPreview, setMatchToPreview] = useState<AiMatch | null>(null);
    const [isDonationSuggestionModalOpen, setIsDonationSuggestionModalOpen] = useState(false);
    
    const totalBeneficiaries = new Set(needs.map(n => n.shelterName)).size;
    const confirmedMatchesCount = activities.filter(a => a.type === 'match').length;
    const pendingSubmissions = donationSubmissions.filter(s => s.status === 'Pending Review');

    const totalInventoryUnits = inventory.reduce((sum, item) => sum + item.quantity, 0);
    const WAREHOUSE_CAPACITY = 5000; // Mock capacity in units

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <DashboardCard 
                    glowColor="5, 150, 105"
                    title="Suggest Donations"
                    value="AI Ideas"
                    description="Get smart donation suggestions"
                    onClick={() => setIsDonationSuggestionModalOpen(true)}
                />
                <DashboardCard 
                    glowColor="234, 179, 8"
                    title="Warehouse Capacity" 
                    value={`${((totalInventoryUnits / WAREHOUSE_CAPACITY) * 100).toFixed(0)}%`} 
                    description="Total units in stock"
                    progress={{ current: totalInventoryUnits, total: WAREHOUSE_CAPACITY }}
                />
                <DashboardCard glowColor="168, 85, 247" title="Beneficiaries" value={String(totalBeneficiaries)} description="Shelters & Kitchens" />
                <DashboardCard glowColor="34, 197, 94" title="Matches This Month" value={String(confirmedMatchesCount)} description="Distributions confirmed" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                     {pendingSubmissions.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 glow-on-hover hover:scale-[1.02]" style={{ '--glow-color': '249, 115, 22' } as React.CSSProperties}>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pending Donations for Matching</h3>
                            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                                {pendingSubmissions.map(sub => (
                                    <div key={sub.id} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-gray-800 dark:text-white">{sub.items.map(i => `${i.quantity} ${i.unit} ${i.name}`).join(', ')}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">From donor ID: {sub.donorId}</p>
                                        </div>
                                        <button onClick={() => setMatchingSubmission(sub)} className="bg-blue-500/20 text-blue-500 hover:bg-blue-500 hover:text-white font-bold py-2 px-4 rounded-lg transition-colors" title="Review and match this new donation">
                                            Match Donation
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <AiRecommendations inventory={inventory} needs={needs} onReviewMatch={setMatchToPreview} showToast={showToast} glowColor="96, 165, 250" />
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 glow-on-hover hover:scale-[1.02]" style={{ '--glow-color': '34, 197, 94' } as React.CSSProperties}>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Priority Inventory</h3>
                        {inventory.slice(0, 5).map(item => (
                            <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-md mb-2">
                                <div className="flex items-center">
                                    <div className={`w-12 h-12 rounded-md mr-4 flex items-center justify-center ${item.isLowStock ? 'bg-red-100 dark:bg-red-900/50' : 'bg-green-100 dark:bg-green-900/50'}`}>
                                      {
                                        {
                                          'Produce': '🍎',
                                          'Canned Goods': '🥫',
                                          'Bakery': '🍞',
                                          'Dairy': '🥛'
                                        }[item.category]
                                      }
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800 dark:text-white">{item.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Donor: {item.donor}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-mono text-gray-800 dark:text-white">{item.quantity} <span className="text-sm text-gray-500 dark:text-gray-400">{item.unit}</span></p>
                                    <p className="text-xs text-gray-500">Expiry: {new Date(item.expiryDate).toLocaleDateString()}</p>
                                </div>
                                {item.isLowStock && <span className="text-xs text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/50 px-2 py-1 rounded-full">LOW STOCK</span>}
                                <button onClick={() => setMatchingItem(item)} className="ml-6 bg-blue-500/20 text-blue-500 hover:bg-blue-500 hover:text-white font-bold py-2 px-4 rounded-lg transition-colors" title="Manually match this inventory item to a need">Create Match</button>
                            </div>
                        ))}
                    </div>
                     <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 glow-on-hover hover:scale-[1.02]" style={{ '--glow-color': '239, 68, 68' } as React.CSSProperties}>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">High Priority Needs</h3>
                         {needs.filter(n => n.priority === 'High').map(need => (
                            <div key={need.id} className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3">🏠</div>
                                    <div>
                                        <p className="font-semibold text-gray-800 dark:text-white">{need.shelterName} needs {need.itemName}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{need.quantityNeeded} {need.unit}</p>
                                    </div>
                                </div>
                                <div className="flex items-center text-red-500 dark:text-red-400 text-sm font-bold">
                                    <Icon icon="urgent" className="w-4 h-4 mr-1" title="Urgent" />
                                    <span>Urgent</span>
                                </div>
                            </div>
                         ))}
                    </div>
                </div>

                <div className="space-y-6">
                     <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 glow-on-hover hover:scale-[1.02]" style={{ '--glow-color': '147, 112, 219' } as React.CSSProperties}>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Predictive Usage Forecast</h3>
                        <PredictiveChart data={usageData} />
                     </div>
                     <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 glow-on-hover hover:scale-[1.02]" style={{ '--glow-color': '156, 163, 175' } as React.CSSProperties}>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity Feed</h3>
                        <div className="space-y-3">
                            {activities.map(act => (
                                <div key={act.id} className="flex items-start">
                                    <div className={`w-1.5 h-1.5 mt-1.5 rounded-full mr-3 ${act.type === 'match' ? 'bg-green-500' : act.type === 'alert' ? 'bg-yellow-400' : 'bg-gray-500'}`}></div>
                                    <div>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">{act.description}</p>
                                        <p className="text-xs text-gray-500">{act.timestamp}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                     </div>
                </div>
            </div>
            {matchingItem && (
                <ManualMatchModal
                    item={matchingItem}
                    needs={needs}
                    onConfirm={onConfirmMatch}
                    onClose={() => setMatchingItem(null)}
                />
            )}
             {matchingSubmission && (
                <DonationMatchModal
                    submission={matchingSubmission}
                    needs={needs}
                    onMatch={onMatchSubmission}
                    onClose={() => setMatchingSubmission(null)}
                />
            )}
            {matchToPreview && (
                <MatchingPreviewModal
                    isOpen={!!matchToPreview}
                    onClose={() => setMatchToPreview(null)}
                    match={matchToPreview}
                    inventory={inventory}
                    needs={needs}
                    onConfirmMatch={onConfirmMatch}
                />
            )}
            <DonationSuggestionModal
                isOpen={isDonationSuggestionModalOpen}
                onClose={() => setIsDonationSuggestionModalOpen(false)}
                needs={needs}
            />
        </div>
    );
};