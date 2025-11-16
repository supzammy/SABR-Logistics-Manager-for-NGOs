import React, { useMemo, useState } from 'react';
import type { DonationSubmission, Achievement, Activity, Message, Donor, ShelterNeed } from '../types';
import { Icon } from '../components/Icon';
import { ImpactCard } from '../components/ImpactCard';
import { DonationSubmissionModal } from '../components/DonationSubmissionModal';
import { ReceiptModal } from '../components/ReceiptModal';
import { AchievementBadge } from '../components/AchievementBadge';
import { DonationTracker } from '../components/DonationTracker';
import { MessageFeed } from '../components/MessageFeed';
import { DonationCategoryChart } from '../components/DonationCategoryChart';
import { DonationTrendChart } from '../components/DonationTrendChart';
import { DonorProfileForm } from '../components/DonorProfileForm';
import { DonationSuggestionModal } from '../components/DonationSuggestionModal';
import { EmptyState } from '../components/EmptyState';
import { DonorLevelProgress } from '../components/DonorLevelProgress';
import { ImpactMap } from '../components/ImpactMap';


interface DonorPortalPageProps {
  selectedDonor: string;
  donorId: string;
  donationSubmissions: DonationSubmission[];
  setDonationSubmissions: React.Dispatch<React.SetStateAction<DonationSubmission[]>>;
  activities: Activity[];
  messages: Message[];
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  onCreateDonor: (donorData: Omit<Donor, 'id'>) => void;
  allNeeds: ShelterNeed[];
}

const getStatusClass = (status: DonationSubmission['status']) => {
    switch (status) {
        case 'Delivered':
            return 'text-green-500 dark:text-green-400 bg-green-100 dark:bg-green-900/50';
        case 'Collected':
        case 'In Transit':
             return 'text-blue-500 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50';
        case 'Matched':
             return 'text-purple-500 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/50';
        case 'Pending Review':
            return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/50';
        default:
            return 'text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-700/50';
    }
};

const DONOR_LEVELS = [
    { name: 'Bronze Contributor', threshold: 0 },
    { name: 'Silver Partner', threshold: 500 },
    { name: 'Gold Champion', threshold: 2000 },
    { name: 'Platinum Benefactor', threshold: 10000 },
];

type DonorTab = 'Overview' | 'My Donations' | 'My Impact';

// #region Tab Components
const OverviewTab: React.FC<{
    donorSubmissions: DonationSubmission[];
    messages: Message[];
}> = ({ donorSubmissions, messages }) => {
    const currentSubmissions = donorSubmissions.filter(s => s.status !== 'Delivered');

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Current Donations</h3>
                {currentSubmissions.length > 0 ? (
                    <div className="space-y-6">
                        {currentSubmissions.map((sub, index) => (
                             <div 
                                key={sub.id} 
                                className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700 animate-list-item-fade-in"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <DonationTracker submission={sub} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                        <EmptyState 
                            icon="truck"
                            title="No Active Donations"
                            message="Your active donations will appear here, allowing you to track their journey from pickup to delivery."
                        />
                    </div>
                )}
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                 <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Message Center</h3>
                 <MessageFeed messages={messages} />
            </div>
        </div>
    );
};

const DonationsTab: React.FC<{
    donorSubmissions: DonationSubmission[];
    setIsSubmissionModalOpen: (isOpen: boolean) => void;
    handleViewReceipt: (submission: DonationSubmission) => void;
}> = ({ donorSubmissions, setIsSubmissionModalOpen, handleViewReceipt }) => {
    const [historySearch, setHistorySearch] = useState('');
    const [historyStatusFilter, setHistoryStatusFilter] = useState('All');

    const filteredDonorSubmissions = useMemo(() => {
        return donorSubmissions
            .filter(s => historyStatusFilter === 'All' || s.status === historyStatusFilter)
            .filter(s => {
                if (!historySearch) return true;
                const searchTerm = historySearch.toLowerCase();
                return s.items.some(i => i.name.toLowerCase().includes(searchTerm)) || s.id.toLowerCase().includes(searchTerm);
            });
    }, [donorSubmissions, historySearch, historyStatusFilter]);
    
    const statusOptions = ['All', ...Array.from(new Set(donorSubmissions.map(s => s.status)))];

    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
             <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Full Donation History</h3>
                 <div className="flex items-center space-x-3 w-full md:w-auto">
                     <div className="relative flex-grow">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <Icon icon="search" className="w-5 h-5 text-gray-500" title="Search Icon" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search by item..."
                            value={historySearch}
                            onChange={(e) => setHistorySearch(e.target.value)}
                            className="w-full py-2 pl-10 pr-4 text-gray-800 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            title="Search donations by item name"
                        />
                    </div>
                    <select 
                        value={historyStatusFilter}
                        onChange={(e) => setHistoryStatusFilter(e.target.value)}
                        className="py-2 px-3 text-gray-800 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        title="Filter donations by status"
                    >
                        {statusOptions.map(status => <option key={status} value={status}>{status}</option>)}
                    </select>
                </div>
            </div>
             <div className="overflow-x-auto max-h-[32rem]">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-500 dark:text-gray-300 uppercase bg-gray-100 dark:bg-gray-800 sticky top-0">
                         <tr>
                            <th scope="col" className="px-4 py-3">Date</th>
                            <th scope="col" className="px-4 py-3">Items</th>
                            <th scope="col" className="px-4 py-3">Status</th>
                            <th scope="col" className="px-4 py-3 text-right">Details</th>
                        </tr>
                    </thead>
                     <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredDonorSubmissions.length > 0 ? (
                            filteredDonorSubmissions.map((sub, index) => (
                                <tr 
                                    key={sub.id} 
                                    className="hover:bg-gray-50 dark:hover:bg-gray-800 animate-table-row-fade-in"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <td className="px-4 py-3 whitespace-nowrap">{new Date(sub.createdAt).toLocaleDateString()}</td>
                                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-white">{sub.items.map(i => `${i.quantity} ${i.unit} ${i.name}`).join(', ')}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${getStatusClass(sub.status)}`}>
                                            {sub.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        {sub.status === 'Delivered' && sub.donorBenefits && (
                                            <button onClick={() => handleViewReceipt(sub)} className="bg-blue-500/20 text-blue-500 hover:bg-blue-500 hover:text-white font-bold py-1 px-3 rounded-lg transition-colors text-xs focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-white dark:focus:ring-offset-gray-900" title="View and print the official receipt for this donation">
                                                View Receipt
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4}>
                                    <EmptyState
                                        icon="package"
                                        title="No Donations Found"
                                        message="No donations match your current filters. Try adjusting your search or submit a new donation!"
                                        actionText="Submit First Donation"
                                        onAction={() => setIsSubmissionModalOpen(true)}
                                    />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
             </div>
        </div>
    );
};

const ImpactTab: React.FC<{
    achievements: Achievement[];
    nextAchievementToSpotlight: (Achievement & { progress: number }) | undefined;
    categoryData: { name: string; value: number; }[];
    trendData: { month: string; value: number; }[];
    supportedLocations: { name: string; address: string; }[];
}> = ({ achievements, nextAchievementToSpotlight, categoryData, trendData, supportedLocations }) => {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Your Achievements</h3>
                    {nextAchievementToSpotlight && (
                        <div className="bg-gradient-to-br from-amber-400/20 to-orange-500/20 p-4 rounded-lg border-2 border-dashed border-orange-500/50 mb-6">
                            <p className="text-sm font-bold text-orange-600 dark:text-orange-400 mb-2">Next Up: {nextAchievementToSpotlight.name}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{nextAchievementToSpotlight.description}</p>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${nextAchievementToSpotlight.progress}%` }}></div>
                            </div>
                        </div>
                    )}
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                        {achievements.map(ach => <AchievementBadge key={ach.id} achievement={ach} />)}
                    </div>
                </div>
                <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <Icon icon="chart-pie" className="w-6 h-6 mr-3 text-orange-500" title="Donations by Category" />
                        Category Breakdown
                    </h3>
                    <DonationCategoryChart data={categoryData} />
                </div>
            </div>
             <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Your Geographic Impact</h3>
                <ImpactMap locations={supportedLocations} />
             </div>
             <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Icon icon="chart-bar" className="w-6 h-6 mr-3 text-blue-500" title="Monthly Contribution Trend" />
                    Monthly Contribution Trend
                </h3>
                <DonationTrendChart data={trendData} />
            </div>
        </div>
    );
};
// #endregion


export const DonorPortalPage: React.FC<DonorPortalPageProps> = ({ 
    selectedDonor, 
    donorId,
    donationSubmissions,
    setDonationSubmissions,
    activities,
    messages,
    showToast,
    onCreateDonor,
    allNeeds,
}) => {
  const [activeTab, setActiveTab] = useState<DonorTab>('Overview');
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<DonationSubmission | null>(null);

  const donorSubmissions = useMemo(() => {
    return donationSubmissions.filter(s => s.donorId === donorId)
      .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [donationSubmissions, donorId]);
  
  const donorImpact = useMemo(() => {
    const deliveredSubmissions = donorSubmissions.filter(s => s.status === 'Delivered');
    const totalDonatedValue = deliveredSubmissions.reduce((sum, sub) => sum + (sub.donorBenefits?.tax_deduction_value || 0), 0);
    const estimatedMeals = deliveredSubmissions.reduce((sum, sub) => {
        const foodItems = sub.items.filter(i => i.category === 'Food');
        const itemCount = foodItems.reduce((itemSum, i) => itemSum + (i.quantity * 2.5), 0); // Heuristic
        return sum + itemCount;
    }, 0);
    const uniqueBeneficiaries = new Set(deliveredSubmissions.map(s => s.matchDetails?.name).filter(Boolean));

    return {
      totalValue: totalDonatedValue,
      estimatedMeals: Math.round(estimatedMeals),
      beneficiariesHelped: uniqueBeneficiaries.size,
      totalDonations: deliveredSubmissions.length,
    };
  }, [donorSubmissions]);

  // Donor Level Calculation
  const { currentLevelInfo, nextLevelInfo, levelProgress } = useMemo(() => {
      const { totalValue } = donorImpact;
      const currentLevel = DONOR_LEVELS.slice().reverse().find(level => totalValue >= level.threshold) || DONOR_LEVELS[0];
      const nextLevel = DONOR_LEVELS.find(level => totalValue < level.threshold);
      const progress = nextLevel 
          ? ((totalValue - currentLevel.threshold) / (nextLevel.threshold - currentLevel.threshold)) * 100
          : 100;
      return { currentLevelInfo: currentLevel, nextLevelInfo: nextLevel, levelProgress: progress };
  }, [donorImpact]);
  
  const achievements: Achievement[] = useMemo(() => {
    const deliveredSubmissions = donorSubmissions.filter(s => s.status === 'Delivered');
    const produceDonated = deliveredSubmissions.flatMap(s => s.items).filter(i => i.category === 'Food' && (i.name.toLowerCase().includes('apple') || i.name.toLowerCase().includes('orange') || i.name.toLowerCase().includes('tomato'))).reduce((sum, i) => sum + i.quantity, 0);
    const pantryDonated = deliveredSubmissions.flatMap(s => s.items).filter(i => i.category === 'Food' && (i.name.toLowerCase().includes('canned') || i.name.toLowerCase().includes('pasta'))).reduce((sum, i) => sum + i.quantity, 0);
    const pledgesMade = activities.filter(a => a.type === 'pledge' && a.description.startsWith(selectedDonor));

    return [
      { id: 'first_donation', name: 'First Donation', description: 'Make your first donation.', unlocked: deliveredSubmissions.length > 0, icon: 'gift' },
      { id: 'five_timer', name: 'Five-Timer', description: 'Make 5 successful donations.', unlocked: deliveredSubmissions.length >= 5, icon: 'star' },
      { id: 'produce_pro', name: 'Produce Pro', description: 'Donate over 100kg of produce.', unlocked: produceDonated > 100, icon: 'badge' },
      { id: 'pantry_packer', name: 'Pantry Packer', description: 'Donate over 200 pantry items.', unlocked: pantryDonated > 200, icon: 'award' },
      { id: 'urgent_responder', name: 'Urgent Responder', description: 'Fulfill a high-priority need.', unlocked: pledgesMade.length > 0, icon: 'heart' },
    ];
  }, [donorSubmissions, activities, selectedDonor]);
  
  const getAchievementProgress = (achievement: Achievement): number => {
    if (achievement.unlocked) return 100;
    const deliveredSubmissions = donorSubmissions.filter(s => s.status === 'Delivered');
    switch (achievement.id) {
        case 'first_donation': return deliveredSubmissions.length > 0 ? 100 : 0;
        case 'five_timer': return Math.min((deliveredSubmissions.length / 5) * 100, 100);
        case 'produce_pro':
            const produceDonated = donorSubmissions.flatMap(s => s.items).filter(i => i.category === 'Food' && (i.name.toLowerCase().includes('apple') || i.name.toLowerCase().includes('orange') || i.name.toLowerCase().includes('tomato'))).reduce((sum, i) => sum + i.quantity, 0);
            return Math.min((produceDonated / 100) * 100, 100);
        case 'pantry_packer':
            const pantryDonated = donorSubmissions.flatMap(s => s.items).filter(i => i.category === 'Food' && (i.name.toLowerCase().includes('canned') || i.name.toLowerCase().includes('pasta'))).reduce((sum, i) => sum + i.quantity, 0);
            return Math.min((pantryDonated / 200) * 100, 100);
        case 'urgent_responder': return 0; // Hard to quantify progress
        default: return 0;
    }
  };

  const nextAchievementToSpotlight = useMemo(() => {
     const achievementsWithProgress = achievements
        .filter(a => !a.unlocked)
        .map(a => ({ ...a, progress: getAchievementProgress(a) }))
        .sort((a, b) => b.progress - a.progress);
    return achievementsWithProgress[0];
  }, [achievements, donorSubmissions]);

  const categoryData = useMemo(() => {
    const deliveredSubmissions = donorSubmissions.filter(s => s.status === 'Delivered');
    const dataMap = new Map<string, number>();
    
    deliveredSubmissions.forEach(submission => {
        submission.items.forEach(item => {
            const category = item.category || 'Other';
            dataMap.set(category, (dataMap.get(category) || 0) + item.quantity);
        });
    });

    return Array.from(dataMap.entries()).map(([name, value]) => ({ name, value }));
  }, [donorSubmissions]);

  // FIX: Mapped the ShelterNeed object to the expected { name, address } shape.
  const supportedLocations = useMemo(() => {
      const deliveredSubmissions = donorSubmissions.filter(s => s.status === 'Delivered' && s.matchedNgoId);
      const supportedNeedIds = new Set(deliveredSubmissions.map(s => s.matchedNgoId));
      return allNeeds
        .filter(need => supportedNeedIds.has(need.id))
        .map(need => ({ name: need.shelterName, address: need.address }));
  }, [donorSubmissions, allNeeds]);


  const trendData = useMemo(() => {
    const deliveredSubmissions = donorSubmissions.filter(s => s.status === 'Delivered' && s.donorBenefits);
    const dataMap = new Map<string, number>();
    
    const monthLabels: string[] = [];
    for (let i = 11; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const month = d.toLocaleString('default', { month: 'short' });
        const year = d.getFullYear().toString().slice(-2);
        const label = `${month} '${year}`;
        monthLabels.push(label);
        dataMap.set(label, 0);
    }
    
    deliveredSubmissions.forEach(submission => {
        const date = new Date(submission.createdAt);
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear().toString().slice(-2);
        const label = `${month} '${year}`;
        
        if (dataMap.has(label)) {
            const currentValue = dataMap.get(label) || 0;
            dataMap.set(label, currentValue + (submission.donorBenefits?.tax_deduction_value || 0));
        }
    });

    return monthLabels.map(label => ({
        month: label,
        value: dataMap.get(label) || 0
    }));
  }, [donorSubmissions]);

  const handleSubmission = (submissionData: Omit<DonationSubmission, 'id' | 'donorId' | 'status' | 'createdAt'>) => {
    const newSubmission: DonationSubmission = {
      ...submissionData,
      id: `sub${Date.now()}`,
      donorId: donorId,
      status: 'Pending Review',
      createdAt: new Date().toISOString()
    };
    setDonationSubmissions(prev => [newSubmission, ...prev]);
    setIsSubmissionModalOpen(false);
    showToast('Donation submitted for review! Thank you.', 'success');
  };
  
  const handleViewReceipt = (submission: DonationSubmission) => {
      setSelectedSubmission(submission);
      setIsReceiptModalOpen(true);
  };

  if (selectedDonor === '__REGISTER__') {
      return (
          <div className="p-8 bg-stone-50 dark:bg-gray-800 min-h-full">
              <div className="max-w-4xl mx-auto">
                  <DonorProfileForm onSave={onCreateDonor} />
              </div>
          </div>
      );
  }

  const renderTabContent = () => {
    switch (activeTab) {
        case 'Overview':
            return <OverviewTab donorSubmissions={donorSubmissions} messages={messages} />;
        case 'My Donations':
            return <DonationsTab donorSubmissions={donorSubmissions} setIsSubmissionModalOpen={setIsSubmissionModalOpen} handleViewReceipt={handleViewReceipt} />;
        case 'My Impact':
            return <ImpactTab achievements={achievements} nextAchievementToSpotlight={nextAchievementToSpotlight} categoryData={categoryData} trendData={trendData} supportedLocations={supportedLocations} />;
        default:
            return null;
    }
  };
  
  const isNewDonor = donorImpact.totalDonations <= 1;
  const greeting = isNewDonor ? `Let's Get Started, ${selectedDonor}!` : `Welcome Back, ${selectedDonor}!`;
  const subGreeting = isNewDonor ? "Ready to make your first big impact? We're glad you're here." : "Your continued support is making a huge difference in our community.";


  return (
    <div className="p-8 bg-stone-50 dark:bg-gray-800 min-h-full">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-xl overflow-hidden p-8 mb-8 bg-gradient-to-tr from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700">
            <div
                className="absolute inset-0 bg-repeat opacity-[0.03] dark:opacity-[0.02]"
                style={{ backgroundImage: `url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23000000" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')` }}
            ></div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-6">
                <div className="flex-1">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{greeting}</h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">{subGreeting}</p>
                    <div className="mt-6">
                        <DonorLevelProgress 
                            levelName={currentLevelInfo.name}
                            progress={levelProgress}
                            currentValue={donorImpact.totalValue}
                            nextLevelValue={nextLevelInfo?.threshold || donorImpact.totalValue}
                        />
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto self-start md:self-end">
                    <button onClick={() => setIsSuggestionModalOpen(true)} className="flex items-center justify-center bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white font-bold py-3 px-6 rounded-lg transition-transform duration-200 ease-in-out hover:scale-105 shadow-sm" title="Get AI-powered ideas for impactful donations">
                        <Icon icon="sparkles" className="w-5 h-5 mr-3 text-orange-500" title="Get Donation Ideas" />
                        Get Donation Ideas
                    </button>
                    <button onClick={() => setIsSubmissionModalOpen(true)} className="flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-transform duration-200 ease-in-out hover:scale-105 shadow-lg" title="Submit a new donation for review and matching">
                        <Icon icon="package" className="w-5 h-5 mr-3" title="Submit New Donation" />
                        Submit New Donation
                    </button>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <ImpactCard icon="gift" value={donorImpact.estimatedMeals.toLocaleString()} title="Estimated Meals Provided" description="From your delivered donations." colorClass="bg-gradient-to-br from-green-400 to-green-600" glowColor="52, 211, 153" />
            <ImpactCard icon="dollar-sign" value={`$${donorImpact.totalValue.toLocaleString()}`} title="Total Value of Donations" description="Estimated tax-deductible value." colorClass="bg-gradient-to-br from-blue-400 to-blue-600" glowColor="96, 165, 250" />
            <ImpactCard icon="beneficiaries" value={String(donorImpact.beneficiariesHelped)} title="Beneficiaries Supported" description="Organizations you've helped." colorClass="bg-gradient-to-br from-purple-400 to-purple-600" glowColor="192, 132, 252" />
        </div>

        <div className="relative mb-8">
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {(['Overview', 'My Donations', 'My Impact'] as DonorTab[]).map(tabName => (
                        <button 
                            key={tabName} 
                            onClick={() => setActiveTab(tabName)}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 focus:outline-none relative ${
                                activeTab === tabName
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300 dark:hover:border-gray-600'
                            }`}
                            aria-current={activeTab === tabName ? 'page' : undefined}
                        >
                            {tabName}
                        </button>
                    ))}
                </nav>
            </div>
        </div>

        <div key={activeTab} className="animate-page-fade-in">
            {renderTabContent()}
        </div>

      </div>

      {isSubmissionModalOpen && (
        <DonationSubmissionModal
            isOpen={isSubmissionModalOpen}
            onClose={() => setIsSubmissionModalOpen(false)}
            onSubmit={handleSubmission}
        />
      )}

      {isSuggestionModalOpen && (
        <DonationSuggestionModal
            isOpen={isSuggestionModalOpen}
            onClose={() => setIsSuggestionModalOpen(false)}
            needs={allNeeds}
        />
      )}
      
      {isReceiptModalOpen && selectedSubmission && (
        <ReceiptModal
            isOpen={isReceiptModalOpen}
            onClose={() => setIsReceiptModalOpen(false)}
            submission={selectedSubmission}
            donorName={selectedDonor}
        />
      )}
    </div>
  );
};
