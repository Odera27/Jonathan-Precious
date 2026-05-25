'use client';

import React, { useMemo } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { mockProducts, mockOrders } from '@/lib/mockData';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SummaryCard from '@/components/shared/SummaryCard';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { Package, TrendingUp, DollarSign, Clock } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function VendorOverviewPage() {
  const { user } = useAuth();

  // Get vendor's products and orders
  const vendorProducts = useMemo(() => {
    return mockProducts.filter(p => p.vendorId === user?.id);
  }, [user]);

  const vendorOrders = useMemo(() => {
    return mockOrders.filter(o => o.vendorId === user?.id);
  }, [user]);

  // Calculate summary stats
  const totalProducts = vendorProducts.length;
  const lowStockItems = vendorProducts.filter(p => p.stock > 0 && p.stock <= 5).length;
  const todaysSales = vendorOrders
    .filter(o => o.date === new Date().toISOString().split('T')[0])
    .reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = vendorOrders.filter(o => o.status === 'pending').length;

  // Weekly sales data
  const weeklySalesData = [
    { day: 'Mon', sales: 15000 },
    { day: 'Tue', sales: 22000 },
    { day: 'Wed', sales: 18500 },
    { day: 'Thu', sales: 28000 },
    { day: 'Fri', sales: 35000 },
    { day: 'Sat', sales: 42000 },
    { day: 'Sun', sales: 38000 },
  ];

  // Recent orders
  const recentOrders = vendorOrders.slice(0, 5).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'fulfilled':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}!</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Products"
          value={totalProducts}
          icon={<Package className="w-8 h-8" />}
          bgColor="bg-blue-50"
        />
        <SummaryCard
          title="Low Stock Items"
          value={lowStockItems}
          icon={<TrendingUp className="w-8 h-8 text-amber-600" />}
          bgColor="bg-amber-50"
        />
        <SummaryCard
          title="Today's Sales"
          value={`₦${todaysSales.toLocaleString()}`}
          icon={<DollarSign className="w-8 h-8 text-green-600" />}
          bgColor="bg-green-50"
        />
        <SummaryCard
          title="Pending Orders"
          value={pendingOrders}
          icon={<Clock className="w-8 h-8 text-orange-600" />}
          bgColor="bg-orange-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Sales Chart */}
        <Card className="lg:col-span-2 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Weekly Sales Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklySalesData}>
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
              <Bar dataKey="sales" fill="#16a34a" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Top Stats */}
        <div className="space-y-4">
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <p className="text-sm text-gray-600 mb-1">Total Orders</p>
            <p className="text-3xl font-bold text-green-700">{vendorOrders.length}</p>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <p className="text-sm text-gray-600 mb-1">In Stock Items</p>
            <p className="text-3xl font-bold text-blue-700">{vendorProducts.filter(p => p.stock > 0).length}</p>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
            <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-orange-700">₦{vendorOrders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}</p>
          </Card>
        </div>
      </div>

      {/* Recent Orders Table */}
      <Card>
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-gray-200">
                <TableHead>Order ID</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map(order => (
                <TableRow key={order.id} className="border-gray-200">
                  <TableCell className="font-mono text-sm text-gray-600">
                    {order.id.slice(-8)}
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    {order.productName}
                  </TableCell>
                  <TableCell className="text-gray-700">{order.productName}</TableCell>
                  <TableCell className="text-right text-gray-700">{order.quantity}</TableCell>
                  <TableCell className="text-right font-semibold text-gray-900">
                    ₦{order.total.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {new Date(order.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
