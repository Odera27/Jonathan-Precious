'use client';

import React, { useMemo } from 'react';
import { mockVendors, mockStudents, mockOrders, mockProducts } from '@/lib/mockData';
import { Card } from '@/components/ui/card';
import SummaryCard from '@/components/shared/SummaryCard';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Users, ShoppingCart, TrendingUp, DollarSign } from 'lucide-react';

export default function AdminOverviewPage() {
  // Calculate summary stats
  const totalVendors = mockVendors.filter(v => v.status === 'active').length;
  const totalStudents = mockStudents.filter(s => s.status === 'active').length;
  const todaysSales = mockOrders
    .filter(o => o.date === new Date().toISOString().split('T')[0])
    .reduce((sum, o) => sum + o.total, 0);
  const totalRevenue = mockOrders.reduce((sum, o) => sum + o.total, 0);

  // Order distribution by category
  const categoryDistribution = useMemo(() => {
    const dist: { [key: string]: number } = {};
    mockProducts.forEach(product => {
      dist[product.category] = (dist[product.category] || 0) + 1;
    });
    return Object.entries(dist).map(([name, value]) => ({ name, value }));
  }, []);

  const COLORS = ['#16a34a', '#2563eb', '#f59e0b', '#ef4444', '#8b5cf6'];

  // Revenue over 30 days
  const revenueData = [
    { day: 'Day 1-5', revenue: 125000 },
    { day: 'Day 6-10', revenue: 185000 },
    { day: 'Day 11-15', revenue: 215000 },
    { day: 'Day 16-20', revenue: 275000 },
    { day: 'Day 21-25', revenue: 325000 },
    { day: 'Day 26-30', revenue: 380000 },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Platform overview and analytics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Vendors"
          value={totalVendors}
          icon={<Users className="w-8 h-8 text-blue-600" />}
          bgColor="bg-blue-50"
        />
        <SummaryCard
          title="Total Students"
          value={totalStudents}
          icon={<Users className="w-8 h-8 text-green-600" />}
          bgColor="bg-green-50"
        />
        <SummaryCard
          title="Today's Orders"
          value={mockOrders.filter(o => o.date === new Date().toISOString().split('T')[0]).length}
          icon={<ShoppingCart className="w-8 h-8 text-orange-600" />}
          bgColor="bg-orange-50"
        />
        <SummaryCard
          title="Total Revenue"
          value={`₦${totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="w-8 h-8 text-purple-600" />}
          bgColor="bg-purple-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Distribution Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Product Distribution by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} (${value})`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Platform Revenue Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Platform Revenue (30 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#16a34a"
                strokeWidth={2}
                dot={{ fill: '#16a34a' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <p className="text-sm text-gray-600 mb-1">Active Vendors</p>
          <p className="text-3xl font-bold text-blue-700">{totalVendors}</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <p className="text-sm text-gray-600 mb-1">Active Students</p>
          <p className="text-3xl font-bold text-green-700">{totalStudents}</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <p className="text-sm text-gray-600 mb-1">Total Products</p>
          <p className="text-3xl font-bold text-orange-700">{mockProducts.length}</p>
        </Card>
      </div>
    </div>
  );
}
