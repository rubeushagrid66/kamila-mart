import React, { useState, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Settings, Menu, LogOut, User, Users,
  Edit, TrendingUp, CreditCard, Eye, X, Calendar, DollarSign, PieChart,
  ArrowUpRight, ArrowDownRight, Camera, Trash2, Phone,
  Plus, Download, FileText, Archive, EyeOff, CheckCircle2
} from 'lucide-react';
import { formatIDR, UI_RADIUS, MENU_OPTIONS, UI_SPACING, UI_TEXT, UI_BUTTON } from './utils';
import Footer from './Footer';

// --- MODAL PRODUK ---
function ProductModal({ product, onClose, onSave }) {
  const [formData, setFormData] = useState(product || {
    customId: '',
    name: '',
    category: '',
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className={`bg-white w-full max-w-lg ${UI_RADIUS.outer} shadow-2xl overflow-hidden animate-in zoom-in duration-300`}>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-900">{product ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[85vh] overflow-y-auto">
          <div className="space-y-2">
            <label className={UI_TEXT.label}>ID Produk</label>
            <input
              required
              value={formData.customId}
              onChange={(e) => setFormData({ ...formData, customId: e.target.value })}
              placeholder="Contoh: ATK-001"
              className={`w-full p-4 bg-slate-50 border border-slate-100 ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/10 font-bold text-sm text-slate-900`}
            />
          </div>

          <div className="space-y-2">
            <label className={UI_TEXT.label}>Nama Produk</label>
            <input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Aqua Galon 19L"
              className={`w-full p-4 bg-slate-50 border border-slate-100 ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/10 font-bold text-sm text-slate-900`}
            />
          </div>

          <div className="space-y-2">
            <label className={UI_TEXT.label}>Kategori (Produk)</label>
            <input
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Contoh: Galon, Gas, ATK"
              className={`w-full p-4 bg-slate-50 border border-slate-100 ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/10 font-bold text-sm text-slate-900`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={UI_TEXT.label}>Harga Beli (Modal)</label>
              <div className="relative">
                <span className="absolute left-4 top-4 text-slate-400 text-xs font-bold">Rp</span>
                <input
                  required
                  type="number"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  className={`w-full p-4 pl-12 bg-slate-50 border border-slate-100 ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/10 font-bold text-sm text-slate-900`}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className={UI_TEXT.label}>Harga Jual</label>
              <div className="relative">
                <span className="absolute left-4 top-4 text-slate-400 text-xs font-bold">Rp</span>
                <input
                  required
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className={`w-full p-4 pl-12 bg-slate-50 border border-slate-100 ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/10 font-black text-sm text-blue-600`}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className={UI_TEXT.label}>Stok Tersedia</label>
            <input
              required
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              placeholder="0"
              className={`w-full p-4 bg-slate-50 border border-slate-100 ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/10 font-bold text-sm text-slate-900`}
            />
          </div>
          <div className="space-y-2">
            <label className={UI_TEXT.label}>Status Produk</label>
            <select
              value={formData.status || 'aktif'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className={`w-full p-4 bg-slate-50 border border-slate-100 ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/10 font-bold text-sm text-slate-900`}
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className={`bg-white w-full max-w-lg ${UI_RADIUS.outer} shadow-2xl overflow-hidden animate-in zoom-in duration-300`}>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white z-10">
          <h3 className="font-bold text-slate-900">{user ? 'Edit User' : 'Tambah User Baru'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          <div className="space-y-2">
            <label className={UI_TEXT.label}>Nama Lengkap</label>
            <input
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                setErrors({ ...errors, name: '' });
              }}
              placeholder="Masukkan nama lengkap"
              className={`w-full p-4 bg-slate-50 border ${errors.name ? 'border-rose-400' : 'border-slate-100'} ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/10 font-bold text-sm text-slate-900`}
            />
            {errors.name && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <label className={UI_TEXT.label}>Username</label>
            <input
              value={formData.username}
              onChange={(e) => {
                setFormData({ ...formData, username: e.target.value });
                setErrors({ ...errors, username: '' });
              }}
              placeholder="Username akun"
              className={`w-full p-4 bg-slate-50 border ${errors.username ? 'border-rose-400' : 'border-slate-100'} ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/10 font-bold text-sm text-slate-900`}
            />
            {errors.username && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.username}</p>}
          </div>

          <div className="space-y-2">
            <label className={UI_TEXT.label}>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                setErrors({ ...errors, password: '' });
              }}
              placeholder="Password akun"
              className={`w-full p-4 bg-slate-50 border ${errors.password ? 'border-rose-400' : 'border-slate-100'} ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/10 font-bold text-sm text-slate-900`}
            />
            {errors.password && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.password}</p>}
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-50">
            <p className={UI_TEXT.label}>Hak Akses Modul</p>
            <div className="grid grid-cols-2 gap-3">
              {['dashboard', 'transactions', 'products', 'finance', 'profit_report', 'settings', 'users'].map(perm => (
                <label key={perm} className={`flex items-center gap-3 p-3 border ${formData.permissions.includes(perm) ? 'border-blue-500 bg-blue-50/30' : 'border-slate-100'} ${UI_RADIUS.inner} cursor-pointer group transition-all`}>
                  <input
                    type="checkbox"
                    checked={formData.permissions.includes(perm)}
                    onChange={() => togglePermission(perm)}
                    className="w-4 h-4 accent-blue-600 rounded"
                  />
                  <span className={`text-[10px] font-bold uppercase tracking-tight ${formData.permissions.includes(perm) ? 'text-blue-600' : 'text-slate-500'}`}>{perm.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-6 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-4 text-slate-500 font-bold text-sm hover:bg-slate-50 rounded-xl transition-all">Batal</button>
            <button type="submit" className={`${UI_BUTTON.base} ${UI_BUTTON.primary} flex-[2] py-4 ${UI_RADIUS.inner}`}>
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1600px] w-full px-4 md:px-8 mx-auto">
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 ${UI_RADIUS.outer} border border-slate-100 shadow-sm`}>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-100">
            <Calendar size={16} className="ml-2 text-slate-400" />
            <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="bg-transparent text-sm font-bold text-slate-700 p-2 outline-none">
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
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
        <div className={`p-8 bg-white ${UI_RADIUS.outer} border border-slate-100 shadow-sm`}>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 text-emerald-600">Omzet Berhasil</p>
          <p className="text-2xl font-black text-slate-900 tracking-tighter">{formatIDR(yearlyTotal.revenue)}</p>
        </div>
        <div className={`p-8 bg-white ${UI_RADIUS.outer} border border-slate-100 shadow-sm`}>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 text-blue-600">Transaksi Selesai</p>
          <p className="text-2xl font-black text-slate-900 tracking-tighter">{yearlyTotal.success} Pesanan</p>
        </div>
      </div>

      <div className={`bg-white ${UI_RADIUS.outer} border border-slate-100 shadow-sm overflow-hidden`}>
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
  const [editingFormula, setEditingFormula] = useState(false);
  const [tempFormula, setTempFormula] = useState({
    marbotPercent: settings?.marbotPercent || 60,
    musholaPercent: settings?.musholaPercent || 0,
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
      const savedData = monthlyReports?.find(r => r.id === reportId) || {};

      const mP = savedData.marbotPercent !== undefined ? savedData.marbotPercent : (settings?.marbotPercent || 60);
      const msP = savedData.musholaPercent !== undefined ? savedData.musholaPercent : (settings?.musholaPercent || 0);
      const iP = savedData.internalPercent !== undefined ? savedData.internalPercent : (settings?.internalPercent || 40);

      return {
        id: reportId,
        monthName,
        profit,
        marbotPercent: mP,
        musholaPercent: msP,
        internalPercent: iP,
        status: savedData.status || 'menunggu',
        notes: savedData.notes || ''
      };
    });
  }, [transactions, selectedYear, products, monthlyReports, settings]);

  const handleSaveFormula = async () => {
    const total = Number(tempFormula.marbotPercent) + Number(tempFormula.musholaPercent) + Number(tempFormula.internalPercent);
    if (total > 100) {
      alert('Total persentase tidak boleh melebihi 100%!');
      return;
    }

    if (editingMonthFormula) {
      // Per Month Override
      saveMonthlyReport(editingMonthFormula.id, {
        marbotPercent: Number(tempFormula.marbotPercent),
        musholaPercent: Number(tempFormula.musholaPercent),
        internalPercent: Number(tempFormula.internalPercent)
      });
      setEditingMonthFormula(null);
    } else {
      // Master Formula
      saveSettings({
        ...settings,
        marbotPercent: Number(tempFormula.marbotPercent),
        musholaPercent: Number(tempFormula.musholaPercent),
        internalPercent: Number(tempFormula.internalPercent)
      });

      if (applyToAll) {
        // Apply to all months of all active years (simplified to existing reports or just logic)
        // Usually, we iterate through months of current year at least
        for (let i = 0; i < 12; i++) {
          const mId = `${selectedYear}-${i}`;
          saveMonthlyReport(mId, {
            marbotPercent: Number(tempFormula.marbotPercent),
            musholaPercent: Number(tempFormula.musholaPercent),
            internalPercent: Number(tempFormula.internalPercent)
          });
        }
      }
      setEditingFormula(false);
    }
    setApplyToAll(false);
  };

  const marbotP = settings?.marbotPercent || 60;
  const musholaP = settings?.musholaPercent || 0;
  const internalP = settings?.internalPercent || 40;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1600px] w-full px-4 md:px-8 mx-auto">
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 ${UI_RADIUS.outer} border border-slate-100 shadow-sm`}>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-100 px-3">
            <Calendar size={14} className="text-slate-400" />
            <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="bg-transparent text-xs font-bold text-slate-700 py-1.5 outline-none">
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <button
            onClick={() => {
              setTempFormula({ marbotPercent: marbotP, musholaPercent: musholaP, internalPercent: internalP });
              setEditingFormula(true);
            }}
            className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold text-xs ${UI_RADIUS.inner} shadow-lg shadow-blue-500/20 active:scale-95 transition-all`}
          >
            <Settings size={14} /> Atur Formula
          </button>
        </div>
      </div>

      <div className={`bg-white ${UI_RADIUS.outer} border border-slate-100 shadow-sm overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4">Bulan</th>
                <th className="px-6 py-4">Total Profit</th>
                <th className="px-6 py-4 text-center">Formula</th>
                <th className="px-6 py-4">Marbot</th>
                <th className="px-6 py-4">Mushola</th>
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
                        setTempFormula({ marbotPercent: s.marbotPercent, musholaPercent: s.musholaPercent, internalPercent: s.internalPercent });
                        setEditingMonthFormula(s);
                      }}
                      className="group flex flex-col items-center justify-center p-2 hover:bg-slate-100 rounded-lg transition-all"
                    >
                      <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-600 transition-colors uppercase tracking-widest">{s.marbotPercent}:{s.musholaPercent}:{s.internalPercent}</span>
                      <Settings size={10} className="text-slate-300 group-hover:text-blue-500 mt-0.5" />
                    </button>
                  </td>
                  <td className="px-6 py-5 text-emerald-600 font-bold">{formatIDR(s.profit * (s.marbotPercent / 100))}</td>
                  <td className="px-6 py-5 text-amber-600 font-bold">{formatIDR(s.profit * (s.musholaPercent / 100))}</td>
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
                  <span>Mushola (%)</span>
                  <span className="text-amber-600">{tempFormula.musholaPercent}%</span>
                </div>
                <input
                  type="range" min="0" max="100" step="5"
                  value={tempFormula.musholaPercent}
                  onChange={(e) => setTempFormula({ ...tempFormula, musholaPercent: Number(e.target.value) })}
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

              <div className={`p-4 rounded-xl flex justify-between items-center ${Number(tempFormula.marbotPercent) + Number(tempFormula.musholaPercent) + Number(tempFormula.internalPercent) > 100 ? 'bg-rose-50 border border-rose-100 text-rose-600' : 'bg-blue-50 border border-blue-100 text-blue-600'}`}>
                <span className="text-xs font-bold uppercase">Total Alokasi</span>
                <span className="font-black text-lg">{Number(tempFormula.marbotPercent) + Number(tempFormula.musholaPercent) + Number(tempFormula.internalPercent)}%</span>
              </div>

              {Number(tempFormula.marbotPercent) + Number(tempFormula.musholaPercent) + Number(tempFormula.internalPercent) > 100 && (
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
              disabled={Number(tempFormula.marbotPercent) + Number(tempFormula.musholaPercent) + Number(tempFormula.internalPercent) > 100}
              className={`w-full py-4 text-white font-black text-sm ${UI_RADIUS.inner} shadow-lg transition-all ${Number(tempFormula.marbotPercent) + Number(tempFormula.musholaPercent) + Number(tempFormula.internalPercent) > 100 ? 'bg-slate-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'}`}
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
function TransactionList({ transactions, products, onDetail, updateStatus }) {
  const flattenedItems = useMemo(() => {
    let globalIdx = 1;
    const result = [];

    // Sort transactions by date desc before flattening
    const sortedTx = [...(transactions || [])].sort((a, b) => {
      const dateA = a.date instanceof Date ? a.date : new Date(a.date);
      const dateB = b.date instanceof Date ? b.date : new Date(b.date);
      return dateB - dateA;
    });

    sortedTx.forEach(t => {
      const d = t.date instanceof Date ? t.date : new Date(t.date);
      const day = d.getDate().toString().padStart(2, '0');
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const year = d.getFullYear();
      const tanggalPesanan = `${day}/${month}/${year}`;
      const bulan = d.getMonth() + 1;
      const tahun = d.getFullYear();

      t.items.forEach(item => {
        const productInfo = products?.find(p => p.id === item.id) || {};
        const hargaModal = productInfo.cost || 0;
        const totalHargaModal = hargaModal * item.qty;
        const hargaJual = item.price || 0;
        const totalHargaJual = hargaJual * item.qty;
        const profit = totalHargaJual - totalHargaModal;

        result.push({
          no: globalIdx++,
          tanggalPesanan,
          bulan,
          tahun,
          nomorRumah: t.address || t.customer, // Map from address as requested
          kodeBarang: productInfo.customId || '-',
          namaBarang: item.name,
          jumlah: item.qty,
          hargaModal,
          totalHargaModal,
          hargaJual,
          totalHargaJual,
          caraPembayaran: t.method === 'transfer' ? 'Transfer' : 'Cash',
          catatan: t.notes || '-',
          profit,
          // Extra info for actions
          txId: t.id,
          paymentStatus: t.paymentStatus,
          shippingStatus: t.shippingStatus,
          originalTx: t
        });
      });
    });
    return result;
  }, [transactions, products]);

  return (
    <div className="space-y-4">
      {/* Mobile view: Improved Responsive Cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {transactions.map(t => (
          <div key={t.id} className={`p-5 bg-white border border-slate-100 ${UI_RADIUS.inner} shadow-sm space-y-4`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.time}</p>
                <p className="font-extrabold text-slate-900 text-base mt-1">{t.customer}</p>
                <p className="text-[11px] text-slate-500 mt-1 leading-tight font-medium">{t.address}</p>
              </div>
              <button
                onClick={() => onDetail(t)}
                className={`p-3 bg-slate-50 text-blue-600 ${UI_RADIUS.inner} active:scale-95 transition-all outline-none`}
              >
                <Eye size={20} />
              </button>
            </div>

            <div className="space-y-2 border-t border-slate-50 pt-4">
              {t.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 font-medium">{item.qty}x {item.name}</span>
                  <span className="font-bold text-slate-900">{formatIDR(item.price * item.qty)}</span>
                </div>
              ))}
            </div>

            <div className={`flex justify-between items-center bg-slate-50/50 p-4 ${UI_RADIUS.inner} border border-slate-50`}>
              <div className="flex flex-col">
                <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest">Total Bayar</span>
                <span className="text-blue-600 font-black text-xl tracking-tight">{formatIDR(t.total)}</span>
              </div>
              <span className={`px-2.5 py-1 bg-white border border-slate-100 ${UI_RADIUS.inner} text-[10px] font-black text-slate-500 uppercase tracking-tighter shadow-sm`}>
                {t.method === 'transfer' ? 'Transfer' : 'Cash'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="space-y-1.5">
                <label className={UI_TEXT.label}>Bayar</label>
                <select
                  value={t.paymentStatus}
                  onChange={(e) => updateStatus(t.id, 'paymentStatus', e.target.value)}
                  className={`w-full text-[11px] font-black uppercase p-3 ${UI_RADIUS.inner} border-0 outline-none cursor-pointer transition-colors ${t.paymentStatus === 'lunas' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}
                >
                  <option value="menunggu">Unpaid</option>
                  <option value="lunas">Lunas</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className={UI_TEXT.label}>Kirim</label>
                <select
                  value={t.shippingStatus}
                  onChange={(e) => updateStatus(t.id, 'shippingStatus', e.target.value)}
                  className={`w-full text-[11px] font-black uppercase p-3 ${UI_RADIUS.inner} border-0 outline-none cursor-pointer transition-colors ${t.shippingStatus === 'dikirim' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'}`}
                >
                  <option value="menunggu">Pending</option>
                  <option value="dikirim">Dikirim</option>
                </select>
              </div>
            </div>
          </div>
        ))}
        {transactions.length === 0 && (
          <div className={`text-center py-10 bg-slate-50/50 ${UI_RADIUS.inner} border border-dashed border-slate-200`}>
            <p className="text-slate-400 text-xs font-medium">Tidak ada transaksi ditemukan</p>
          </div>
        )}
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left min-w-[1500px]">
          <thead>
            <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
              <th className="py-4 px-4 text-center">No</th>
              <th className="py-4 px-4">Tanggal pesanan</th>
              <th className="py-4 px-4 text-center">Bulan</th>
              <th className="py-4 px-4 text-center">Tahun</th>
              <th className="py-4 px-4">Nomor Rumah</th>
              <th className="py-4 px-4">Kode Barang</th>
              <th className="py-4 px-4">Nama Barang</th>
              <th className="py-4 px-4 text-center">Jumlah</th>
              <th className="py-4 px-4 text-right">Harga Modal</th>
              <th className="py-4 px-4 text-right">Total Modal</th>
              <th className="py-4 px-4 text-right text-blue-600/70">Harga Jual</th>
              <th className="py-4 px-4 text-right text-blue-600">Total Jual</th>
              <th className="py-4 px-4">Metode</th>
              <th className="py-4 px-4">Catatan</th>
              <th className="py-4 px-4 text-right">Profit</th>
              <th className="py-4 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {flattenedItems.map((item, i) => (
              <tr key={`${item.txId}-${i}`} className="text-[12px] hover:bg-slate-50/50 transition-colors group">
                <td className="py-4 px-4 text-center text-slate-400 font-medium">{item.no}</td>
                <td className="py-4 px-4 whitespace-nowrap font-medium text-slate-600">{item.tanggalPesanan}</td>
                <td className="py-4 px-4 text-center font-bold text-slate-500">{item.bulan}</td>
                <td className="py-4 px-4 text-center font-bold text-slate-500">{item.tahun}</td>
                <td className="py-4 px-4 font-extrabold text-slate-900">{item.nomorRumah}</td>
                <td className="py-4 px-4 font-mono text-[10px] text-slate-500">{item.kodeBarang}</td>
                <td className="py-4 px-4 font-bold text-slate-800">{item.namaBarang}</td>
                <td className="py-4 px-4 text-center font-black text-blue-600">{item.jumlah}</td>
                <td className="py-4 px-4 text-right text-slate-500">{formatIDR(item.hargaModal)}</td>
                <td className="py-4 px-4 text-right font-bold text-slate-600">{formatIDR(item.totalHargaModal)}</td>
                <td className="py-4 px-4 text-right font-bold text-blue-600/70">{formatIDR(item.hargaJual)}</td>
                <td className="py-4 px-4 text-right font-black text-blue-600">{formatIDR(item.totalHargaJual)}</td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter ${item.caraPembayaran === 'Transfer' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {item.caraPembayaran}
                  </span>
                </td>
                <td className="py-4 px-4 text-slate-400 italic max-w-[150px] truncate font-medium">{item.catatan}</td>
                <td className="py-4 px-4 text-right font-black text-emerald-600 text-sm">{formatIDR(item.profit)}</td>
                <td className="py-4 px-4 text-center">
                  <button
                    onClick={() => onDetail(item.originalTx)}
                    className={`p-2 text-slate-300 hover:text-blue-600 rounded-lg hover:bg-white transition-all`}
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {flattenedItems.length === 0 && (
          <div className="text-center py-10">
            <p className="text-slate-400 text-xs font-medium">Tidak ada data transaksi ditemukan</p>
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
        cost: product.cost,
        price: product.price,
        qty: quantity,
        profit: (product.price - product.cost) * quantity
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

            <div className="bg-slate-50 border border-slate-100 overflow-hidden md:rounded-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-white border-b border-slate-100 text-slate-400 font-bold uppercase tracking-tighter">
                    <tr>
                      <th className="py-3 px-4">Nama Barang</th>
                      <th className="py-3 px-2 text-center">Qty</th>
                      <th className="py-3 px-2 text-right">Modal</th>
                      <th className="py-3 px-2 text-right">Jual</th>
                      <th className="py-3 px-2 text-right">Profit</th>
                      <th className="py-3 px-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {formData.items.map((item, idx) => (
                      <tr key={idx} className="bg-white/50">
                        <td className="py-3 px-4 font-bold text-slate-700">{item.name}</td>
                        <td className="py-3 px-2 text-center font-black text-blue-600">{item.qty}</td>
                        <td className="py-3 px-2 text-right text-slate-400">{formatIDR(item.cost * item.qty)}</td>
                        <td className="py-3 px-2 text-right font-bold text-slate-900">{formatIDR(item.price * item.qty)}</td>
                        <td className="py-3 px-2 text-right font-bold text-emerald-600">{formatIDR(item.profit)}</td>
                        <td className="py-3 px-4 text-center text-rose-500">
                          <button type="button" onClick={() => removeItem(idx)} className="p-1 hover:bg-rose-50 rounded"><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {formData.items.length === 0 && (
                <div className="py-8 text-center text-slate-400 italic text-xs">Belum ada item ditambahkan</div>
              )}
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
                <option value="cod">Bayar di Tempat</option>
                <option value="transfer">Transfer Bank</option>
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
    <div className={`bg-white ${UI_SPACING.card} ${UI_RADIUS.outer} border border-white shadow-sm flex items-center gap-5 transition-all hover:shadow-md group`}>
      <div className={`w-14 h-14 ${color} ${UI_RADIUS.inner} flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      <div className="min-w-0">
        <p className={`${UI_TEXT.label} mb-1 opacity-70`}>{label}</p>
        <p className="text-2xl font-black text-slate-900 tracking-tight">{val}</p>
      </div>
    </div>
  );
}

// --- MAIN ADMIN LAYOUT ---
export default function AdminDashboard({
  products, saveProduct, deleteProduct,
  users, setUsers, saveUser, deleteUser, settings, setSettings, saveSettings, mobileMenuOpen, setMobileMenuOpen,
  handleLogout, onCustomerView, transactions, saveTransaction, deleteTransaction, updateTransactionStatus,
  monthlyReports, saveMonthlyReport, currentUserData
}) {
  const { tab: adminTab = 'dashboard' } = useParams();
  const navigate = useNavigate();
  const setAdminTab = (newTab) => navigate(`/dashboard/${newTab}`);

  const [selectedTx, setSelectedTx] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [visibleTransactions, setVisibleTransactions] = useState(20);
  const [visibleProducts, setVisibleProducts] = useState(20);
  const [visibleUsers, setVisibleUsers] = useState(20);
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const fileInputRef = useRef(null);

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
      t.method === 'transfer' ? 'Transfer Bank' : 'Bayar di Tempat',
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

  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n');
      const headers = lines[0].split(',');

      const newTransactions = lines.slice(1).filter(line => line.trim()).map(line => {
        const values = line.split(',');
        const t = {};
        headers.forEach((h, i) => {
          const key = h.trim().toLowerCase().replace(' ', '');
          let val = values[i]?.replace(/"/g, '').trim();

          if (key === 'total' || key === 'harga' || key === 'price') val = Number(val) || 0;
          if (key === 'items') {
            // Very simple parser for items like "2x Aqua, 1x Gas"
            val = val.split(';').map(itemStr => {
              const [qty, ...nameParts] = itemStr.trim().split('x ');
              return { qty: Number(qty) || 1, name: nameParts.join('x ').trim(), price: 0 }; // Price will be updated from products later if needed
            });
          }
          t[key] = val;
        });

        return {
          id: Date.now() + Math.random().toString(36).substr(2, 9),
          date: t.tanggal ? new Date(t.tanggal).toISOString() : new Date().toISOString(),
          time: t.tanggal || new Date().toLocaleString(),
          customer: t.pelanggan || 'Imported Customer',
          phone: t.whatsapp || '',
          address: t.alamat || '',
          items: t.items || [],
          total: t.total || 0,
          method: (t.metode || '').toLowerCase().includes('transfer') ? 'transfer' : 'cash',
          paymentStatus: t.statusbayar || 'menunggu',
          shippingStatus: t.statuskirim || 'menunggu',
          notes: t.catatan || ''
        };
      });

      if (newTransactions.length > 0) {
        newTransactions.forEach(tx => saveTransaction(tx));
        alert(`Berhasil mengimpor ${newTransactions.length} transaksi!`);
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  const filteredTransactions = useMemo(() => {
    return (transactions || []).filter(t => {
      if (!t.date) return false;
      const d = (t.date instanceof Date) ? t.date : new Date(t.date);
      if (isNaN(d.getTime())) return false;
      return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    });
  }, [transactions, selectedMonth, selectedYear]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-100 p-8 transform transition-transform duration-500 md:translate-x-0 flex flex-col ${mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        <div className="mb-12">
          <h1 className={UI_TEXT.h1}>{settings.martName || 'Mart Admin'}</h1>
          <p className={UI_TEXT.caption}>Welcome back, <span className="text-blue-600 font-bold">{currentUserData?.name || 'Admin'}</span></p>
        </div>
        <nav className="flex-1 space-y-1.5">
          {filteredMenuOptions.map(m => {
            const iconMap = {
              'LayoutDashboard': LayoutDashboard,
              'ShoppingCart': ShoppingCart,
              'Package': Package,
              'DollarSign': DollarSign,
              'FileText': FileText,
              'Users': Users,
              'Settings': Settings
            };
            const IconComponent = iconMap[m.icon];
            return (
              <button
                key={m.id}
                onClick={() => { setAdminTab(m.id); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3.5 px-5 py-4 ${UI_RADIUS.inner} transition-all font-bold text-sm ${adminTab === m.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <div className="w-6 flex justify-center shrink-0">
                  <IconComponent size={20} />
                </div>
                <span className="truncate">{m.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="pt-8 mt-8 border-t border-slate-50 space-y-3">
          <button onClick={onCustomerView} className={`${UI_BUTTON.base} ${UI_BUTTON.secondary} ${UI_RADIUS.inner} w-full`}><Eye size={18} /> View Store</button>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2.5 px-5 py-4 text-rose-500 hover:bg-rose-50 font-bold text-xs transition active:scale-95"><LogOut size={18} /> Logout</button>
        </div>
      </aside>

      {mobileMenuOpen && <div className="fixed inset-0 bg-slate-900/40 z-30 md:hidden backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />}

      <main className="flex-1 p-6 md:p-14 ml-0 md:ml-72 transition-all flex flex-col">
        <header className="flex items-center justify-between mb-12">
          <div>
            <h2 className={UI_TEXT.h2}>{MENU_OPTIONS.find(m => m.id === adminTab)?.label}</h2>
            <p className={UI_TEXT.caption}>Manage your mart operations efficiently.</p>
          </div>
          <button onClick={() => setMobileMenuOpen(true)} className={`p-3 bg-white ${UI_RADIUS.inner} border border-slate-200 md:hidden shadow-sm text-slate-600 active:scale-95 transition-all`}><Menu size={24} /></button>
        </header>

        {adminTab === 'dashboard' && (
          <div className={`animate-in fade-in slide-in-from-bottom-4 duration-500 ${UI_SPACING.section}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard label="Total Transaksi" val={(transactions || []).length} icon={ShoppingCart} />
              <StatCard label="Total Produk" val={(products || []).length} icon={Package} color="bg-emerald-50 text-emerald-600" />
              <StatCard label="Total User" val={(users || []).length} icon={Users} color="bg-amber-50 text-amber-600" />
              <StatCard label="Total Penjualan" val={formatIDR((transactions || []).reduce((sum, t) => sum + t.total, 0))} icon={DollarSign} color="bg-indigo-50 text-indigo-600" />
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className={UI_TEXT.h2}>Pesanan Terbaru</h2>
                <button onClick={() => setAdminTab('transactions')} className="text-blue-600 font-bold text-xs hover:underline">Lihat Selengkapnya</button>
              </div>
              <div className={`bg-white border border-slate-100 shadow-sm overflow-hidden md:rounded-2xl`}>
                <TransactionList
                  updateStatus={updateTransactionStatus}
                  transactions={(transactions || []).slice().sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)}
                  products={products}
                  onDetail={setSelectedTx}
                />
              </div>
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
          <div className={`animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1600px] w-full px-4 md:px-8 mx-auto ${UI_SPACING.section}`}>
            <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
              <div className="flex gap-2 w-full sm:w-auto">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImportCSV}
                  accept=".csv"
                  className="hidden"
                />
                <button onClick={() => fileInputRef.current?.click()} className={`${UI_BUTTON.base} ${UI_BUTTON.secondary} ${UI_RADIUS.inner} flex-1 sm:flex-none text-blue-600 border-blue-100 hover:bg-blue-50`}>
                  <Download size={18} className="rotate-180" /> Import
                </button>
                <button onClick={handleExportCSV} className={`${UI_BUTTON.base} ${UI_BUTTON.secondary} ${UI_RADIUS.inner} flex-1 sm:flex-none`}>
                  <Download size={18} /> Export
                </button>
                <button onClick={() => setIsAddingTransaction(true)} className={`${UI_BUTTON.base} ${UI_BUTTON.primary} ${UI_RADIUS.inner} flex-1 sm:flex-none`}>
                  <Plus size={18} /> Tambah
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className={`p-2.5 bg-white border border-slate-200 ${UI_RADIUS.inner} text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/10`}
              >
                {monthsList.map((m, i) => <option key={i} value={i}>{m}</option>)}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className={`p-2.5 bg-white border border-slate-200 ${UI_RADIUS.inner} text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/10`}
              >
                {yearsList.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            <div className="bg-white border border-slate-100 shadow-sm overflow-hidden md:rounded-2xl">
              <TransactionList
                updateStatus={updateTransactionStatus}
                transactions={filteredTransactions.slice(0, visibleTransactions)}
                products={products}
                onDetail={setSelectedTx}
              />
            </div>
            {filteredTransactions.length > visibleTransactions && (
              <button onClick={() => setVisibleTransactions(prev => prev + 20)} className={`w-full mt-6 py-4 bg-white text-slate-500 font-bold text-xs ${UI_RADIUS.inner} border border-slate-100 hover:bg-slate-50 transition-all`}>
                Muat Lebih Banyak ({filteredTransactions.length - visibleTransactions} Tersisa)
              </button>
            )}
          </div>
        )}

        {adminTab === 'products' && (
          <div className={`animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1600px] w-full px-4 md:px-8 mx-auto ${UI_SPACING.section}`}>
            <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
              <button onClick={() => setIsAddingProduct(true)} className={`${UI_BUTTON.base} ${UI_BUTTON.primary} ${UI_RADIUS.inner} w-full sm:w-auto`}>
                <Plus size={18} /> Tambah Produk
              </button>
            </div>

            <div className="bg-white border border-slate-100 shadow-sm overflow-hidden md:rounded-2xl">
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`border-b border-slate-50 ${UI_TEXT.label} bg-slate-50/50`}>
                      <th className="py-4 px-6 border-b">No</th>
                      <th className="py-4 px-6 border-b">Kode Barang</th>
                      <th className="py-4 px-6 border-b">Nama Barang</th>
                      <th className="py-4 px-6 border-b">Kategori</th>
                      <th className="py-4 px-6 border-b text-right">Harga Modal</th>
                      <th className="py-4 px-6 border-b text-right">Harga Jual</th>
                      <th className="py-4 px-6 border-b text-center">Stok</th>
                      <th className="py-4 px-6 border-b text-center">Status</th>
                      <th className="py-4 px-6 border-b text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {(products || []).slice(0, visibleProducts).map((p, idx) => (
                      <tr key={p.id} className="text-sm hover:bg-slate-50/50 transition-colors group">
                        <td className="py-4 px-6 text-slate-400 font-medium">{idx + 1}</td>
                        <td className="py-4 px-6 font-mono text-[11px] text-slate-700">{p.customId || `SKU-${p.id}`}</td>
                        <td className="py-4 px-6 font-bold text-slate-900">{p.name}</td>
                        <td className="py-4 px-6">
                          <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-[10px] font-black uppercase text-slate-500 tracking-tight">{p.category || '-'}</span>
                        </td>
                        <td className="py-4 px-6 text-right font-medium text-slate-600">{formatIDR(p.cost)}</td>
                        <td className="py-4 px-6 text-right font-black text-blue-600">{formatIDR(p.price)}</td>
                        <td className="py-4 px-6 text-center">
                          <span className={`font-bold ${p.stock < 10 ? 'text-rose-500' : 'text-slate-900'}`}>{p.stock}</span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${p.status === 'aktif' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                            {p.status || 'aktif'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => setEditingProduct(p)} className="p-2 text-slate-300 hover:text-blue-600 hover:bg-white rounded-lg transition-all"><Edit size={16} /></button>
                            <button onClick={() => deleteProduct(p.id)} className="p-2 text-slate-300 hover:text-rose-600 hover:bg-white rounded-lg transition-all"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-slate-50">
                {(products || []).slice(0, visibleProducts).map((p) => (
                  <div key={p.id} className="p-5 flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">SKU: {p.customId || p.id}</span>
                          <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[8px] font-black uppercase">{p.category || 'General'}</span>
                        </div>
                        <h3 className="font-extrabold text-slate-900 text-sm leading-tight">{p.name}</h3>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => setEditingProduct(p)} className="p-2 bg-slate-50 text-blue-600 rounded-lg"><Edit size={16} /></button>
                        <button onClick={() => deleteProduct(p.id)} className="p-2 bg-rose-50 text-rose-600 rounded-lg"><Trash2 size={16} /></button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Harga Jual</p>
                        <p className="text-sm font-black text-blue-600">{formatIDR(p.price)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Stok</p>
                        <p className={`text-sm font-black ${p.stock < 10 ? 'text-rose-500' : 'text-slate-900'}`}>{p.stock}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {products.length > visibleProducts && (
              <button onClick={() => setVisibleProducts(prev => prev + 20)} className={`w-full py-4 bg-white text-slate-500 font-bold text-xs ${UI_RADIUS.inner} border border-slate-100 hover:bg-slate-50 transition-all`}>
                Muat Lebih Banyak ({products.length - visibleProducts} Tersisa)
              </button>
            )}
          </div>
        )}

        {adminTab === 'users' && (
          <div className={`animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1600px] w-full px-4 md:px-8 mx-auto ${UI_SPACING.section}`}>
            <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
              <button onClick={() => setIsAddingUser(true)} className={`${UI_BUTTON.base} ${UI_BUTTON.primary} ${UI_RADIUS.inner} w-full sm:w-auto`}>
                <Plus size={18} /> User Baru
              </button>
            </div>

            <div className={`bg-white border border-slate-100 shadow-sm overflow-hidden md:rounded-2xl`}>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      <th className="py-4 px-6">No</th>
                      <th className="py-4 px-6">Nama</th>
                      <th className="py-4 px-6">Username</th>
                      <th className="py-4 px-6">Hak Akses</th>
                      <th className="py-4 px-6 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {users.map((u, idx) => (
                      <tr key={u.id} className="text-sm hover:bg-slate-50/50 transition-colors group">
                        <td className="py-4 px-6 text-slate-400 font-medium">{idx + 1}</td>
                        <td className="py-4 px-6 font-bold text-slate-900">{u.name}</td>
                        <td className="py-4 px-6 font-mono text-[11px] text-slate-500">@{u.username}</td>
                        <td className="py-4 px-6">
                          <div className="flex flex-wrap gap-1">
                            {u.permissions.map(p => (
                              <span key={p} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[8px] font-black uppercase tracking-tighter">{p.replace('_', ' ')}</span>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => setEditingUser(u)} className="p-2 text-slate-300 hover:text-blue-600 hover:bg-white rounded-lg transition-all"><Edit size={16} /></button>
                            <button onClick={() => handleDeleteUser(u.id)} className="p-2 text-slate-300 hover:text-rose-600 hover:bg-white rounded-lg transition-all"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-slate-50">
                {users.map(u => (
                  <div key={u.id} className="p-5 flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                          <Users size={18} />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-slate-900 text-sm leading-tight">{u.name}</h3>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">@{u.username}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => setEditingUser(u)} className="p-2 bg-slate-50 text-blue-600 rounded-lg"><Edit size={16} /></button>
                        <button onClick={() => handleDeleteUser(u.id)} className="p-2 bg-rose-50 text-rose-600 rounded-lg"><Trash2 size={16} /></button>
                      </div>
                    </div>
                    <div className="space-y-2 pt-4 border-t border-slate-50">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Hak Akses</p>
                      <div className="flex flex-wrap gap-1">
                        {u.permissions.map(p => (
                          <span key={p} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[8px] font-black uppercase tracking-tighter">{p.replace('_', ' ')}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {adminTab === 'settings' && (
          <div className={`animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1600px] w-full px-4 md:px-8 mx-auto ${UI_SPACING.section}`}>
            <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
              <button onClick={handleSettingsSave} className={`${UI_BUTTON.base} ${UI_BUTTON.primary} ${UI_RADIUS.inner} w-full sm:w-auto`}>
                <Download size={18} /> Simpan Perubahan
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className={`bg-white ${UI_SPACING.card} ${UI_RADIUS.outer} border border-slate-100 shadow-sm space-y-8`}>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Archive size={18} /></div>
                    Identitas Toko
                  </h3>
                  <div className="space-y-5">
                    <div className="space-y-1.5">
                      <label className={UI_TEXT.label}>Nama Mart</label>
                      <input
                        value={settings.martName}
                        onChange={(e) => setSettings({ ...settings, martName: e.target.value })}
                        className={`w-full p-4 bg-slate-50 border border-slate-100 ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm font-medium`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={UI_TEXT.label}>WhatsApp Admin</label>
                      <input
                        value={settings.adminPhone}
                        onChange={(e) => setSettings({ ...settings, adminPhone: e.target.value })}
                        className={`w-full p-4 bg-slate-50 border border-slate-100 ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm font-medium`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className={`bg-white ${UI_SPACING.card} ${UI_RADIUS.outer} border border-slate-100 shadow-sm space-y-8`}>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><DollarSign size={18} /></div>
                    Informasi Pembayaran (Transfer Bank)
                  </h3>
                  <div className="space-y-5">
                    <div className="space-y-1.5">
                      <label className={UI_TEXT.label}>Nama Bank</label>
                      <input
                        value={settings.bankName}
                        onChange={(e) => setSettings({ ...settings, bankName: e.target.value })}
                        className={`w-full p-4 bg-slate-50 border border-slate-100 ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm font-medium`}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className={UI_TEXT.label}>No. Rekening</label>
                        <input
                          value={settings.bankAccountNumber}
                          onChange={(e) => setSettings({ ...settings, bankAccountNumber: e.target.value })}
                          className={`w-full p-4 bg-slate-50 border border-slate-100 ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm font-medium`}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className={UI_TEXT.label}>Atas Nama</label>
                        <input
                          value={settings.bankAccountName}
                          onChange={(e) => setSettings({ ...settings, bankAccountName: e.target.value })}
                          className={`w-full p-4 bg-slate-50 border border-slate-100 ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm font-medium`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
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
                <p className={UI_TEXT.caption}>{selectedTx.time}</p>
              </div>
              <button onClick={() => setSelectedTx(null)} className="p-2 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-lg transition-colors"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className={UI_TEXT.label}>Pemesan</label>
                  <p className="font-bold text-slate-800">{selectedTx.customer}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium"><Phone size={12} /> {selectedTx.phone}</p>
                </div>
                <div>
                  <label className={UI_TEXT.label}>Alamat</label>
                  <p className="text-xs text-slate-600 leading-relaxed font-semibold">{selectedTx.address}</p>
                </div>
              </div>

              <div>
                <label className={UI_TEXT.label}>Metode Pembayaran</label>
                <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5 capitalize">
                  <CreditCard size={14} className="text-blue-500" /> {selectedTx.method === 'transfer' ? 'Transfer Bank' : 'Bayar di Tempat'}
                </p>
              </div>

              <div>
                <label className={UI_TEXT.label}>Item Dipesan</label>
                <div className="space-y-2 mt-3">
                  {selectedTx.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm py-3 border-b border-slate-50 last:border-0">
                      <span className="font-medium text-slate-700">{item.qty}x {item.name}</span>
                      <span className="font-bold text-slate-900">{formatIDR(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className={UI_TEXT.label}>Catatan Internal</label>
                <div className="relative mt-2">
                  <textarea
                    defaultValue={selectedTx.notes || ''}
                    onBlur={(e) => updateTransactionStatus(selectedTx.id, 'notes', e.target.value)}
                    placeholder="Tulis catatan di sini... (otomatis tersimpan)"
                    className={`w-full p-4 bg-slate-50 border border-slate-100 ${UI_RADIUS.inner} text-xs text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/10 transition-all resize-none h-24 font-medium`}
                  />
                  <FileText size={14} className="absolute right-3 bottom-3 text-slate-300" />
                </div>
              </div>

              <div className={`p-5 bg-blue-50/50 ${UI_RADIUS.inner} border border-blue-50 flex justify-between items-center`}>
                <span className="font-bold text-slate-500 text-xs">Total Pembayaran</span>
                <span className="text-xl font-black text-blue-600 tracking-tight">{formatIDR(selectedTx.total)}</span>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button onClick={() => setSelectedTx(null)} className={`${UI_BUTTON.base} ${UI_BUTTON.secondary} ${UI_RADIUS.inner}`}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
