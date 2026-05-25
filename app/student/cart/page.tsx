'use client';

import React, { useState, useEffect } from 'react';
import { CartItem, Order } from '@/lib/types';
import { useWallet } from '@/lib/context/WalletContext';
import { useNotifications } from '@/lib/context/NotificationContext';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Image from 'next/image';

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { walletBalance, deductFromWallet, addNotification } = useWallet();
  const { addToast } = useNotifications();
  const { user } = useAuth();
  const router = useRouter();

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('campusmart_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('[v0] Failed to load cart:', error);
      }
    }
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
    } else {
      const updatedCart = cart.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      setCart(updatedCart);
      localStorage.setItem('campusmart_cart', JSON.stringify(updatedCart));
    }
  };

  const removeItem = (productId: string) => {
    const updatedCart = cart.filter(item => item.product.id !== productId);
    setCart(updatedCart);
    localStorage.setItem('campusmart_cart', JSON.stringify(updatedCart));
    addToast('Item removed from cart', 'info');
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      addToast('Cart is empty', 'warning');
      return;
    }

    if (walletBalance < subtotal) {
      addToast('Insufficient wallet balance', 'error');
      return;
    }

    // Deduct from wallet
    const success = deductFromWallet(subtotal, `Purchase: ${cart.length} item(s)`);

    if (success && user && user.role === 'student') {
      // Create orders for each vendor
      const orders: Order[] = cart.map(item => ({
        id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        studentId: user.id,
        vendorId: item.vendor.id,
        productId: item.product.id,
        productName: item.product.name,
        vendorName: item.vendor.storeName,
        quantity: item.quantity,
        total: item.product.price * item.quantity,
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
      }));

      // Save orders to localStorage
      const savedOrders = JSON.parse(localStorage.getItem('campusmart_orders') || '[]');
      localStorage.setItem('campusmart_orders', JSON.stringify([...savedOrders, ...orders]));

      // Add notifications
      orders.forEach(order => {
        addNotification({
          userId: user.id,
          type: 'new_order',
          title: 'Order Confirmed',
          message: `Your order for ${order.productName} has been placed`,
          timestamp: new Date().toISOString(),
          read: false,
        });
      });

      // Clear cart
      setCart([]);
      localStorage.removeItem('campusmart_cart');

      addToast('Order placed successfully!', 'success');
      setShowConfirmation(true);

      // Redirect after 2 seconds
      setTimeout(() => {
        setShowConfirmation(false);
        router.push('/student/my-orders');
      }, 2000);
    }
  };

  return (
    <div className="max-w-4xl">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <p className="text-gray-600">Review your items before checkout</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          {cart.length > 0 ? (
            <Card className="divide-y">
              {cart.map(item => (
                <div key={item.product.id} className="p-4 flex gap-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.vendor.storeName}</p>
                    <p className="text-lg font-bold text-green-600">
                      ₦{item.product.price.toLocaleString()}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-100"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-sm font-semibold text-gray-900">
                      ₦{(item.product.price * item.quantity).toLocaleString()}
                    </p>

                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </Card>
          ) : (
            <Card className="p-12 text-center">
              <ShoppingCart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">Your cart is empty</p>
              <Button
                onClick={() => router.push('/student')}
                className="bg-green-600 hover:bg-green-700"
              >
                Continue Shopping
              </Button>
            </Card>
          )}
        </div>

        {/* Summary & Checkout */}
        <div>
          <Card className="p-6 sticky top-24 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>

            {/* Wallet Balance */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Wallet Balance</p>
              <p className="text-2xl font-bold text-blue-600">₦{walletBalance.toLocaleString()}</p>
            </div>

            {/* Subtotal */}
            <div className="space-y-2 border-t border-b border-gray-200 py-4">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Delivery Fee</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-lg pt-2">
                <span>Total</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Status & Button */}
            {cart.length > 0 && (
              <>
                {walletBalance < subtotal && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    Insufficient wallet balance. Please top up your wallet.
                  </div>
                )}
                <Button
                  onClick={handleCheckout}
                  disabled={cart.length === 0 || walletBalance < subtotal}
                  className="w-full bg-green-600 hover:bg-green-700 text-white h-12"
                >
                  Pay with Wallet
                </Button>
              </>
            )}

            <Button
              variant="outline"
              onClick={() => router.push('/student')}
              className="w-full"
            >
              Continue Shopping
            </Button>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Confirmed!</DialogTitle>
            <DialogDescription>
              Your order has been placed successfully. You&apos;ll be redirected to your orders page.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
