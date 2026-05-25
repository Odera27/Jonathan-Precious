'use client';

import React, { useMemo } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { mockProducts, mockInventoryForecast } from '@/lib/mockData';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, AlertCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function InventoryPredictionPage() {
  const { user } = useAuth();

  // Get vendor's products
  const vendorProducts = useMemo(() => {
    return mockProducts.filter(p => p.vendorId === user?.id);
  }, [user]);

  // Forecast data for a sample product
  const forecastData = mockInventoryForecast;

  // Create prediction table data
  const predictionTableData = vendorProducts.slice(0, 5).map(product => {
    const predictedDemandNext7Days = Math.floor(Math.random() * (product.stock - 5)) + 5;
    const recommendedReorder = Math.max(0, predictedDemandNext7Days - product.stock);
    const shouldReorder = recommendedReorder > 0;

    return {
      product: product.name,
      currentStock: product.stock,
      predictedDemand: predictedDemandNext7Days,
      recommendedReorder,
      shouldReorder,
    };
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Stock Forecast</h1>
        <p className="text-gray-600">AI-Powered inventory predictions</p>
      </div>

      {/* Info Card */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-900">Inventory Forecast</p>
            <p className="text-sm text-blue-800 mt-1">
              Based on historical sales data and market trends, our AI model predicts the next 7 days of demand.
            </p>
          </div>
        </div>
      </Card>

      {/* Stock Trend Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">7-Day Stock Trend & Predicted Demand</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={forecastData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="day" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#16a34a"
              strokeWidth={2}
              dot={{ fill: '#16a34a' }}
              name="Actual Stock"
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#2563eb"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#2563eb' }}
              name="Predicted Demand"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Prediction Table */}
      <Card>
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Reorder Recommendations</h3>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-gray-200 bg-gray-50">
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Current Stock</TableHead>
                <TableHead className="text-right">Predicted Demand (7d)</TableHead>
                <TableHead className="text-right">Recommended Reorder Qty</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {predictionTableData.map((item, idx) => (
                <TableRow key={idx} className="border-gray-200">
                  <TableCell className="font-medium text-gray-900">
                    {item.product}
                  </TableCell>
                  <TableCell className="text-right text-gray-700">
                    {item.currentStock} units
                  </TableCell>
                  <TableCell className="text-right text-gray-700">
                    {item.predictedDemand} units
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-semibold text-gray-900">
                      {item.recommendedReorder} units
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        item.shouldReorder
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }
                    >
                      {item.shouldReorder ? 'Reorder Now' : 'Sufficient'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Insights */}
      <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-900">Insight</p>
            <p className="text-sm text-amber-800 mt-2">
              Based on the forecast, you should prioritize reordering items with predicted demand exceeding current stock levels.
              Items marked "Reorder Now" should be restocked within the next 2-3 days to avoid stockouts.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
