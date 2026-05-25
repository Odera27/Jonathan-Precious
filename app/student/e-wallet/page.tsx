'use client';

import React, { useState, useEffect } from 'react';
import { Transaction } from '@/lib/types';
import { useWallet } from '@/lib/context/WalletContext';
import { useNotifications } from '@/lib/context/NotificationContext';
import { useAuth } from '@/lib/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Wallet, TrendingUp, TrendingDown, Plus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function EWalletPage() {
  const { walletBalance, topUpWallet, transactions } = useWallet();
  const { addToast } = useNotifications();
  const { user } = useAuth();
  const [topUpAmount, setTopUpAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTopUpDialog, setShowTopUpDialog] = useState(false);
  const [userTransactions, setUserTransactions] = useState<Transaction[]>([]);

  // Load user transactions
  useEffect(() => {
    if (user && user.role === 'student') {
      const userTxns = transactions.filter(t => t.studentId === user.id);
      setUserTransactions(userTxns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
  }, [user, transactions]);

  const handleTopUp = async () => {
    if (!topUpAmount || parseFloat(topUpAmount) <= 0) {
      addToast('Please enter a valid amount', 'warning');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    const amount = parseFloat(topUpAmount);
    topUpWallet(amount, 'Wallet Top-up');

    addToast('Wallet topped up successfully!', 'success');
    setTopUpAmount('');
    setShowTopUpDialog(false);
    setIsProcessing(false);
  };

  const handlePaystackPayment = async () => {
    if (!topUpAmount || parseFloat(topUpAmount) <= 0) {
      addToast('Please enter a valid amount', 'warning');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    addToast('Processing payment with Paystack...', 'info');
    await new Promise(resolve => setTimeout(resolve, 2000));

    const amount = parseFloat(topUpAmount);
    topUpWallet(amount, 'Wallet Top-up via Paystack');

    addToast('Payment successful!', 'success');
    setTopUpAmount('');
    setShowTopUpDialog(false);
    setIsProcessing(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">E-Wallet</h1>
        <p className="text-gray-600">Manage your campus wallet balance</p>
      </div>

      {/* Wallet Balance Card */}
      <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-8 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-blue-100 text-sm mb-2">Current Balance</p>
            <h2 className="text-4xl font-bold">₦{walletBalance.toLocaleString()}</h2>
          </div>
          <Wallet className="w-16 h-16 opacity-50" />
        </div>

        <Dialog open={showTopUpDialog} onOpenChange={setShowTopUpDialog}>
          <DialogTrigger asChild>
            <Button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold">
              <Plus className="w-4 h-4 mr-2" />
              Top Up Wallet
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Top Up Your Wallet</DialogTitle>
              <DialogDescription>
                Add funds to your CampusMart wallet for seamless shopping
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₦)
                </label>
                <Input
                  type="number"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="100"
                  max="100000"
                  disabled={isProcessing}
                />
                <p className="text-xs text-gray-500 mt-1">Minimum: ₦100 | Maximum: ₦100,000</p>
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[1000, 2500, 5000, 10000].map(amount => (
                  <button
                    key={amount}
                    onClick={() => setTopUpAmount(amount.toString())}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700"
                  >
                    ₦{(amount / 1000).toFixed(0)}K
                  </button>
                ))}
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <Button
                  onClick={handlePaystackPayment}
                  disabled={!topUpAmount || isProcessing}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isProcessing ? 'Processing...' : 'Pay with Paystack'}
                </Button>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
                <p className="font-medium mb-1">Test Card Details:</p>
                <p>Card: 4084084084084081 | CVV: 408 | Exp: Any future date</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </Card>

      {/* Transaction History */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Transaction History</h3>
        </div>

        {userTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-gray-200">
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Balance After</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userTransactions.map(transaction => (
                  <TableRow key={transaction.id} className="border-gray-200">
                    <TableCell className="font-medium">
                      {new Date(transaction.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      <Badge
                        variant={transaction.type === 'credit' ? 'default' : 'secondary'}
                        className={transaction.type === 'credit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                      >
                        {transaction.type === 'credit' ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className={`text-right font-semibold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'credit' ? '+' : '-'}₦{transaction.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ₦{transaction.balanceAfter.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Wallet className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No transactions yet</p>
          </div>
        )}
      </Card>
    </div>
  );
}
