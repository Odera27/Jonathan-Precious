'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import {
  BarChart3,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Package,
  TrendingUp,
  MessageSquare,
  Wallet,
  ClipboardList,
  DollarSign,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const { role, logout } = useAuth();
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const getLinkClass = (href: string) => {
    const base = 'flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors';
    const active = 'bg-green-100 text-green-700';
    const inactive = 'text-gray-700 hover:bg-gray-100';
    return isActive(href) ? `${base} ${active}` : `${base} ${inactive}`;
  };

  const vendorLinks = [
    { href: '/vendor', label: 'Overview', icon: BarChart3 },
    { href: '/vendor/products', label: 'Products', icon: Package },
    { href: '/vendor/inventory-prediction', label: 'Inventory Forecast', icon: TrendingUp },
    { href: '/vendor/orders', label: 'Orders', icon: ClipboardList },
    { href: '/vendor/sms-alerts', label: 'SMS Alerts', icon: MessageSquare },
  ];

  const studentLinks = [
    { href: '/student', label: 'Marketplace', icon: ShoppingCart },
    { href: '/student/cart', label: 'Cart', icon: ShoppingCart },
    { href: '/student/e-wallet', label: 'E-Wallet', icon: Wallet },
    { href: '/student/my-orders', label: 'My Orders', icon: ClipboardList },
  ];

  const adminLinks = [
    { href: '/admin', label: 'Overview', icon: BarChart3 },
    { href: '/admin/users', label: 'User Management', icon: Users },
    { href: '/admin/products', label: 'Product Moderation', icon: Package },
    { href: '/admin/finance', label: 'Finance', icon: DollarSign },
  ];

  const links = role === 'vendor' ? vendorLinks : role === 'admin' ? adminLinks : studentLinks;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 overflow-y-auto transition-transform duration-300 ease-in-out md:static md:translate-x-0 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 md:hidden flex items-center justify-between">
          <span className="font-bold text-gray-900">Navigation</span>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-2">
          {links.map(link => {
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href} className={getLinkClass(link.href)}>
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="mx-4 my-4 border-t border-gray-200" />

        {/* Settings & Logout */}
        <nav className="p-4 space-y-2">
          <Link href="/settings/profile" className={getLinkClass('/settings/profile')}>
            <Settings className="w-5 h-5 flex-shrink-0" />
            <span>Settings</span>
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </>
  );
}
