import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc, onSnapshot, query, orderBy, limit, increment, writeBatch } from 'firebase/firestore';
import { auth, db } from './firebase-config';
import Login from './Login';
import Pemesanan from './Pemesanan';
import AdminDashboard from './AdminDashboard';
import toast, { Toaster } from 'react-hot-toast';
function AppContent() {
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
    bankAccountNumber: ''
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
        const productsSnap = await fetchWithTimeout(collection(db, 'products'));
        if (mounted) setProducts(productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const settingsSnap = await fetchWithTimeout(collection(db, 'settings'));
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
        if (mounted) setLoading(false);
      });
    };

    init();

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [customUser]); // Added customUser dependency to properly handle logout/fallback state

  // DATA SYNC EFFECT: Setup real-time listeners whenever a user is logged in
  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setMonthlyReports([]);
      return;
    }

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
            toast.success(`Pesanan Baru dari ${newTx.customer || 'Pelanggan'}!`, {
              duration: 5000,
              icon: '🛒'
            });

            if (Notification.permission === "granted") {
              new Notification("Pesanan Baru!", {
                body: `${newTx.customer} baru saja memesan Rp ${newTx.total?.toLocaleString('id-ID')}`,
                icon: "/favicon.ico"
              });
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

      await setDoc(doc(db, 'transactions', targetId), dataToSave, { merge: true });

      if (isNew && !skipStockUpdate) {
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

      setTransactions(prev => {
        const index = prev.findIndex(t => t.id === targetId);
        if (index > -1) {
          const newTx = [...prev];
          newTx[index] = { id: targetId, ...dataToSave };
          return newTx;
        }
        return [...prev, { id: targetId, ...dataToSave }];
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
          // Note: we assume IDs are already generated or provided for bulk imports to ensure idempotency if needed
          const docRef = id ? doc(db, 'transactions', id.toString()) : doc(collection(db, 'transactions'));
          batch.set(docRef, dataToSave, { merge: true });
        });

        await batch.commit();
      }

      // 2. (Optional) Bulk stock update if needed, but for historical data we usually skip
      // In this app, we skip stock update for bulk imports as per implementation plan

      // 3. Update global state once at the end (the listener will also pick it up, 
      // but manual update ensures immediate UI sync if listener is slow)
      // Actually, since we have onSnapshot, it will trigger anyway.
      // But for massive imports, onSnapshot might be overwhelming.

      toast.success(`Berhasil mengimpor ${transactionsArray.length} transaksi!`);
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
        const collectionsToClear = ['transactions', 'monthly_reports'];

        for (const collName of collectionsToClear) {
          const querySnapshot = await getDocs(collection(db, collName));
          const docs = querySnapshot.docs;

          // Firestore batch limit is 500
          for (let i = 0; i < docs.length; i += 500) {
            const batch = writeBatch(db);
            const chunk = docs.slice(i, i + 500);
            chunk.forEach(d => batch.delete(d.ref));
            await batch.commit();
          }
        }

        setTransactions([]);
        setMonthlyReports([]);
        toast.success('Seluruh data berhasil dibersihkan!');
      }
    } catch (error) {
      console.error('Error clearing data:', error);
      toast.error('Gagal menghapus data');
    }
  };


  // MONTHLY REPORTS
  const saveMonthlyReport = async (reportId, data) => {
    try {
      const reportRef = doc(db, 'monthly_reports', reportId);
      await setDoc(reportRef, data, { merge: true });
      // State will be updated by onSnapshot if we set it up, 
      // otherwise we update manually. Let's setup onSnapshot.
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
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Gagal menyimpan pengaturan');
    }
  };

  // Auth functions
  const handleLogin = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const usernameInput = fd.get('username');
    const password = fd.get('password');

    let email = usernameInput;
    // Add domain if they only typed username (since Firebase requires email)
    if (email && !email.includes('@')) {
      email = `${email}@kamilamart.com`;
    }

    try {
      // 1. Try Firebase Auth first
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Login berhasil (Firebase)!');
      setCustomUser(null);
      navigate('/dashboard');
    } catch (firebaseError) {
      console.warn('Firebase login failed, trying Firestore fallback...', firebaseError.code);

      // 2. Fallback to Firestore users collection
      const foundUser = users.find(u => u.username === usernameInput && u.password === password);

      if (foundUser) {
        setCustomUser(foundUser);
        setUser({ email: `${foundUser.username}@kamilamart.com` }); // Mock user object for routing
        toast.success(`Login berhasil sebagai ${foundUser.name} !`);
        navigate('/dashboard');
      } else {
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
            user ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} onBack={() => navigate('/')} />
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
                monthlyReports={monthlyReports}
                saveMonthlyReport={saveMonthlyReport}
                currentUserData={
                  customUser ||
                  users.find(u => u.username === user?.email?.split('@')[0]) ||
                  (user?.email?.split('@')[0] === 'admin'
                    ? { name: 'Super Admin', permissions: ['dashboard', 'transactions', 'products', 'finance', 'profit_report', 'users', 'settings'] }
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