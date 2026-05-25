'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Notification } from '@/lib/types';
import { mockNotifications } from '@/lib/mockData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  toasts: Toast[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  addToast: (message: string, type: 'success' | 'error' | 'warning' | 'info', duration?: number) => void;
  markAsRead: (notificationId: string) => void;
  removeToast: (toastId: string) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Load notifications from localStorage
  useEffect(() => {
    const savedNotifications = localStorage.getItem('campusmart_notifications');
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (error) {
        console.error('[v0] Failed to parse notifications:', error);
      }
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('campusmart_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const addToast = (message: string, type: 'success' | 'error' | 'warning' | 'info', duration = 3000) => {
    const toastId = `toast-${Date.now()}`;
    const newToast: Toast = { id: toastId, message, type, duration };
    setToasts(prev => [...prev, newToast]);

    // Auto-remove toast after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toastId));
    }, duration);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const removeToast = (toastId: string) => {
    setToasts(prev => prev.filter(t => t.id !== toastId));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const value: NotificationContextType = {
    notifications,
    toasts,
    addNotification,
    addToast,
    markAsRead,
    removeToast,
    clearNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};
