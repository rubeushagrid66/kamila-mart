import React, { useState, useEffect } from 'react';
import LoginPage from './Login';
import Pemesanan from './Pemesanan';
import AdminDashboard from './AdminDashboard';
import { INITIAL_PRODUCTS, INITIAL_USERS, INITIAL_SETTINGS } from './utils';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home'); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [cart, setCart] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [adminTab, setAdminTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleLogin = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const user = users.find(u => u.username === fd.get('username') && u.password === fd.get('password'));
    if (user) {
      setIsLoggedIn(true);
      setCurrentPage('dashboard');
    } else {
      alert("Username atau Password salah!");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('home');
  };

  const addTransaction = (newOrder) => {
    setTransactions(prev => [newOrder, ...prev]);
    setToast({ message: `Pesanan Baru dari ${newOrder.customer}!`, type: 'success' });
  };

  const updateTransactionStatus = (id, field, value) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const renderContent = () => {
    if (currentPage === 'login') {
      return <LoginPage onLogin={handleLogin} onBack={() => setCurrentPage('home')} />;
    }
    
    if (currentPage === 'dashboard') {
      return (
        <AdminDashboard 
          adminTab={adminTab} setAdminTab={setAdminTab} 
          products={products} setProducts={setProducts} 
          users={users} setUsers={setUsers} settings={settings} setSettings={setSettings}
          mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen}
          handleLogout={handleLogout}
          onCustomerView={() => setCurrentPage('home')}
          transactions={transactions}
          updateTransactionStatus={updateTransactionStatus}
        />
      );
    }

    return (
      <Pemesanan 
        settings={settings} products={products} cart={cart} 
        setCart={setCart} showSuccess={showSuccess} setShowSuccess={setShowSuccess}
        onAdminClick={() => setCurrentPage('login')}
        onNewTransaction={addTransaction}
      />
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 duration-300">
          <div className={`px-6 py-3 bg-slate-900 text-white shadow-2xl rounded-full flex items-center gap-3 border border-white/10`}>
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm font-bold tracking-tight">{toast.message}</span>
          </div>
        </div>
      )}
      {renderContent()}
    </div>
  );

  import Footer from './Footer';

// At the end of JSX, wrap with Footer
return (
  <div>
    {renderContent()}
    <Footer />
  </div>
);
}
