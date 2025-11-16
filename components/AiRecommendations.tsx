import React, { useState, useEffect } from 'react';
import type { InventoryItem, ShelterNeed, AiMatch } from '../types';
import { generateMatchingRecommendations } from '../services/aiService';
import { Icon } from './Icon';

interface AiRecommendationsProps {
  inventory: InventoryItem[];
  needs: ShelterNeed[];
  onReviewMatch: (match: AiMatch) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  glowColor?: string;
}

const SkeletonCard = () => (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg animate-pulse">
        <div className="flex justify-between items-start">
            <div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2.5"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mt-3"></div>
            </div>
            <div className="h-10 w-28 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0 ml-4"></div>
        </div>
    </div>
);

export const AiRecommendations: React.FC<AiRecommendationsProps> = ({ inventory, needs, onReviewMatch, showToast, glowColor }) => {
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<AiMatch[]>([]);

  const generateRecs = async (showSuccessToast: boolean) => {
    setLoading(true);
    try {
      const result = await generateMatchingRecommendations(inventory, needs);
      if (result && result.length > 0) {
        setRecommendations(result);
        if (showSuccessToast) {
            showToast(`Generated ${result.length} smart recommendations!`, 'success');
        }
      } else {
        setRecommendations([]);
        if (showSuccessToast) {
            showToast('No optimal matches found at this time.', 'info');
        }
      }
    } catch (error) {
      console.error("AI recommendation error:", error);
      showToast('Failed to generate recommendations.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateRecs(false); // Auto-load recommendations on mount
  }, [inventory, needs]);

  const containerClasses = [
      'bg-white dark:bg-gray-800',
      'p-6 rounded-lg border border-gray-200 dark:border-gray-700',
      'transition-all duration-300 ease-in-out',
      glowColor ? 'glow-on-hover hover:scale-[1.02]' : '',
  ].filter(Boolean).join(' ');

  return (
    <div 
        className={containerClasses}
        style={glowColor ? { '--glow-color': glowColor } as React.CSSProperties : {}}
    >
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Recommendations</h3>
            <button
                onClick={() => generateRecs(true)}
                disabled={loading}
                className="flex items-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                title="Use AI to find optimal matches between inventory and needs"
            >
                <Icon icon={loading ? 'loading' : 'sparkles'} className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} title="Generate Smart Matches" />
                {loading ? 'Analyzing...' : 'Refresh'}
            </button>
        </div>
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {loading ? (
                <>
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </>
            ) : recommendations.length > 0 ? (
                recommendations.map((rec, index) => {
                    const item = inventory.find(i => i.id === rec.inventoryId);
                    const need = needs.find(n => n.id === rec.needId);
                    if (!item || !need) return null;

                    return (
                        <div key={index} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-white">
                                        Match <span className="text-blue-500">{rec.quantity} {item.unit} of {item.name}</span> to <span className="text-green-500">{need.shelterName}</span>
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 italic">
                                        <Icon icon="info" className="w-4 h-4 inline mr-1.5" title="AI Rationale" />
                                        {rec.reason}
                                    </p>
                                </div>
                                <button onClick={() => onReviewMatch(rec)} className="bg-blue-500/20 text-blue-500 hover:bg-blue-500 hover:text-white font-bold py-2 px-3 rounded-lg transition-colors text-sm flex-shrink-0 ml-4" title="Review the details of this AI-suggested match">
                                    Review Match
                                </button>
                            </div>
                        </div>
                    )
                })
            ) : (
                <div className="text-center py-8 text-gray-500">
                    <Icon icon="sparkles" className="w-8 h-8 mx-auto mb-2 text-gray-400" title="AI Recommendations Area" />
                    <p>No optimal matches found at this time. Check back later or adjust inventory/needs.</p>
                </div>
            )}
        </div>
    </div>
  );
};