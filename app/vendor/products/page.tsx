'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Product, ProductCategory } from '@/lib/types';
import { useAuth } from '@/lib/context/AuthContext';
import { useNotifications } from '@/lib/context/NotificationContext';
import { mockProducts } from '@/lib/mockData';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Edit2, Trash2, Plus, Barcode, AlertTriangle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const categories: ProductCategory[] = ['Food', 'Stationery', 'Electronics', 'Clothing', 'Other'];

export default function VendorProductsPage() {
  const { user } = useAuth();
  const { addToast } = useNotifications();
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Food' as ProductCategory,
    price: '',
    stock: '',
    barcode: '',
    imageUrl: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=500&h=500&fit=crop',
  });

  // Load vendor's products
  useEffect(() => {
    const vendorProds = mockProducts.filter(p => p.vendorId === user?.id);
    setProducts(vendorProds);
  }, [user]);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.stock) {
      addToast('Please fill all required fields', 'warning');
      return;
    }

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      vendorId: user?.id || '',
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      barcode: formData.barcode || undefined,
      imageUrl: formData.imageUrl,
      status: 'approved',
      dateAdded: new Date().toISOString().split('T')[0],
    };

    setProducts([...products, newProduct]);
    mockProducts.push(newProduct);

    addToast(`${formData.name} added successfully!`, 'success');
    setIsAddDialogOpen(false);
    setFormData({
      name: '',
      category: 'Food',
      price: '',
      stock: '',
      barcode: '',
      imageUrl: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=500&h=500&fit=crop',
    });
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    const index = mockProducts.findIndex(p => p.id === id);
    if (index > -1) mockProducts.splice(index, 1);
    addToast('Product deleted', 'info');
  };

  const handleBarcodeSimulation = (productId: string) => {
    setProducts(products.map(p => {
      if (p.id === productId && p.stock > 0) {
        return { ...p, stock: p.stock - 1 };
      }
      return p;
    }));
    addToast('Barcode scan simulated - Stock reduced by 1', 'success');
  };

  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 5);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Add a new product to your store inventory
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAddProduct} className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Indomie Noodles"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <Select value={formData.category} onValueChange={(value: any) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₦) *
                </label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g., 200"
                  min="1"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity *
                </label>
                <Input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="e.g., 50"
                  min="0"
                />
              </div>

              {/* Barcode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Barcode (Optional)
                </label>
                <Input
                  value={formData.barcode}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                  placeholder="e.g., 123456789001"
                />
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                Add Product
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Card className="p-4 bg-amber-50 border-amber-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900">Low Stock Alert</p>
              <p className="text-sm text-amber-800 mt-1">
                {lowStockProducts.length} product{lowStockProducts.length > 1 ? 's' : ''} {lowStockProducts.length > 1 ? 'are' : 'is'} running low on stock
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Products Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-gray-200 bg-gray-50">
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length > 0 ? (
                products.map(product => (
                  <TableRow key={product.id} className="border-gray-200">
                    <TableCell className="font-medium text-gray-900">
                      {product.name}
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-right font-semibold text-green-600">
                      ₦{product.price.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">{product.stock}</TableCell>
                    <TableCell>
                      <Badge
                        variant={product.stock > 5 ? 'default' : product.stock > 0 ? 'secondary' : 'destructive'}
                        className={
                          product.stock > 5
                            ? 'bg-green-100 text-green-800'
                            : product.stock > 0
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }
                      >
                        {product.stock > 5 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleBarcodeSimulation(product.id)}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        <Barcode className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No products yet. Add your first product!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
