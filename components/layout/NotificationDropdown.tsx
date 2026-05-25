'use client';

import React from 'react';
import { useNotifications } from '@/lib/context/NotificationContext';
import { Bell, AlertCircle, CheckCircle, Package, DollarSign, X } from 'lucide-react';

interface NotificationDropdownProps {
  onClose: () => void;
}

export default function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const { notifications, markAsRead } = useNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'low_stock':
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      case 'new_order':
        return <Package className="w-4 h-4 text-blue-600" />;
      case 'payout_processed':
        return <DollarSign className="w-4 h-4 text-green-600" />;
      case 'product_approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'user_suspended':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className="absolute top-full right-0 mt-2 w-96 max-h-[500px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Notifications</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded transition"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Notifications List */}
      <div className="overflow-y-auto flex-1">
        {recentNotifications.length > 0 ? (
          recentNotifications.map(notif => (
            <div
              key={notif.id}
              className={`p-3 border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer ${
                !notif.read ? 'bg-blue-50' : ''
              }`}
              onClick={() => markAsRead(notif.id)}
            >
              <div className="flex gap-3">
                <div className="mt-1">
                  {getNotificationIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm">{notif.title}</p>
                  <p className="text-sm text-gray-600 line-clamp-2">{notif.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatTime(notif.timestamp)}</p>
                </div>
                {!notif.read && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No notifications yet</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {recentNotifications.length > 0 && (
        <div className="p-3 border-t border-gray-200 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            See All Notifications
          </button>
        </div>
      )}
    </div>
  );
}
