'use client';

import React, { useState, useEffect } from 'react';
import { SMSAlert } from '@/lib/types';
import { useAuth } from '@/lib/context/AuthContext';
import { useNotifications } from '@/lib/context/NotificationContext';
import { mockSMSAlerts } from '@/lib/mockData';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, Bell, CheckCircle, AlertTriangle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function SMSAlertsPage() {
  const { user } = useAuth();
  const { addToast } = useNotifications();
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [stockThreshold, setStockThreshold] = useState('5');
  const [alerts, setAlerts] = useState<SMSAlert[]>(mockSMSAlerts.filter(a => a.vendorId === user?.id));

  const handleToggleAlerts = async (enabled: boolean) => {
    setAlertsEnabled(enabled);
    if (enabled) {
      addToast('SMS alerts enabled', 'success');
    } else {
      addToast('SMS alerts disabled', 'info');
    }
  };

  const handleSendTestSMS = async () => {
    if (!user || user.role !== 'vendor') return;

    const phone = (user as any).phone;
    if (!phone) {
      addToast('Phone number not found. Please update your profile.', 'error');
      return;
    }

    addToast('Sending test SMS...', 'info');

    // Simulate SMS sending
    setTimeout(() => {
      const testAlert: SMSAlert = {
        id: `alert-${Date.now()}`,
        vendorId: user.id,
        productId: 'test-prod',
        productName: 'Test Product',
        alertTime: new Date().toLocaleString(),
        alertType: 'low_stock',
        status: 'sent',
        phoneNumber: phone,
      };

      setAlerts([testAlert, ...alerts]);
      addToast('Test SMS sent successfully!', 'success');
    }, 1000);
  };

  const getAlertIcon = (status: string) => {
    return status === 'sent' ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <AlertTriangle className="w-4 h-4 text-red-600" />
    );
  };

  const getStatusColor = (status: string) => {
    return status === 'sent'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">SMS Alerts</h1>
        <p className="text-gray-600">Receive real-time SMS notifications for inventory changes</p>
      </div>

      {/* Alert Settings Card */}
      <Card className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Alert Settings</h3>

          {/* Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Low Stock SMS Alerts</p>
                <p className="text-sm text-gray-600">Get notified when inventory runs low</p>
              </div>
            </div>
            <Switch
              checked={alertsEnabled}
              onCheckedChange={handleToggleAlerts}
            />
          </div>

          {/* Stock Threshold */}
          <div className={`p-4 border border-gray-200 rounded-lg ${!alertsEnabled ? 'opacity-50' : ''}`}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Threshold (Units)
            </label>
            <p className="text-xs text-gray-600 mb-3">
              You&apos;ll receive an SMS when product stock falls below this level
            </p>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                value={stockThreshold}
                onChange={(e) => setStockThreshold(e.target.value)}
                min="1"
                max="100"
                disabled={!alertsEnabled}
                className="w-20"
              />
              <span className="text-sm text-gray-600">units</span>
              <Button
                onClick={handleSendTestSMS}
                variant="outline"
                size="sm"
                disabled={!alertsEnabled}
                className="ml-auto"
              >
                Send Test SMS
              </Button>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Real SMS Integration</p>
            <p>
              SMS alerts are sent via Termii API. To enable real SMS delivery, configure your Termii API key in environment variables.
            </p>
          </div>
        </div>
      </Card>

      {/* Alert History */}
      <Card>
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Alert History</h3>
        </div>

        {alerts.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-gray-200 bg-gray-50">
                  <TableHead>Product</TableHead>
                  <TableHead>Alert Time</TableHead>
                  <TableHead>Alert Type</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map(alert => (
                  <TableRow key={alert.id} className="border-gray-200">
                    <TableCell className="font-medium text-gray-900">
                      {alert.productName}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {alert.alertTime}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                        {alert.alertType === 'low_stock' ? 'Low Stock' : 'Out of Stock'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm text-gray-700">
                      {alert.phoneNumber}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(alert.status)}>
                        {getAlertIcon(alert.status)}
                        <span className="ml-1">
                          {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                        </span>
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No alerts yet</p>
          </div>
        )}
      </Card>
    </div>
  );
}
