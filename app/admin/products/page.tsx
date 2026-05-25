'use client';

import React, { useState } from 'react';
import { Product } from '@/lib/types';
import { mockProducts, mockVendors } from '@/lib/mockData';
import { useNotifications } from '@/lib/context/NotificationContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function AdminProductsPage() {
  const [products, setProducts] = useState(mockProducts);
  const { addToast } = useNotifications();

  const vendorMap = mockVendors.reduce((acc, v) => ({ ...acc, [v.id]: v }), {} as Record<string, any>);

  const handleApproveProduct = (id: string) => {
    setProducts(products.map(p =>
      p.id === id ? { ...p, status: 'approved' as const } : p
    ));
    addToast('Product approved', 'success');
  };

  const handleFlagProduct = (id: string) => {
    setProducts(products.map(p =>
      p.id === id ? { ...p, status: 'flagged' as const } : p
    ));
    addToast('Product flagged for review', 'warning');
  };

  const handleRemoveProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    addToast('Product removed', 'success');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'flagged':
        return 'bg-amber-100 text-amber-800';
      case 'removed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'flagged':
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Product Moderation</h1>
        <p className="text-gray-600">Review and manage all products on the platform</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-green-50 border-green-200">
          <p className="text-sm text-gray-600">Approved</p>
          <p className="text-2xl font-bold text-green-700">{products.filter(p => p.status === 'approved').length}</p>
        </Card>
        <Card className="p-4 bg-blue-50 border-blue-200">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-blue-700">{products.filter(p => p.status === 'pending').length}</p>
        </Card>
        <Card className="p-4 bg-amber-50 border-amber-200">
          <p className="text-sm text-gray-600">Flagged</p>
          <p className="text-2xl font-bold text-amber-700">{products.filter(p => p.status === 'flagged').length}</p>
        </Card>
        <Card className="p-4 bg-red-50 border-red-200">
          <p className="text-sm text-gray-600">Removed</p>
          <p className="text-2xl font-bold text-red-700">{products.filter(p => p.status === 'removed').length}</p>
        </Card>
      </div>

      {/* Products Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-gray-200 bg-gray-50">
                <TableHead>Product</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead>Added</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map(product => {
                const vendor = vendorMap[product.vendorId];
                return (
                  <TableRow key={product.id} className="border-gray-200">
                    <TableCell className="font-medium text-gray-900">
                      {product.name}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {vendor?.storeName || 'Unknown'}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {product.category}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-green-600">
                      ₦{product.price.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-gray-700">
                      {product.stock}
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm">
                      {new Date(product.dateAdded).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(product.status)}>
                        {getStatusIcon(product.status)}
                        <span className="ml-1">
                          {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center space-x-1">
                      {product.status !== 'approved' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApproveProduct(product.id)}
                          className="text-green-600 border-green-200 hover:bg-green-50"
                        >
                          Approve
                        </Button>
                      )}
                      {product.status !== 'flagged' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleFlagProduct(product.id)}
                          className="text-amber-600 border-amber-200 hover:bg-amber-50"
                        >
                          Flag
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveProduct(product.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
