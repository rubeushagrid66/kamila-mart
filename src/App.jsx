import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc, onSnapshot, query, orderBy, limit, increment, writeBatch } from 'firebase/firestore';
import { auth, db } from './firebase-config';
import Login from './Login';
import Pemesanan from './Pemesanan';
import AdminDashboard from './AdminDashboard';
import toast, { Toaster } from 'react-hot-toast';
import { formatIDR } from './utils';
function AppContent() {
  const lastDeployRef = useRef(0);
  const [user, setUser] = useState(null);
  const [customUser, setCustomUser] = useState(() => {
    const saved = localStorage.getItem('kamila_custom_user');
    return saved ? JSON.parse(saved) : null;
  });
  const navigate = useNavigate();

  // Initial mock user if customUser exists
  useEffect(() => {
    if (customUser && !user) {
      setUser({ email: `${customUser.username}@kamilamart.com` });
    }
  }, []);

  const [cart, setCart] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [adminTab, setAdminTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [settings, setSettings] = useState({
    martName: 'Kamila Mart',
    adminPhone: '',
    bankName: '',
    bankAccountName: '',
    bankAccountNumber: '',
    vercelDeployHook: '',
    autoDeploy: true
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [monthlyReports, setMonthlyReports] = useState([]);

  // Sync customUser with localStorage
  useEffect(() => {
    if (customUser) {
      localStorage.setItem('kamila_custom_user', JSON.stringify(customUser));
    } else {
      localStorage.removeItem('kamila_custom_user');
    }
  }, [customUser]);

  // Fetch data with timeouts and logical split
  useEffect(() => {
    let mounted = true;
    let unsubscribe = () => { };

    const fetchWithTimeout = async (queryReq, ms = 8000) => {
      return Promise.race([
        getDocs(queryReq),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))
      ]);
    };

    const loadPublicData = async () => {
      try {
        // Detect if mobile for longer timeout
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
        const timeout = isMobile ? 15000 : 8000; // Increased to 15s for very slow connections
        
        const productsSnap = await fetchWithTimeout(collection(db, 'products'), timeout);
        if (mounted) setProducts(productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const settingsSnap = await fetchWithTimeout(collection(db, 'settings'), timeout);
        if (mounted && settingsSnap.docs.length > 0) {
          setSettings(settingsSnap.docs[0].data());
        }
      } catch (error) {
        console.error('Error public data:', error);
        if (error.message === 'timeout' && mounted) {
          toast.error('Pengambilan data lambat. Apakah Firestore Database sudah di-Create di Firebase Console?', { duration: 6000 });
        }
      }
    };

    const init = async () => {
      setLoading(true);
      console.log('[App] Initializing...');

      // Request notification permission
      if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
      }

      await loadPublicData();

      // Fetch users list early for login fallback
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        if (mounted) setUsers(usersSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Error fetching users for fallback:", err);
      }

      // Setup Auth Listener
      unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        console.log('[App] Auth state changed:', currentUser?.email || 'not logged in');
        if (currentUser) {
          if (mounted) {
            setUser(currentUser);
            setCustomUser(null);
          }
        } else {
          if (mounted && !customUser) {
            setUser(null);
            setIsFirstLoad(true);
          }
        }
        if (mounted) {
          console.log('[App] Setting loading to false');
          setLoading(false);
        }
      });
    };

    init();

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [customUser]);

  // DATA SYNC EFFECT: Setup real-time listeners whenever a user is logged in
  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setMonthlyReports([]);
      return;
    }

    console.log('[App] Setting up data listeners for user:', user.email);
    let mounted = true;

    // --- Setup real-time listener for transactions ---
    const qTx = query(collection(db, 'transactions'), orderBy('date', 'desc'));
    const unsubTx = onSnapshot(qTx, (snapshot) => {
      const txList = snapshot.docs.map(doc => {
        const data = doc.data();
        let date;
        if (data.date?.toDate) {
          date = data.date.toDate();
        } else if (data.date) {
          date = new Date(data.date);
          if (isNaN(date.getTime())) date = new Date();
        } else {
          date = new Date();
        }
        return { id: doc.id, ...data, date };
      });
      if (mounted) {
        setTransactions(txList);
        setLoadingData(false);
      }

      if (!isFirstLoad) {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const newTx = change.doc.data();
            
            // Play notification sound
            try {
              const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
              audio.play().catch(e => console.log('Audio play blocked:', e));
            } catch (err) {
              console.warn('Sound error:', err);
            }

            toast.success(`Pesanan Baru dari ${newTx.customer || 'Pelanggan'}!`, {
              duration: 8000,
              icon: '🛒'
            });

            if ("Notification" in window && Notification.permission === "granted") {
              const productNames = newTx.items?.length > 0 
                ? (newTx.items[0].name + (newTx.items.length > 1 ? ` dan ${newTx.items.length - 1} produk lainnya` : ''))
                : 'Produk';
                
              const notification = new Notification("Pesanan Baru!", {
                body: `Pesanan baru dari ${newTx.customer || 'Pelanggan'} untuk ${productNames}`,
                icon: "/favicon.ico",
                tag: change.doc.id,
                requireInteraction: true
              });

              notification.onclick = () => {
                window.focus();
                navigate(`/dashboard/transactions?detail=${change.doc.id}`);
                notification.close();
              };
            }
          }
        });
      }
      if (mounted) setIsFirstLoad(false);
    }, (error) => {
      console.error('Transactions sync error:', error);
    });

    // --- Setup real-time listener for monthly reports ---
    const unsubReports = onSnapshot(collection(db, 'monthly_reports'), (snapshot) => {
      const reports = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (mounted) setMonthlyReports(reports);
    }, (error) => {
      console.error('Reports sync error:', error);
    });

    return () => {
      mounted = false;
      unsubTx();
      unsubReports();
    };
  }, [user]);

  // PRODUCT CRUD
  const saveProduct = async (productData) => {
    try {
      const { id, ...dataToSave } = productData;
      const targetId = id || doc(collection(db, 'products')).id;

      await setDoc(doc(db, 'products', targetId), dataToSave, { merge: true });
      if (settings.autoDeploy) triggerDeployHook();

      setProducts(prev => {
        const index = prev.findIndex(p => p.id === targetId);
        if (index > -1) {
          const newProducts = [...prev];
          newProducts[index] = { id: targetId, ...dataToSave };
          return newProducts;
        }
        return [...prev, { id: targetId, ...dataToSave }];
      });

      toast.success('Produk berhasil disimpan!');
      return targetId;
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Gagal menyimpan produk');
      throw error;
    }
  };

  const deleteProduct = async (productId) => {
    try {
      if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
        await deleteDoc(doc(db, 'products', productId));
        setProducts(prev => prev.filter(p => p.id !== productId));
        toast.success('Produk berhasil dihapus!');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Gagal menghapus produk');
    }
  };

  // USER CRUD
  const saveUser = async (userData) => {
    try {
      const { id, ...dataToSave } = userData;
      if (id) {
        // Update existing
        await updateDoc(doc(db, 'users', id), dataToSave);
        setUsers(prev => prev.map(u => u.id === id ? { id, ...dataToSave } : u));
        toast.success('User berhasil diperbarui!');
      } else {
        // Add new
        const docRef = await addDoc(collection(db, 'users'), dataToSave);
        setUsers(prev => [...prev, { id: docRef.id, ...dataToSave }]);
        toast.success('User berhasil ditambahkan!');
      }
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Gagal menyimpan user');
    }
  };

  const deleteUser = async (userId) => {
    try {
      if (window.confirm('Apakah Anda yakin ingin menghapus user ini?')) {
        await deleteDoc(doc(db, 'users', userId));
        setUsers(prev => prev.filter(u => u.id !== userId));
        toast.success('User berhasil dihapus!');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Gagal menghapus user');
    }
  };

  // TRANSACTION CRUD
  const saveTransaction = async (transactionData, { silent = false, skipStockUpdate = false } = {}) => {
    try {
      const { id, ...dataToSave } = transactionData;
      const isNew = !id || !transactions.some(t => t.id === id.toString());
      const targetId = id ? id.toString() : doc(collection(db, 'transactions')).id;

      if (isNew && !dataToSave.paymentStatus) {
        dataToSave.paymentStatus = 'Belum Bayar';
      }

      await setDoc(doc(db, 'transactions', targetId), dataToSave, { merge: true });

      if (isNew) {
        // --- SEND TELEGRAM NOTIFICATION ---
        if (settings.telegramBotToken && settings.telegramChatId) {
          const itemsText = (dataToSave.items || []).map(it => `${it.name} (${it.qty})`).join(', ');
          const totalAmount = formatIDR(dataToSave.total);
          const detailLink = `${window.location.origin}/dashboard/transactions?detail=${targetId}`;
          
          const message = `<b>Ada pesanan baru!</b>\n\n` +
            `📦 <b>Produk:</b> ${itemsText}\n` +
            `👤 <b>Pelanggan:</b> ${dataToSave.customer}\n` +
            `💳 <b>Metode:</b> ${String(dataToSave.method).toUpperCase()}\n` +
            `💰 <b>Total:</b> ${totalAmount}\n\n` +
            `<a href="${detailLink}">Klik di sini untuk detail pesanan</a>`;

          fetch(`https://api.telegram.org/bot${settings.telegramBotToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: settings.telegramChatId,
              text: message,
              parse_mode: 'HTML'
            })
          }).catch(e => console.error('Telegram error:', e));
        }
        // ------------------------------------

        if (!skipStockUpdate) {
          // --- REDUCE STOCK ---
          const stockUpdates = (dataToSave.items || []).map(async (item) => {
            if (item.id) {
              const productRef = doc(db, 'products', item.id.toString());
              await updateDoc(productRef, {
                stock: increment(-item.qty)
              });
            }
          });
          await Promise.all(stockUpdates);
          // --------------------
        }
      }

      if (settings.autoDeploy) triggerDeployHook();

      setTransactions(prev => {
        const index = prev.findIndex(t => t.id === targetId);
        const preparedTx = { id: targetId, ...dataToSave, date: dataToSave.date instanceof Date ? dataToSave.date : new Date(dataToSave.date) };
        if (index > -1) {
          const newTx = [...prev];
          newTx[index] = preparedTx;
          return newTx;
        }
        return [preparedTx, ...prev];
      });

      if (!silent) {
        toast.success(isNew ? 'Pesanan berhasil dibuat!' : 'Transaksi berhasil diperbarui!');
      }
      return targetId;
    } catch (error) {
      console.error('Error saving transaction:', error);
      toast.error('Gagal menyimpan transaksi');
      throw error;
    }
  };

  const saveTransactionsBulk = async (transactionsArray, { skipStockUpdate = false } = {}) => {
    try {
      // 1. Save to Firestore in batches of 500
      for (let i = 0; i < transactionsArray.length; i += 500) {
        const batch = writeBatch(db);
        const chunk = transactionsArray.slice(i, i + 500);

        chunk.forEach(tx => {
          const { id, ...dataToSave } = tx;
          const docRef = id ? doc(db, 'transactions', id.toString()) : doc(collection(db, 'transactions'));
          batch.set(docRef, dataToSave, { merge: true });
        });

        await batch.commit();
      }

      toast.success(`Berhasil mengimpor ${transactionsArray.length} transaksi!`);
      if (settings.autoDeploy) triggerDeployHook();
    } catch (error) {
      console.error('Error saving transactions bulk:', error);
      toast.error('Gagal menyimpan beberapa transaksi');
      throw error;
    }
  };

  const deleteTransaction = async (transactionId) => {
    try {
      await deleteDoc(doc(db, 'transactions', transactionId));
      toast.success('Transaksi berhasil dihapus!');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Gagal menghapus transaksi');
    }
  };

  const clearAllTransactions = async () => {
    try {
      if (window.confirm('PERINGATAN: Seluruh data transaksi dan laporan akan dihapus secara permanen. Lanjutkan?')) {
        toast.loading('Membersihkan data transaksi...', { id: 'clearing_tx' });
        const collectionsToClear = ['transactions', 'monthly_reports'];

        for (const collName of collectionsToClear) {
          const querySnapshot = await getDocs(collection(db, collName));
          const docs = querySnapshot.docs;

          if (docs.length === 0) continue;

          for (let i = 0; i < docs.length; i += 500) {
            const batch = writeBatch(db);
            const chunk = docs.slice(i, i + 500);
            chunk.forEach(d => batch.delete(d.ref));
            await batch.commit();
          }
        }

        setTransactions([]);
        setMonthlyReports([]);
        toast.success('Seluruh data transaksi berhasil dibersihkan!', { id: 'clearing_tx' });
      }
    } catch (error) {
      console.error('Error clearing transactions:', error);
      toast.error('Gagal menghapus data transaksi', { id: 'clearing_tx' });
    }
  };

  const clearAllProducts = async () => {
    try {
      if (window.confirm('PERINGATAN: Seluruh data produk akan dihapus secara permanen. Lanjutkan?')) {
        toast.loading('Membersihkan data produk...', { id: 'clearing_products' });
        const querySnapshot = await getDocs(collection(db, 'products'));
        const docs = querySnapshot.docs;

        if (docs.length === 0) {
          toast.success('Data produk sudah kosong', { id: 'clearing_products' });
          return;
        }

        for (let i = 0; i < docs.length; i += 500) {
          const batch = writeBatch(db);
          const chunk = docs.slice(i, i + 500);
          chunk.forEach(d => batch.delete(d.ref));
          await batch.commit();
        }

        setProducts([]);
        toast.success('Seluruh data produk berhasil dibersihkan!', { id: 'clearing_products' });
      }
    } catch (error) {
      console.error('Error clearing products:', error);
      toast.error('Gagal menghapus data produk', { id: 'clearing_products' });
    }
  };


  // MONTHLY REPORTS
  const saveMonthlyReport = async (reportId, data) => {
    try {
      const reportRef = doc(db, 'monthly_reports', reportId);
      await setDoc(reportRef, data, { merge: true });
      if (settings.autoDeploy) triggerDeployHook();
    } catch (error) {
      console.error('Error saving monthly report:', error);
      toast.error('Gagal menyimpan laporan bulanan');
    }
  };

  // SETTINGS CRUD
  const saveSettings = async (settingsData) => {
    try {
      const settingsRef = doc(db, 'settings', 'main');
      await setDoc(settingsRef, settingsData);
      setSettings(settingsData);
      toast.success('Pengaturan berhasil disimpan!');
      if (settingsData.autoDeploy) triggerDeployHook();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Gagal menyimpan pengaturan');
    }
  };

  const triggerDeployHook = async () => {
    if (!settings.vercelDeployHook) return;
    
    // Antispam build (cooldown 30s)
    const now = Date.now();
    if (now - lastDeployRef.current < 30000) return;
    lastDeployRef.current = now;

    try {
      await fetch(settings.vercelDeployHook, { method: 'POST' });
      toast.success('Website sedang diperbarui secara otomatis...', { icon: '🚀', duration: 4000 });
      console.log('Auto-deployment triggered via hook');
    } catch (error) {
      console.error('Failed to trigger auto-deployment:', error);
    }
  };

  // Auth functions
  const handleLogin = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const usernameInput = fd.get('username');
    const password = fd.get('password');

    let email = usernameInput;
    if (email && !email.includes('@')) {
      email = `${email}@kamilamart.com`;
    }

    try {
      console.log('[App] Attempting Firebase login...');
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Login berhasil (Firebase)!');
      setCustomUser(null);
      setMobileMenuOpen(false);
      console.log('[App] Firebase login successful, navigating to dashboard');
      navigate('/dashboard/dashboard');
    } catch (firebaseError) {
      console.warn('Firebase login failed, trying Firestore fallback...', firebaseError.code);

      // Fallback to Firestore users collection
      const foundUser = users.find(u => u.username === usernameInput && u.password === password);

      if (foundUser) {
        console.log('[App] Firestore fallback successful');
        setCustomUser(foundUser);
        setUser({ email: `${foundUser.username}@kamilamart.com` });
        setMobileMenuOpen(false);
        toast.success(`Login berhasil sebagai ${foundUser.name} !`);
        navigate('/dashboard/dashboard');
      } else {
        console.error('[App] Login failed - invalid credentials');
        toast.error('Gagal login: Username atau Password salah');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setCustomUser(null);
      setAdminTab('dashboard');
      setMobileMenuOpen(false);
      toast.success('Logout berhasil!');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Gagal logout');
    }
  };

  const onCustomerView = () => {
    setMobileMenuOpen(false);
    navigate('/');
  };

  if (loading) {
    console.log('[App] Loading state: true - showing loading screen');
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Toaster position="top-center" />
      <Routes>
        <Route
          path="/"
          element={
            <Pemesanan
              settings={settings} products={products} cart={cart}
              setCart={setCart} showSuccess={showSuccess} setShowSuccess={setShowSuccess}
              onNewTransaction={saveTransaction}
            />
          }
        />
        <Route
          path="/login"
          element={
            user ? <Navigate to="/dashboard/dashboard" replace /> : <Login onLogin={handleLogin} onBack={() => navigate('/')} />
          }
        />
        <Route
          path="/dashboard/:tab"
          element={
            user ? (
              <AdminDashboard
                products={products}
                saveProduct={saveProduct}
                deleteProduct={deleteProduct}
                users={users}
                setUsers={setUsers}
                saveUser={saveUser}
                deleteUser={deleteUser}
                settings={settings}
                setSettings={setSettings}
                saveSettings={saveSettings}
                triggerDeployHook={triggerDeployHook}
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
                handleLogout={handleLogout}
                onCustomerView={onCustomerView}
                transactions={transactions}
                isLoading={loadingData}
                saveTransaction={saveTransaction}
                saveTransactionsBulk={saveTransactionsBulk}
                deleteTransaction={deleteTransaction}
                clearAllTransactions={clearAllTransactions}
                clearAllProducts={clearAllProducts}
                monthlyReports={monthlyReports}
                saveMonthlyReport={saveMonthlyReport}
                currentUserData={
                  customUser ||
                  users.find(u => u.username === user?.email?.split('@')[0]) ||
                  (user?.email?.split('@')[0] === 'admin'
                    ? { name: 'Super Admin', username: 'admin', email: user.email, isAuthAccount: true, permissions: ['dashboard', 'transactions', 'products', 'finance', 'profit_report', 'balance_report', 'users', 'settings', 'edit_profit_notes'] }
                    : { permissions: ['dashboard'] })
                }
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/dashboard" element={<Navigate to="/dashboard/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
