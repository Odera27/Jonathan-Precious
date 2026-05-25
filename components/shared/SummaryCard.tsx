import React, { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: number;
  bgColor?: string;
}

export default function SummaryCard({
  title,
  value,
  icon,
  trend,
  bgColor = 'bg-blue-50',
}: SummaryCardProps) {
  return (
    <Card className={`p-6 ${bgColor} border-0 shadow-sm`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {trend !== undefined && (
            <p className={`text-xs font-medium mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '+' : ''}{trend}% from last period
            </p>
          )}
        </div>
        <div className="text-3xl opacity-80">{icon}</div>
      </div>
    </Card>
  );
}
