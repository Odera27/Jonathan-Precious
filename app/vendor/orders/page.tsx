'use client';

import React, { useState, useMemo } from 'react';
import { Order } from '@/lib/types';
import { useAuth } from '@/lib/context/AuthContext';
import { useNotifications } from '@/lib/context/NotificationContext';
import { mockOrders } from '@/lib/mockData';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function VendorOrdersPage() {
  const { user } = useAuth();
  const { addToast } = useNotifications();
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'fulfilled' | 'cancelled'>('all');
  const [orders, setOrders] = useState<Order[]>(mockOrders.filter(o => o.vendorId === user?.id));

  const filteredOrders = useMemo(() => {
    if (selectedStatus === 'all') return orders;
    return orders.filter(o => o.status === selectedStatus);
  }, [orders, selectedStatus]);

  const handleMarkAsFulfilled = (orderId: string) => {
    setOrders(orders.map(o =>
      o.id === orderId ? { ...o, status: 'fulfilled' as const } : o
    ));
    addToast('Order marked as fulfilled', 'success');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'fulfilled':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'fulfilled':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
    }
  };

  const stats = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    fulfilled: orders.filter(o => o.status === 'fulfilled').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600">Manage customer orders and fulfillment</p>
      </div>

      {/* Filter Tabs */}
      <Tabs value={selectedStatus} onValueChange={(value: any) => setSelectedStatus(value)}>
        <TabsList className="grid w-full grid-cols-4 bg-gray-100">
          <TabsTrigger value="all" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            All ({stats.all})
          </TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            Pending ({stats.pending})
          </TabsTrigger>
          <TabsTrigger value="fulfilled" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            Fulfilled ({stats.fulfilled})
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            Cancelled ({stats.cancelled})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedStatus} className="mt-6">
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-gray-200 bg-gray-50">
                    <TableHead>Order ID</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map(order => (
                      <TableRow key={order.id} className="border-gray-200">
                        <TableCell className="font-mono text-sm text-gray-600">
                          {order.id.slice(-8)}
                        </TableCell>
                        <TableCell className="font-medium text-gray-900">
                          Student
                        </TableCell>
                        <TableCell className="text-gray-700">
                          {order.productName}
                        </TableCell>
                        <TableCell className="text-right text-gray-700">
                          {order.quantity}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-green-600">
                          ₦{order.total.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {new Date(order.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1">
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {order.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => handleMarkAsFulfilled(order.id)}
                              className="bg-green-600 hover:bg-green-700 text-white text-xs"
                            >
                              Fulfill
                            </Button>
                          )}
                          {order.status !== 'pending' && (
                            <span className="text-gray-500 text-sm">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        No {selectedStatus !== 'all' ? selectedStatus : ''} orders
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
