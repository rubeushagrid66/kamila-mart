import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc, onSnapshot, query, orderBy, limit, increment } from 'firebase/firestore';
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
        const date = data.date?.toDate ? data.date.toDate() : new Date(data.date);
        return { id: doc.id, ...data, date };
      });
      if (mounted) setTransactions(txList);

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

      if (id) {
        // Update existing
        await updateDoc(doc(db, 'products', id), dataToSave);
        setProducts(prev => prev.map(p => p.id === id ? { id, ...dataToSave } : p));
        toast.success('Produk berhasil diperbarui!');
      } else {
        // Add new
        const docRef = await addDoc(collection(db, 'products'), dataToSave);
        setProducts(prev => [...prev, { id: docRef.id, ...dataToSave }]);
        toast.success('Produk berhasil ditambahkan!');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Gagal menyimpan produk');
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
  const saveTransaction = async (transactionData) => {
    try {
      const idStr = transactionData.id ? transactionData.id.toString() : null;
      const dataToSave = { ...transactionData };
      if (idStr) dataToSave.id = idStr;

      if (idStr && transactions.some(t => t.id === idStr)) {
        // Update existing
        await updateDoc(doc(db, 'transactions', idStr), dataToSave);
        setTransactions(prev => prev.map(t => t.id === idStr ? dataToSave : t));
        toast.success('Transaksi berhasil diperbarui!');
      } else {
        // Add new
        delete dataToSave.id; // Let Firebase generate
        const docRef = await addDoc(collection(db, 'transactions'), dataToSave);

        // --- REDUCE STOCK ---
        const stockUpdates = dataToSave.items.map(async (item) => {
          if (item.id) {
            const productRef = doc(db, 'products', item.id.toString());
            await updateDoc(productRef, {
              stock: increment(-item.qty)
            });
          }
        });
        await Promise.all(stockUpdates);
        // --------------------

        setTransactions(prev => [...prev, { id: docRef.id, ...dataToSave }]);
        toast.success('Pesanan berhasil dibuat!');
      }
    } catch (error) {
      console.error('Error saving transaction:', error);
      toast.error('Gagal menyimpan transaksi');
    }
  };

  const deleteTransaction = async (transactionId) => {
    try {
      if (window.confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
        await deleteDoc(doc(db, 'transactions', transactionId));
        setTransactions(prev => prev.filter(t => t.id !== transactionId));
        toast.success('Transaksi berhasil dihapus!');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Gagal menghapus transaksi');
    }
  };

  const clearAllTransactions = async () => {
    try {
      if (window.confirm('PERINGATAN: Seluruh data transaksi akan dihapus secara permanen. Lanjutkan?')) {
        const batch = [];
        const querySnapshot = await getDocs(collection(db, 'transactions'));
        querySnapshot.forEach((d) => {
          batch.push(deleteDoc(doc(db, 'transactions', d.id)));
        });
        await Promise.all(batch);
        setTransactions([]);
        toast.success('Seluruh transaksi berhasil dihapus!');
      }
    } catch (error) {
      console.error('Error clearing transactions:', error);
      toast.error('Gagal menghapus seluruh transaksi');
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
                saveTransaction={saveTransaction}
                deleteTransaction={deleteTransaction}
                clearAllTransactions={clearAllTransactions}
                monthlyReports={monthlyReports}
                saveMonthlyReport={saveMonthlyReport}
                currentUserData={
                  customUser ||
                  users.find(u => u.username === user.email.split('@')[0]) ||
                  (user.email.split('@')[0] === 'admin'
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