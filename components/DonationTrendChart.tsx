import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ChartDataPoint {
    month: string;
    value: number;
}

interface DonationTrendChartProps {
    data: ChartDataPoint[];
}

export const DonationTrendChart: React.FC<DonationTrendChartProps> = ({ data }) => {
     if (!data || data.length === 0) {
        return <div className="flex items-center justify-center h-full text-gray-500">No trend data to display.</div>;
    }
    
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart
                data={data}
                margin={{
                    top: 5,
                    right: 20,
                    left: -10,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `$${value}`} />
                <Tooltip
                    cursor={{ fill: '#374151' }}
                    contentStyle={{
                        backgroundColor: '#1f2937',
                        borderColor: '#374151',
                        color: '#d1d5db',
                    }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Donation Value']}
                />
                <Legend wrapperStyle={{ fontSize: '14px' }}/>
                <Bar dataKey="value" name="Donation Value" fill="#3b82f6" />
            </BarChart>
        </ResponsiveContainer>
    );
};