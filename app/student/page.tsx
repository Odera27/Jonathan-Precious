'use client';

import React, { useState, useMemo } from 'react';
import { mockProducts, mockVendors } from '@/lib/mockData';
import { Product, ProductCategory, Vendor } from '@/lib/types';
import { useNotifications } from '@/lib/context/NotificationContext';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import ProductGrid from '@/components/student/ProductGrid';

const categories: ProductCategory[] = ['Food', 'Stationery', 'Electronics', 'Clothing', 'Other'];

export default function StudentMarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const { addToast } = useNotifications();
  const router = useRouter();

  // Create vendor map for quick lookup
  const vendorMap = useMemo(() => {
    const map: { [key: string]: Vendor } = {};
    mockVendors.forEach(vendor => {
      map[vendor.id] = vendor;
    });
    return map;
  }, []);

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return mockProducts.filter(product => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (vendorMap[product.vendorId]?.storeName || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, vendorMap]);

  const handleAddToCart = (product: Product, vendor: Vendor) => {
    // Get or initialize cart from localStorage
    const cart = JSON.parse(localStorage.getItem('campusmart_cart') || '[]');

    // Check if product is already in cart
    const existingItem = cart.find((item: any) => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        product,
        vendor,
        quantity: 1,
      });
    }

    localStorage.setItem('campusmart_cart', JSON.stringify(cart));
    addToast(`${product.name} added to cart!`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Campus Marketplace</h1>
        <p className="text-gray-600">Discover products from campus vendors</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search products or vendors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white"
        />
      </div>

      {/* Category Filters */}
      <Tabs value={selectedCategory} onValueChange={(value: any) => setSelectedCategory(value)}>
        <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 bg-gray-100 p-0 h-auto">
          <TabsTrigger value="All" className="rounded-none first:rounded-l-lg last:rounded-r-lg data-[state=active]:bg-green-600 data-[state=active]:text-white">
            All
          </TabsTrigger>
          {categories.map(cat => (
            <TabsTrigger
              key={cat}
              value={cat}
              className="rounded-none data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory || 'All'} className="mt-6">
          <ProductGrid
            products={filteredProducts}
            vendors={vendorMap}
            onAddToCart={handleAddToCart}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
