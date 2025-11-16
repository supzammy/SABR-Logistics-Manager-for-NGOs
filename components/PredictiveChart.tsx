

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from 'recharts';
import type { UsageDataPoint } from '../types';
import { useTheme } from '../hooks/useTheme';

interface PredictiveChartProps {
  data: UsageDataPoint[];
}

export const PredictiveChart: React.FC<PredictiveChartProps> = ({ data }) => {
  const { theme } = useTheme();

  const colors = {
    grid: theme === 'dark' ? '#374151' : '#e5e7eb',
    axis: theme === 'dark' ? '#6b7280' : '#6b7280',
    tooltipBg: theme === 'dark' ? '#1f2937' : '#ffffff',
    tooltipBorder: theme === 'dark' ? '#374151' : '#e5e7eb',
    tooltipText: theme === 'dark' ? '#d1d5db' : '#1f2937',
    line: '#3b82f6',
  };


  return (
    <div className="h-64 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <defs>
            <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.line} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={colors.line} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
          <XAxis dataKey="date" stroke={colors.axis} fontSize={12} />
          <YAxis stroke={colors.axis} fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: colors.tooltipBg,
              borderColor: colors.tooltipBorder,
              color: colors.tooltipText,
            }}
          />
          <Line type="monotone" dataKey="usage" stroke={colors.line} strokeWidth={2} dot={false} />
          <Area type="monotone" dataKey="usage" stroke={false} fillOpacity={1} fill="url(#colorUsage)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};