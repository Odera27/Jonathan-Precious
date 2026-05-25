'use client';

import React, { useState } from 'react';
import { Vendor, Student } from '@/lib/types';
import { mockVendors, mockStudents } from '@/lib/mockData';
import { useNotifications } from '@/lib/context/NotificationContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Lock, Unlock } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function AdminUsersPage() {
  const [vendors, setVendors] = useState(mockVendors);
  const [students, setStudents] = useState(mockStudents);
  const [selectedTab, setSelectedTab] = useState('vendors');
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'vendor' | 'student'; id: string } | null>(null);
  const { addToast } = useNotifications();

  const handleSuspendVendor = (id: string) => {
    setVendors(vendors.map(v => {
      if (v.id === id) {
        return { ...v, status: v.status === 'active' ? 'suspended' : 'active' };
      }
      return v;
    }));
    const vendor = vendors.find(v => v.id === id);
    addToast(
      `${vendor?.name} has been ${vendor?.status === 'active' ? 'suspended' : 'activated'}`,
      'success'
    );
  };

  const handleDeleteVendor = (id: string) => {
    setVendors(vendors.filter(v => v.id !== id));
    setDeleteConfirm(null);
    addToast('Vendor deleted', 'success');
  };

  const handleSuspendStudent = (id: string) => {
    setStudents(students.map(s => {
      if (s.id === id) {
        return { ...s, status: s.status === 'active' ? 'suspended' : 'active' };
      }
      return s;
    }));
    const student = students.find(s => s.id === id);
    addToast(
      `${student?.name} has been ${student?.status === 'active' ? 'suspended' : 'activated'}`,
      'success'
    );
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
    setDeleteConfirm(null);
    addToast('Student deleted', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600">Manage vendors and students on the platform</p>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-2 bg-gray-100">
          <TabsTrigger value="vendors" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            Vendors ({vendors.length})
          </TabsTrigger>
          <TabsTrigger value="students" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            Students ({students.length})
          </TabsTrigger>
        </TabsList>

        {/* Vendors Tab */}
        <TabsContent value="vendors" className="mt-6">
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-gray-200 bg-gray-50">
                    <TableHead>Name</TableHead>
                    <TableHead>Store Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendors.map(vendor => (
                    <TableRow key={vendor.id} className="border-gray-200">
                      <TableCell className="font-medium text-gray-900">
                        {vendor.name}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {vendor.storeName}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {vendor.email}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {vendor.phone}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {new Date(vendor.dateJoined).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={vendor.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                        >
                          {vendor.status === 'active' ? 'Active' : 'Suspended'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSuspendVendor(vendor.id)}
                          className={vendor.status === 'active' ? 'text-red-600 border-red-200 hover:bg-red-50' : 'text-green-600 border-green-200 hover:bg-green-50'}
                        >
                          {vendor.status === 'active' ? (
                            <>
                              <Lock className="w-4 h-4 mr-1" />
                              Suspend
                            </>
                          ) : (
                            <>
                              <Unlock className="w-4 h-4 mr-1" />
                              Activate
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDeleteConfirm({ type: 'vendor', id: vendor.id })}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students" className="mt-6">
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-gray-200 bg-gray-50">
                    <TableHead>Name</TableHead>
                    <TableHead>Matric Number</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Wallet Balance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map(student => (
                    <TableRow key={student.id} className="border-gray-200">
                      <TableCell className="font-medium text-gray-900">
                        {student.name}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-gray-700">
                        {student.matric}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {student.email}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {new Date(student.dateJoined).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-semibold text-green-600">
                        ₦{student.walletBalance.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                        >
                          {student.status === 'active' ? 'Active' : 'Suspended'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSuspendStudent(student.id)}
                          className={student.status === 'active' ? 'text-red-600 border-red-200 hover:bg-red-50' : 'text-green-600 border-green-200 hover:bg-green-50'}
                        >
                          {student.status === 'active' ? (
                            <>
                              <Lock className="w-4 h-4 mr-1" />
                              Suspend
                            </>
                          ) : (
                            <>
                              <Unlock className="w-4 h-4 mr-1" />
                              Activate
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDeleteConfirm({ type: 'student', id: student.id })}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The user account and all associated data will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteConfirm?.type === 'vendor') {
                  handleDeleteVendor(deleteConfirm.id);
                } else if (deleteConfirm?.type === 'student') {
                  handleDeleteStudent(deleteConfirm.id);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
