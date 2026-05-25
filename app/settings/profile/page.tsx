'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useNotifications } from '@/lib/context/NotificationContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Mail, Lock, Phone, Store } from 'lucide-react';

export default function ProfileSettingsPage() {
  const { user, updateUser } = useAuth();
  const { addToast } = useNotifications();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: (user as any)?.phone || '',
    storeName: (user as any)?.storeName || '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      addToast('Passwords do not match', 'error');
      return;
    }

    if (!formData.name || !formData.email) {
      addToast('Name and email are required', 'warning');
      return;
    }

    // Update user
    const updatedUser = {
      ...user,
      name: formData.name,
      email: formData.email,
      ...(user?.role === 'vendor' && { phone: formData.phone, storeName: formData.storeName }),
    };

    updateUser(updatedUser as any);
    addToast('Profile updated successfully!', 'success');
    setIsEditing(false);
    setFormData({
      ...formData,
      newPassword: '',
      confirmPassword: '',
    });
  };

  return (
    <ProtectedRoute>
      <div className="max-w-2xl">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        {/* Profile Avatar */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-semibold flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{user?.name}</p>
              <p className="text-gray-600">{user?.role?.charAt(0).toUpperCase()}{user?.role?.slice(1)} Account</p>
            </div>
          </div>
        </Card>

        {/* Edit Profile Form */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
            <Button
              variant={isEditing ? 'outline' : 'default'}
              onClick={() => setIsEditing(!isEditing)}
              className={isEditing ? '' : 'bg-green-600 hover:bg-green-700'}
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Full Name
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditing}
                className="bg-gray-50"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
                className="bg-gray-50"
              />
            </div>

            {/* Phone (Vendors Only) */}
            {user?.role === 'vendor' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                  className="bg-gray-50"
                  placeholder="+234..."
                />
              </div>
            )}

            {/* Store Name (Vendors Only) */}
            {user?.role === 'vendor' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Store className="w-4 h-4 inline mr-2" />
                  Store Name
                </label>
                <Input
                  type="text"
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                  disabled={!isEditing}
                  className="bg-gray-50"
                />
              </div>
            )}

            {/* Password Section (Only when editing) */}
            {isEditing && (
              <>
                <div className="border-t border-gray-200 pt-5">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Change Password (Optional)
                  </h4>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <Input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    placeholder="Leave empty to keep current password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <Input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                  />
                </div>
              </>
            )}

            {/* Save Button */}
            {isEditing && (
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                Save Changes
              </Button>
            )}
          </form>
        </Card>

        {/* Account Info */}
        <Card className="p-6 mt-6 bg-gray-50">
          <h3 className="font-semibold text-gray-900 mb-4">Account Information</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Account Type</span>
              <span className="font-medium text-gray-900">{user?.role?.charAt(0).toUpperCase()}{user?.role?.slice(1)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Account ID</span>
              <span className="font-mono text-gray-900">{user?.id}</span>
            </div>
            {user?.role === 'student' && (
              <div className="flex justify-between">
                <span className="text-gray-600">Matric Number</span>
                <span className="font-medium text-gray-900">{(user as any)?.matric}</span>
              </div>
            )}
          </div>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
