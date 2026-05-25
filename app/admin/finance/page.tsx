'use client';

import React, { useState, useMemo } from 'react';
import { mockVendors, mockOrders } from '@/lib/mockData';
import { useNotifications } from '@/lib/context/NotificationContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, CheckCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface VendorFinance {
  vendorId: string;
  vendorName: string;
  totalSales: number;
  payoutsDue: number;
  status: 'pending' | 'processed';
}

export default function AdminFinancePage() {
  const [payoutConfirm, setPayoutConfirm] = useState<string | null>(null);
  const { addToast } = useNotifications();

  // Calculate vendor finances
  const vendorFinances: VendorFinance[] = useMemo(() => {
    return mockVendors.map(vendor => {
      const vendorOrders = mockOrders.filter(o => o.vendorId === vendor.id);
      const totalSales = vendorOrders.reduce((sum, o) => sum + o.total, 0);
      const payoutsDue = Math.floor(totalSales * 0.85); // 85% payout to vendor

      return {
        vendorId: vendor.id,
        vendorName: vendor.storeName,
        totalSales,
        payoutsDue,
        status: 'pending' as const,
      };
    });
  }, []);

  const handleProcessPayout = (vendorId: string) => {
    addToast('Payout processed successfully!', 'success');
    setPayoutConfirm(null);
  };

  const totalPaymentsDue = vendorFinances.reduce((sum, v) => sum + v.payoutsDue, 0);
  const totalProcessed = 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Finance Management</h1>
        <p className="text-gray-600">Manage vendor payouts and financial reports</p>
      </div>

      {/* Finance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-blue-700">
                ₦{mockOrders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-10 h-10 text-blue-600 opacity-50" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Payments Due</p>
              <p className="text-3xl font-bold text-amber-700">
                ₦{totalPaymentsDue.toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-10 h-10 text-amber-600 opacity-50" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Commission Earned</p>
              <p className="text-3xl font-bold text-green-700">
                ₦{(mockOrders.reduce((sum, o) => sum + o.total, 0) * 0.15).toLocaleString()}
              </p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-600 opacity-50" />
          </div>
        </Card>
      </div>

      {/* Vendor Payouts Table */}
      <Card>
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Vendor Payouts</h3>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-gray-200 bg-gray-50">
                <TableHead>Vendor Name</TableHead>
                <TableHead className="text-right">Total Sales</TableHead>
                <TableHead className="text-right">Payout Due (85%)</TableHead>
                <TableHead className="text-right">Commission (15%)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendorFinances.map(vendor => (
                <TableRow key={vendor.vendorId} className="border-gray-200">
                  <TableCell className="font-medium text-gray-900">
                    {vendor.vendorName}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-gray-900">
                    ₦{vendor.totalSales.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-green-600">
                    ₦{vendor.payoutsDue.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-blue-600">
                    ₦{(vendor.totalSales - vendor.payoutsDue).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={vendor.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}>
                      {vendor.status === 'pending' ? 'Pending' : 'Processed'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      size="sm"
                      onClick={() => setPayoutConfirm(vendor.vendorId)}
                      disabled={vendor.status === 'processed'}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Process Payout
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Payout Confirmation Dialog */}
      <AlertDialog open={payoutConfirm !== null} onOpenChange={() => setPayoutConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Process Payout?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to process this payout? The vendor will receive the funds in their account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => payoutConfirm && handleProcessPayout(payoutConfirm)}
              className="bg-green-600 hover:bg-green-700"
            >
              Process Payout
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
