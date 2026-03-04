import React from 'react';
import { Lock, User, Key } from 'lucide-react';
import { UI_RADIUS } from './utils';

export default function LoginPage({ onLogin, onBack }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900">
      <div className={`bg-white p-10 ${UI_RADIUS.outer} shadow-2xl w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-300`}>
        <div className="text-center">
          <div className={`w-14 h-14 bg-blue-50 text-blue-600 ${UI_RADIUS.inner} flex items-center justify-center mx-auto mb-4`}>
            <Lock size={28} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Portal Admin</h2>
          <p className="text-slate-400 text-xs mt-1">Silakan masuk untuk mengelola toko</p>
        </div>
        <form onSubmit={onLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Username</label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              <input 
                required 
                name="username" 
                className={`w-full p-3.5 pl-11 bg-slate-50 border border-slate-100 ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium`} 
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
            <div className="relative">
              <Key size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              <input 
                required 
                name="password" 
                type="password" 
                className={`w-full p-3.5 pl-11 bg-slate-50 border border-slate-100 ${UI_RADIUS.inner} outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium`} 
              />
            </div>
          </div>
          <button 
            type="submit" 
            className={`w-full py-4 bg-blue-600 text-white ${UI_RADIUS.inner} font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-[0.98]`}
          >
            Masuk Sekarang
          </button>
        </form>
        <button 
          onClick={onBack} 
          className="w-full text-slate-400 text-xs font-semibold hover:text-slate-600 transition text-center"
        >
          Kembali ke Beranda Toko
        </button>
      </div>
    </div>
  );
}
