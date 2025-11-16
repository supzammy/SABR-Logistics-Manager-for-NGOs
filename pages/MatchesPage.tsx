import React from 'react';
import type { Activity } from '../types';
import { EmptyState } from '../components/EmptyState';

interface MatchesPageProps {
    activities: Activity[];
}

export const MatchesPage: React.FC<MatchesPageProps> = ({ activities }) => {
    const confirmedMatches = activities.filter(act => act.type === 'match');

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Match History</h1>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600 dark:text-gray-400">
                        <thead className="text-xs text-gray-500 dark:text-gray-300 uppercase bg-gray-100 dark:bg-gray-900">
                            <tr>
                                <th scope="col" className="px-6 py-3">Timestamp</th>
                                <th scope="col" className="px-6 py-3">Description</th>
                                <th scope="col" className="px-6 py-3">Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {confirmedMatches.length > 0 ? (
                                confirmedMatches.map(match => (
                                    <tr key={match.id} className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-6 py-4">{match.timestamp}</td>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{match.description}</th>
                                        <td className="px-6 py-4">
                                            <span className="text-xs text-green-500 dark:text-green-400 bg-green-100 dark:bg-green-900/50 px-2 py-1 rounded-full font-bold">MATCH</span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3}>
                                        <EmptyState 
                                            icon="matches"
                                            title="No Match History"
                                            message="Confirmed matches will appear here once they are made from the dashboard."
                                        />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
