// Constants
export const INITIAL_PRODUCTS = [
  { id: 1, name: 'LPG 3kg', price: 20000, cost: 18000, stock: 50, image: 'https://images.unsplash.com/photo-1635335279970-ca72aa3d3c93?w=400&q=80' },
  { id: 2, name: 'Le Minerale 15L', price: 22000, cost: 17000, stock: 30, image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=200' },
  { id: 3, name: 'Aqua Gallon', price: 19000, cost: 15000, stock: 40, image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=200' },
];

export const INITIAL_USERS = [
  { id: 1, name: 'Admin Utama', username: 'admin', password: '123', permissions: ['dashboard', 'transactions', 'products', 'finance', 'profit_report', 'settings', 'users'] },
];

export const INITIAL_SETTINGS = {
  martName: 'Kamila Mart',
  adminPhone: '6281936617426',
  bankName: 'BCA',
  bankAccountName: 'Kamila Mart Admin',
  bankAccountNumber: '1234567890'
};

export const MENU_OPTIONS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { id: 'transactions', label: 'Transaksi', icon: 'ShoppingCart' },
  { id: 'products', label: 'Produk & Stok', icon: 'Package' },
  { id: 'finance', label: 'Manajemen Keuangan', icon: 'DollarSign' },
  { id: 'profit_report', label: 'Laporan Keuntungan', icon: 'FileText' },
  { id: 'users', label: 'Manajemen User', icon: 'Users' },
  { id: 'settings', label: 'Pengaturan', icon: 'Settings' },
];

export const UI_RADIUS = {
  outer: 'rounded-2xl',
  inner: 'rounded-xl',
  full: 'rounded-full'
};

// Utility Functions
export const formatIDR = (amount) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
