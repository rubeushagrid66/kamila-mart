import React, { useState } from 'react';
import { Package, Truck, Minus, Plus, Send, Wallet, CreditCard, CheckCircle2, Info, Phone } from 'lucide-react';
import { formatIDR, UI_RADIUS, UI_SPACING, UI_TEXT, UI_BUTTON } from './utils';

export default function Pemesanan({ settings, products, cart, setCart, showSuccess, setShowSuccess, onNewTransaction }) {
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '', paymentMethod: 'cod' });

  const handleAddToCart = (product, change) => {
    const existing = cart.find(item => item.id === product.id);
    const currentQty = existing ? existing.qty : 0;
    const newQty = Math.max(0, currentQty + change);

    // Check stock limit when increasing
    if (change > 0 && newQty > product.stock) {
      alert(`Stok tidak mencukupi. Stok tersedia: ${product.stock}`);
      return;
    }

    if (newQty <= 0) setCart(cart.filter(item => item.id !== product.id));
    else if (existing) setCart(cart.map(item => item.id === product.id ? { ...item, qty: newQty } : item));
    else setCart([...cart, { ...product, qty: newQty }]);
  };

  const total = cart.reduce((s, i) => s + (i.price * i.qty), 0);

  const handleResetApp = () => {
    setCart([]);
    setCustomerInfo({ name: '', phone: '', address: '', paymentMethod: 'cod' });
    setShowSuccess(false);
  };

  const handleOrderSubmit = () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address || cart.length === 0) {
      alert("Mohon lengkapi data pemesanan dan pilih produk.");
      return;
    }

    onNewTransaction({
      id: Date.now(),
      customer: customerInfo.name,
      phone: customerInfo.phone,
      address: customerInfo.address,
      items: [...cart],
      total: total,
      method: customerInfo.paymentMethod,
      date: new Date(),
      time: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
      paymentStatus: 'menunggu',
      shippingStatus: 'menunggu'
    });

    setShowSuccess(true);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-white animate-in fade-in duration-500">
        <div className={`w-24 h-24 bg-emerald-50 text-emerald-500 ${UI_RADIUS.full} flex items-center justify-center mb-8 shadow-inner`}>
          <CheckCircle2 size={48} className="animate-bounce" />
        </div>
        <h1 className={UI_TEXT.h1}>Pesanan Berhasil!</h1>
        <p className={`${UI_TEXT.caption} mb-10 max-w-xs leading-relaxed mx-auto`}>
          {customerInfo.paymentMethod === 'transfer'
            ? 'Silakan selesaikan pembayaran dan kirimkan bukti transfer melalui WhatsApp Admin.'
            : 'Terima kasih telah berbelanja! Pesanan Anda akan segera kami antar ke alamat tujuan.'}
        </p>

        <div className="w-full max-w-sm space-y-4">
          {customerInfo.paymentMethod === 'transfer' && settings?.adminPhone && (
            <a
              href={`https://wa.me/${settings.adminPhone.replace(/[^0-9]/g, '')}?text=Halo%20Admin%20${encodeURIComponent(settings?.martName || 'Kamila Mart')},%20saya%20sudah%20transfer%20pembayaran%20untuk%20pesanan%20atas%20nama%20${encodeURIComponent(customerInfo.name)}%20sebesar%20${encodeURIComponent(formatIDR(total))}.%20Berikut%20bukti%20transfernya.`}
              target="_blank"
              rel="noreferrer"
              className={`${UI_BUTTON.base} ${UI_BUTTON.primary} ${UI_RADIUS.inner} w-full py-4.5`}
            >
              <Phone size={20} /> Kirim Bukti Transfer
            </a>
          )}

          <button
            onClick={handleResetApp}
            className={`${UI_BUTTON.base} ${UI_BUTTON.secondary} ${UI_RADIUS.inner} w-full py-4.5 font-black`}
          >
            Selesai & Kembali Belanja
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-slate-50 min-h-screen flex flex-col relative shadow-2xl border-x border-slate-100">
      <header className="flex justify-between items-center px-6 py-5 sticky top-0 bg-white/80 backdrop-blur-xl border-b border-slate-100 z-20">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1">{settings?.martName || 'Kamila Mart'}</h1>
          <p className="text-blue-600 text-[10px] font-black flex items-center gap-1 uppercase tracking-[0.2em]">Layanan Harian Keluarga</p>
        </div>
        <div className="flex items-center gap-3">
          {settings?.adminPhone && (
            <a
              href={`https://wa.me/${settings.adminPhone.replace(/[^0-9]/g, '')}?text=Halo%20Admin%20${encodeURIComponent(settings?.martName || 'Kamila Mart')}`}
              target="_blank"
              rel="noreferrer"
              className={`p-3 bg-blue-50 text-blue-600 hover:bg-blue-100 ${UI_RADIUS.inner} transition-all active:scale-95`}
            >
              <Phone size={20} />
            </a>
          )}
        </div>
      </header>

      <div className="flex-1 px-6 py-8 pb-36 space-y-10">
        {/* Produk List */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className={UI_TEXT.h2}>Katalog Produk</h2>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase">{products.filter(p => !p.isArchived).length} Item</span>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {products.filter(p => p.status === 'aktif' || (!p.status && !p.isArchived)).map(p => {
              const qty = cart.find(i => i.id === p.id)?.qty || 0;
              const isOutOfStock = p.stock <= 0;
              return (
                <div
                  key={p.id}
                  className={`p-4 bg-white ${UI_RADIUS.outer} border transition-all duration-300 flex items-center gap-4 ${qty > 0 ? 'border-blue-500 shadow-lg shadow-blue-500/5 scale-[1.02]' : 'border-slate-100 shadow-sm'} ${isOutOfStock ? 'opacity-60 grayscale' : ''}`}
                >
                  <div className={`w-12 h-12 bg-blue-50 text-blue-600 ${UI_RADIUS.inner} flex-shrink-0 flex items-center justify-center border border-blue-50`}>
                    <Package size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm truncate mb-1">{p.name}</h3>
                    <div className="flex items-center gap-3">
                      <p className="text-blue-600 font-black text-sm">{formatIDR(p.price)}</p>
                      {isOutOfStock ? (
                        <span className="text-[9px] font-black bg-rose-500 text-white px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm">Habis</span>
                      ) : (
                        <span className={`text-[9px] font-bold ${p.stock < 10 ? 'text-amber-500' : 'text-slate-400'} uppercase tracking-tight`}>Stok: {p.stock}</span>
                      )}
                    </div>
                  </div>
                  <div className={`flex items-center bg-slate-50 ${UI_RADIUS.inner} border border-slate-100 p-1 ${isOutOfStock ? 'pointer-events-none' : ''}`}>
                    <button
                      onClick={() => handleAddToCart(p, -1)}
                      disabled={isOutOfStock || qty === 0}
                      className={`p-2 text-slate-400 hover:text-rose-500 hover:bg-white ${UI_RADIUS.inner} transition-all disabled:opacity-30`}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center text-sm font-black text-slate-900 tabular-nums">{qty}</span>
                    <button
                      onClick={() => handleAddToCart(p, 1)}
                      disabled={isOutOfStock || (qty >= p.stock)}
                      className={`p-2 text-blue-600 hover:bg-white ${UI_RADIUS.inner} transition-all disabled:opacity-30`}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Data Pelanggan */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className={UI_TEXT.h2}>Informasi Pengantaran</h2>
          </div>
          <div className={`bg-white ${UI_SPACING.card} ${UI_RADIUS.outer} shadow-sm border border-slate-100 space-y-8`}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className={UI_TEXT.label}>Nama Lengkap</label>
                  <input
                    placeholder="Masukkan nama Anda"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    className={`w-full p-4 bg-slate-50 border border-slate-100 ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-bold text-sm text-slate-900`}
                  />
                </div>
                <div className="space-y-2">
                  <label className={UI_TEXT.label}>Nomor WhatsApp</label>
                  <input
                    placeholder="Contoh: 0812..."
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    className={`w-full p-4 bg-slate-50 border border-slate-100 ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-bold text-sm text-slate-900`}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className={UI_TEXT.label}>Alamat Lengkap</label>
                <textarea
                  placeholder="Detail blok, nomor rumah, atau patokan..."
                  rows="3"
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                  className={`w-full p-4 bg-slate-50 border border-slate-100 ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-bold text-sm text-slate-900 resize-none h-28`}
                />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <p className={UI_TEXT.label}>Metode Pembayaran</p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setCustomerInfo({ ...customerInfo, paymentMethod: 'cod' })}
                  className={`flex flex-col items-center justify-center gap-3 p-5 ${UI_RADIUS.outer} font-black text-xs border-2 transition-all ${customerInfo.paymentMethod === 'cod' ? 'bg-slate-900 text-white border-slate-900 shadow-xl scale-105' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'}`}
                >
                  <Wallet size={24} />
                  <span>Bayar di Tempat</span>
                </button>
                <button
                  onClick={() => setCustomerInfo({ ...customerInfo, paymentMethod: 'transfer' })}
                  className={`flex flex-col items-center justify-center gap-3 p-5 ${UI_RADIUS.outer} font-black text-xs border-2 transition-all ${customerInfo.paymentMethod === 'transfer' ? 'bg-slate-900 text-white border-slate-900 shadow-xl scale-105' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'}`}
                >
                  <CreditCard size={24} />
                  <span>Transfer Bank</span>
                </button>
              </div>
            </div>

            {customerInfo.paymentMethod === 'transfer' && (
              <div className={`p-6 bg-blue-50/30 border border-blue-100 ${UI_RADIUS.outer} animate-in slide-in-from-top-4 duration-500`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 bg-blue-600 text-white ${UI_RADIUS.inner}`}>
                    <Info size={14} />
                  </div>
                  <span className="text-xs font-black text-blue-900 uppercase tracking-widest">Detail Rekening</span>
                </div>
                <div className={`p-5 bg-white ${UI_RADIUS.inner} border border-blue-100 shadow-sm space-y-2`}>
                  <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em]">{settings?.bankName || 'BANK'}</p>
                  <p className="font-black text-slate-900 text-lg tracking-tight tabular-nums">{settings?.bankAccountNumber || '-'}</p>
                  <p className="text-xs text-slate-500 font-bold">a/n {settings?.bankAccountName || '-'}</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Floating Cart Bar */}
      <div className="fixed bottom-6 left-0 right-0 px-6 max-w-xl mx-auto z-30">
        <div className={`bg-slate-900/95 backdrop-blur-xl p-4 ${UI_RADIUS.outer} border border-white/10 shadow-2xl flex items-center justify-between gap-6 animate-in slide-in-from-bottom-6 duration-700`}>
          <div className="flex-1 min-w-0 pl-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Bayar</p>
            <p className="text-xl font-black text-white truncate tabular-nums">{formatIDR(total)}</p>
          </div>
          <button
            onClick={handleOrderSubmit}
            disabled={cart.length === 0}
            className={`${UI_BUTTON.base} ${UI_BUTTON.primary} ${UI_RADIUS.inner} px-10 py-4.5 disabled:opacity-30 disabled:grayscale`}
          >
            <Send size={18} /> PESAN
          </button>
        </div>
      </div>
    </div>
  );
}
