import React, { useState } from 'react';
import { Package, Truck, Minus, Plus, Send, Wallet, CreditCard, CheckCircle2, Lock, Info, Phone } from 'lucide-react';
import { formatIDR, UI_RADIUS } from './utils';

export default function Pemesanan({ settings, products, cart, setCart, showSuccess, setShowSuccess, onAdminClick, onNewTransaction }) {
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
        <div className={`w-20 h-20 bg-emerald-50 text-emerald-500 ${UI_RADIUS.full} flex items-center justify-center mb-6`}>
          <CheckCircle2 size={40} />
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">Pesanan Terkirim!</h1>
        <p className="text-slate-500 text-sm mb-8 max-w-xs leading-relaxed">Pesanan Anda telah berhasil dikirim. Kurir kami akan segera memproses pengiriman.</p>
        <button
          onClick={handleResetApp}
          className={`bg-blue-600 text-white w-full max-w-xs py-4 ${UI_RADIUS.inner} font-bold shadow-lg shadow-blue-500/10 active:scale-95 transition-all`}
        >
          Selesai & Kembali Belanja
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-[#F8FAFC] min-h-screen flex flex-col relative shadow-2xl">
      <header className="flex justify-between items-center px-5 py-4 sticky top-0 bg-white/70 backdrop-blur-xl border-b border-slate-100 z-20">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">{settings?.martName || 'Kamila Mart'}</h1>
          <p className="text-slate-400 text-[10px] font-semibold flex items-center gap-1 uppercase tracking-widest">Layanan harian rumah tangga</p>
        </div>
        <div className="flex items-center gap-3">
          {settings?.adminPhone && (
            <a
              href={`https://wa.me/${settings.adminPhone.replace(/[^0-9]/g, '')}?text=Halo%20Admin%20${encodeURIComponent(settings?.martName || 'Kamila Mart')}`}
              target="_blank"
              rel="noreferrer"
              className={`p-2.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 ${UI_RADIUS.inner} transition-colors flex items-center gap-2`}
            >
              <Phone size={16} />
              <span className="text-xs font-bold hidden sm:block">Admin</span>
            </a>
          )}
          <button onClick={onAdminClick} className={`p-2.5 bg-slate-50 text-slate-300 hover:text-blue-500 ${UI_RADIUS.inner} transition-colors`}>
            <Lock size={16} />
          </button>
        </div>
      </header>

      <div className="flex-1 px-5 py-4 pb-32 space-y-6">
        {/* Produk List */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] flex items-center gap-2">
              <Package size={14} className="text-blue-500" /> Katalog Belanja
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            {products.filter(p => !p.isArchived).map(p => {
              const qty = cart.find(i => i.id === p.id)?.qty || 0;
              const isOutOfStock = p.stock <= 0;
              return (
                <div
                  key={p.id}
                  className={`p-3 bg-white ${UI_RADIUS.outer} border transition-all flex items-center gap-4 ${qty > 0 ? 'border-blue-200 ring-2 ring-blue-50' : 'border-white shadow-sm hover:shadow-md'} ${isOutOfStock ? 'opacity-60 grayscale-[0.5]' : ''}`}
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 text-sm truncate">{p.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-blue-600 font-bold text-sm">{formatIDR(p.price)}</p>
                      {isOutOfStock ? (
                        <span className="text-[9px] font-black bg-rose-500 text-white px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm animate-pulse">Stok Habis</span>
                      ) : (
                        <span className={`text-[9px] font-bold ${p.stock < 10 ? 'text-amber-500' : 'text-slate-300'} uppercase tracking-tight`}>Stok: {p.stock}</span>
                      )}
                    </div>
                  </div>
                  <div className={`flex items-center bg-slate-50 ${UI_RADIUS.inner} border border-slate-100 p-0.5 ${isOutOfStock ? 'pointer-events-none' : ''}`}>
                    <button
                      onClick={() => handleAddToCart(p, -1)}
                      disabled={isOutOfStock}
                      className={`p-2 text-slate-400 hover:text-red-500 hover:bg-white ${UI_RADIUS.inner} transition-all disabled:opacity-30`}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-slate-800 tracking-tighter">{qty}</span>
                    <button
                      onClick={() => handleAddToCart(p, 1)}
                      disabled={isOutOfStock || (qty >= p.stock)}
                      className={`p-2 text-blue-600 hover:bg-white ${UI_RADIUS.inner} transition-all disabled:opacity-30`}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Data Pelanggan */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] flex items-center gap-2">
              <Truck size={14} className="text-blue-500" /> Detail Pengantaran
            </h2>
          </div>
          <div className={`bg-white p-5 ${UI_RADIUS.outer} shadow-sm border border-white space-y-4`}>
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase ml-1">Nama</span>
                  <input
                    placeholder="Nama Anda"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    className={`w-full p-3 bg-slate-50 border border-slate-100 ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-medium text-sm`}
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase ml-1">WhatsApp</span>
                  <input
                    placeholder="08xx..."
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    className={`w-full p-3 bg-slate-50 border border-slate-100 ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-medium text-sm`}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase ml-1">Alamat</span>
                <textarea
                  placeholder="Detail alamat..."
                  rows="2"
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                  className={`w-full p-3 bg-slate-50 border border-slate-100 ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-medium text-sm resize-none`}
                />
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Metode Pembayaran</p>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => setCustomerInfo({ ...customerInfo, paymentMethod: 'cod' })}
                  className={`flex items-center justify-center gap-2 p-3 ${UI_RADIUS.inner} font-bold text-xs border transition-all ${customerInfo.paymentMethod === 'cod' ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-500 border-slate-100'}`}
                >
                  <Wallet size={14} /> Bayar di Tempat
                </button>
                <button
                  onClick={() => setCustomerInfo({ ...customerInfo, paymentMethod: 'transfer' })}
                  className={`flex items-center justify-center gap-2 p-3 ${UI_RADIUS.inner} font-bold text-xs border transition-all ${customerInfo.paymentMethod === 'transfer' ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-500 border-slate-100'}`}
                >
                  <CreditCard size={14} /> Transfer Bank
                </button>
              </div>
            </div>

            {customerInfo.paymentMethod === 'transfer' && (
              <div className={`p-4 bg-blue-50/50 border border-blue-100 ${UI_RADIUS.inner} animate-in slide-in-from-top-2 duration-300`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`p-1 bg-blue-600 text-white ${UI_RADIUS.inner}`}>
                    <Info size={10} />
                  </div>
                  <span className="text-[10px] font-bold text-blue-900 uppercase tracking-tight">Detail Rekening</span>
                </div>
                <div className={`p-3 bg-white ${UI_RADIUS.inner} border border-blue-100 shadow-sm space-y-1`}>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{settings?.bankName || 'Bank'}</p>
                  <p className="font-bold text-slate-800 text-sm tracking-tight">{settings?.bankAccountNumber || '-'}</p>
                  <p className="text-xs text-slate-500">a/n {settings?.bankAccountName || '-'}</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Floating Cart Bar */}
      <div className="fixed bottom-4 left-0 right-0 px-5 max-w-xl mx-auto z-30">
        <div className={`bg-white/90 backdrop-blur-xl p-3 ${UI_RADIUS.outer} border border-white/50 shadow-xl shadow-slate-200 flex items-center justify-between gap-3 animate-in slide-in-from-bottom-4 duration-500`}>
          <div className="flex-1 min-w-0 pl-2">
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Total Bayar</p>
            <p className="text-base font-bold text-slate-900 truncate">{formatIDR(total)}</p>
          </div>
          <button
            onClick={handleOrderSubmit}
            disabled={cart.length === 0}
            className={`flex-1 max-w-[150px] py-3.5 bg-blue-600 text-white ${UI_RADIUS.inner} font-bold text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-40`}
          >
            <Send size={14} /> Pesan
          </button>
        </div>
      </div>
    </div>
  );
}
