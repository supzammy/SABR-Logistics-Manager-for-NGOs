import React from 'react';
import { Icon } from './Icon';

interface Location {
    name: string;
    address: string;
}

interface ImpactMapProps {
    locations: Location[];
}

// Mock coordinates for our fictional map
const MOCK_COORDS: Record<string, { x: number; y: number }> = {
    'Anbu Illam': { x: 25, y: 40 },
    'Aashirwad Shelter': { x: 70, y: 20 },
    'Akshaya Patra Kitchen': { x: 50, y: 75 },
};

export const ImpactMap: React.FC<ImpactMapProps> = ({ locations }) => {
    const uniqueLocations = Array.from(new Set(locations.map(l => l.name)))
        .map(name => locations.find(l => l.name === name)!);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="relative w-full aspect-video bg-gray-100 dark:bg-gray-900/50 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                {/* Simplified map representation */}
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
                    <path d="M10,10 L90,10 L90,90 L10,90 Z" className="fill-blue-100 dark:fill-blue-900/30 stroke-blue-200 dark:stroke-blue-800" strokeWidth="0.5" />
                    <path d="M30 10 L30 90" className="stroke-blue-200 dark:stroke-blue-800" strokeWidth="0.2" />
                    <path d="M60 10 L60 90" className="stroke-blue-200 dark:stroke-blue-800" strokeWidth="0.2" />
                    <path d="M10 30 L90 30" className="stroke-blue-200 dark:stroke-blue-800" strokeWidth="0.2" />
                    <path d="M10 60 L90 60" className="stroke-blue-200 dark:stroke-blue-800" strokeWidth="0.2" />
                </svg>

                {uniqueLocations.map(location => {
                    const coords = MOCK_COORDS[location.name];
                    if (!coords) return null;
                    return (
                        <div
                            key={location.name}
                            className="absolute"
                            style={{ top: `${coords.y}%`, left: `${coords.x}%`, transform: 'translate(-50%, -50%)' }}
                            title={`${location.name} - ${location.address}`}
                        >
                            <div className="relative flex items-center justify-center">
                                <div className="absolute w-4 h-4 bg-orange-500 rounded-full animate-ping opacity-75"></div>
                                <div className="relative w-3 h-3 bg-orange-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Locations Supported</h4>
                {uniqueLocations.length > 0 ? (
                    <ul className="space-y-2">
                        {uniqueLocations.map(location => (
                            <li key={location.name} className="flex items-start text-sm">
                                <Icon icon="beneficiaries" className="w-4 h-4 mr-2 mt-0.5 text-blue-500 flex-shrink-0" title="Location"/>
                                <div>
                                    <p className="font-medium text-gray-800 dark:text-gray-200">{location.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{location.address}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">Once your donations are delivered, the locations you've helped will appear here!</p>
                )}
            </div>
        </div>
    );
};
