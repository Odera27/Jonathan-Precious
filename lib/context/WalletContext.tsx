'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Transaction, Student } from '@/lib/types';
import { mockStudents, mockTransactions } from '@/lib/mockData';

interface WalletContextType {
  walletBalance: number;
  transactions: Transaction[];
  topUpWallet: (amount: number, description: string) => void;
  deductFromWallet: (amount: number, description: string) => boolean;
  getTransactionHistory: (studentId: string) => Transaction[];
  getStudentWalletBalance: (studentId: string) => number;
  updateStudentBalance: (studentId: string, amount: number) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [studentsData, setStudentsData] = useState(mockStudents);

  // Load wallet data from localStorage on mount
  useEffect(() => {
    const savedStudents = localStorage.getItem('campusmart_students');
    if (savedStudents) {
      try {
        setStudentsData(JSON.parse(savedStudents));
      } catch (error) {
        console.error('[v0] Failed to parse students:', error);
      }
    }

    const savedTransactions = localStorage.getItem('campusmart_transactions');
    if (savedTransactions) {
      try {
        setTransactions(JSON.parse(savedTransactions));
      } catch (error) {
        console.error('[v0] Failed to parse transactions:', error);
      }
    }

    // Set initial balance from localStorage user
    const savedUser = localStorage.getItem('campusmart_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        if (user.role === 'student' && user.walletBalance) {
          setWalletBalance(user.walletBalance);
        }
      } catch (error) {
        console.error('[v0] Failed to get wallet balance:', error);
      }
    }
  }, []);

  const topUpWallet = (amount: number, description: string) => {
    const savedUser = localStorage.getItem('campusmart_user');
    if (!savedUser) return;

    try {
      const user = JSON.parse(savedUser);
      if (user.role !== 'student') return;

      const newBalance = walletBalance + amount;
      setWalletBalance(newBalance);

      // Update user in localStorage
      user.walletBalance = newBalance;
      localStorage.setItem('campusmart_user', JSON.stringify(user));

      // Add transaction
      const newTransaction: Transaction = {
        id: `txn-${Date.now()}`,
        studentId: user.id,
        type: 'credit',
        amount,
        description,
        date: new Date().toISOString().split('T')[0],
        balanceAfter: newBalance,
      };

      setTransactions(prev => [newTransaction, ...prev]);
      localStorage.setItem('campusmart_transactions', JSON.stringify([newTransaction, ...transactions]));

      // Update students data
      const updatedStudents = studentsData.map(s =>
        s.id === user.id ? { ...s, walletBalance: newBalance } : s
      );
      setStudentsData(updatedStudents);
      localStorage.setItem('campusmart_students', JSON.stringify(updatedStudents));
    } catch (error) {
      console.error('[v0] Failed to top up wallet:', error);
    }
  };

  const deductFromWallet = (amount: number, description: string): boolean => {
    if (walletBalance < amount) {
      return false;
    }

    const savedUser = localStorage.getItem('campusmart_user');
    if (!savedUser) return false;

    try {
      const user = JSON.parse(savedUser);
      if (user.role !== 'student') return false;

      const newBalance = walletBalance - amount;
      setWalletBalance(newBalance);

      // Update user in localStorage
      user.walletBalance = newBalance;
      localStorage.setItem('campusmart_user', JSON.stringify(user));

      // Add transaction
      const newTransaction: Transaction = {
        id: `txn-${Date.now()}`,
        studentId: user.id,
        type: 'debit',
        amount,
        description,
        date: new Date().toISOString().split('T')[0],
        balanceAfter: newBalance,
      };

      setTransactions(prev => [newTransaction, ...prev]);
      localStorage.setItem('campusmart_transactions', JSON.stringify([newTransaction, ...transactions]));

      // Update students data
      const updatedStudents = studentsData.map(s =>
        s.id === user.id ? { ...s, walletBalance: newBalance } : s
      );
      setStudentsData(updatedStudents);
      localStorage.setItem('campusmart_students', JSON.stringify(updatedStudents));

      return true;
    } catch (error) {
      console.error('[v0] Failed to deduct from wallet:', error);
      return false;
    }
  };

  const getTransactionHistory = (studentId: string): Transaction[] => {
    return transactions.filter(t => t.studentId === studentId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getStudentWalletBalance = (studentId: string): number => {
    const student = studentsData.find(s => s.id === studentId);
    return student?.walletBalance || 0;
  };

  const updateStudentBalance = (studentId: string, amount: number) => {
    const updatedStudents = studentsData.map(s =>
      s.id === studentId ? { ...s, walletBalance: amount } : s
    );
    setStudentsData(updatedStudents);
    localStorage.setItem('campusmart_students', JSON.stringify(updatedStudents));
  };

  const value: WalletContextType = {
    walletBalance,
    transactions,
    topUpWallet,
    deductFromWallet,
    getTransactionHistory,
    getStudentWalletBalance,
    updateStudentBalance,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};
