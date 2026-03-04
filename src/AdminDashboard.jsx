import React, { useState, useMemo, useRef } from 'react';
import { 
  LayoutDashboard, Package, ShoppingCart, Settings, Menu, LogOut, User, 
  Edit, TrendingUp, CreditCard, Eye, X, Calendar, DollarSign, PieChart, 
  ArrowUpRight, ArrowDownRight, Camera, Image as ImageIcon, Trash2, Phone,
  Plus
} from 'lucide-react';
import { formatIDR, UI_RADIUS, MENU_OPTIONS } from './utils';
import Footer from './Footer';

// --- MODAL PRODUK ---
function ProductModal({ product, onClose, onSave }) {
  const [formData, setFormData] = useState(product || {
    name: '',
    cost: '',
    price: '',
    stock: '',
    image: ''
  });
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.cost || !formData.price || !formData.stock) {
      alert("Mohon lengkapi semua field!");
      return;
    }
    onSave({
      ...formData,
      id: product?.id,
      cost: Number(formData.cost),
      price: Number(formData.price),
      stock: Number(formData.stock)
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className={`bg-white w-full max-w-lg ${UI_RADIUS.outer} shadow-2xl overflow-hidden animate-in zoom-in duration-300`}>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-900">{product ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Upload Foto */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Foto Produk</label>
            <div className="flex gap-4 items-center">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`w-24 h-24 ${UI_RADIUS.inner} border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all overflow-hidden relative group`}
              >
                {formData.image ? (
                  <>
                    <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                      <Camera size={20} />
                    </div>
                  </>
                ) : (
                  <>
                    <Camera size={24} className="text-slate-300 mb-1" />
                    <span className="text-[10px] text-slate-400 font-bold">Upload</span>
                  </>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full py-2 px-4 bg-white border border-slate-200 ${UI_RADIUS.inner} text-xs font-bold text-slate-600 flex items-center justify-center gap-2 hover:bg-slate-50`}
                >
                  <ImageIcon size={14} /> Ambil dari Galeri
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
                <p className="text-[10px] text-slate-400 italic">Rekomendasi ukuran 1:1 atau persegi.</p>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nama Produk</label>
            <input 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Contoh: Aqua Galon 19L" 
              className={`w-full p-3.5 bg-slate-50 border border-slate-100 ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/20 font-medium text-sm`} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Harga Beli (Modal)</label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-slate-400 text-xs font-bold">Rp</span>
                <input 
                  required
                  type="number"
                  value={formData.cost}
                  onChange={(e) => setFormData({...formData, cost: e.target.value})}
                  className={`w-full p-3.5 pl-10 bg-slate-50 border border-slate-100 ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-sm`} 
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Harga Jual</label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-slate-400 text-xs font-bold">Rp</span>
                <input 
                  required
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className={`w-full p-3.5 pl-10 bg-slate-50 border border-slate-100 ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-sm text-blue-600`} 
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Stok Tersedia</label>
            <input 
              required
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({...formData, stock: e.target.value})}
              placeholder="0" 
              className={`w-full p-3.5 bg-slate-50 border border-slate-100 ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/20 font-medium text-sm`} 
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className={`flex-1 py-3.5 bg-slate-100 text-slate-600 ${UI_RADIUS.inner} font-bold text-sm hover:bg-slate-200 transition-all`}
            >
              Batal
            </button>
            <button 
              type="submit"
              className={`flex-1 py-3.5 bg-blue-600 text-white ${UI_RADIUS.inner} font-bold text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all`}
            >
              Simpan Produk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- MODAL USER ---
function UserModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState(user || {
    name: '',
    username: '',
    password: '',
    permissions: ['dashboard', 'transactions', 'products', 'finance', 'settings', 'users']
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Nama diperlukan";
    if (!formData.username.trim()) newErrors.username = "Username diperlukan";
    if (!formData.password.trim()) newErrors.password = "Password diperlukan";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      ...formData,
      id: user?.id || Date.now().toString()
    });
  };

  const togglePermission = (perm) => {
    setFormData({
      ...formData,
      permissions: formData.permissions.includes(perm)
        ? formData.permissions.filter(p => p !== perm)
        : [...formData.permissions, perm]
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className={`bg-white w-full max-w-lg ${UI_RADIUS.outer} shadow-2xl overflow-hidden animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto`}>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h3 className="font-bold text-slate-900">{user ? 'Edit User' : 'Tambah User Baru'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
            <input 
              value={formData.name}
              onChange={(e) => {
                setFormData({...formData, name: e.target.value});
                setErrors({...errors, name: ''});
              }}
              placeholder="Nama Lengkap" 
              className={`w-full p-3.5 bg-slate-50 border ${errors.name ? 'border-red-300' : 'border-slate-100'} ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/20 font-medium text-sm`} 
            />
            {errors.name && <p className="text-xs text-red-600 ml-1">{errors.name}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Username</label>
            <input 
              value={formData.username}
              onChange={(e) => {
                setFormData({...formData, username: e.target.value});
                setErrors({...errors, username: ''});
              }}
              placeholder="Username" 
              className={`w-full p-3.5 bg-slate-50 border ${errors.username ? 'border-red-300' : 'border-slate-100'} ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/20 font-medium text-sm`} 
            />
            {errors.username && <p className="text-xs text-red-600 ml-1">{errors.username}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <input 
              type="password"
              value={formData.password}
              onChange={(e) => {
                setFormData({...formData, password: e.target.value});
                setErrors({...errors, password: ''});
              }}
              placeholder="Password" 
              className={`w-full p-3.5 bg-slate-50 border ${errors.password ? 'border-red-300' : 'border-slate-100'} ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/20 font-medium text-sm`} 
            />
            {errors.password && <p className="text-xs text-red-600 ml-1">{errors.password}</p>}
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Hak Akses Modul</p>
            <div className="grid grid-cols-2 gap-3">
              {['dashboard', 'transactions', 'products', 'finance', 'settings', 'users'].map(perm => (
                <label key={perm} className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={formData.permissions.includes(perm)}
                    onChange={() => togglePermission(perm)}
                    className="w-4 h-4 accent-blue-600 rounded" 
                  />
                  <span className="text-xs text-slate-600 font-medium group-hover:text-blue-600 transition-colors capitalize">{perm}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className={`flex-1 py-3.5 bg-slate-100 text-slate-600 ${UI_RADIUS.inner} font-bold text-sm hover:bg-slate-200 transition-all`}
            >
              Batal
            </button>
            <button 
              type="submit"
              className={`flex-1 py-3.5 bg-blue-600 text-white ${UI_RADIUS.inner} font-bold text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all`}
            >
              {user ? 'Update User' : 'Simpan User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- FINANCE VIEW ---
function FinanceView({ transactions, products }) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const years = [2024, 2025, 2026];
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  const stats = useMemo(() => {
    return months.map((monthName, index) => {
      const monthTx = transactions.filter(t => {
        const d = new Date(t.date);
        return d.getFullYear() === selectedYear && d.getMonth() === index;
      });

      const successTx = monthTx.filter(t => t.paymentStatus === 'sukses');
      const pendingTx = monthTx.filter(t => t.paymentStatus === 'menunggu');

      let profit = 0;
      let revenue = 0;
      
      successTx.forEach(tx => {
        revenue += tx.total;
        tx.items.forEach(item => {
          const productInfo = products.find(p => p.id === item.id);
          const cost = productInfo ? productInfo.cost : (item.price * 0.8);
          profit += (item.price - cost) * item.qty;
        });
      });

      return {
        monthName,
        totalTx: monthTx.length,
        successCount: successTx.length,
        pendingCount: pendingTx.length,
        revenue,
        profit
      };
    });
  }, [transactions, selectedYear, products]);

  const yearlyTotal = stats.reduce((acc, curr) => ({
    profit: acc.profit + curr.profit,
    revenue: acc.revenue + curr.revenue,
    success: acc.success + curr.successCount
  }), { profit: 0, revenue: 0, success: 0 });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 ${UI_RADIUS.outer} border border-white shadow-sm`}>
        <div>
          <h3 className="text-sm font-bold text-slate-800">Laporan Keuangan Tahunan</h3>
          <p className="text-xs text-slate-400">Ringkasan laba bersih dari pembayaran sukses</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-100">
          <Calendar size={16} className="ml-2 text-slate-400" />
          <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="bg-transparent text-sm font-bold text-slate-700 p-2 outline-none">
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className={`p-8 bg-slate-900 text-white ${UI_RADIUS.outer} shadow-xl relative overflow-hidden`}>
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Keuntungan ({selectedYear})</p>
            <p className="text-3xl font-black tracking-tighter">{formatIDR(yearlyTotal.profit)}</p>
          </div>
          <DollarSign size={80} className="absolute -bottom-4 -right-4 text-white/5" />
        </div>
        <div className={`p-8 bg-white ${UI_RADIUS.outer} border border-white shadow-sm`}>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 text-emerald-600">Omzet Berhasil</p>
          <p className="text-2xl font-black text-slate-900 tracking-tighter">{formatIDR(yearlyTotal.revenue)}</p>
        </div>
        <div className={`p-8 bg-white ${UI_RADIUS.outer} border border-white shadow-sm`}>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 text-blue-600">Transaksi Selesai</p>
          <p className="text-2xl font-black text-slate-900 tracking-tighter">{yearlyTotal.success} Pesanan</p>
        </div>
      </div>

      <div className={`bg-white ${UI_RADIUS.outer} border border-white shadow-sm overflow-hidden`}>
        <div className="p-6 border-b border-slate-50 flex items-center gap-2">
          <PieChart size={18} className="text-blue-600" />
          <h4 className="text-sm font-bold text-slate-800">Rincian Laba Rugi Bulanan</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">Bulan</th>
                <th className="px-6 py-4 text-center">Sukses</th>
                <th className="px-6 py-4 text-center">Menunggu</th>
                <th className="px-6 py-4">Omzet</th>
                <th className="px-6 py-4">Keuntungan</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {stats.map((s, i) => (
                <tr key={i} className={`text-sm hover:bg-slate-50/30 transition-colors ${s.profit > 0 ? '' : 'opacity-60'}`}>
                  <td className="px-6 py-4 font-bold text-slate-700">{s.monthName}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md text-[10px] font-bold">{s.successCount}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded-md text-[10px] font-bold">{s.pendingCount}</span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-500">{formatIDR(s.revenue)}</td>
                  <td className="px-6 py-4 font-black text-slate-900">{formatIDR(s.profit)}</td>
                  <td className="px-6 py-4 text-right">
                    {s.profit > 0 ? (
                      <div className="flex items-center justify-end text-emerald-500 gap-1"><ArrowUpRight size={14} /><span className="text-[10px] font-bold uppercase">Profit</span></div>
                    ) : (
                      <div className="flex items-center justify-end text-slate-300 gap-1">-</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- TRANSACTION LIST ---
function TransactionList({ transactions, onDetail, updateStatus }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <th className="pb-4">Tanggal</th>
            <th className="pb-4">Pelanggan</th>
            <th className="pb-4">Detail</th>
            <th className="pb-4">Status Bayar</th>
            <th className="pb-4">Pengiriman</th>
            <th className="pb-4 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {transactions.map(t => (
            <tr key={t.id} className="text-sm group">
              <td className="py-4 text-slate-400 font-medium text-[11px]">{t.time}</td>
              <td className="py-4">
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-800 tracking-tight">{t.customer}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{t.phone}</p>
                </div>
              </td>
              <td className="py-4">
                <div className="flex flex-col">
                  <span className="text-slate-500 text-xs font-medium">{t.items.length} item</span>
                  <span className="text-blue-600 font-bold">{formatIDR(t.total)}</span>
                </div>
              </td>
              <td className="py-4">
                <select 
                  value={t.paymentStatus} 
                  onChange={(e) => updateStatus(t.id, 'paymentStatus', e.target.value)}
                  className={`text-[10px] font-bold uppercase p-1.5 rounded border-0 outline-none cursor-pointer ${t.paymentStatus === 'sukses' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}
                >
                  <option value="menunggu">Menunggu</option>
                  <option value="sukses">Sukses</option>
                </select>
              </td>
              <td className="py-4">
                <select 
                  value={t.shippingStatus} 
                  onChange={(e) => updateStatus(t.id, 'shippingStatus', e.target.value)}
                  className={`text-[10px] font-bold uppercase p-1.5 rounded border-0 outline-none cursor-pointer ${t.shippingStatus === 'sukses' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-500'}`}
                >
                  <option value="menunggu">Menunggu</option>
                  <option value="dikirim">Dikirim</option>
                  <option value="sukses">Sampai</option>
                </select>
              </td>
              <td className="py-4 text-right">
                <button onClick={() => onDetail(t)} className="p-2 text-slate-300 hover:text-blue-600 transition-colors"><Eye size={18} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- STAT CARD ---
function StatCard({ label, val, icon: Icon, color = "bg-blue-50 text-blue-600" }) {
  return (
    <div className={`bg-white p-8 ${UI_RADIUS.outer} border border-white shadow-sm flex items-center gap-6 hover:shadow-md transition-all`}>
      <div className={`p-5 ${color} ${UI_RADIUS.inner} shrink-0`}><Icon size={22} /></div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">{label}</p>
        <p className="text-2xl font-black text-slate-900 tracking-tighter">{val}</p>
      </div>
    </div>
  );
}

// --- MAIN ADMIN LAYOUT ---
export default function AdminDashboard({ 
  adminTab, setAdminTab, products, saveProduct, deleteProduct,
  users, setUsers, settings, saveSettings, mobileMenuOpen, setMobileMenuOpen, 
  handleLogout, onCustomerView, transactions, updateTransactionStatus 
}) {
  const [selectedTx, setSelectedTx] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const handleProductSave = (productData) => {
    saveProduct(productData);
    setEditingProduct(null);
    setIsAddingProduct(false);
  };

  const handleUserSave = async (userData) => {
    try {
      if (editingUser) {
        // Update existing user
        setUsers(prev => prev.map(u => u.id === editingUser.id ? userData : u));
      } else {
        // Add new user
        setUsers(prev => [...prev, userData]);
      }
      setEditingUser(null);
      setIsAddingUser(false);
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Error saving user: ' + error.message);
    }
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      setUsers(prev => prev.filter(u => u.id !== userId));
    }
  };

  const handleSettingsSave = () => {
    saveSettings(settings);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F1F5F9]">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200 p-8 transform transition-transform duration-500 md:translate-x-0 flex flex-col ${mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        <div className="mb-12">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tighter">Kamila Mart <span className="text-blue-600">Admin</span></h2>
        </div>
        <nav className="flex-1 space-y-1.5">
          {MENU_OPTIONS.map(m => {
            const iconMap = {
              'LayoutDashboard': LayoutDashboard,
              'ShoppingCart': ShoppingCart,
              'Package': Package,
              'DollarSign': DollarSign,
              'Users': User,
              'Settings': Settings
            };
            const IconComponent = iconMap[m.icon];
            return (
              <button 
                key={m.id} 
                onClick={() => { setAdminTab(m.id); setMobileMenuOpen(false); }} 
                className={`w-full flex items-center gap-3.5 px-5 py-4 ${UI_RADIUS.inner} transition-all font-semibold text-sm ${adminTab === m.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <IconComponent size={18} /> {m.label}
              </button>
            );
          })}
        </nav>
        <div className="pt-8 mt-8 border-t border-slate-100 space-y-2">
          <button onClick={onCustomerView} className={`w-full flex items-center justify-center gap-2.5 px-5 py-4 ${UI_RADIUS.inner} text-slate-900 bg-slate-100 font-bold text-xs transition border border-transparent hover:border-slate-200`}><ShoppingCart size={16} /> Tampilan Toko</button>
          <button onClick={handleLogout} className={`w-full flex items-center justify-center gap-2.5 px-5 py-4 ${UI_RADIUS.inner} text-rose-500 hover:bg-rose-50 font-bold text-xs transition`}><LogOut size={16} /> Logout</button>
        </div>
      </aside>

      {mobileMenuOpen && <div className="fixed inset-0 bg-slate-900/20 z-30 md:hidden backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />}

      <main className="flex-1 p-6 md:p-14 ml-0 md:ml-72 transition-all flex flex-col">
        <div className="flex-1">
          <header className="flex items-center justify-between mb-12">
            <h2 className="text-2xl font-bold text-slate-900 capitalize tracking-tight">{MENU_OPTIONS.find(m => m.id === adminTab)?.label}</h2>
            <button onClick={() => setMobileMenuOpen(true)} className={`p-3 bg-white ${UI_RADIUS.inner} border border-slate-200 md:hidden shadow-sm text-slate-600 active:scale-95 transition-all`}><Menu size={24} /></button>
          </header>

          {adminTab === 'dashboard' && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <StatCard label="Produk Aktif" val={products.length} icon={Package} />
                <StatCard label="Total User" val={users.length} icon={User} />
                <StatCard label="Total Pesanan" val={transactions.length} icon={TrendingUp} color="bg-emerald-50 text-emerald-600" />
              </div>
              <div className={`bg-white p-8 ${UI_RADIUS.outer} border border-white shadow-sm`}>
                <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2 text-sm"><ShoppingCart size={16} className="text-blue-600" /> Pesanan Terbaru</h3>
                {transactions.length === 0 ? <p className="text-slate-400 text-xs py-8 text-center">Belum ada transaksi.</p> : <TransactionList transactions={transactions.slice(0, 5)} onDetail={setSelectedTx} updateStatus={updateTransactionStatus} />}
              </div>
            </div>
          )}

          {adminTab === 'finance' && <FinanceView transactions={transactions} products={products} />}

          {adminTab === 'transactions' && (
            <div className={`bg-white p-8 ${UI_RADIUS.outer} border border-white shadow-sm animate-in fade-in duration-500 overflow-hidden`}>
              <TransactionList transactions={transactions} onDetail={setSelectedTx} updateStatus={updateTransactionStatus} />
            </div>
          )}

          {adminTab === 'products' && (
            <div className={`bg-white p-8 ${UI_RADIUS.outer} border border-white shadow-sm animate-in fade-in duration-500 overflow-hidden`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800 text-sm">Inventaris Barang</h3>
                <button 
                  onClick={() => setIsAddingProduct(true)}
                  className={`px-4 py-2 bg-blue-600 text-white text-xs font-bold ${UI_RADIUS.inner} shadow-lg shadow-blue-500/20 active:scale-95 transition-all`}
                >
                  + Tambah Produk
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <th className="pb-4">Produk</th>
                      <th className="pb-4">Harga Beli</th>
                      <th className="pb-4">Harga Jual</th>
                      <th className="pb-4">Stok</th>
                      <th className="pb-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {products.map(p => (
                      <tr key={p.id} className="text-sm hover:bg-slate-50/50 group transition-colors">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <img src={p.image || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=100'} className={`w-10 h-10 ${UI_RADIUS.inner} object-cover bg-slate-100`} />
                            <span className="font-bold text-slate-800">{p.name}</span>
                          </div>
                        </td>
                        <td className="py-4 text-slate-500 font-medium">{formatIDR(p.cost)}</td>
                        <td className="py-4 font-bold text-blue-600">{formatIDR(p.price)}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold ${p.stock < 10 ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>{p.stock} Unit</span>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex justify-end gap-1">
                            <button 
                              onClick={() => setEditingProduct(p)}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => deleteProduct(p.id)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {adminTab === 'users' && (
            <div className="animate-in fade-in duration-500 space-y-6">
              <div className={`bg-white p-8 ${UI_RADIUS.outer} border border-white shadow-sm`}>
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-bold text-slate-800 text-sm">Kelola Akses Admin ({users.length} User)</h3>
                  <button 
                    onClick={() => setIsAddingUser(true)}
                    className={`px-4 py-2 bg-blue-600 text-white text-xs font-bold ${UI_RADIUS.inner} shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2`}
                  >
                    <Plus size={16} /> Tambah User
                  </button>
                </div>
                
                {users.length === 0 ? (
                  <p className="text-slate-400 text-xs py-8 text-center">Belum ada user. Klik tombol "Tambah User" untuk membuat user baru.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {users.map(u => (
                      <div key={u.id} className={`p-5 border border-slate-100 ${UI_RADIUS.inner} bg-slate-50/50 flex flex-col`}>
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-10 h-10 bg-white shadow-sm ${UI_RADIUS.inner} flex items-center justify-center text-slate-400 shrink-0`}><User size={20} /></div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-800 text-sm truncate">{u.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium truncate">@{u.username}</p>
                          </div>
                        </div>
                        
                        {/* Permissions display */}
                        <div className="mb-4 pb-4 border-t border-slate-100 pt-3">
                          <p className="text-[9px] font-bold text-slate-400 uppercase mb-2">Akses:</p>
                          <div className="flex flex-wrap gap-1">
                            {u.permissions && u.permissions.slice(0, 3).map(perm => (
                              <span key={perm} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[8px] font-bold uppercase">{perm}</span>
                            ))}
                            {u.permissions && u.permissions.length > 3 && (
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[8px] font-bold">+{u.permissions.length - 3}</span>
                            )}
                          </div>
                        </div>
                        
                        {/* Action buttons */}
                        <div className="flex gap-2 mt-auto">
                          <button 
                            onClick={() => setEditingUser(u)}
                            className="flex-1 p-2 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all text-xs font-bold flex items-center justify-center gap-1"
                          >
                            <Edit size={14} /> Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(u.id)}
                            className="flex-1 p-2 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all text-xs font-bold flex items-center justify-center gap-1"
                          >
                            <Trash2 size={14} /> Hapus
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {adminTab === 'settings' && (
            <div className="animate-in fade-in duration-500 max-w-3xl">
              <div className={`bg-white p-10 ${UI_RADIUS.outer} border border-white shadow-sm space-y-8`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nama Toko</label>
                    <input value={settings.martName} onChange={(e) => setSettings({...settings, martName: e.target.value})} className={`w-full p-4 bg-slate-50 border border-slate-100 ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/10 font-bold text-slate-800`} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">WhatsApp Admin</label>
                    <input value={settings.adminPhone} onChange={(e) => setSettings({...settings, adminPhone: e.target.value})} className={`w-full p-4 bg-slate-50 border border-slate-100 ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/10 font-bold text-slate-800`} />
                  </div>
                </div>
                <div className="pt-6 border-t border-slate-50">
                  <h4 className="font-bold text-slate-800 text-sm mb-6 flex items-center gap-2"><CreditCard size={18} className="text-blue-600" /> Informasi Rekening Bank</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Bank</label>
                      <input value={settings.bankName} onChange={(e) => setSettings({...settings, bankName: e.target.value})} className={`w-full p-4 bg-slate-50 border border-slate-100 ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/10 font-bold text-slate-800`} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Atas Nama</label>
                      <input value={settings.bankAccountName} onChange={(e) => setSettings({...settings, bankAccountName: e.target.value})} className={`w-full p-4 bg-slate-50 border border-slate-100 ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/10 font-bold text-slate-800`} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nomor Rekening</label>
                      <input value={settings.bankAccountNumber} onChange={(e) => setSettings({...settings, bankAccountNumber: e.target.value})} className={`w-full p-4 bg-slate-50 border border-slate-100 ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/10 font-bold text-slate-800`} />
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleSettingsSave}
                  className={`w-full py-4 bg-blue-600 text-white ${UI_RADIUS.inner} font-bold text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all`}
                >
                  Simpan Pengaturan
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <Footer />
      </main>

      {/* Modal CRUD Produk */}
      {(isAddingProduct || editingProduct) && (
        <ProductModal 
          product={editingProduct} 
          onClose={() => { setEditingProduct(null); setIsAddingProduct(false); }}
          onSave={handleProductSave}
        />
      )}

      {/* Modal CRUD User */}
      {(isAddingUser || editingUser) && (
        <UserModal 
          user={editingUser} 
          onClose={() => { setEditingUser(null); setIsAddingUser(false); }}
          onSave={handleUserSave}
        />
      )}

      {/* Detail Pesanan Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className={`bg-white w-full max-w-xl ${UI_RADIUS.outer} shadow-2xl overflow-hidden animate-in zoom-in duration-300`}>
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-slate-900">Detail Pesanan</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{selectedTx.time}</p>
              </div>
              <button onClick={() => setSelectedTx(null)} className="p-2 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-lg"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Pemesan</label>
                  <p className="font-bold text-slate-800">{selectedTx.customer}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><Phone size={10} /> {selectedTx.phone}</p>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Alamat</label>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{selectedTx.address}</p>
                </div>
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-3">Item Dipesan</label>
                <div className="space-y-2">
                  {selectedTx.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm py-2 border-b border-slate-50 last:border-0">
                      <span className="font-medium text-slate-700">{item.qty}x {item.name}</span>
                      <span className="font-bold text-slate-900">{formatIDR(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={`p-4 bg-slate-50 ${UI_RADIUS.inner} flex justify-between items-center`}>
                <span className="font-bold text-slate-500 text-xs">Total Pembayaran</span>
                <span className="text-xl font-black text-blue-600 tracking-tighter">{formatIDR(selectedTx.total)}</span>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button onClick={() => setSelectedTx(null)} className={`px-6 py-2.5 font-bold text-slate-600 text-xs hover:bg-slate-100 rounded-lg`}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
