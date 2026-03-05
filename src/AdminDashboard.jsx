import React, { useState, useMemo, useRef } from 'react';
import {
  LayoutDashboard, Package, ShoppingCart, Settings, Menu, LogOut, User,
  Edit, TrendingUp, CreditCard, Eye, X, Calendar, DollarSign, PieChart,
  ArrowUpRight, ArrowDownRight, Camera, Trash2, Phone,
  Plus, Download, FileText, Archive, EyeOff
} from 'lucide-react';
import { formatIDR, UI_RADIUS, MENU_OPTIONS } from './utils';
import Footer from './Footer';

// --- MODAL PRODUK ---
function ProductModal({ product, onClose, onSave }) {
  const [formData, setFormData] = useState(product || {
    customId: '',
    name: '',
    cost: '',
    price: '',
    stock: '',
    status: 'aktif'
  });

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
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">ID Produk</label>
            <input
              required
              value={formData.customId}
              onChange={(e) => setFormData({ ...formData, customId: e.target.value })}
              placeholder="Contoh: ATK-001"
              className={`w-full p-3.5 bg-slate-50 border border-slate-100 ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-sm`}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nama Produk</label>
            <input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              placeholder="0"
              className={`w-full p-3.5 bg-slate-50 border border-slate-100 ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/20 font-medium text-sm`}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Status Produk</label>
            <select
              value={formData.status || 'aktif'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className={`w-full p-3.5 bg-slate-50 border border-slate-100 ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-sm`}
            >
              <option value="aktif">Aktif (Tampil)</option>
              <option value="tidak_aktif">Tidak Aktif (Sembunyi)</option>
            </select>
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

    const dataToSave = { ...formData };
    if (user?.id) dataToSave.id = user.id;
    else delete dataToSave.id;

    onSave(dataToSave);
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
                setFormData({ ...formData, name: e.target.value });
                setErrors({ ...errors, name: '' });
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
                setFormData({ ...formData, username: e.target.value });
                setErrors({ ...errors, username: '' });
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
                setFormData({ ...formData, password: e.target.value });
                setErrors({ ...errors, password: '' });
              }}
              placeholder="Password"
              className={`w-full p-3.5 bg-slate-50 border ${errors.password ? 'border-red-300' : 'border-slate-100'} ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/20 font-medium text-sm`}
            />
            {errors.password && <p className="text-xs text-red-600 ml-1">{errors.password}</p>}
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Hak Akses Modul</p>
            <div className="grid grid-cols-2 gap-3">
              {['dashboard', 'transactions', 'products', 'finance', 'profit_report', 'settings', 'users'].map(perm => (
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

        {/* Mobile View: Cards */}
        <div className="grid grid-cols-1 gap-0 self-stretch md:hidden divide-y divide-slate-50">
          {stats.map((s, i) => (
            <div key={i} className={`p-5 space-y-4 hover:bg-slate-50/30 transition-colors ${s.profit > 0 ? '' : 'opacity-60'}`}>
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-700 text-sm">{s.monthName}</span>
                {s.profit > 0 ? (
                  <div className="flex items-center text-emerald-500 gap-1"><ArrowUpRight size={14} /><span className="text-[10px] font-bold uppercase tracking-tight">Profit</span></div>
                ) : (
                  <div className="text-slate-300 font-bold text-[10px]">-</div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-50">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status Transaksi</p>
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[10px] font-bold">{s.successCount} Sukses</span>
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded text-[10px] font-bold">{s.pendingCount} Menunggu</span>
                  </div>
                </div>
                <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-50">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Keuntungan</p>
                  <p className="font-black text-slate-900 text-[13px]">{formatIDR(s.profit)}</p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-1 px-1">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Total Omzet</span>
                <span className="text-slate-600 font-bold text-sm tracking-tight">{formatIDR(s.revenue)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
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

// --- PROFIT REPORT VIEW ---
function ProfitReportView({ transactions, products, monthlyReports, saveMonthlyReport, settings, saveSettings }) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [editingMonthFormula, setEditingMonthFormula] = useState(null);
  const [tempFormula, setTempFormula] = useState({
    marbotPercent: settings?.marbotPercent || 60,
    internalPercent: settings?.internalPercent || 40
  });
  const [applyToAll, setApplyToAll] = useState(false);

  const years = [2024, 2025, 2026];
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  const stats = useMemo(() => {
    return months.map((monthName, index) => {
      const monthTx = transactions.filter(t => {
        const d = (t.date instanceof Date) ? t.date : new Date(t.date);
        return d.getFullYear() === selectedYear && d.getMonth() === index;
      });

      const successTx = monthTx.filter(t => t.paymentStatus === 'sukses');
      let profit = 0;

      successTx.forEach(tx => {
        tx.items.forEach(item => {
          const productInfo = products.find(p => p.id === item.id);
          const cost = productInfo ? productInfo.cost : (item.price * 0.8);
          profit += (item.price - cost) * item.qty;
        });
      });

      const reportId = `${selectedYear}-${index}`;
      const savedData = monthlyReports.find(r => r.id === reportId) || {};

      const mP = savedData.marbotPercent !== undefined ? savedData.marbotPercent : (settings?.marbotPercent || 60);
      const iP = savedData.internalPercent !== undefined ? savedData.internalPercent : (settings?.internalPercent || 40);

      return {
        id: reportId,
        monthName,
        profit,
        marbotPercent: mP,
        internalPercent: iP,
        status: savedData.status || 'menunggu',
        notes: savedData.notes || ''
      };
    });
  }, [transactions, selectedYear, products, monthlyReports, settings]);

  const handleSaveFormula = async () => {
    const total = Number(tempFormula.marbotPercent) + Number(tempFormula.internalPercent);
    if (total > 100) {
      alert('Total persentase tidak boleh melebihi 100%!');
      return;
    }

    if (editingMonthFormula) {
      // Per Month Override
      saveMonthlyReport(editingMonthFormula.id, {
        marbotPercent: Number(tempFormula.marbotPercent),
        internalPercent: Number(tempFormula.internalPercent)
      });
      setEditingMonthFormula(null);
    } else {
      // Master Formula
      saveSettings({
        ...settings,
        marbotPercent: Number(tempFormula.marbotPercent),
        internalPercent: Number(tempFormula.internalPercent)
      });

      if (applyToAll) {
        // Apply to all months of all active years (simplified to existing reports or just logic)
        // Usually, we iterate through months of current year at least
        for (let i = 0; i < 12; i++) {
          const mId = `${selectedYear}-${i}`;
          saveMonthlyReport(mId, {
            marbotPercent: Number(tempFormula.marbotPercent),
            internalPercent: Number(tempFormula.internalPercent)
          });
        }
      }
      setEditingFormula(false);
    }
    setApplyToAll(false);
  };

  const marbotP = settings?.marbotPercent || 60;
  const internalP = settings?.internalPercent || 40;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 ${UI_RADIUS.outer} border border-white shadow-sm`}>
        <div>
          <h3 className="text-sm font-bold text-slate-800">Laporan Pembagian Keuntungan</h3>
          <p className="text-xs text-slate-400">Pembagian profit bersih antara Marbot dan Internal</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-100 px-3">
            <Calendar size={14} className="text-slate-400" />
            <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="bg-transparent text-xs font-bold text-slate-700 py-1.5 outline-none">
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <button
            onClick={() => {
              setTempFormula({ marbotPercent: marbotP, internalPercent: internalP });
              setEditingFormula(true);
            }}
            className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold text-xs ${UI_RADIUS.inner} shadow-lg shadow-blue-500/20 active:scale-95 transition-all`}
          >
            <Settings size={14} /> Atur Formula
          </button>
        </div>
      </div>

      <div className={`bg-white ${UI_RADIUS.outer} border border-white shadow-sm overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4">Bulan</th>
                <th className="px-6 py-4">Total Profit</th>
                <th className="px-6 py-4 text-center">Formula</th>
                <th className="px-6 py-4">Marbot</th>
                <th className="px-6 py-4">Internal</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {stats.map((s) => (
                <tr key={s.id} className="text-sm hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-5 font-bold text-slate-700">{s.monthName}</td>
                  <td className="px-6 py-5 font-black text-slate-900">{formatIDR(s.profit)}</td>
                  <td className="px-6 py-5 text-center">
                    <button
                      onClick={() => {
                        setTempFormula({ marbotPercent: s.marbotPercent, internalPercent: s.internalPercent });
                        setEditingMonthFormula(s);
                      }}
                      className="group flex flex-col items-center justify-center p-2 hover:bg-slate-100 rounded-lg transition-all"
                    >
                      <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-600 transition-colors uppercase tracking-widest">{s.marbotPercent}:{s.internalPercent}</span>
                      <Settings size={10} className="text-slate-300 group-hover:text-blue-500 mt-0.5" />
                    </button>
                  </td>
                  <td className="px-6 py-5 text-emerald-600 font-bold">{formatIDR(s.profit * (s.marbotPercent / 100))}</td>
                  <td className="px-6 py-5 text-blue-600 font-bold">{formatIDR(s.profit * (s.internalPercent / 100))}</td>
                  <td className="px-6 py-5">
                    <select
                      value={s.status}
                      onChange={(e) => saveMonthlyReport(s.id, { status: e.target.value })}
                      className={`text-[10px] font-bold uppercase p-2 px-3 rounded-lg border-0 outline-none cursor-pointer ${s.status === 'sukses' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}
                    >
                      <option value="menunggu">Menunggu</option>
                      <option value="sukses">Selesai</option>
                    </select>
                  </td>
                  <td className="px-6 py-5 min-w-[200px]">
                    <input
                      className="w-full bg-slate-50 p-2 rounded-lg border border-slate-100 text-xs outline-none focus:border-blue-300 transition-all font-medium"
                      placeholder="Add note..."
                      value={s.notes}
                      onChange={(e) => saveMonthlyReport(s.id, { notes: e.target.value })}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {(editingFormula || editingMonthFormula) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className={`bg-white w-full max-w-md ${UI_RADIUS.outer} shadow-2xl overflow-hidden animate-in zoom-in duration-300 p-8 space-y-6`}>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-black text-slate-900 text-lg tracking-tight">
                {editingMonthFormula ? `Set Formula: ${editingMonthFormula.monthName}` : 'Atur Formula Master'}
              </h3>
              <button onClick={() => { setEditingFormula(false); setEditingMonthFormula(null); }} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <span>Marbot (%)</span>
                  <span className="text-emerald-600">{tempFormula.marbotPercent}%</span>
                </div>
                <input
                  type="range" min="0" max="100" step="5"
                  value={tempFormula.marbotPercent}
                  onChange={(e) => setTempFormula({ ...tempFormula, marbotPercent: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <span>Internal (%)</span>
                  <span className="text-blue-600">{tempFormula.internalPercent}%</span>
                </div>
                <input
                  type="range" min="0" max="100" step="5"
                  value={tempFormula.internalPercent}
                  onChange={(e) => setTempFormula({ ...tempFormula, internalPercent: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div className={`p-4 rounded-xl flex justify-between items-center ${Number(tempFormula.marbotPercent) + Number(tempFormula.internalPercent) > 100 ? 'bg-rose-50 border border-rose-100 text-rose-600' : 'bg-blue-50 border border-blue-100 text-blue-600'}`}>
                <span className="text-xs font-bold uppercase">Total Alokasi</span>
                <span className="font-black text-lg">{Number(tempFormula.marbotPercent) + Number(tempFormula.internalPercent)}%</span>
              </div>

              {Number(tempFormula.marbotPercent) + Number(tempFormula.internalPercent) > 100 && (
                <p className="text-[10px] text-rose-500 font-bold text-center animate-pulse">* Total tidak boleh melebihi 100%!</p>
              )}

              {!editingMonthFormula && (
                <div onClick={() => setApplyToAll(!applyToAll)} className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${applyToAll ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-100'}`}>
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${applyToAll ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white border-slate-200'}`}>
                    {applyToAll && <CheckCircle2 size={12} />}
                  </div>
                  <div className="flex-1">
                    <p className={`text-[10px] font-black uppercase tracking-widest ${applyToAll ? 'text-amber-700' : 'text-slate-500'}`}>Apply to All Months</p>
                    <p className="text-[9px] text-slate-400 font-medium">Terapkan formula ini ke seluruh bulan di tahun {selectedYear}</p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleSaveFormula}
              disabled={Number(tempFormula.marbotPercent) + Number(tempFormula.internalPercent) > 100}
              className={`w-full py-4 text-white font-black text-sm ${UI_RADIUS.inner} shadow-lg transition-all ${Number(tempFormula.marbotPercent) + Number(tempFormula.internalPercent) > 100 ? 'bg-slate-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'}`}
            >
              Simpan Formula
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- TRANSACTION LIST ---
function TransactionList({ transactions, onDetail, updateStatus }) {
  return (
    <div className="space-y-4">
      {/* Mobile view: Cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {transactions.map(t => (
          <div key={t.id} className={`p-4 bg-white border border-slate-100 ${UI_RADIUS.inner} shadow-sm space-y-4`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t.time}</p>
                <p className="font-bold text-slate-800 text-base mt-1">{t.customer}</p>
                <p className="text-xs text-slate-500 font-medium">{t.phone}</p>
              </div>
              <button onClick={() => onDetail(t)} className="p-2.5 bg-slate-50 text-blue-600 rounded-lg"><Eye size={18} /></button>
            </div>

            <div className="flex justify-between items-center bg-slate-50/50 p-3 rounded-lg border border-slate-50">
              <div className="flex flex-col">
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-tighter">Total</span>
                <span className="text-blue-600 font-black text-lg">{formatIDR(t.total)}</span>
              </div>
              <span className="px-2 py-1 bg-white border border-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase">{t.items.length} Item</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase">Pembayaran</label>
                <select
                  value={t.paymentStatus}
                  onChange={(e) => updateStatus(t.id, 'paymentStatus', e.target.value)}
                  className={`w-full text-[10px] font-bold uppercase p-2 rounded border-0 outline-none cursor-pointer ${t.paymentStatus === 'sukses' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}
                >
                  <option value="menunggu">Menunggu</option>
                  <option value="sukses">Sukses</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase">Pengiriman</label>
                <select
                  value={t.shippingStatus}
                  onChange={(e) => updateStatus(t.id, 'shippingStatus', e.target.value)}
                  className={`w-full text-[10px] font-bold uppercase p-2 rounded border-0 outline-none cursor-pointer ${t.shippingStatus === 'sukses' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-500'}`}
                >
                  <option value="menunggu">Menunggu</option>
                  <option value="dikirim">Dikirim</option>
                  <option value="sukses">Sampai</option>
                </select>
              </div>
            </div>
          </div>
        ))}
        {transactions.length === 0 && (
          <div className="text-center py-10 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
            <p className="text-slate-400 text-xs font-medium">Tidak ada transaksi ditemukan</p>
          </div>
        )}
      </div>

      {/* Desktop view: Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <th className="pb-4 px-2">Tanggal</th>
              <th className="pb-4 px-2">Pelanggan</th>
              <th className="pb-4 px-2">Detail</th>
              <th className="pb-4 px-2">Status Bayar</th>
              <th className="pb-4 px-2">Pengiriman</th>
              <th className="pb-4 px-2 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {transactions.map(t => (
              <tr key={t.id} className="text-sm group hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-2 text-slate-400 font-medium text-[11px] whitespace-nowrap">{t.time}</td>
                <td className="py-4 px-2">
                  <div className="space-y-0.5 min-w-[120px]">
                    <p className="font-bold text-slate-800 tracking-tight">{t.customer}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{t.phone}</p>
                  </div>
                </td>
                <td className="py-4 px-2">
                  <div className="flex flex-col whitespace-nowrap">
                    <span className="text-slate-500 text-xs font-medium">{t.items.length} item</span>
                    <span className="text-blue-600 font-bold">{formatIDR(t.total)}</span>
                  </div>
                </td>
                <td className="py-4 px-2">
                  <select
                    value={t.paymentStatus}
                    onChange={(e) => updateStatus(t.id, 'paymentStatus', e.target.value)}
                    className={`text-[10px] font-bold uppercase p-1.5 rounded border-0 outline-none cursor-pointer ${t.paymentStatus === 'sukses' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}
                  >
                    <option value="menunggu">Menunggu</option>
                    <option value="sukses">Sukses</option>
                  </select>
                </td>
                <td className="py-4 px-2">
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
                <td className="py-4 px-2 text-right">
                  <button onClick={() => onDetail(t)} className="p-2 text-slate-300 hover:text-blue-600 transition-colors"><Eye size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {transactions.length === 0 && (
          <div className="text-center py-10">
            <p className="text-slate-400 text-xs font-medium">Tidak ada transaksi ditemukan</p>
          </div>
        )}
      </div>
    </div>
  );
}

// --- TRANSACTION MODAL ---
function TransactionModal({ onClose, onSave, products }) {
  const [formData, setFormData] = useState({
    customer: '',
    phone: '',
    address: '',
    items: [],
    method: 'cod',
    date: new Date().toISOString(),
    paymentStatus: 'menunggu',
    shippingStatus: 'menunggu'
  });

  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);

  const addItem = () => {
    if (!selectedProduct) return;
    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        id: product.id,
        name: product.name,
        price: product.price,
        qty: quantity
      }]
    }));
    setSelectedProduct('');
    setQuantity(1);
  };

  const removeItem = (idx) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx)
    }));
  };

  const total = formData.items.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customer || !formData.phone || formData.items.length === 0) {
      alert("Mohon lengkapi data pelanggan dan item!");
      return;
    }

    onSave({
      ...formData,
      total,
      time: new Date(formData.date).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className={`bg-white w-full max-w-2xl ${UI_RADIUS.outer} shadow-2xl overflow-hidden animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto`}>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h3 className="font-bold text-slate-900">Tambah Transaksi Manual</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nama Pelanggan</label>
              <input
                required
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                className={`w-full p-3 bg-slate-50 border border-slate-100 ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/20 text-sm`}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">WhatsApp</label>
              <input
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={`w-full p-3 bg-slate-50 border border-slate-100 ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/20 text-sm`}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Alamat</label>
            <textarea
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className={`w-full p-3 bg-slate-50 border border-slate-100 ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/20 text-sm resize-none`}
              rows="2"
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Item Transaksi</p>
            <div className="flex gap-2">
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className={`flex-1 p-3 bg-slate-50 border border-slate-100 ${UI_RADIUS.inner} outline-none text-sm`}
              >
                <option value="">Pilih Produk</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} - {formatIDR(p.price)}</option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className={`w-20 p-3 bg-slate-50 border border-slate-100 ${UI_RADIUS.inner} outline-none text-sm font-bold text-center`}
              />
              <button
                type="button"
                onClick={addItem}
                className={`p-3 bg-blue-600 text-white ${UI_RADIUS.inner} hover:bg-blue-700 transition-all`}
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="space-y-2">
              {formData.items.map((item, idx) => (
                <div key={idx} className={`flex justify-between items-center p-3 bg-slate-50 ${UI_RADIUS.inner} text-sm`}>
                  <div className="flex-1">
                    <span className="font-bold text-slate-800">{item.qty}x</span> {item.name}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-blue-600">{formatIDR(item.price * item.qty)}</span>
                    <button type="button" onClick={() => removeItem(idx)} className="text-slate-300 hover:text-red-500"><X size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Metode</label>
              <select
                value={formData.method}
                onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                className={`w-full p-3 bg-slate-50 border border-slate-100 ${UI_RADIUS.inner} outline-none text-sm`}
              >
                <option value="cod">COD</option>
                <option value="transfer">Transfer</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tanggal</label>
              <input
                type="datetime-local"
                value={formData.date.slice(0, 16)}
                onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value).toISOString() })}
                className={`w-full p-3 bg-slate-50 border border-slate-100 ${UI_RADIUS.inner} outline-none text-sm`}
              />
            </div>
          </div>

          <div className={`p-4 bg-blue-50 ${UI_RADIUS.inner} flex justify-between items-center`}>
            <span className="font-bold text-blue-900/50 text-xs uppercase tracking-widest">Total Bayar</span>
            <span className="text-xl font-black text-blue-600">{formatIDR(total)}</span>
          </div>

          <div className="flex gap-3">
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
              Simpan Transaksi
            </button>
          </div>
        </form>
      </div>
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
  users, setUsers, saveUser, deleteUser, settings, setSettings, saveSettings, mobileMenuOpen, setMobileMenuOpen,
  handleLogout, onCustomerView, transactions, saveTransaction, deleteTransaction, updateTransactionStatus,
  monthlyReports, saveMonthlyReport, currentUserData
}) {
  const [selectedTx, setSelectedTx] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);

  const handleProductSave = (productData) => {
    saveProduct(productData);
    setEditingProduct(null);
    setIsAddingProduct(false);
  };

  const handleUserSave = async (userData) => {
    await saveUser(userData);
    setEditingUser(null);
    setIsAddingUser(false);
  };

  const handleTransactionSave = async (transactionData) => {
    await saveTransaction(transactionData);
    setIsAddingTransaction(false);
  };

  const handleDeleteUser = (userId) => {
    deleteUser(userId);
  };

  const handleSettingsSave = () => {
    saveSettings(settings);
  };

  // Filter menu based on permissions
  const filteredMenuOptions = MENU_OPTIONS.filter(m =>
    currentUserData?.permissions?.includes(m.id) || m.id === 'dashboard'
  );

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const monthsList = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const yearsList = [2024, 2025, 2026];

  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) {
      toast.error("Tidak ada data untuk diekspor");
      return;
    }

    const headers = ["Tanggal", "Pelanggan", "WhatsApp", "Alamat", "Items", "Total", "Metode", "Status Bayar", "Status Kirim", "Catatan"];
    const rows = filteredTransactions.map(t => [
      t.time,
      t.customer,
      t.phone,
      `"${t.address?.replace(/"/g, '""')}"`,
      `"${t.items.map(i => `${i.qty}x ${i.name}`).join(', ')}"`,
      t.total,
      t.method,
      t.paymentStatus,
      t.shippingStatus,
      `"${(t.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Laporan_Transaksi_${monthsList[selectedMonth]}_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (!t.date) return false;
      const d = (t.date instanceof Date) ? t.date : new Date(t.date);
      if (isNaN(d.getTime())) return false;
      return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    });
  }, [transactions, selectedMonth, selectedYear]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F1F5F9]">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200 p-8 transform transition-transform duration-500 md:translate-x-0 flex flex-col ${mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        <div className="mb-12">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tighter">Kamila Mart <span className="text-blue-600">Admin</span></h2>
        </div>
        <nav className="flex-1 space-y-1.5">
          {filteredMenuOptions.map(m => {
            const iconMap = {
              'LayoutDashboard': LayoutDashboard,
              'ShoppingCart': ShoppingCart,
              'Package': Package,
              'DollarSign': DollarSign,
              'FileText': FileText,
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
                <StatCard label="Produk Aktif" val={products.filter(p => (p.status === 'aktif' || (!p.status && !p.isArchived))).length} icon={Package} />
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

          {adminTab === 'profit_report' && (
            <ProfitReportView
              transactions={transactions}
              products={products}
              monthlyReports={monthlyReports}
              saveMonthlyReport={saveMonthlyReport}
              settings={settings}
              saveSettings={saveSettings}
            />
          )}

          {adminTab === 'transactions' && (
            <div className={`bg-white p-8 ${UI_RADIUS.outer} border border-white shadow-sm animate-in fade-in duration-500 space-y-6`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-50 pb-6">
                <div className="flex items-center gap-3">
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold text-slate-600 outline-none"
                  >
                    {monthsList.map((m, i) => <option key={i} value={i}>{m}</option>)}
                  </select>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold text-slate-600 outline-none"
                  >
                    {yearsList.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleExportCSV}
                    className={`px-5 py-2.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold ${UI_RADIUS.inner} shadow-sm active:scale-95 transition-all flex items-center gap-2 hover:bg-slate-50`}
                  >
                    <Download size={16} /> Ekspor CSV
                  </button>
                  <button
                    onClick={() => setIsAddingTransaction(true)}
                    className={`px-5 py-2.5 bg-blue-600 text-white text-xs font-black ${UI_RADIUS.inner} shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2`}
                  >
                    <Plus size={16} /> Tambah Transaksi
                  </button>
                </div>
              </div>
              <TransactionList transactions={filteredTransactions} onDetail={setSelectedTx} updateStatus={updateTransactionStatus} />
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
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {products.map(p => (
                  <div key={p.id} className={`p-4 bg-white border border-slate-100 ${UI_RADIUS.inner} shadow-sm space-y-4`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded leading-none">{p.customId || 'NO-ID'}</span>
                          <p className={`font-bold text-slate-800 text-base ${(p.status === 'tidak_aktif' || (!p.status && p.isArchived)) ? 'line-through opacity-50' : ''}`}>{p.name}</p>
                        </div>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${p.stock < 10 ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>{p.stock} Unit Tersedia</span>
                      </div>
                      <div className="flex gap-1">
                        <select
                          value={p.status || (p.isArchived ? 'tidak_aktif' : 'aktif')}
                          onChange={(e) => saveProduct({ ...p, status: e.target.value, isArchived: e.target.value === 'tidak_aktif' })}
                          className={`text-[10px] font-bold uppercase p-2 px-1.5 rounded-lg border-0 outline-none cursor-pointer transition-colors ${(p.status === 'aktif' || (!p.status && !p.isArchived)) ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}
                        >
                          <option value="aktif">Aktif</option>
                          <option value="tidak_aktif">Tidak Aktif</option>
                        </select>
                        <button
                          onClick={() => setEditingProduct(p)}
                          className="p-2.5 bg-slate-50 text-blue-600 rounded-lg"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-2.5 bg-slate-50 text-rose-600 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 bg-slate-50/50 p-3 rounded-lg border border-slate-50">
                      <div className="flex flex-col">
                        <span className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">Harga Jual</span>
                        <span className="text-blue-600 font-black text-base">{formatIDR(p.price)}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">Harga Beli</span>
                        <span className="text-slate-600 font-bold text-base">{formatIDR(p.cost)}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {products.length === 0 && (
                  <div className="text-center py-10 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-slate-400 text-xs font-medium">Belum ada produk</p>
                  </div>
                )}
              </div>

              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <th className="pb-4">ID</th>
                      <th className="pb-4">Produk</th>
                      <th className="pb-4">Harga Beli</th>
                      <th className="pb-4">Harga Jual</th>
                      <th className="pb-4">Stok</th>
                      <th className="pb-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {products.map(p => (
                      <tr key={p.id} className={`text-sm hover:bg-slate-50/50 group transition-colors ${(p.status === 'tidak_aktif' || (!p.status && p.isArchived)) ? 'bg-slate-50/50' : ''}`}>
                        <td className="py-4">
                          <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-1.5 py-1 rounded">{p.customId || 'NO-ID'}</span>
                        </td>
                        <td className="py-4">
                          <span className={`font-bold text-slate-800 ${(p.status === 'tidak_aktif' || (!p.status && p.isArchived)) ? 'line-through opacity-50' : ''}`}>{p.name} {(p.status === 'tidak_aktif' || (!p.status && p.isArchived)) && <span className="ml-2 text-[9px] bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded uppercase tracking-tighter">Tidak Aktif</span>}</span>
                        </td>
                        <td className="py-4 text-slate-500 font-medium">{formatIDR(p.cost)}</td>
                        <td className="py-4 font-bold text-blue-600">{formatIDR(p.price)}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold ${p.stock < 10 ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>{p.stock} Unit</span>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex justify-end gap-1">
                            <select
                              value={p.status || (p.isArchived ? 'tidak_aktif' : 'aktif')}
                              onChange={(e) => saveProduct({ ...p, status: e.target.value, isArchived: e.target.value === 'tidak_aktif' })}
                              className={`text-[10px] font-bold uppercase p-1.5 px-2 rounded-lg border-0 outline-none cursor-pointer transition-colors ${(p.status === 'aktif' || (!p.status && !p.isArchived)) ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}
                            >
                              <option value="aktif">Aktif</option>
                              <option value="tidak_aktif">Tidak Aktif</option>
                            </select>
                            <button
                              onClick={() => setEditingProduct(p)}
                              className="p-2 text-slate-300 hover:text-blue-600 hover:bg-white rounded-lg transition-all"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => deleteProduct(p.id)}
                              className="p-2 text-slate-300 hover:text-rose-600 hover:bg-white rounded-lg transition-all"
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
                    <input value={settings?.martName || ''} onChange={(e) => setSettings({ ...settings, martName: e.target.value })} className={`w-full p-4 bg-slate-50 border border-slate-100 ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/10 font-bold text-slate-800`} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">WhatsApp Admin</label>
                    <input value={settings?.adminPhone || ''} onChange={(e) => setSettings({ ...settings, adminPhone: e.target.value })} className={`w-full p-4 bg-slate-50 border border-slate-100 ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/10 font-bold text-slate-800`} />
                  </div>
                </div>
                <div className="pt-6 border-t border-slate-50">
                  <h4 className="font-bold text-slate-800 text-sm mb-6 flex items-center gap-2"><CreditCard size={18} className="text-blue-600" /> Informasi Rekening Bank</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Bank</label>
                      <input value={settings?.bankName || ''} onChange={(e) => setSettings({ ...settings, bankName: e.target.value })} className={`w-full p-4 bg-slate-50 border border-slate-100 ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/10 font-bold text-slate-800`} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Atas Nama</label>
                      <input value={settings?.bankAccountName || ''} onChange={(e) => setSettings({ ...settings, bankAccountName: e.target.value })} className={`w-full p-4 bg-slate-50 border border-slate-100 ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/10 font-bold text-slate-800`} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nomor Rekening</label>
                      <input value={settings?.bankAccountNumber || ''} onChange={(e) => setSettings({ ...settings, bankAccountNumber: e.target.value })} className={`w-full p-4 bg-slate-50 border border-slate-100 ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/10 font-bold text-slate-800`} />
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

      {/* Manual Transaction Modal */}
      {isAddingTransaction && (
        <TransactionModal
          onClose={() => setIsAddingTransaction(false)}
          onSave={handleTransactionSave}
          products={products}
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
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Metode Pembayaran</label>
                <p className="text-xs font-bold text-slate-700 capitalize flex items-center gap-1.5"><CreditCard size={12} className="text-blue-500" /> {selectedTx.method || '-'}</p>
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-3">Item Dipesan</label>
                <div className="space-y-2">
                  {selectedTx.items.map((item, idx) => {
                    const product = products.find(p => p.id === item.id);
                    const currentStatus = product?.status || (product?.isArchived ? 'tidak_aktif' : 'aktif');
                    return (
                      <div key={idx} className="flex justify-between items-center text-sm py-3 border-b border-slate-50 last:border-0">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-slate-700">{item.qty}x {item.name}</span>
                          {product && (
                            <select
                              value={currentStatus}
                              onChange={(e) => saveProduct({ ...product, status: e.target.value, isArchived: e.target.value === 'tidak_aktif' })}
                              className={`text-[9px] font-bold uppercase w-fit px-1.5 py-0.5 rounded border-0 outline-none cursor-pointer transition-colors ${currentStatus === 'aktif' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}
                            >
                              <option value="aktif">Aktif</option>
                              <option value="tidak_aktif">Tidak Aktif</option>
                            </select>
                          )}
                        </div>
                        <span className="font-bold text-slate-900">{formatIDR(item.price * item.qty)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Catatan Internal</label>
                <div className="relative">
                  <textarea
                    defaultValue={selectedTx.notes || ''}
                    onBlur={(e) => updateStatus(selectedTx.id, 'notes', e.target.value)}
                    placeholder="Tulis catatan di sini... (otomatis tersimpan saat keluar)"
                    className={`w-full p-4 bg-slate-50 border border-slate-100 ${UI_RADIUS.inner} text-xs text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-200 transition-all resize-none h-20 font-medium`}
                  />
                  <FileText size={14} className="absolute right-3 bottom-3 text-slate-300" />
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
