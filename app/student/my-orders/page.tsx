'use client';

import React, { useState, useEffect } from 'react';
import { Order } from '@/lib/types';
import { useAuth } from '@/lib/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronDown, Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type OrderStatus = 'pending' | 'fulfilled' | 'cancelled';

export default function MyOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'all'>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Load orders from localStorage
  useEffect(() => {
    const allOrders = JSON.parse(localStorage.getItem('campusmart_orders') || '[]');
    if (user && user.role === 'student') {
      const userOrders = allOrders
        .filter((order: Order) => order.studentId === user.id)
        .sort((a: Order, b: Order) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setOrders(userOrders);
    }
  }, [user]);

  const filteredOrders = selectedStatus === 'all'
    ? orders
    : orders.filter(order => order.status === selectedStatus);

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'fulfilled':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'fulfilled':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
        <p className="text-gray-600">Track and manage your purchases</p>
      </div>

      {/* Filter Tabs */}
      <Tabs value={selectedStatus} onValueChange={(value: any) => setSelectedStatus(value)}>
        <TabsList className="grid w-full grid-cols-4 bg-gray-100">
          <TabsTrigger value="all" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            All ({orders.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            Pending ({orders.filter(o => o.status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="fulfilled" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            Fulfilled ({orders.filter(o => o.status === 'fulfilled').length})
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            Cancelled ({orders.filter(o => o.status === 'cancelled').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedStatus || 'all'} className="mt-6">
          {filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map(order => (
                <Card key={order.id} className="overflow-hidden">
                  {/* Order Summary */}
                  <button
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    className="w-full p-4 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <Package className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          <h3 className="font-semibold text-gray-900">{order.productName}</h3>
                          <Badge className={getStatusColor(order.status as OrderStatus)}>
                            {getStatusIcon(order.status as OrderStatus)}
                            <span className="ml-1">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 ml-8">{order.vendorName}</p>
                      </div>
                      <div className="text-right ml-4 flex-shrink-0">
                        <p className="text-lg font-bold text-green-600">₦{order.total.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-400 ml-4 transition-transform flex-shrink-0 ${
                          expandedOrder === order.id ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {expandedOrder === order.id && (
                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Order ID</p>
                          <p className="font-mono text-sm text-gray-900">{order.id}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Quantity</p>
                          <p className="font-semibold text-gray-900">{order.quantity} unit{order.quantity > 1 ? 's' : ''}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Price per Unit</p>
                          <p className="font-semibold text-gray-900">₦{(order.total / order.quantity).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Order Date</p>
                          <p className="font-semibold text-gray-900">{new Date(order.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">
                {selectedStatus === 'all' ? 'No orders yet' : `No ${selectedStatus} orders`}
              </p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
