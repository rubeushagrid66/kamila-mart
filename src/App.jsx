import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { auth, db, storage } from './firebase-config';
import Login from './Login';
import Pemesanan from './Pemesanan';
import AdminDashboard from './AdminDashboard';
import toast, { Toaster } from 'react-hot-toast';

export default function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('store');
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

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setCurrentView('admin');
        await fetchAllData();
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch all data from Firebase
  const fetchAllData = async () => {
    try {
      setLoading(true);

      // Fetch products
      const productsSnap = await getDocs(collection(db, 'products'));
      const productsData = productsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsData);

      // Fetch users
      const usersSnap = await getDocs(collection(db, 'users'));
      const usersData = usersSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);

      // Fetch transactions
      const transactionsSnap = await getDocs(collection(db, 'transactions'));
      const transactionsData = transactionsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTransactions(transactionsData);

      // Fetch settings
      const settingsSnap = await getDocs(collection(db, 'settings'));
      if (settingsSnap.docs.length > 0) {
        setSettings(settingsSnap.docs[0].data());
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
      setLoading(false);
    }
  };

  // PRODUCT CRUD
  const saveProduct = async (productData) => {
    try {
      let imageUrl = productData.image;

      // If image is base64, upload to Firebase Storage
      if (productData.image && productData.image.startsWith('data:')) {
        try {
          const response = await fetch(productData.image);
          const blob = await response.blob();
          const imageRef = ref(storage, `products/${productData.id || Date.now()}-${productData.name}`);
          const uploadTask = await uploadBytes(imageRef, blob);
          imageUrl = await getDownloadURL(uploadTask.ref);
        } catch (error) {
          console.error('Error uploading image:', error);
          toast.error('Failed to upload image');
          return;
        }
      }

      const productWithUrl = {
        ...productData,
        image: imageUrl
      };

      if (productData.id) {
        // Update existing
        await updateDoc(doc(db, 'products', productData.id), productWithUrl);
        setProducts(prev => prev.map(p => p.id === productData.id ? { id: productData.id, ...productWithUrl } : p));
        toast.success('Produk berhasil diperbarui!');
      } else {
        // Add new
        const docRef = await addDoc(collection(db, 'products'), productWithUrl);
        setProducts(prev => [...prev, { id: docRef.id, ...productWithUrl }]);
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
      if (userData.id) {
        // Update existing
        await updateDoc(doc(db, 'users', userData.id), userData);
        setUsers(prev => prev.map(u => u.id === userData.id ? { id: userData.id, ...userData } : u));
        toast.success('User berhasil diperbarui!');
      } else {
        // Add new
        const docRef = await addDoc(collection(db, 'users'), userData);
        setUsers(prev => [...prev, { id: docRef.id, ...userData }]);
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
        setTransactions(prev => [...prev, { id: docRef.id, ...dataToSave }]);
        toast.success('Transaksi berhasil ditambahkan!');
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

  const updateTransactionStatus = async (transactionId, field, value) => {
    try {
      await updateDoc(doc(db, 'transactions', transactionId), {
        [field]: value
      });
      setTransactions(prev => prev.map(t =>
        t.id === transactionId ? { ...t, [field]: value } : t
      ));
      toast.success('Status berhasil diperbarui!');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Gagal memperbarui status');
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
    let email = fd.get('username');
    const password = fd.get('password');

    // Add domain if they only typed username (since Firebase requires email)
    if (email && !email.includes('@')) {
      email = `${email}@kamilamart.com`;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setCurrentView('admin');
      toast.success('Login berhasil!');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Gagal login: Periksa username/email dan password');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setCurrentView('store');
      setAdminTab('dashboard');
      toast.success('Logout berhasil!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Gagal logout');
    }
  };

  const onCustomerView = () => {
    setMobileMenuOpen(false);
    setCurrentView('store');
  };

  const renderContent = () => {
    if (currentView === 'store') {
      return (
        <Pemesanan
          settings={settings} products={products} cart={cart}
          setCart={setCart} showSuccess={showSuccess} setShowSuccess={setShowSuccess}
          onAdminClick={() => setCurrentView('login')}
          onNewTransaction={saveTransaction}
        />
      );
    }

    if (currentView === 'login') {
      return <Login onLogin={handleLogin} onBack={() => setCurrentView('store')} />;
    }

    return (
      <AdminDashboard
        adminTab={adminTab}
        setAdminTab={setAdminTab}
        products={products}
        saveProduct={saveProduct}
        deleteProduct={deleteProduct}
        users={users}
        setUsers={(callback) => {
          if (typeof callback === 'function') {
            setUsers(callback);
          } else {
            setUsers(callback);
          }
        }}
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
        updateTransactionStatus={updateTransactionStatus}
      />
    );
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
      {renderContent()}
    </div>
  );
}