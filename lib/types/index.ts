// User Types
export type UserRole = 'vendor' | 'student' | 'admin';

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'vendor';
  storeName: string;
  dateJoined: string;
  status: 'active' | 'suspended';
  profileImage?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  matric: string;
  role: 'student';
  dateJoined: string;
  status: 'active' | 'suspended';
  profileImage?: string;
  walletBalance: number;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'admin';
  profileImage?: string;
}

export type User = Vendor | Student | Admin;

// Product & Inventory
export type ProductCategory = 'Food' | 'Stationery' | 'Electronics' | 'Clothing' | 'Other';
export type ProductStatus = 'approved' | 'pending' | 'flagged' | 'removed';

export interface Product {
  id: string;
  vendorId: string;
  name: string;
  category: ProductCategory;
  price: number; // in ₦
  stock: number;
  barcode?: string;
  imageUrl: string;
  status: ProductStatus;
  dateAdded: string;
}

// Orders
export type OrderStatus = 'pending' | 'fulfilled' | 'cancelled';

export interface Order {
  id: string;
  studentId: string;
  vendorId: string;
  productId: string;
  productName: string;
  vendorName: string;
  quantity: number;
  total: number;
  date: string;
  status: OrderStatus;
}

// Cart Item
export interface CartItem {
  product: Product;
  vendor: Vendor;
  quantity: number;
}

// Wallet & Transactions
export type TransactionType = 'credit' | 'debit';

export interface Transaction {
  id: string;
  studentId: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
  balanceAfter: number;
}

// SMS Alert
export type AlertType = 'low_stock' | 'out_of_stock';
export type SMSStatus = 'sent' | 'failed';

export interface SMSAlert {
  id: string;
  vendorId: string;
  productId: string;
  productName: string;
  alertTime: string;
  alertType: AlertType;
  status: SMSStatus;
  phoneNumber: string;
}

// Notifications
export type NotificationType = 'low_stock' | 'new_order' | 'sms_delivery' | 'payout_processed' | 'product_approved' | 'user_suspended';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  icon?: string;
}

// Inventory Forecast
export interface InventoryForecast {
  day: string;
  actual: number;
  predicted: number;
}

// Dashboard Summary
export interface VendorSummary {
  totalProducts: number;
  lowStockItems: number;
  todaysSales: number;
  pendingOrders: number;
}

export interface StudentSummary {
  totalOrders: number;
  pendingOrders: number;
  walletBalance: number;
  lastOrderDate?: string;
}

export interface AdminSummary {
  totalVendors: number;
  totalStudents: number;
  totalOrdersToday: number;
  totalRevenue: number;
}
