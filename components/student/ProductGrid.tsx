'use client';

import React from 'react';
import { Product, Vendor } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';

interface ProductGridProps {
  products: Product[];
  vendors: { [key: string]: Vendor };
  onAddToCart: (product: Product, vendor: Vendor) => void;
}

export default function ProductGrid({ products, vendors, onAddToCart }: ProductGridProps) {
  const approvedProducts = products.filter(p => p.status === 'approved');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {approvedProducts.map(product => {
        const vendor = vendors[product.vendorId];
        return (
          <Card
            key={product.id}
            className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Product Image */}
            <div className="relative w-full h-40 bg-gray-100 overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              {product.stock <= 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <p className="text-white font-semibold text-sm">Out of Stock</p>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col flex-1 p-4">
              <p className="text-xs text-gray-500 mb-1">{product.category}</p>
              <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
                {product.name}
              </h3>
              <p className="text-xs text-gray-600 mb-3">{vendor?.storeName || 'Unknown Store'}</p>

              {/* Price & Stock */}
              <div className="flex items-center justify-between mb-3 mt-auto">
                <p className="text-lg font-bold text-green-600">₦{product.price.toLocaleString()}</p>
                <Badge
                  variant={product.stock > 5 ? 'default' : product.stock > 0 ? 'secondary' : 'destructive'}
                  className="text-xs"
                >
                  {product.stock > 0 ? (product.stock <= 5 ? 'Low Stock' : 'In Stock') : 'Out of Stock'}
                </Badge>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={() => onAddToCart(product, vendor)}
                disabled={product.stock <= 0}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm h-9"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </Card>
        );
      })}

      {approvedProducts.length === 0 && (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500">No products found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}
