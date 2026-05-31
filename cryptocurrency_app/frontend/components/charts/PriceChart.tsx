"use client";

import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface PriceChartProps {
  data: any[];
}

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4', '#6366F1'];

export default function PriceChart({ data }: PriceChartProps) {
  const chartData = useMemo(() => {
    return data.slice(0, 8).map(coin => ({
      name: coin.symbol.toUpperCase(),
      marketCap: +(coin.market_cap / 1e9).toFixed(2),
      image: coin.image
    }));
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        barCategoryGap="20%"
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="name"
          stroke="var(--text-muted)"
          tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          stroke="var(--text-muted)"
          tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => `$${value}B`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            color: 'var(--foreground)'
          }}
          itemStyle={{ color: 'var(--foreground)' }}
          formatter={(value: any) => [`$${value}B`, 'Market Cap']}
          cursor={{ fill: 'var(--panel)' }}
        />
        <Bar dataKey="marketCap" radius={[8, 8, 0, 0]}>
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
