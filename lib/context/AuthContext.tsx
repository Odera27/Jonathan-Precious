'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole, Student, Vendor, Admin } from '@/lib/types';
import { mockVendors, mockStudents } from '@/lib/mockData';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  register: (email: string, password: string, role: UserRole, name: string, phone?: string, storeName?: string, matric?: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('campusmart_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setRole(parsedUser.role);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('[v0] Failed to parse saved user:', error);
        localStorage.removeItem('campusmart_user');
      }
    }
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock authentication - check if user exists
    let foundUser: User | null = null;

    if (role === 'vendor') {
      foundUser = mockVendors.find(v => v.email === email) || null;
    } else if (role === 'student') {
      foundUser = mockStudents.find(s => s.email === email) || null;
    } else if (role === 'admin') {
      // Mock admin login
      if (email === 'admin@campus.com') {
        foundUser = {
          id: 'admin',
          name: 'Campus Admin',
          email: 'admin@campus.com',
          role: 'admin',
        } as Admin;
      }
    }

    if (foundUser) {
      setUser(foundUser);
      setRole(role);
      setIsAuthenticated(true);
      localStorage.setItem('campusmart_user', JSON.stringify(foundUser));
      return true;
    }

    return false;
  };

  const register = async (
    email: string,
    password: string,
    role: UserRole,
    name: string,
    phone?: string,
    storeName?: string,
    matric?: string
  ): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check if user already exists
    const allUsers = [...mockVendors, ...mockStudents];
    if (allUsers.find(u => u.email === email)) {
      return false;
    }

    // Create new user based on role
    let newUser: User;

    if (role === 'vendor') {
      newUser = {
        id: `vendor-${Date.now()}`,
        name,
        email,
        phone: phone || '',
        role: 'vendor',
        storeName: storeName || `${name}'s Store`,
        dateJoined: new Date().toISOString().split('T')[0],
        status: 'active',
      } as Vendor;
      mockVendors.push(newUser as Vendor);
    } else if (role === 'student') {
      newUser = {
        id: `student-${Date.now()}`,
        name,
        email,
        matric: matric || '',
        role: 'student',
        dateJoined: new Date().toISOString().split('T')[0],
        status: 'active',
        walletBalance: 0,
      } as Student;
      mockStudents.push(newUser as Student);
    } else {
      return false;
    }

    setUser(newUser);
    setRole(role);
    setIsAuthenticated(true);
    localStorage.setItem('campusmart_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem('campusmart_user');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('campusmart_user', JSON.stringify(updatedUser));
  };

  const value: AuthContextType = {
    user,
    role,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
