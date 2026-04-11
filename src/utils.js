// Constants
export const INITIAL_PRODUCTS = [
  { id: 1, customId: 'GAS01', name: 'LPG 3kg', category: 'Gas', price: 20000, cost: 18000, stock: 50, image: 'https://images.unsplash.com/photo-1635335279970-ca72aa3d3c93?w=400&q=80' },
  { id: 2, customId: 'LE01', name: 'Le Minerale 15L', category: 'Galon', price: 22000, cost: 17000, stock: 30, image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=200' },
  { id: 3, customId: 'AQ01', name: 'Aqua Gallon', category: 'Galon', price: 19000, cost: 15000, stock: 40, image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=200' },
];

export const INITIAL_USERS = [
  { id: 1, name: 'Admin Utama', username: 'admin', password: '123', permissions: ['dashboard', 'transactions', 'products', 'finance', 'profit_report', 'balance_report', 'settings', 'users'] },
];

export const INITIAL_SETTINGS = {
  martName: 'Kamila Mart',
  adminPhone: '6281936617426',
  bankName: 'BCA',
  bankAccountName: 'Kamila Mart Admin',
  bankAccountNumber: '1234567890',
  internalPercent: 40,
  marbotSource: 'cod',
  musholaSource: 'cod',
  internalSource: 'transfer'
};

export const MENU_OPTIONS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { id: 'transactions', label: 'Transaksi', icon: 'ShoppingCart' },
  { id: 'products', label: 'Produk & Stok', icon: 'Package' },
  { id: 'finance', label: 'Manajemen Keuangan', icon: 'DollarSign' },
  { id: 'profit_report', label: 'Laporan Keuntungan', icon: 'FileText' },
  { id: 'balance_report', label: 'Laporan Balance', icon: 'TrendingUp' },
  { id: 'users', label: 'Manajemen User', icon: 'Users' },
  { id: 'settings', label: 'Pengaturan', icon: 'Settings' },
];

export const UI_RADIUS = {
  outer: 'rounded-2xl',
  inner: 'rounded-xl',
  full: 'rounded-full'
};

export const UI_SPACING = {
  page: 'p-6 md:p-14',
  section: 'space-y-8',
  card: 'p-8',
  gap: 'gap-6'
};

export const UI_TEXT = {
  h1: 'text-2xl md:text-3xl font-black text-slate-900 tracking-tighter',
  h2: 'text-xl font-extrabold text-slate-900 tracking-tight',
  h3: 'text-base font-bold text-slate-800',
  body: 'text-sm text-slate-600 font-medium',
  label: 'text-[10px] font-bold text-slate-400 uppercase tracking-widest',
  caption: 'text-xs text-slate-500'
};

export const UI_BUTTON = {
  base: 'px-6 py-3.5 font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2',
  primary: 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 disabled:opacity-50',
  secondary: 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm',
  danger: 'bg-rose-50 text-rose-600 hover:bg-rose-100',
  ghost: 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900'
};

// Utility Functions
export const formatIDR = (amount) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
