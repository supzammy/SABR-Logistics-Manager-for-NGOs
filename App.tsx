import React, { useState, useCallback, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Toast, ToastProps } from './components/Toast';
import { DashboardPage } from './pages/DashboardPage';
import { InventoryPage } from './pages/InventoryPage';
import { DonorsPage } from './pages/DonorsPage';
import { BeneficiariesPage } from './pages/BeneficiariesPage';
import { ReportsPage } from './pages/ReportsPage';
import { MatchesPage } from './pages/MatchesPage';
import { SettingsPage } from './pages/SettingsPage';
import { VolunteersPage } from './pages/VolunteersPage';
import { DonorPortalPage } from './pages/DonorPortalPage';
import { AboutPage } from './pages/AboutPage';
import type { InventoryItem, ShelterNeed, Activity, UsageDataPoint, Volunteer, Donor, DonationSubmission, Message, ManagerProfile } from './types';

type Page = 'Dashboard' | 'Inventory' | 'Donors' | 'Beneficiaries' | 'Reports' | 'Matches' | 'Volunteers' | 'Settings' | 'About';
type UserRole = 'manager' | 'donor';

// Mock Data moved to App level to be shared across pages
const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'inv001', name: 'Apples', category: 'Produce', quantity: 100, unit: 'kg', donor: 'Reliance Fresh', expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), donationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), valuePerUnit: 2.5, isLowStock: true, dietaryRestrictions: ['gluten-free'] },
  { id: 'inv002', name: 'Canned Beans', category: 'Canned Goods', quantity: 500, unit: 'cans', donor: 'BigBasket', expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), donationDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), valuePerUnit: 1.2, isLowStock: false, dietaryRestrictions: ['gluten-free'] },
  { id: 'inv003', name: 'Bread', category: 'Bakery', quantity: 50, unit: 'loaves', donor: 'Iyengar Bakery', expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), donationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), valuePerUnit: 3.0, isLowStock: false, dietaryRestrictions: [] },
  { id: 'inv004', name: 'Milk', category: 'Dairy', quantity: 80, unit: 'liters', donor: 'BigBasket', expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), donationDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), valuePerUnit: 1.5, isLowStock: false, dietaryRestrictions: [] },
  { id: 'inv005', name: 'Oranges', category: 'Produce', quantity: 150, unit: 'kg', donor: 'Reliance Fresh', expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), donationDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), valuePerUnit: 2.0, isLowStock: false, dietaryRestrictions: [] },
];

const MOCK_NEEDS: ShelterNeed[] = [
  { id: 'need01', shelterName: 'Anbu Illam', itemName: 'Apples', quantityNeeded: 50, unit: 'kg', priority: 'Medium', address: '123 Gandhi St, Chennai', capacity: 1000, currentStock: 800, dietaryNeeds: [] },
  { id: 'need02', shelterName: 'Aashirwad Shelter', itemName: 'Apples', quantityNeeded: 75, unit: 'kg', priority: 'High', address: '456 Nehru Rd, Mumbai', capacity: 500, currentStock: 450, dietaryNeeds: [] },
  { id: 'need03', shelterName: 'Akshaya Patra Kitchen', itemName: 'Anything', quantityNeeded: 200, unit: 'kg', priority: 'High', address: '789 Bangalore Hwy', capacity: 2000, currentStock: 1500, dietaryNeeds: ['gluten-free'] },
];

const MOCK_ACTIVITY: Activity[] = [
    { id: 'act01', timestamp: '10:02:38', description: 'Zaeem confirmed match for Anbu Illam (+50kg Apples)', type: 'match' },
    { id: 'act02', timestamp: '11:03:01', description: 'New donation received from Reliance Fresh (+110 Apples)', type: 'donation' },
    { id: 'act03', timestamp: '13:50:24', description: 'System triggered low stock alert for Bread', type: 'alert' },
    { id: 'act04', timestamp: '14:20:00', description: 'BigBasket pledged 200 cans of Canned Beans for Akshaya Patra Kitchen.', type: 'pledge' },
];

const MOCK_USAGE_DATA: UsageDataPoint[] = [
    { date: 'Day 1', usage: 150 }, { date: 'Day 2', usage: 200 }, { date: 'Day 3', usage: 180 },
    { date: 'Day 4', usage: 220 }, { date: 'Day 5', usage: 250 }, { date: 'Day 6', usage: 230 },
    { date: 'Day 7', usage: 270 },
];

const MOCK_VOLUNTEERS: Volunteer[] = [
    { id: 'vol001', name: 'Rohan Patel', email: 'rohan.p@example.com', phone: '98765-12345', task: 'Delivery Driver', status: 'Active' },
    { id: 'vol002', name: 'Aisha Begum', email: 'aisha.b@example.com', phone: '98765-54321', task: 'Warehouse Sorting', status: 'Active' },
    { id: 'vol003', name: 'David D\'Souza', email: 'david.d@example.com', phone: '98765-87654', task: 'Donation Pickup', status: 'Inactive' },
    { id: 'vol004', name: 'Maria Fernandes', email: 'maria.f@example.com', phone: '98765-11223', task: 'On Call', status: 'Active' },
];

const MOCK_DONORS: Donor[] = [
    { id: 'don001', name: 'Reliance Fresh', contactPerson: 'Priya Sharma', email: 'priya.s@reliance.com', phone: '99887-76655', address: { street: '100 Market St', city: 'Mumbai', zip: '400001' }, businessType: 'Supermarket', status: 'Active', donationPreferences: { transportation: 'Self-deliver', donationTypes: ['Food'] }, taxInfo: { ein: '12-3456789' } },
    { id: 'don002', name: 'BigBasket', contactPerson: 'Sameer Khan', email: 'contact@bigbasket.com', phone: '99887-76654', address: { street: '200 Corner Ave', city: 'Bangalore', zip: '560001' }, businessType: 'Restaurant', status: 'Active', donationPreferences: { transportation: 'Pickup required', donationTypes: ['Food', 'Other'] }, taxInfo: { ein: '98-7654321' } },
    { id: 'don003', name: 'Iyengar Bakery', contactPerson: 'Anand Kumar', email: 'contact@iyengar.com', phone: '99887-76653', address: { street: '300 Sweet St', city: 'Chennai', zip: '600001' }, businessType: 'Farm', status: 'Pending Verification', donationPreferences: { transportation: 'Pickup required', donationTypes: ['Food'] }, taxInfo: { ein: '54-3219876' } },
    { id: 'don004', name: 'Chennai Farmers Co-op', contactPerson: 'Fatima Ali', email: 'contact@cfc.com', phone: '99887-76652', address: { street: '400 Farm Rd', city: 'Chennai', zip: '600028' }, businessType: 'Farm', status: 'Active', donationPreferences: { transportation: 'Self-deliver', donationTypes: ['Food'] }, taxInfo: { ein: '32-1987654' } }
];

const MOCK_SUBMISSIONS: DonationSubmission[] = [
    { id: 'sub001', donorId: 'don001', items: [{ name: 'Tomatoes', category: 'Food', quantity: 50, unit: 'kg', storageNotes: 'Keep refrigerated.' }], pickupWindow: { start: new Date().toISOString(), end: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() }, status: 'Delivered', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), matchedNgoId: 'need01', matchDetails: { ngo_id: 'need01', name: 'Anbu Illam' }, donorBenefits: { tax_deduction_value: 125, impact_certificate_ready: true, social_media_shareables: ["I just donated 50kg of fresh tomatoes to Anbu Illam via SABR, helping provide nutritious meals to families in need! #CommunityHeroes #SABR"] } },
    { id: 'sub002', donorId: 'don002', items: [{ name: 'Pasta', category: 'Food', quantity: 100, unit: 'boxes', storageNotes: '' }], pickupWindow: { start: new Date().toISOString(), end: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString() }, status: 'Collected', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), matchedNgoId: 'need03', matchDetails: { ngo_id: 'need03', name: 'Akshaya Patra Kitchen' } },
    { id: 'sub003', donorId: 'don001', items: [{ name: 'Fresh Oranges', category: 'Food', quantity: 200, unit: 'kg', storageNotes: '' }], pickupWindow: { start: new Date().toISOString(), end: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString() }, status: 'Pending Review', createdAt: new Date().toISOString() }
];

const MOCK_MESSAGES: Message[] = [
    { id: 'msg001', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), from: 'Zaeem, Manager', fromAvatar: 'Z', content: 'Welcome to your new Donor Command Center! We\'re excited to partner with you to make a difference.', read: false },
    { id: 'msg002', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), from: 'SABR System', fromAvatar: 'S', content: 'Your recent donation of Tomatoes has been successfully delivered to Anbu Illam. Thank you!', read: true },
    { id: 'msg003', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), from: 'Anbu Illam', fromAvatar: 'A', content: 'The fresh tomatoes were a huge hit! Our kitchen team was so grateful. Thank you, Reliance Fresh!', read: true },
];

const INITIAL_MANAGER_PROFILE: ManagerProfile = {
    name: 'Zaeem Ahmad',
    email: 'zaeem.ahmad@sabr.org',
    notifications: {
        lowStock: true,
        newMatches: true,
        weeklySummary: false,
    },
};

// Inject animation styles once
const pageAnimationKeyframes = `
@keyframes page-fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-page-fade-in { animation: page-fade-in 0.4s ease forwards; }

@keyframes row-fade-out {
    from { opacity: 1; transform: scaleY(1); }
    to { opacity: 0; transform: scaleY(0.8); }
}
.deleting {
    animation: row-fade-out 0.3s ease-out forwards;
    transform-origin: top;
}

/* New animations for smoothness */
@keyframes subtle-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
}
.animate-subtle-pulse {
  animation: subtle-pulse 2.5s ease-in-out infinite;
}

@keyframes list-item-fade-in {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-list-item-fade-in {
  opacity: 0; /* Start hidden */
  animation: list-item-fade-in 0.5s ease-out forwards;
}

@keyframes table-row-fade-in {
  from { opacity: 0; transform: translateX(-15px); }
  to { opacity: 1; transform: translateX(0); }
}
.animate-table-row-fade-in {
  opacity: 0; /* Start hidden */
  animation: table-row-fade-in 0.5s ease-out forwards;
}

@keyframes progress-bar-fill {
  from { width: 0%; }
  to { width: var(--progress-width, 0%); }
}
.animate-progress-bar-fill {
  animation: progress-bar-fill 1.5s ease-out forwards;
}

@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

.glow-on-hover:hover {
  box-shadow: 0 0 15px 0px rgba(var(--glow-color), 0.5);
}

`;
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = pageAnimationKeyframes;
document.head.appendChild(styleSheet);


export const App: React.FC = () => {
    const [activePage, setActivePage] = useState<Page>('Dashboard');
    const [currentUser, setCurrentUser] = useState<UserRole>('manager');
    
    const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
    const [needs, setNeeds] = useState<ShelterNeed[]>(MOCK_NEEDS);
    const [activities, setActivities] = useState<Activity[]>(MOCK_ACTIVITY);
    const [volunteers, setVolunteers] = useState<Volunteer[]>(MOCK_VOLUNTEERS);
    const [donors, setDonors] = useState<Donor[]>(MOCK_DONORS);
    const [donationSubmissions, setDonationSubmissions] = useState<DonationSubmission[]>(MOCK_SUBMISSIONS);
    const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
    const [selectedDonor, setSelectedDonor] = useState<string>('__REGISTER__');
    const [managerProfile, setManagerProfile] = useState<ManagerProfile>(INITIAL_MANAGER_PROFILE);
    
    const [toast, setToast] = useState<ToastProps | null>(null);

    const showToast = useCallback((message: string, type: ToastProps['type']) => {
        setToast({ message, type, onClose: () => setToast(null) });
    }, []);

    const onConfirmMatch = (donorItemId: string, shelterNeedId: string, quantityToMatch: number) => {
        const item = inventory.find(i => i.id === donorItemId);
        const need = needs.find(n => n.id === shelterNeedId);

        if (item && need) {
            setInventory(prev => prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity - quantityToMatch } : i));
            setNeeds(prev => prev.map(n => n.id === need.id ? { ...n, quantityNeeded: n.quantityNeeded - quantityToMatch } : n));
            
            const newActivity: Activity = {
                id: `act${Date.now()}`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                description: `${item.name} (${quantityToMatch} ${item.unit}) matched to ${need.shelterName}.`,
                type: 'match'
            };
            setActivities(prev => [newActivity, ...prev]);

            showToast('Match confirmed and inventory updated!', 'success');
        } else {
            showToast('Error confirming match: item or need not found.', 'error');
        }
    };

    const handleMatchSubmission = (submission: DonationSubmission, needId: string, ngoName: string) => {
        // 1. Update the submission status and store match details
        setDonationSubmissions(prev => prev.map(s => 
            s.id === submission.id 
            ? { ...s, status: 'Matched', matchedNgoId: needId, matchDetails: { ngo_id: needId, name: ngoName } }
            : s
        ));

        // 2. Add the donated item(s) to the main inventory
        const donor = donors.find(d => d.id === submission.donorId);
        if (donor) {
            const newInventoryItems: InventoryItem[] = submission.items.map(item => ({
                id: `inv${Date.now()}-${item.name}`,
                name: item.name,
                category: item.category === 'Food' ? 'Produce' : 'Canned Goods',
                quantity: item.quantity,
                unit: item.unit,
                donor: donor.name,
                expiryDate: item.expiryDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                donationDate: new Date().toISOString(),
                valuePerUnit: 1.0,
                isLowStock: item.quantity < 50,
                dietaryRestrictions: []
            }));
            setInventory(prev => [...newInventoryItems, ...prev]);
        }

        // 3. Add to activity feed
        const newActivity: Activity = {
            id: `act${Date.now()}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            description: `New donation from ${donor?.name} matched to ${ngoName}.`,
            type: 'donation'
        };
        setActivities(prev => [newActivity, ...prev]);

        showToast('Donation matched! Items added to inventory.', 'success');
    };

    const handleCreateDonor = (donorData: Omit<Donor, 'id'>) => {
        const newDonor: Donor = {
            ...donorData,
            id: `don${Date.now()}`
        };
        setDonors(prev => [newDonor, ...prev]);
        showToast('Registration successful! Welcome to SABR.', 'success');
        setSelectedDonor(newDonor.name); // Automatically log in the new donor
    };
    
    const handleUpdateDonor = (updatedDonor: Donor) => {
        setDonors(prev => prev.map(d => d.id === updatedDonor.id ? updatedDonor : d));
        showToast('Donor profile updated!', 'success');
    };

    const renderPage = () => {
        if (currentUser === 'donor') {
            const currentDonor = donors.find(d => d.name === selectedDonor);
            return <DonorPortalPage 
                        selectedDonor={selectedDonor} 
                        donorId={currentDonor?.id || ''}
                        donationSubmissions={donationSubmissions}
                        setDonationSubmissions={setDonationSubmissions}
                        activities={activities}
                        messages={messages}
                        showToast={showToast}
                        onCreateDonor={handleCreateDonor}
                        allNeeds={needs}
                    />;
        }
        switch (activePage) {
            case 'Dashboard':
                return <DashboardPage 
                            inventory={inventory} 
                            needs={needs} 
                            activities={activities} 
                            usageData={MOCK_USAGE_DATA} 
                            onConfirmMatch={onConfirmMatch} 
                            donationSubmissions={donationSubmissions}
                            onMatchSubmission={handleMatchSubmission}
                            showToast={showToast} 
                        />;
            case 'Inventory':
                return <InventoryPage inventory={inventory} setInventory={setInventory} donors={donors} showToast={showToast} />;
            case 'Donors':
                return <DonorsPage donors={donors} setDonors={setDonors} onCreateDonor={handleCreateDonor} onUpdateDonor={handleUpdateDonor} showToast={showToast} />;
            case 'Beneficiaries':
                return <BeneficiariesPage needs={needs} setNeeds={setNeeds} showToast={showToast} />;
            case 'Reports':
                return <ReportsPage inventory={inventory} usageData={MOCK_USAGE_DATA} />;
            case 'Matches':
                return <MatchesPage activities={activities} />;
            case 'Volunteers':
                return <VolunteersPage volunteers={volunteers} setVolunteers={setVolunteers} showToast={showToast} />;
            case 'Settings':
                return <SettingsPage managerProfile={managerProfile} setManagerProfile={setManagerProfile} showToast={showToast} />;
            case 'About':
                return <AboutPage showToast={showToast} />;
            default:
                return <div>Page not found</div>;
        }
    };

    return (
        <div className="flex h-screen bg-stone-50 dark:bg-gray-900 text-gray-900 dark:text-gray-300 font-sans">
            {currentUser === 'manager' && <Sidebar activePage={activePage} setActivePage={setActivePage} />}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header 
                    currentUser={currentUser} 
                    setCurrentUser={setCurrentUser} 
                    donors={donors} 
                    selectedDonor={selectedDonor} 
                    setSelectedDonor={setSelectedDonor}
                    managerProfile={managerProfile}
                />
                <main key={currentUser === 'manager' ? activePage : `${selectedDonor}-${activePage}`} className="flex-1 overflow-x-hidden overflow-y-auto bg-stone-50 dark:bg-gray-900 animate-page-fade-in">
                    {renderPage()}
                </main>
            </div>
            {toast && <Toast message={toast.message} type={toast.type} onClose={toast.onClose} />}
        </div>
    );
};