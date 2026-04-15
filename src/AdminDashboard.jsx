import React, { useState, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  LayoutDashboard, Package, ShoppingCart, Settings, Menu, LogOut, User, Users,
  Edit, Edit2, TrendingUp, CreditCard, Eye, X, Calendar, DollarSign, PieChart,
  ArrowUpRight, ArrowDownRight, Camera, Trash2, Phone,
  Plus, Download, FileText, Archive, EyeOff, CheckCircle2
} from 'lucide-react';
import { formatIDR, UI_RADIUS, MENU_OPTIONS, UI_SPACING, UI_TEXT, UI_BUTTON } from './utils';
import Footer from './Footer';

// --- SHARED COMPONENTS ---

function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="space-y-6 p-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div className="h-10 bg-slate-100 rounded-xl w-48 animate-pulse"></div>
        <div className="h-10 bg-slate-100 rounded-xl w-32 animate-pulse"></div>
      </div>
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-slate-50/50 p-6 border-b border-slate-100 flex gap-4">
          {[...Array(cols)].map((_, i) => (
            <div key={i} className="h-4 bg-slate-200 rounded-md flex-1 animate-pulse"></div>
          ))}
        </div>
        <div className="divide-y divide-slate-50">
          {[...Array(rows)].map((_, i) => (
            <div key={i} className="p-6 flex gap-4">
              {[...Array(cols)].map((_, j) => (
                <div key={j} className="h-4 bg-slate-100 rounded-md flex-1 animate-pulse"></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GridSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-in fade-in duration-500">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="h-32 bg-white border border-slate-100 rounded-2xl p-8 space-y-4 animate-pulse">
          <div className="h-3 bg-slate-100 rounded w-1/2"></div>
          <div className="h-8 bg-slate-50 rounded w-3/4"></div>
        </div>
      ))}
    </div>
  );
}

// --- MODAL PRODUK ---
function ProductModal({ product, onClose, onSave }) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(product ? {
    ...product,
    vendorPayments: product.vendorPayments || [],
    keterangan: product.keterangan || '',
    status: product.status || 'aktif'
  } : {
    customId: '',
    name: '',
    category: '',
    cost: '',
    price: '',
    stock: '',
    vendorPayments: [],
    status: 'aktif',
    keterangan: ''
  });

  const [newPayment, setNewPayment] = useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    status: 'Belum Bayar',
    source: 'cod',
    qty: '',
    amount: 0
  });

  const toggleVendorPaymentStatus = (paymentId) => {
    setFormData(prev => ({
      ...prev,
      vendorPayments: (prev.vendorPayments || []).map(p => {
        if (p.id === paymentId) {
          return {
            ...p,
            status: p.status === 'Sudah Bayar' ? 'Belum Bayar' : 'Sudah Bayar'
          };
        }
        return p;
      })
    }));
  };

  const handleNewPaymentQtyChange = (val) => {
    const qty = val === '' ? '' : Number(val);
    const cost = Number(formData.cost) || 0;
    setNewPayment({
      ...newPayment,
      qty,
      amount: qty !== '' ? qty * cost : 0
    });
  };

  const addVendorPayment = () => {
    if (!newPayment.qty || !newPayment.amount) return;
    const payment = {
      ...newPayment,
      id: Date.now(),
      amount: Number(newPayment.amount),
      qty: Number(newPayment.qty)
    };
    setFormData(prev => ({
      ...prev,
      stock: Number(prev.stock) + Number(newPayment.qty),
      vendorPayments: [...(prev.vendorPayments || []), payment]
    }));
    setNewPayment({ ...newPayment, qty: '', amount: 0 });
  };

  const removeVendorPayment = (id) => {
    setFormData(prev => ({
      ...prev,
      vendorPayments: (prev.vendorPayments || []).filter(p => p.id !== id)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.cost || !formData.price || !formData.stock) {
      alert("Mohon lengkapi semua field!");
      return;
    }
    setIsSaving(true);
    try {
      await onSave({
        ...formData,
        id: product?.id,
        cost: Number(formData.cost),
        price: Number(formData.price),
        stock: Number(formData.stock),
        keterangan: formData.keterangan || ''
      });
    } finally {
      setIsSaving(false);
    }
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

          <div className="space-y-4 pt-6 border-t border-slate-100">
            <h4 className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg uppercase tracking-widest flex items-center gap-2 w-fit">
              <Plus size={14} /> Tambah Stok & Pembayaran
            </h4>
            
            <div className={`p-6 bg-blue-50/50 border border-blue-100 rounded-2xl space-y-6 animate-in fade-in duration-500`}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Jumlah Stok Baru</label>
                  <input
                    type="number"
                    value={newPayment.qty}
                    onChange={(e) => handleNewPaymentQtyChange(e.target.value)}
                    placeholder="Contoh: 10"
                    className={`w-full p-4 bg-white border border-blue-100 ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/10 font-black text-sm text-slate-900 shadow-sm`}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Pembayaran</label>
                  <div className="relative">
                    <span className="absolute left-4 top-4 text-slate-400 text-xs font-bold">Rp</span>
                    <input
                      readOnly
                      value={newPayment.amount}
                      className={`w-full p-4 pl-12 bg-slate-100/50 border border-slate-100 ${UI_RADIUS.inner} font-black text-sm text-slate-400 shadow-inner`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tahun</label>
                  <select
                    value={newPayment.year}
                    onChange={(e) => setNewPayment({ ...newPayment, year: Number(e.target.value) })}
                    className={`w-full p-4 bg-white border border-slate-100 ${UI_RADIUS.inner} text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/10`}
                  >
                    {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Bulan</label>
                  <select
                    value={newPayment.month}
                    onChange={(e) => setNewPayment({ ...newPayment, month: Number(e.target.value) })}
                    className={`w-full p-4 bg-white border border-slate-100 ${UI_RADIUS.inner} text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/10`}
                  >
                    {["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"].map((m, i) => (
                      <option key={i} value={i}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</label>
                  <select
                    value={newPayment.status}
                    onChange={(e) => setNewPayment({ ...newPayment, status: e.target.value })}
                    className={`w-full p-4 bg-white border border-slate-100 ${UI_RADIUS.inner} text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/10`}
                  >
                    <option value="Belum Bayar">🔴 Belum Bayar</option>
                    <option value="Sudah Bayar">🟢 Sudah Bayar</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sumber Dana (Jika Lunas)</label>
                  <select
                    value={newPayment.source}
                    onChange={(e) => setNewPayment({ ...newPayment, source: e.target.value })}
                    className={`w-full p-4 bg-white border border-slate-100 ${UI_RADIUS.inner} text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/10`}
                  >
                    <option value="cod">💵 Bayar di Tempat (Cash)</option>
                    <option value="transfer">🏦 Transfer</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={addVendorPayment}
                className={`w-full py-4 bg-blue-600 text-white font-black text-sm ${UI_RADIUS.inner} shadow-lg shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2`}
              >
                <Plus size={18} /> Tambah & Catat Transaksi
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mt-4">
                <CreditCard size={14} /> Riwayat Pembayaran Vendor
              </h4>
              {(formData.vendorPayments || []).length === 0 ? (
                <p className="text-center py-8 text-[10px] text-slate-400 font-medium bg-slate-50 rounded-2xl border border-dashed border-slate-200">Belum ada riwayat stock</p>
              ) : (
                <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto pr-1">
                  {[...(formData.vendorPayments || [])].reverse().map(p => (
                    <div key={p.id} className="flex justify-between items-center p-4 bg-white border border-slate-100 rounded-2xl shadow-sm group hover:border-blue-200 transition-all">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-xs font-black text-slate-900">{formatIDR(p.amount)}</span>
                          <button
                            type="button"
                            onClick={() => toggleVendorPaymentStatus(p.id)}
                            className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter cursor-pointer hover:scale-105 transition-all ${p.status === 'Sudah Bayar' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}
                          >
                            {p.status}
                          </button>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                          <span>{p.qty} UNIT</span>
                          <span>•</span>
                          <span>{["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"][p.month]} {p.year}</span>
                          <span>•</span>
                          <span>{p.source === 'cod' ? 'CASH' : 'TRANSFER'}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeVendorPayment(p.id)}
                        className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
          <div className="space-y-2">
            <label className={UI_TEXT.label}>Keterangan</label>
            <textarea
              value={formData.keterangan || ''}
              onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
              placeholder="Contoh: Dikirim vendor 5 April, catatan khusus produk..."
              rows={3}
              className={`w-full p-4 bg-slate-50 border border-slate-100 ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/10 text-sm text-slate-700 resize-none`}
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
              disabled={isSaving}
              className={`flex-1 py-3.5 bg-blue-600 text-white ${UI_RADIUS.inner} font-bold text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Menyimpan...
                </>
              ) : (
                'Simpan Produk'
              )}
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
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Nama diperlukan";
    if (!formData.username.trim()) newErrors.username = "Username diperlukan";
    if (!formData.password.trim()) newErrors.password = "Password diperlukan";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    try {
      const dataToSave = { ...formData };
      if (user?.id) dataToSave.id = user.id;
      else delete dataToSave.id;

      await onSave(dataToSave);
    } finally {
      setIsSaving(false);
    }
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
              {['dashboard', 'transactions', 'products', 'finance', 'profit_report', 'balance_report', 'settings', 'users'].map(perm => (
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
            <button
              type="submit"
              disabled={isSaving}
              className={`flex-[2] py-4 bg-blue-600 text-white ${UI_RADIUS.inner} font-bold text-sm shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Menyimpan...
                </>
              ) : (
                user ? 'Update User' : 'Simpan User'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- FINANCE VIEW ---
function FinanceView({ transactions, products, selectedYear, setSelectedYear, isLoading = false }) {
  const years = [2024, 2025, 2026];
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  const stats = useMemo(() => {
    if (isLoading) return [];
    return months.map((monthName, index) => {
      const monthTx = (transactions || []).filter(t => {
        const d = (t.date instanceof Date) ? t.date : new Date(t.date);
        const isPaid = t.paymentStatus === 'Sudah Bayar';
        return d.getFullYear() === selectedYear && d.getMonth() === index && isPaid;
      });

      let profit = 0;
      let revenue = 0;
      let itemsSold = 0;

      monthTx.forEach(tx => {
        revenue += (tx.total || 0);
        (tx.items || []).forEach(item => {
          const productInfo = products.find(p => p.id === item.id);
          // Prioritize historical cost stored in the transaction item
          const cost = item.cost !== undefined ? item.cost : (productInfo ? productInfo.cost : (item.price * 0.8));
          profit += ((item.price || 0) - cost) * (item.qty || 0);
          itemsSold += (item.qty || 0);
        });
      });

      return {
        monthName,
        totalTx: monthTx.length,
        revenue,
        profit,
        itemsSold
      };
    });
  }, [transactions, selectedYear, products]);

  const yearlyTotal = stats.reduce((acc, curr) => ({
    profit: acc.profit + curr.profit,
    revenue: acc.revenue + curr.revenue,
    totalTx: acc.totalTx + curr.totalTx,
    itemsSold: acc.itemsSold + curr.itemsSold
  }), { profit: 0, revenue: 0, totalTx: 0, itemsSold: 0 });

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <GridSkeleton count={3} />
        <TableSkeleton rows={8} cols={6} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 ${UI_RADIUS.outer} border border-slate-100 shadow-sm`}>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-100">
            <Calendar size={16} className="ml-2 text-slate-400" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-transparent text-sm font-bold text-slate-700 p-2 outline-none"
            >
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
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 text-blue-600">Total Transaksi</p>
          <p className="text-2xl font-black text-slate-900 tracking-tighter">{yearlyTotal.totalTx} Pesanan</p>
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
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Jumlah Item</p>
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold">{s.totalTx} Transaksi</span>
                  </div>
                </div>
                <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-50">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Keuntungan</p>
                  <p className="font-black text-slate-900 text-[13px]">{formatIDR(s.profit)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pb-2 border-b border-slate-50">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Transaksi</span>
                  <span className="text-xs font-bold text-slate-700">{s.totalTx}</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Terjual</span>
                  <span className="text-xs font-black text-blue-600">{s.itemsSold} unit</span>
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
          <table className="w-full text-left min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">Bulan</th>
                <th className="px-6 py-4 text-center">Transaksi</th>
                <th className="px-6 py-4 text-center text-blue-600">Terjual</th>
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
                    <span className="px-2 py-0.5 bg-slate-50 text-slate-600 rounded-md text-[10px] font-bold">{s.totalTx}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[10px] font-black">{s.itemsSold}</span>
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
function ProfitReportView({ transactions, products, monthlyReports, saveMonthlyReport, settings, saveSettings, selectedYear, setSelectedYear, isLoading = false }) {
  const [editingMonthFormula, setEditingMonthFormula] = useState(null);
  const [editingFormula, setEditingFormula] = useState(false);
  const [tempFormula, setTempFormula] = useState({
    marbotPercent: settings?.marbotPercent || 60,
    musholaPercent: settings?.musholaPercent || 0,
    internalPercent: settings?.internalPercent || 40,
    marbotSource: settings?.marbotSource || 'cod',
    musholaSource: settings?.musholaSource || 'cod',
    internalSource: settings?.internalSource || 'transfer'
  });
  const [applyToAll, setApplyToAll] = useState(false);

  const years = [2024, 2025, 2026];
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  const stats = useMemo(() => {
    if (isLoading) return [];
    return months.map((monthName, index) => {
      const monthTxAll = transactions.filter(t => {
        const d = (t.date instanceof Date) ? t.date : new Date(t.date);
        return d.getFullYear() === selectedYear && d.getMonth() === index;
      });

      let profit = 0;
      let unrealizedProfit = 0;

      monthTxAll.forEach(tx => {
        const isPaid = tx.paymentStatus === 'Sudah Bayar';
        tx.items.forEach(item => {
          const productInfo = products.find(p => p.id === item.id);
          // Prioritize historical cost stored in the transaction item
          const cost = item.cost !== undefined ? item.cost : (productInfo ? productInfo.cost : (item.price * 0.8));
          const itemProfit = (item.price - cost) * item.qty;
          if (isPaid) {
            profit += itemProfit;
          } else {
            unrealizedProfit += itemProfit;
          }
        });
      });

      const reportId = `${selectedYear}-${index}`;
      const savedData = monthlyReports?.find(r => r.id === reportId) || {};

      const mP = savedData.marbotPercent !== undefined ? savedData.marbotPercent : (settings?.marbotPercent || 60);
      const msP = savedData.musholaPercent !== undefined ? savedData.musholaPercent : (settings?.musholaPercent || 0);
      const iP = savedData.internalPercent !== undefined ? savedData.internalPercent : (settings?.internalPercent || 40);

      const mS = savedData.marbotSource || (settings?.marbotSource || 'cod');
      const msS = savedData.musholaSource || (settings?.musholaSource || 'cod');
      const iS = savedData.internalSource || (settings?.internalSource || 'transfer');

      return {
        id: reportId,
        monthName,
        profit,
        unrealizedProfit,
        marbotPercent: mP,
        musholaPercent: msP,
        internalPercent: iP,
        marbotSource: mS,
        musholaSource: msS,
        internalSource: iS,
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
      saveMonthlyReport(editingMonthFormula.id, {
        marbotPercent: Number(tempFormula.marbotPercent),
        musholaPercent: Number(tempFormula.musholaPercent),
        internalPercent: Number(tempFormula.internalPercent),
        marbotSource: tempFormula.marbotSource,
        musholaSource: tempFormula.musholaSource,
        internalSource: tempFormula.internalSource
      });
      setEditingMonthFormula(null);
    } else {
      // Master Formula
      saveSettings({
        ...settings,
        marbotPercent: Number(tempFormula.marbotPercent),
        musholaPercent: Number(tempFormula.musholaPercent),
        internalPercent: Number(tempFormula.internalPercent),
        marbotSource: tempFormula.marbotSource,
        musholaSource: tempFormula.musholaSource,
        internalSource: tempFormula.internalSource
      });

      if (applyToAll) {
        // Apply to all months of all active years (simplified to existing reports or just logic)
        // Usually, we iterate through months of current year at least
        for (let i = 0; i < 12; i++) {
          const mId = `${selectedYear}-${i}`;
          saveMonthlyReport(mId, {
            marbotPercent: Number(tempFormula.marbotPercent),
            musholaPercent: Number(tempFormula.musholaPercent),
            internalPercent: Number(tempFormula.internalPercent),
            marbotSource: tempFormula.marbotSource,
            musholaSource: tempFormula.musholaSource,
            internalSource: tempFormula.internalSource
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
  const marbotS = settings?.marbotSource || 'cod';
  const musholaS = settings?.musholaSource || 'cod';
  const internalS = settings?.internalSource || 'transfer';

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <GridSkeleton count={4} />
        <TableSkeleton rows={8} cols={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 ${UI_RADIUS.outer} border border-slate-100 shadow-sm`}>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-100 px-3">
            <Calendar size={14} className="text-slate-400" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-transparent text-xs font-bold text-slate-700 py-1.5 outline-none"
            >
              {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <button
            onClick={() => {
              setTempFormula({
                marbotPercent: marbotP,
                musholaPercent: musholaP,
                internalPercent: internalP,
                marbotSource: marbotS,
                musholaSource: musholaS,
                internalSource: internalS
              });
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
          <table className="w-full text-left min-w-[1200px]">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4">Bulan</th>
                <th className="px-6 py-4">Total Profit</th>
                <th className="px-6 py-4">Realisasi Profit</th>
                <th className="px-6 py-4 text-center">Formula</th>
                <th className="px-6 py-4">Marbot</th>
                <th className="px-6 py-4">Mushola</th>
                <th className="px-6 py-4">Internal</th>
                <th className="px-6 py-4">Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {stats.map((s) => (
                <tr key={s.id} className="text-sm hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-5 font-bold text-slate-700">{s.monthName}</td>
                  <td className="px-6 py-5 font-black text-slate-900">{formatIDR(s.profit)}</td>
                  <td className="px-6 py-5 font-black text-rose-600">{formatIDR(s.unrealizedProfit)}</td>
                  <td className="px-6 py-5 text-center">
                    <button
                      onClick={() => {
                        setTempFormula({
                          marbotPercent: s.marbotPercent,
                          musholaPercent: s.musholaPercent,
                          internalPercent: s.internalPercent,
                          marbotSource: s.marbotSource,
                          musholaSource: s.musholaSource,
                          internalSource: s.internalSource
                        });
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
                {editingMonthFormula ? `Set Formula: ${editingMonthFormula.monthName}` : 'Atur Formula Master (Update)'}
              </h3>
              <button onClick={() => { setEditingFormula(false); setEditingMonthFormula(null); }} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
                <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <span>Marbot (Sumber Dana Diatur)</span>
                  <span className="text-emerald-600">{tempFormula.marbotPercent}%</span>
                </div>
                <input
                  type="range" min="0" max="100" step="5"
                  value={tempFormula.marbotPercent}
                  onChange={(e) => setTempFormula({ ...tempFormula, marbotPercent: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Sumber Dana</span>
                  <select
                    value={tempFormula.marbotSource}
                    onChange={(e) => setTempFormula({ ...tempFormula, marbotSource: e.target.value })}
                    className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200 rounded-md px-2 py-1 outline-none"
                  >
                    <option value="cod">Bayar di Tempat (Cash)</option>
                    <option value="transfer">Transfer</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
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
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Sumber Dana</span>
                  <select
                    value={tempFormula.musholaSource}
                    onChange={(e) => setTempFormula({ ...tempFormula, musholaSource: e.target.value })}
                    className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200 rounded-md px-2 py-1 outline-none"
                  >
                    <option value="cod">Bayar di Tempat (Cash)</option>
                    <option value="transfer">Transfer</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
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
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Sumber Dana</span>
                  <select
                    value={tempFormula.internalSource}
                    onChange={(e) => setTempFormula({ ...tempFormula, internalSource: e.target.value })}
                    className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200 rounded-md px-2 py-1 outline-none"
                  >
                    <option value="cod">Bayar di Tempat (Cash)</option>
                    <option value="transfer">Transfer</option>
                  </select>
                </div>
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
function TransactionList({ transactions, products, onDetail, onEdit, onDelete, isLoading = false, onToggleStatus }) {
  const flattenedItems = useMemo(() => {
    let globalIdx = 1;
    const result = [];

    // Sort transactions by date desc before flattening
    const sortedTx = [...(transactions || [])].sort((a, b) => {
      const dateA = a.date instanceof Date ? a.date : new Date(a.date);
      const dateB = b.date instanceof Date ? b.date : new Date(b.date);
      return dateB - dateA;
    });

    (sortedTx || []).forEach(t => {
      const d = t.date instanceof Date ? t.date : new Date(t.date);
      const day = d.getDate().toString().padStart(2, '0');
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const year = d.getFullYear();
      const tanggalPesanan = `${day}/${month}/${year}`;
      const bulan = d.toLocaleString('id-ID', { month: 'long' });
      const tahun = d.getFullYear();

      // Ensure t.items is an array before iterating
      const items = Array.isArray(t.items) ? t.items : [];

      if (items.length === 0) {
        result.push({
          txId: t.id,
          no: globalIdx++,
          tanggalPesanan: t.time || (isNaN(d.getTime()) ? '-' : d.toLocaleString()),
          bulan: bulan,
          tahun: tahun,
          nomorRumah: t.address || '-',
          kodeBarang: '-',
          namaBarang: '(Tanpa Item)',
          jumlah: 0,
          hargaJual: 0,
          totalHargaJual: t.total || 0,
          caraPembayaran: (t.method === 'transfer' ? 'Transfer' : 'Cash'),
          catatan: t.notes || '-',
          profit: 0,
          originalTx: t
        });
      } else {
        items.forEach(item => {
          const prod = products?.find(p => p.id === item.id || p.name?.toLowerCase() === item.name?.toLowerCase());
          result.push({
            txId: t.id,
            no: globalIdx++,
            tanggalPesanan: t.time || (isNaN(d.getTime()) ? '-' : d.toLocaleString()),
            bulan: bulan,
            tahun: tahun,
            nomorRumah: t.address || '-',
            kodeBarang: prod?.customId || '-',
            namaBarang: item.name || 'Unknown Item',
            jumlah: item.qty || 0,
            hargaJual: item.price || 0,
            totalHargaJual: (item.price || 0) * (item.qty || 0),
            caraPembayaran: (t.method === 'transfer' ? 'Transfer' : 'Cash'),
            catatan: t.notes || '-',
            profit: item.profit || 0,
            originalTx: t
          });
        });
      }
    });
    return result;
  }, [transactions, products]);

  return (
    <div className="space-y-4">
      {/* Mobile view: Improved Responsive Cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className={`p-5 bg-white border border-slate-100 ${UI_RADIUS.inner} shadow-sm animate-pulse flex flex-col gap-4`}>
                <div className="h-4 w-3/4 bg-slate-100 rounded" />
                <div className="h-10 w-full bg-slate-50 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {transactions.map(t => (
              <div key={t.id} className={`p-5 bg-white border border-slate-100 ${UI_RADIUS.inner} shadow-sm space-y-4`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.time}</p>
                       <button
                         onClick={(e) => { e.stopPropagation(); onToggleStatus && onToggleStatus(t); }}
                         className={`text-[9px] font-bold px-1.5 py-0.5 rounded border transition-colors ${
                           (t.paymentStatus || 'Sudah Bayar') === 'Belum Bayar'
                             ? 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100'
                             : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
                         }`}
                       >
                         {t.paymentStatus || 'Sudah Bayar'}
                       </button>
                    </div>
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

                <div className="flex justify-between items-center pt-2">
                  <p className="text-[10px] font-bold text-slate-400">{t.method === 'transfer' ? 'Transfer' : 'Cash'}</p>
                  <div className="flex gap-1">
                    <button
                      onClick={() => onEdit(t)}
                      className={`p-2 text-slate-300 hover:text-amber-600 rounded-lg hover:bg-white transition-all`}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(t.id)}
                      className={`p-2 text-slate-300 hover:text-rose-600 rounded-lg hover:bg-white transition-all`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {transactions.length === 0 && (
              <div className={`text-center py-10 bg-slate-50/50 ${UI_RADIUS.inner} border border-dashed border-slate-200`}>
                <p className="text-slate-400 text-xs font-medium">Tidak ada transaksi ditemukan</p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left min-w-[1000px]">
          <thead>
            <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
              <th className="py-4 px-4 text-center">No</th>
              <th className="py-4 px-4">Tanggal pesanan</th>
              <th className="py-4 px-4">Nomor Rumah</th>
              <th className="py-4 px-4">Kode Barang</th>
              <th className="py-4 px-4">Nama Barang</th>
              <th className="py-4 px-4 text-center">Jumlah</th>
              <th className="py-4 px-4 text-right text-blue-600">Total Jual</th>
              <th className="py-4 px-4">Metode</th>
              <th className="py-4 px-4 text-center">Status</th>
              <th className="py-4 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {flattenedItems.map((item, i) => (
              <tr key={`${item.txId}-${i}`} className="text-[12px] hover:bg-slate-50/50 transition-colors group">
                <td className="py-4 px-4 text-center text-slate-400 font-medium">{item.no}</td>
                <td className="py-4 px-4 whitespace-nowrap font-medium text-slate-600">{item.tanggalPesanan}</td>
                <td className="py-4 px-4 font-extrabold text-slate-900">{item.nomorRumah}</td>
                <td className="py-4 px-4 font-mono text-[10px] text-slate-500">{item.kodeBarang}</td>
                <td className="py-4 px-4 font-bold text-slate-800">{item.namaBarang}</td>
                <td className="py-4 px-4 text-center font-black text-blue-600">{item.jumlah}</td>
                <td className="py-4 px-4 text-right font-black text-blue-600">{formatIDR(item.totalHargaJual)}</td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter ${item.caraPembayaran === 'Transfer' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {item.caraPembayaran}
                  </span>
                </td>
                <td className="py-4 px-4 text-center">
                  <button
                    onClick={() => onToggleStatus && onToggleStatus(item.originalTx)}
                    className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter cursor-pointer transition-colors border ${
                      (item.originalTx.paymentStatus || 'Sudah Bayar') === 'Belum Bayar'
                        ? 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100'
                        : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    {item.originalTx.paymentStatus || 'Sudah Bayar'}
                  </button>
                </td>
                <td className="py-4 px-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => onDetail(item.originalTx)}
                      className={`p-2 text-slate-300 hover:text-blue-600 rounded-lg hover:bg-white transition-all`}
                      title="Lihat Detail"
                    >
                      <Eye size={16} />
                    </button>
                    {onEdit && (
                      <button
                        onClick={() => onEdit(item.originalTx)}
                        className={`p-2 text-slate-300 hover:text-amber-600 rounded-lg hover:bg-white transition-all`}
                        title="Edit Transaksi"
                      >
                        <Edit2 size={16} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(item.originalTx.id)}
                        className={`p-2 text-slate-300 hover:text-rose-600 rounded-lg hover:bg-white transition-all`}
                        title="Hapus Transaksi"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
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

// --- MODAL TRANSAKSI ---
function TransactionModal({ products, onClose, onSave, transaction = null, saveProduct }) {
  const [formData, setFormData] = useState(transaction ? {
    ...transaction,
    items: transaction.items || [],
    // Ensure date is in ISO string format for datetime-local input
    date: transaction.date ? new Date(transaction.date).toISOString() : new Date().toISOString(),
    notes: transaction.notes || '' // Ensure notes is present
  } : {
    customer: '',
    phone: '',
    address: '',
    items: [],
    method: 'cod',
    date: new Date().toISOString(),
    notes: ''
  });

  const [isSaving, setIsSaving] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);

  const addItem = () => {
    if (!selectedProduct) return;
    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    // Check if item already exists in formData.items
    const existingItemIndex = formData.items.findIndex(item => item.id === product.id);

    if (existingItemIndex > -1) {
      // If exists, update quantity
      setFormData(prev => ({
        ...prev,
        items: prev.items.map((item, idx) =>
          idx === existingItemIndex
            ? { ...item, qty: item.qty + quantity, profit: (product.price - product.cost) * (item.qty + quantity) }
            : item
        )
      }));
    } else {
      // If not, add new item
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
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customer || !formData.phone || formData.items.length === 0) {
      alert("Mohon lengkapi data pelanggan dan item!");
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        ...formData,
        total,
        time: new Date(formData.date).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className={`bg-white w-full max-w-2xl ${UI_RADIUS.outer} shadow-2xl overflow-hidden animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto`}>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h3 className="font-bold text-slate-900">{transaction ? 'Edit Transaksi' : 'Tambah Transaksi Manual'}</h3>
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
            <div className="flex flex-col sm:flex-row gap-3">
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
              <div className="flex gap-2 w-full sm:w-auto">
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
                  className={`flex-1 sm:flex-none p-3 bg-blue-600 text-white ${UI_RADIUS.inner} hover:bg-blue-700 transition-all flex items-center justify-center`}
                >
                  <Plus size={20} />
                </button>
              </div>
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
              disabled={isSaving}
              className={`flex-1 py-3.5 bg-blue-600 text-white ${UI_RADIUS.inner} font-bold text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Menyimpan...
                </>
              ) : (
                'Simpan Transaksi'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- STAT CARD ---
function StatCard({ label, val, icon: Icon, color = "bg-blue-50 text-blue-600", isLoading = false }) {
  return (
    <div className={`bg-white ${UI_SPACING.card} ${UI_RADIUS.outer} border border-white shadow-sm flex items-center gap-5 transition-all hover:shadow-md group`}>
      <div className={`w-14 h-14 ${color} ${UI_RADIUS.inner} flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      <div className="min-w-0 flex-1">
        <p className={`${UI_TEXT.label} mb-1 opacity-70`}>{label}</p>
        {isLoading ? (
          <div className="h-8 w-24 bg-slate-100 animate-pulse rounded-lg mt-1" />
        ) : (
          <p className={`text-2xl font-black tracking-tight ${val.toString().startsWith('-') ? 'text-rose-500' : 'text-slate-900'}`}>{val}</p>
        )}
      </div>
    </div>
  );
}

// --- BALANCE REPORT VIEW ---
function BalanceReport({ transactions, products, isLoading = false }) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const balanceData = useMemo(() => {
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    const report = months.map((month, idx) => ({
      month,
      cod: 0,
      transfer: 0,
      total: 0
    }));

    // Add Revenues (Sudah Bayar)
    (transactions || []).forEach(tx => {
      if (tx.paymentStatus !== 'Sudah Bayar') return;

      const d = tx.date instanceof Date ? tx.date : new Date(tx.date);
      if (isNaN(d.getTime())) return;
      if (d.getFullYear() !== selectedYear) return;

      const monthIdx = d.getMonth();
      const amount = tx.total || 0;

      if (tx.method === 'transfer') {
        report[monthIdx].transfer += amount;
      } else {
        report[monthIdx].cod += amount;
      }
      report[monthIdx].total += amount;
    });

    // Subtract Vendor Payments (Sudah Bayar)
    (products || []).forEach(p => {
      (p.vendorPayments || []).forEach(pay => {
        if (pay.status !== 'Sudah Bayar') return;
        if (pay.year !== selectedYear) return;

        const monthIdx = pay.month;
        const amount = pay.amount || 0;

        if (pay.source === 'transfer') {
          report[monthIdx].transfer -= amount;
        } else {
          report[monthIdx].cod -= amount;
        }
        report[monthIdx].total -= amount;
      });
    });

    return report;
  }, [transactions, products, selectedYear]);

  const debt = useMemo(() => {
    let totalUnpaid = 0;
    (products || []).forEach(p => {
      (p.vendorPayments || []).forEach(pay => {
        if (pay.status !== 'Sudah Bayar' && (pay.year === selectedYear || !selectedYear)) {
          totalUnpaid += (pay.amount || 0);
        }
      });
    });
    return totalUnpaid;
  }, [products, selectedYear]);

  const summary = useMemo(() => {
    return balanceData.reduce((acc, curr) => ({
      cod: acc.cod + curr.cod,
      transfer: acc.transfer + curr.transfer,
      total: acc.total + curr.total
    }), { cod: 0, transfer: 0, total: 0 });
  }, [balanceData]);

  const years = useMemo(() => {
    const uniqueYears = [...new Set((transactions || []).map(t => {
      const d = t.date instanceof Date ? t.date : new Date(t.date);
      return isNaN(d.getTime()) ? null : d.getFullYear();
    }))].filter(Boolean).sort((a,b) => b-a);
    return uniqueYears.length > 0 ? uniqueYears : [new Date().getFullYear()];
  }, [transactions]);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <GridSkeleton count={2} />
        <TableSkeleton rows={8} cols={4} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1">Total Saldo Masuk</h3>
          <p className="text-xs text-slate-500 font-medium tracking-wide">Akumulasi seluruh pembayaran "Sudah Bayar"</p>
        </div>
        <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
          {years.map(y => (
            <button
              key={y}
              onClick={() => setSelectedYear(y)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${selectedYear === y ? 'bg-white text-blue-600 shadow-sm shadow-blue-500/10' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Cash (COD)" val={formatIDR(summary.cod)} icon={CreditCard} color="bg-amber-50 text-amber-600" />
        <StatCard label="Total Transfer" val={formatIDR(summary.transfer)} icon={ArrowUpRight} color="bg-indigo-50 text-indigo-600" />
        <StatCard label="Hutang Vendor (Belum Bayar)" val={formatIDR(debt)} icon={EyeOff} color="bg-rose-50 text-rose-600" />
        <StatCard label="Saldo Bersih (Net)" val={formatIDR(summary.total - debt)} icon={DollarSign} color="bg-emerald-50 text-emerald-600" />
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Bulan</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Bayar di Tempat (Cash)</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Transfer</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Total Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {balanceData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-5 px-8 text-sm font-bold text-slate-900">{row.month}</td>
                  <td className="py-5 px-8 text-sm font-medium text-slate-600 text-right">{formatIDR(row.cod)}</td>
                  <td className="py-5 px-8 text-sm font-medium text-slate-600 text-right">{formatIDR(row.transfer)}</td>
                  <td className="py-5 px-8 text-sm font-black text-blue-600 text-right">{formatIDR(row.total)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-blue-50/30">
                <td className="py-6 px-8 text-sm font-black text-slate-900">GRAND TOTAL</td>
                <td className="py-6 px-8 text-sm font-black text-slate-900 text-right">{formatIDR(summary.cod)}</td>
                <td className="py-6 px-8 text-sm font-black text-slate-900 text-right">{formatIDR(summary.transfer)}</td>
                <td className="py-6 px-8 text-base font-black text-blue-600 text-right">{formatIDR(summary.total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- MAIN ADMIN LAYOUT ---
export default function AdminDashboard({
  products, saveProduct, deleteProduct,
  users, setUsers, saveUser, deleteUser, settings, setSettings, saveSettings, mobileMenuOpen, setMobileMenuOpen,
  handleLogout, onCustomerView, transactions, isLoading, saveTransaction, saveTransactionsBulk, deleteTransaction, clearAllTransactions, clearAllProducts,
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
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [importStatus, setImportStatus] = useState({ isImporting: false, current: 0, total: 0 });
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
    setEditingTransaction(null);
  };

  const handleToggleStatus = async (tx) => {
    const newStatus = tx.paymentStatus === 'Belum Bayar' ? 'Sudah Bayar' : 'Belum Bayar';
    await saveTransaction({ ...tx, paymentStatus: newStatus }, { silent: true });
  };

  const handleDeleteTransaction = async (txId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
      await deleteTransaction(txId);
    }
  };

  const handleDeleteUser = (userId) => {
    deleteUser(userId);
  };

  const handleSettingsSave = () => {
    saveSettings(settings);
  };

  const handleTriggerDeploy = async () => {
    if (!settings.vercelDeployHook) {
      toast.error('Silakan atur Vercel Deploy Hook URL terlebih dahulu di pengaturan.');
      return;
    }
    
    const loadingToast = toast.loading('Memulai deployment ke Vercel...');
    try {
      const response = await fetch(settings.vercelDeployHook, { method: 'POST' });
      if (response.ok) {
        toast.success('Deployment berhasil dipicu! Situs akan diperbarui dalam beberapa menit.', { id: loadingToast });
      } else {
        throw new Error('Gagal memicu deployment');
      }
    } catch (error) {
      toast.error('Gagal memicu deployment. Pastikan URL Hook benar.', { id: loadingToast });
    }
  };

  // Filter menu based on permissions
  const filteredMenuOptions = MENU_OPTIONS.filter(m =>
    currentUserData?.permissions?.includes(m.id) || m.id === 'dashboard'
  );

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [txSelectedMonth, setTxSelectedMonth] = useState('all');
  const [txSelectedYear, setTxSelectedYear] = useState('all');
  const [txSelectedStatus, setTxSelectedStatus] = useState('all');

  const monthsList = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const yearsList = [2024, 2025, 2026];

  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) {
      toast.error("Tidak ada data untuk diekspor");
      return;
    }

    const headers = ["Tanggal", "Pelanggan", "WhatsApp", "Alamat", "Items", "Total", "Metode", "Catatan"];
    const rows = filteredTransactions.map(t => [
      t.time,
      t.customer,
      t.phone,
      `"${t.address?.replace(/"/g, '""')}"`,
      `"${t.items.map(i => `${i.qty}x ${i.name}`).join(', ')}"`,
      t.total,
      t.method === 'transfer' ? 'Transfer Bank' : 'Bayar di Tempat',
      `"${(t.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    const monthName = txSelectedMonth === 'all' ? 'Semua_Bulan' : monthsList[txSelectedMonth];
    const yearName = txSelectedYear === 'all' ? 'Semua_Tahun' : txSelectedYear;
    link.setAttribute("download", `Laporan_Transaksi_${monthName}_${yearName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      setImportStatus({ isImporting: true, current: 0, total: 0 });
      const text = event.target.result;
      const lines = text.split('\n').map(l => l.trim()).filter(l => l);
      if (lines.length < 2) return;

      const commaCount = (lines[0].match(/,/g) || []).length;
      const semiCount = (lines[0].match(/;/g) || []).length;
      const delimiter = semiCount > commaCount ? ';' : ',';

      const rawHeaders = lines[0].split(delimiter).map(h => h.trim().toLowerCase());

      const headerMap = {
        'tanggal': 'date', 'date': 'date', 'tgl': 'date', 'time': 'date', 'waktu': 'date', 'tanggal pesanan': 'date', 'tanggal pesanan (dd/mm/yyyy)': 'date',
        'pelanggan': 'customer', 'customer': 'customer', 'nama': 'customer', 'nama pelanggan': 'customer',
        'nomor rumah': 'address_home',
        'whatsapp': 'phone', 'phone': 'phone', 'wa': 'phone', 'no': 'phone', 'telepon': 'phone', 'no hp': 'phone',
        'alamat': 'address', 'address': 'address', 'rumah': 'address',
        'items': 'items', 'barang': 'items', 'produk': 'category_col', 'nama produk': 'items', 'nama barang': 'name_col', 'pesanan': 'items',
        'jumlah': 'qty_col', 'qty': 'qty_col', 'total': 'total', 'harga': 'total', 'price': 'total', 'total harga jual': 'total',
        'metode': 'method', 'method': 'method', 'pembayaran': 'method', 'cara bayar': 'method', 'cara pembayaran': 'method',
        'catatan': 'notes', 'notes': 'notes', 'keterangan': 'notes', 'memo': 'notes',
        'modal': 'cost_col', 'harga modal': 'cost_col', 'pokok': 'cost_col', 'total harga modal': 'total_cost_col',
        'jual': 'price_col', 'harga jual': 'price_col',
        'kode': 'custom_id', 'kode barang': 'custom_id', 'sku': 'custom_id', 'id': 'custom_id',
        'kategori': 'category_col', 'category': 'category_col',
        'status': 'status_col', 'bulan': 'month_col', 'tahun': 'year_col', 'status pembayarans': 'status_col'
      };

      const mappedHeaders = rawHeaders.map(h => headerMap[h] || h);

      // Verify required headers
      const hasCustomer = mappedHeaders.includes('customer');
      const hasProducts = mappedHeaders.includes('items') || mappedHeaders.includes('name_col');

      if (!hasCustomer || !hasProducts) {
        setImportStatus({ isImporting: false, current: 0, total: 0 });
        toast.error(`Format CSV tidak sesuai. Kolom wajib tidak ditemukan: ${!hasCustomer ? '[Pelanggan] ' : ''}${!hasProducts ? '[Produk/Barang]' : ''}`, { duration: 6000 });
        return;
      }

      const parseDate = (dateStr) => {
        if (!dateStr) return new Date();
        const dmy = dateStr.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
        let date;
        if (dmy) date = new Date(dmy[3], dmy[2] - 1, dmy[1]);
        else {
          const ymd = dateStr.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
          if (ymd) date = new Date(ymd[1], ymd[2] - 1, ymd[3]);
          else date = new Date(dateStr);
        }

        if (isNaN(date.getTime())) return new Date();

        // Auto-correct common year typos (e.g., 2825 -> 2025, 1899 -> current year context)
        let year = date.getFullYear();
        if (year > 2100 && String(year).startsWith('28')) {
          date.setFullYear(Number(String(year).replace('28', '20')));
        } else if (year < 1920) {
          date.setFullYear(new Date().getFullYear()); // Fallback for systemic errors like 1899
        }
        return date;
      };

      const parseCurrency = (val) => {
        if (!val) return 0;
        if (typeof val === 'number') return val;
        let str = String(val);
        // Strip "Rp" or "Rp " (with or without space) case-insensitively
        str = str.replace(/Rp\s*/gi, '');
        // Strip ALL remaining whitespace (tabs, non-breaking spaces, etc.)
        str = str.replace(/[\s\u00A0]+/g, '');
        // Handle Indonesian currency formats:
        // Google Sheets exports: "17,000" "108,000" "120,000" (comma = thousands)
        // Manual input:         "17.000" "108.000" "120.000" (dot = thousands)
        // European decimal:     "10.000,50" (dot = thousands, comma = decimal)
        
        if (str.includes(',') && str.includes('.')) {
          // Both present: dots are thousands, comma is decimal: "10.000,50" -> "10000.50"
          str = str.replace(/\./g, '').replace(',', '.');
        } else if (str.includes(',')) {
          // Comma only: check if it's thousands separator or decimal
          // "17,000" "108,000" -> thousands (3 digits after comma)
          // "10000,50" -> decimal (2 digits after comma)
          if (/,\d{3}$/.test(str)) {
            // Comma followed by exactly 3 digits at end = thousands separator
            str = str.replace(/,/g, '');
          } else {
            // Otherwise treat comma as decimal
            str = str.replace(',', '.');
          }
        } else if (str.includes('.')) {
          // Dot only: check if thousands separator
          // "10.000" "108.000" -> thousands (3 digits after dot)
          // "100.50" -> decimal (2 digits after dot)
          const parts = str.split('.');
          if (parts.length >= 2 && parts[parts.length - 1].length === 3) {
            // Likely thousands separator: "10.000" -> "10000", "1.000.000" -> "1000000"
            str = str.replace(/\./g, '');
          }
          // Otherwise keep dot as-is (normal decimal like "100.50")
        }
        return Number(str) || 0;
      };

      const parseQty = (val) => {
        if (!val) return 0;
        if (typeof val === 'number') return val;
        // Strip non-numeric except dots and commas, then parse
        const clean = String(val).replace(/[^\d.,]/g, '').replace(',', '.');
        return Math.round(Number(clean)) || 0;
      };

      const splitCSVLine = (line, delim) => {
        const result = [];
        let cur = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') inQuotes = !inQuotes;
          else if (char === delim && !inQuotes) {
            result.push(cur.trim());
            cur = '';
          } else cur += char;
        }
        result.push(cur.trim());
        return result.map(v => v.replace(/^"|"$/g, '').trim());
      };

      const existingProducts = [...products];
      const newlyCreatedProducts = new Map(); // Cache to avoid duplicate creation in same run

      const getOrAutoCreateProduct = async (name, rowData) => {
        const lowerName = name.toLowerCase();
        const customId = rowData.custom_id || '';
        const lowerCustomId = customId.toLowerCase();
        
        // Match by BOTH name and customId (case-insensitive for code) to avoid duplicates
        let product = existingProducts.find(p => 
          p.name.toLowerCase() === lowerName && (customId === '' || (p.customId && p.customId.toLowerCase() === lowerCustomId))
        ) || Array.from(newlyCreatedProducts.values()).find(p => 
          p.name.toLowerCase() === lowerName && (customId === '' || (p.customId && p.customId.toLowerCase() === lowerCustomId))
        );
        
        if (product) return product;

        // Calculate cost/price using unit or total values
        const qty = parseQty(rowData.qty_col) || 1;
        const cost = parseCurrency(rowData.cost_col) || (rowData.total_cost_col ? (parseCurrency(rowData.total_cost_col) / qty) : 0);
        const price = parseCurrency(rowData.price_col) || (parseCurrency(rowData.total) / qty) || 0;
        
        const newProduct = {
          name: name,
          customId: customId,
          category: (rowData.category_col && rowData.category_col.toLowerCase() !== 'no data') ? rowData.category_col : 'Umum',
          cost: cost || (price * 0.8),
          price: price,
          stock: 100, // Initial stock for imported product
          status: 'aktif'
        };

        try {
          const savedId = await saveProduct(newProduct);
          newProduct.id = savedId;
          newlyCreatedProducts.set(`${lowerName}-${customId}`, newProduct);
          return newProduct;
        } catch (e) {
          console.error("Failed to auto-create product:", name, e);
          return null;
        }
      };

      let importedTransactions = [];
      let skippedCount = 0;
      let skippedReasons = [];
      const totalRows = lines.length - 1;

      setImportStatus({ isImporting: true, current: 0, total: totalRows });

      for (let i = 1; i < lines.length; i++) {
        try {
          const values = splitCSVLine(lines[i], delimiter);
          if (values.length < 2) continue;

          const rawRow = {};
          mappedHeaders.forEach((h, idx) => { rawRow[h] = values[idx]; });

          const date = parseDate(rawRow.date);

          // Consistency Check for Bulan & Tahun reference (match with Tanggal Pesanan)
          if (rawRow.month_col || rawRow.year_col) {
            const monthsIndo = ["januari", "februari", "maret", "april", "mei", "juni", "juli", "agustus", "september", "oktober", "november", "desember"];
            if (rawRow.month_col) {
              const mVal = String(rawRow.month_col).toLowerCase();
              const expectedMIdx = date.getMonth();
              const expectedMName = monthsIndo[expectedMIdx];
              const expectedMNum = String(expectedMIdx + 1);
              if (mVal !== expectedMNum && !mVal.includes(expectedMName.substring(0, 3))) {
                console.warn(`Baris ${i+1}: Bulan "${rawRow.month_col}" tidak cocok dengan tanggal ${rawRow.date}`);
              }
            }
            if (rawRow.year_col && String(rawRow.year_col) !== String(date.getFullYear())) {
              console.warn(`Baris ${i+1}: Tahun "${rawRow.year_col}" tidak cocok dengan tanggal ${rawRow.date}`);
            }
          }

          const transactionItems = [];

          // Support independent columns: Nama Barang + Jumlah
          if (rawRow.name_col) {
            const name = rawRow.name_col;
            const qty = parseQty(rawRow.qty_col) || 1;
            const product = await getOrAutoCreateProduct(name, rawRow);

            if (product) {
              // Use CSV price data when available, fallback to product DB price
              const csvTotal = parseCurrency(rawRow.total);
              const csvUnitPrice = parseCurrency(rawRow.price_col);
              const csvUnitCost = parseCurrency(rawRow.cost_col);
              const csvTotalCost = parseCurrency(rawRow.total_cost_col);

              // Priority: 1) explicit unit price from CSV, 2) total/qty from CSV, 3) product DB price
              const itemPrice = csvUnitPrice || (csvTotal && qty ? Math.round(csvTotal / qty) : 0) || product.price;
              // Priority: 1) explicit unit cost from CSV, 2) total cost/qty from CSV, 3) product DB cost
              const itemCost = csvUnitCost || (csvTotalCost && qty ? Math.round(csvTotalCost / qty) : 0) || product.cost;

              transactionItems.push({
                id: product.id || `temp-${name}`,
                name: product.name,
                qty: qty,
                price: itemPrice,
                cost: itemCost,
                profit: (itemPrice - itemCost) * qty
              });
            } else {
              skippedCount++;
              skippedReasons.push(`Baris ${i + 1}: Gagal membuat produk "${name}"`);
              continue;
            }
          } else {
            // Fallback to parsed "items" string
            const itemParts = (rawRow.items || "").split(/[|;,]/).map(s => s.trim()).filter(s => s);
            for (const itemPart of itemParts) {
              const match = itemPart.match(/^(\d+)\s*[xX]?\s*(.+)$/);
              const qty = match ? Number(match[1]) : 1;
              const name = (match ? match[2] : itemPart).trim();
              const product = await getOrAutoCreateProduct(name, rawRow);
              if (product) {
                const csvUnitPrice = parseCurrency(rawRow.price_col);
                const csvUnitCost = parseCurrency(rawRow.cost_col);
                const finalPrice = csvUnitPrice || product.price;
                const finalCost = csvUnitCost || product.cost;
                transactionItems.push({
                  id: product.id || `temp-${name}`, name: product.name, qty, price: finalPrice, cost: finalCost,
                  profit: (finalPrice - finalCost) * qty
                });
              }
            }
          }

          if (transactionItems.length === 0) {
            skippedCount++;
            skippedReasons.push(`Baris ${i + 1}: Tidak ada item pesanan yang valid found (mungkin nama produk tidak cocok)`);
            continue;
          }

          const lowerNote = (rawRow.notes || "").toLowerCase();

          // Determine method
          const lowerMethodInput = (rawRow.method || "").toLowerCase();
          let finalMethod = 'cod';
          if (lowerMethodInput.includes('transfer') || lowerNote.includes('transfer')) {
            finalMethod = 'transfer';
          } else if (lowerMethodInput.includes('tempat') || lowerMethodInput.includes('cash') || lowerMethodInput.includes('tunai') || lowerMethodInput.includes('cod')) {
            finalMethod = 'cod';
          }

          // Determine payment status - Default to 'Belum Bayar' for safety if unspecified
          const lowerStatusInput = (rawRow.status_col || "").toLowerCase();
          let finalPaymentStatus = 'Belum Bayar';
          if (lowerStatusInput.includes('sudah') || lowerStatusInput.includes('lunas') || lowerStatusInput.includes('paid')) {
            finalPaymentStatus = 'Sudah Bayar';
          } else if (lowerStatusInput.includes('belum') || lowerNote.includes('belum bayar')) {
            finalPaymentStatus = 'Belum Bayar';
          }

          // Calculate total: use exact CSV total if provided, otherwise sum items (price × qty)
          const csvTotalValue = parseCurrency(rawRow.total);
          const calculatedTotal = transactionItems.reduce((sum, it) => sum + (it.price * it.qty), 0);

          importedTransactions.push({
            date: date.toISOString(),
            time: date.toLocaleString('id-ID'),
            customer: rawRow.customer || rawRow.address_home || 'Imported Customer',
            phone: rawRow.phone || '',
            address: rawRow.address_home || rawRow.address || rawRow.customer || '', 
            items: transactionItems,
            total: csvTotalValue || calculatedTotal,
            method: finalMethod,
            paymentStatus: finalPaymentStatus,
            notes: rawRow.notes || 'Imported from CSV'
          });

          // Save in batches of 100 to yield and show progress
          if (importedTransactions.length >= 100) {
            await saveTransactionsBulk(importedTransactions, { skipStockUpdate: true });
            setImportStatus(prev => ({ ...prev, current: i }));
            importedTransactions = [];
            // Yield to main thread
            await new Promise(r => setTimeout(r, 0));
          } else if (i % 20 === 0) {
            setImportStatus(prev => ({ ...prev, current: i }));
            await new Promise(r => setTimeout(r, 0));
          }

        } catch (err) {
          console.error(`Error processing row ${i + 1}:`, err);
          skippedCount++;
        }
      }

      // Final save for remaining
      if (importedTransactions.length > 0) {
        setImportStatus(prev => ({ ...prev, current: totalRows }));
        await saveTransactionsBulk(importedTransactions, { skipStockUpdate: true });
      }

      // Add a small artificial delay so user can see it's done
      await new Promise(r => setTimeout(r, 1000));
      setImportStatus({ isImporting: false, current: 0, total: 0 });

      const successCount = totalRows - skippedCount;
      if (skippedCount > 0) {
        const uniqueReasons = [...new Set(skippedReasons)].slice(0, 3);
        const reasonText = uniqueReasons.length > 0 ? `\n\nMasalah: ${uniqueReasons.join(', ')}...` : '';
        
        if (successCount === 0) {
          toast.error(`Gagal mengimpor data. Seluruh ${skippedCount} baris bermasalah.${reasonText}`, { duration: 8000 });
        } else {
          toast.success(`Berhasil mengimpor ${successCount} transaksi.${reasonText}\n(${skippedCount} baris dilewati)`, { duration: 8000 });
        }
      } else {
        toast.success(`Berhasil mengimpor seluruh ${successCount} transaksi!`);
      }
    };
    reader.onerror = () => {
      setImportStatus({ isImporting: false, current: 0, total: 0 });
      toast.error("Gagal membaca file CSV");
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const repairYearTypos = async () => {
    const toFix = transactions.filter(t => {
      const year = new Date(t.date).getFullYear();
      return year > 2100 && String(year).startsWith('28');
    });

    if (toFix.length === 0) {
      toast.success("Tidak ditemukan kesalahan tahun (28xx).");
      return;
    }

    if (!window.confirm(`Ditemukan ${toFix.length} transaksi dengan kesalahan tahun (28xx). Perbaiki sekarang?`)) return;

    const fixed = toFix.map(t => {
      const d = new Date(t.date);
      const year = d.getFullYear();
      d.setFullYear(Number(String(year).replace('28', '20')));
      return {
        ...t,
        date: d.toISOString(),
        time: d.toLocaleString('id-ID')
      };
    });

    try {
      await saveTransactionsBulk(fixed, { skipStockUpdate: true });
      toast.success(`Berhasil memperbaiki ${fixed.length} transaksi!`);
    } catch (err) {
      console.error("Repair failed:", err);
      toast.error("Gagal memperbaiki data.");
    }
  };

  const filteredTransactions = useMemo(() => {
    const parseDate = (dateStr) => {
      if (!dateStr) return new Date(0); // Undefined dates go to beginning of time
      if (dateStr instanceof Date) return dateStr;

      // Handle DD/MM/YYYY
      const dmy = dateStr.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
      if (dmy) return new Date(dmy[3], dmy[2] - 1, dmy[1]);

      // Handle YYYY-MM-DD
      const ymd = dateStr.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
      if (ymd) return new Date(ymd[1], ymd[2] - 1, ymd[3]);

      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? new Date(0) : d;
    };

    return (transactions || []).filter(t => {
      const d = parseDate(t.date);
      if (isNaN(d.getTime())) return false;
      const monthMatch = txSelectedMonth === 'all' || d.getMonth() === txSelectedMonth;
      const yearMatch = txSelectedYear === 'all' || d.getFullYear() === txSelectedYear;
      const statusMatch = txSelectedStatus === 'all' || (t.paymentStatus || 'Sudah Bayar') === txSelectedStatus;
      return monthMatch && yearMatch && statusMatch;
    }).sort((a, b) => {
      const dateA = a.date instanceof Date ? a.date : new Date(a.date);
      const dateB = b.date instanceof Date ? b.date : new Date(b.date);
      return dateB - dateA;
    });
  }, [transactions, txSelectedMonth, txSelectedYear, txSelectedStatus]);

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
              'TrendingUp': TrendingUp,
              'Users': Users,
              'Settings': Settings
            };
            const IconComponent = iconMap[m.icon];
            return (
              <button
                key={m.id}
                onClick={() => { setAdminTab(m.id); setMobileMenuOpen(false); }}
                className={`w-full flex items-start text-left gap-3.5 px-5 py-4 ${UI_RADIUS.inner} transition-all font-bold text-sm ${adminTab === m.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <div className="w-6 flex justify-center shrink-0 pt-0.5">
                  <IconComponent size={20} />
                </div>
                <span className="leading-tight">{m.label}</span>
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
        <div className="max-w-[1600px] w-full px-4 md:px-8 mx-auto flex flex-col flex-1">
          <header className="mb-12">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className={UI_TEXT.h2}>{MENU_OPTIONS.find(m => m.id === adminTab)?.label} {adminTab === 'dashboard' ? `(${(transactions || []).length})` : adminTab === 'transactions' ? `(${filteredTransactions.length})` : ''}</h2>
                <p className={UI_TEXT.caption}>Manage your mart operations efficiently.</p>
              </div>
              <button onClick={() => setMobileMenuOpen(true)} className={`p-3 bg-white ${UI_RADIUS.inner} border border-slate-200 md:hidden shadow-sm text-slate-600 active:scale-95 transition-all`}><Menu size={24} /></button>
            </div>
          </header>

          {adminTab === 'dashboard' && (
            <div className={`animate-in fade-in slide-in-from-bottom-4 duration-500 ${UI_SPACING.section}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard label="Total Transaksi" val={(transactions || []).length} icon={ShoppingCart} isLoading={isLoading} />
                <StatCard label="Total Produk" val={(products || []).length} icon={Package} color="bg-emerald-50 text-emerald-600" isLoading={isLoading} />
                <StatCard label="Total User" val={(users || []).length} icon={Users} color="bg-amber-50 text-amber-600" isLoading={isLoading} />
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className={UI_TEXT.h2}>Pesanan Terbaru</h2>
                  <button onClick={() => setAdminTab('transactions')} className="text-blue-600 font-bold text-xs hover:underline">Lihat Selengkapnya</button>
                </div>
                <div className={`bg-white border border-slate-100 shadow-sm overflow-hidden md:rounded-2xl`}>
                  <TransactionList
                    transactions={[...(transactions || [])].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)}
                    products={products}
                    isLoading={isLoading}
                    onDetail={setSelectedTx}
                    onEdit={setEditingTransaction}
                    onDelete={handleDeleteTransaction}
                    onToggleStatus={handleToggleStatus}
                  />
                </div>
              </div>
            </div>
          )}

          {adminTab === 'finance' && <FinanceView transactions={transactions} products={products} selectedYear={selectedYear} setSelectedYear={setSelectedYear} isLoading={isLoading} />}

          {adminTab === 'profit_report' && (
            <ProfitReportView
              transactions={transactions}
              products={products}
              monthlyReports={monthlyReports}
              saveMonthlyReport={saveMonthlyReport}
              settings={settings}
              saveSettings={saveSettings}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              isLoading={isLoading}
            />
          )}

          {adminTab === 'balance_report' && (
            <BalanceReport
              transactions={transactions}
              products={products}
              isLoading={isLoading}
            />
          )}

          {adminTab === 'transactions' && (
            <div className={`animate-in fade-in slide-in-from-bottom-4 duration-500 ${UI_SPACING.section}`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={txSelectedMonth}
                    onChange={(e) => setTxSelectedMonth(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                    className={`p-2.5 bg-white border border-slate-200 ${UI_RADIUS.inner} text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/10`}
                  >
                    <option value="all">Semua Bulan</option>
                    {monthsList.map((m, i) => <option key={i} value={i}>{m}</option>)}
                  </select>
                  <select
                    value={txSelectedYear}
                    onChange={(e) => setTxSelectedYear(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                    className={`p-2.5 bg-white border border-slate-200 ${UI_RADIUS.inner} text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/10`}
                  >
                    <option value="all">Semua Tahun</option>
                    {yearsList.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                  <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button onClick={() => setTxSelectedStatus('all')} className={`px-3 py-1.5 rounded-md text-[10px] font-bold ${txSelectedStatus === 'all' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Semua</button>
                    <button onClick={() => setTxSelectedStatus('Belum Bayar')} className={`px-3 py-1.5 rounded-md text-[10px] font-bold flex items-center gap-1 ${txSelectedStatus === 'Belum Bayar' ? 'bg-amber-50 text-amber-600 shadow-sm border border-amber-200/50' : 'text-slate-500 hover:text-slate-700'}`}>
                      Belum Bayar <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-[8px] leading-none mb-0.5">{transactions?.filter(t => t.paymentStatus === 'Belum Bayar').length || 0}</span>
                    </button>
                    <button onClick={() => setTxSelectedStatus('Sudah Bayar')} className={`px-3 py-1.5 rounded-md text-[10px] font-bold flex items-center gap-1 ${txSelectedStatus === 'Sudah Bayar' ? 'bg-emerald-50 text-emerald-600 shadow-sm border border-emerald-200/50' : 'text-slate-500 hover:text-slate-700'}`}>
                      Sudah Bayar <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded text-[8px] leading-none mb-0.5">{transactions?.filter(t => (t.paymentStatus || 'Sudah Bayar') === 'Sudah Bayar').length || 0}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full sm:w-auto">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImportCSV}
                    accept=".csv"
                    className="hidden"
                  />
                  <button onClick={() => fileInputRef.current?.click()} className={`${UI_BUTTON.base} ${UI_BUTTON.secondary} ${UI_RADIUS.inner} text-blue-600 border-blue-100 hover:bg-blue-50 py-2.5 h-[42px] px-3 sm:px-6`}>
                    <Download size={18} className="rotate-180" /> Import
                  </button>
                  <button onClick={handleExportCSV} className={`${UI_BUTTON.base} ${UI_BUTTON.secondary} ${UI_RADIUS.inner} py-2.5 h-[42px] px-3 sm:px-6`}>
                    <Download size={18} /> Export
                  </button>
                  <button onClick={() => setIsAddingTransaction(true)} className={`${UI_BUTTON.base} ${UI_BUTTON.primary} ${UI_RADIUS.inner} col-span-2 sm:col-span-1 py-2.5 h-[42px] px-3 sm:px-6`}>
                    <Plus size={18} /> Tambah
                  </button>
                </div>
              </div>

              {txSelectedStatus === 'Belum Bayar' && (
                <div className="mb-6 p-6 bg-amber-50/50 border border-amber-100 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-100 text-amber-600 rounded-xl shadow-sm">
                      <DollarSign size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest leading-none mb-1.5">Total Tagihan Belum Dibayar</p>
                      <p className="text-2xl font-black text-slate-900">{formatIDR(filteredTransactions.reduce((acc, tx) => acc + (tx.total || 0), 0))}</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-center sm:items-end">
                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest leading-none mb-1.5">Ringkasan Pesanan</p>
                    <p className="text-sm font-bold text-slate-600">{filteredTransactions.length} Transaksi Menunggu Pembayaran</p>
                  </div>
                </div>
              )}

              <div className="bg-white border border-slate-100 shadow-sm overflow-hidden md:rounded-2xl">
                <TransactionList
                  transactions={filteredTransactions.slice(0, visibleTransactions)}
                  products={products}
                  onDetail={setSelectedTx}
                  onEdit={setEditingTransaction}
                  onDelete={handleDeleteTransaction}
                  onToggleStatus={handleToggleStatus}
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
            <div className={`animate-in fade-in slide-in-from-bottom-4 duration-500 ${UI_SPACING.section}`}>
              <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
                <button onClick={() => setIsAddingProduct(true)} className={`${UI_BUTTON.base} ${UI_BUTTON.primary} ${UI_RADIUS.inner} w-full sm:w-auto`}>
                  <Plus size={18} /> Tambah Produk
                </button>
              </div>

              <div className="bg-white border border-slate-100 shadow-sm overflow-hidden md:rounded-2xl">
                {isLoading ? (
                  <TableSkeleton rows={8} cols={6} />
                ) : (
                  <>
                    {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[1000px]">
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
                            <div className="flex flex-col items-center">
                              <span className={`font-bold ${p.stock < 10 ? 'text-rose-500' : 'text-slate-900'}`}>{p.stock}</span>
                              {p.vendorStatus && (
                                <span className={`mt-1 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tight ${p.vendorStatus === 'Sudah Bayar' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                  {p.vendorStatus}
                                </span>
                              )}
                            </div>
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
                        <div className="text-right flex flex-col items-end">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Stok</p>
                          <p className={`text-sm font-black ${p.stock < 10 ? 'text-rose-500' : 'text-slate-900'}`}>{p.stock}</p>
                          {p.vendorStatus && (
                            <span className={`mt-1 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tight ${p.vendorStatus === 'Sudah Bayar' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                              {p.vendorStatus}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            </div>
            {products.length > visibleProducts && (
              <button onClick={() => setVisibleProducts(prev => prev + 20)} className={`w-full py-4 bg-white text-slate-500 font-bold text-xs ${UI_RADIUS.inner} border border-slate-100 hover:bg-slate-50 transition-all`}>
                Muat Lebih Banyak ({products.length - visibleProducts} Tersisa)
              </button>
            )}
          </div>
        )}

          {adminTab === 'users' && (
            <div className={`animate-in fade-in slide-in-from-bottom-4 duration-500 ${UI_SPACING.section}`}>
              <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
                <button onClick={() => setIsAddingUser(true)} className={`${UI_BUTTON.base} ${UI_BUTTON.primary} ${UI_RADIUS.inner} w-full sm:w-auto`}>
                  <Plus size={18} /> User Baru
                </button>
              </div>

              <div className={`bg-white border border-slate-100 shadow-sm overflow-hidden md:rounded-2xl`}>
                {isLoading ? (
                  <TableSkeleton rows={5} cols={4} />
                ) : (
                  <>
                    <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
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
                </>
              )}
            </div>
          </div>
        )}

          {adminTab === 'settings' && (
            <div className={`animate-in fade-in slide-in-from-bottom-4 duration-500 ${UI_SPACING.section}`}>
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

                <div className={`bg-white ${UI_SPACING.card} ${UI_RADIUS.outer} border border-slate-100 shadow-sm space-y-8 text-rose-600`}>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-3">
                      <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><TrendingUp size={18} /></div>
                      Perbaikan Data
                    </h3>
                    <div className="space-y-4">
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">Temukan dan perbaiki kesalahan umum pada data, seperti tahun yang salah (contoh: 2825 menjadi 2025).</p>
                      <button
                        onClick={repairYearTypos}
                        className="w-full py-4 px-6 bg-blue-50 text-blue-600 font-bold text-sm rounded-xl hover:bg-blue-100 transition-all flex items-center justify-center gap-2 border border-blue-100 active:scale-95"
                      >
                        <CheckCircle2 size={18} /> Perbaiki Kesalahan Tahun (28xx)
                      </button>
                    </div>
                  </div>
                </div>

                <div className={`bg-white ${UI_SPACING.card} ${UI_RADIUS.outer} border border-slate-100 shadow-sm space-y-8`}>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-3">
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><TrendingUp size={18} /></div>
                      Auto-Deployment (Vercel)
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-500/50"></div>
                        <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">Sistem Aktif</p>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">Setiap perubahan kode yang Anda push ke GitHub akan secara otomatis memperbarui website ini. Anda juga bisa memicu build manual menggunakan Deploy Hook.</p>
                      
                      <div className="space-y-4 pt-4 border-t border-slate-50">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vercel Deploy Hook URL</label>
                          <input
                            type="text"
                            value={settings.vercelDeployHook || ''}
                            onChange={(e) => setSettings({ ...settings, vercelDeployHook: e.target.value })}
                            placeholder="https://api.vercel.com/v1/integrations/deploy/..."
                            className="w-full bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs font-mono outline-none focus:border-blue-300 transition-all"
                          />
                        </div>
                        <button
                          onClick={handleTriggerDeploy}
                          className="w-full py-3 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                        >
                          <TrendingUp size={14} /> Picu Build Manual
                        </button>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Perintah Git Manual:</p>
                        <code className="text-[10px] font-mono font-bold text-blue-600 bg-white px-2 py-1 rounded border border-slate-100 block truncate">npm run deploy</code>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`bg-white ${UI_SPACING.card} ${UI_RADIUS.outer} border border-slate-100 shadow-sm space-y-8`}>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-3">
                      <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><Trash2 size={18} /></div>
                      Pengelolaan Data
                    </h3>
                    <div className="space-y-4">
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">Gunakan tombol di bawah untuk menghapus seluruh data transaksi dari sistem. Aksi ini tidak dapat dibatalkan.</p>
                      <button
                        onClick={clearAllTransactions}
                        className="w-full py-4 px-6 bg-rose-50 text-rose-600 font-bold text-sm rounded-xl hover:bg-rose-100 transition-all flex items-center justify-center gap-2 border border-rose-100 active:scale-95"
                      >
                        <Trash2 size={18} /> Hapus Seluruh Data Transaksi
                      </button>

                      <div className="pt-4 mt-4 border-t border-slate-100/50">
                        <p className="text-xs text-slate-500 leading-relaxed font-medium mb-4">Hapus seluruh inventaris produk. Gunakan ini jika ingin mereset daftar produk dari awal.</p>
                        <button
                          onClick={clearAllProducts}
                          className="w-full py-4 px-6 bg-slate-50 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2 border border-slate-100 active:scale-95"
                        >
                          <Package size={18} /> Hapus Seluruh Data Produk
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
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

      {/* Modal CRUD Transaksi */}
      {(isAddingTransaction || editingTransaction) && (
        <TransactionModal
          transaction={editingTransaction}
          products={products}
          onClose={() => { setEditingTransaction(null); setIsAddingTransaction(false); }}
          onSave={handleTransactionSave}
          saveProduct={saveProduct}
        />
      )}

      {/* Import Progress Overlay */}
      {importStatus.isImporting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className={`bg-white p-10 ${UI_RADIUS.outer} shadow-2xl border border-blue-50 flex flex-col items-center gap-6 min-w-[320px] max-w-md w-full animate-in zoom-in duration-300`}>
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center animate-bounce shadow-inner">
              <Download size={32} />
            </div>
            
            <div className="text-center space-y-2">
              <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Memproses Data</h4>
              <p className="text-xs text-slate-500 font-medium">Sedang menyinkronkan data dengan database...</p>
            </div>

            <div className="w-full space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest px-2 py-1 bg-blue-50 rounded-md">Progress Import</span>
                <span className="text-sm font-black text-slate-900">{Math.round((importStatus.current / importStatus.total) * 100) || 0}%</span>
              </div>
              
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-blue-600 transition-all duration-300 ease-out shadow-lg"
                  style={{ width: `${(importStatus.current / importStatus.total) * 100}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">
                <span>{importStatus.current} Baris</span>
                <span>{importStatus.total} Total</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-sm shadow-rose-500/50"></div>
              <p className="text-[10px] text-slate-400 font-black italic uppercase tracking-widest">Jangan tutup atau refresh halaman</p>
            </div>
          </div>
        </div>
      )}

      {/* Detail Pesanan Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className={`bg-white w-full max-w-2xl ${UI_RADIUS.outer} shadow-2xl overflow-hidden animate-in zoom-in duration-300 max-h-[90vh] flex flex-col`}>
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

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div>
                  <label className={UI_TEXT.label}>Tahun</label>
                  <p className="text-xs font-bold text-slate-700">{new Date(selectedTx.date).getFullYear()}</p>
                </div>
                <div className="sm:col-span-1">
                  <label className={UI_TEXT.label}>Metode</label>
                  <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5 capitalize">
                    <CreditCard size={14} className="text-blue-500" /> {selectedTx.method === 'transfer' ? 'Transfer' : 'COD'}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <label className={UI_TEXT.label}>Status Pembayaran</label>
                  <div>
                    <button
                      onClick={() => {
                        const newStatus = (selectedTx.paymentStatus || 'Sudah Bayar') === 'Belum Bayar' ? 'Sudah Bayar' : 'Belum Bayar';
                        saveTransaction({ ...selectedTx, paymentStatus: newStatus }, { silent: true }).then(() => setSelectedTx({ ...selectedTx, paymentStatus: newStatus }));
                      }}
                      className={`mt-1 text-[10px] font-bold px-2 py-1 rounded border transition-colors ${
                        (selectedTx.paymentStatus || 'Sudah Bayar') === 'Belum Bayar'
                          ? 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100'
                          : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      {selectedTx.paymentStatus || 'Sudah Bayar'}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className={UI_TEXT.label}>Item Dipesan</label>
                <div className="space-y-4 mt-3">
                  {selectedTx.items.map((item, idx) => {
                    const productData = products.find(p => p.id === item.id);
                    const cost = productData?.cost || 0;
                    return (
                      <div key={idx} className="space-y-2 pb-4 border-b border-slate-50 last:border-0">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-extrabold text-slate-800">{item.qty}x {item.name}</span>
                          <span className="font-black text-blue-600">{formatIDR(item.price * item.qty)}</span>
                        </div>
                        <div className="flex gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                          <span>Modal: {formatIDR(cost)}</span>
                          <span>Total Modal: {formatIDR(cost * item.qty)}</span>
                          <span className="text-emerald-500">Net Profit: {formatIDR((item.price - cost) * item.qty)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className={UI_TEXT.label}>Catatan Internal</label>
                <div className="relative mt-2">
                  <textarea
                    defaultValue={selectedTx.notes || ''}
                    onBlur={(e) => {
                      if (e.target.value !== selectedTx.notes) {
                        saveTransaction({ ...selectedTx, notes: e.target.value });
                      }
                    }}
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
