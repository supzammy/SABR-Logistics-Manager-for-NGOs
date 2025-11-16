import React, { useMemo } from 'react';
// FIX: Added 'Tooltip' to the import from 'recharts' to resolve the 'Cannot find name' error.
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { DashboardCard } from '../components/DashboardCard';
import { PredictiveChart } from '../components/PredictiveChart';
import type { InventoryItem, UsageDataPoint } from '../types';
import { useTheme } from '../hooks/useTheme';

interface ReportsPageProps {
    inventory: InventoryItem[];
    usageData: UsageDataPoint[];
}

const COLORS = ['#f97316', '#3b82f6', '#22c55e', '#a855f7'];

export const ReportsPage: React.FC<ReportsPageProps> = ({ inventory, usageData }) => {
    const { theme } = useTheme();
    
    const categoryData = useMemo(() => {
        const dataMap = new Map<string, number>();
        inventory.forEach(item => {
            dataMap.set(item.category, (dataMap.get(item.category) || 0) + item.quantity);
        });
        return Array.from(dataMap.entries()).map(([name, value]) => ({ name, value }));
    }, [inventory]);

    const totalInventoryItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
    const expiringSoonCount = inventory.filter(item => {
        const expiryDate = new Date(item.expiryDate);
        const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
        return expiryDate < threeDaysFromNow;
    }).length;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Reports & Analytics</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <DashboardCard title="Total Inventory" value={Math.round(totalInventoryItems).toLocaleString()} description="Sum of all items" />
                <DashboardCard title="Items Expiring Soon" value={String(expiringSoonCount)} description="In the next 3 days" />
                <DashboardCard title="Inventory Categories" value={String(categoryData.length)} description="Unique categories" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Inventory by Category</h3>
                    <div className="w-full h-80">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Legend />
                                 <Tooltip
                                    contentStyle={{
                                      backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                                      borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                                      color: theme === 'dark' ? '#d1d5db' : '#1f2937',
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Predictive Usage Forecast</h3>
                    <PredictiveChart data={usageData} />
                </div>
            </div>
        </div>
    );
};