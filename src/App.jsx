import { useState, useEffect } from 'react';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import LoginOptions from './components/LoginOptions';
import AdminDashboard from './components/AdminDashboard';
import GestorDashboard from './components/GestorDashboard';
import Marketplace from './components/Marketplace';
import StoreView from './components/StoreView';
import SelectPuesto from './components/SelectPuesto';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import ProductDetail from './pages/ProductDetail';
import MisPedidos from './components/MisPedidos';
import { CartProvider } from './context/CartContext';
import { api } from './services/api';
import { Toaster } from 'react-hot-toast';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [user, setUser] = useState(null);
  const [selectedVendedorId, setSelectedVendedorId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductVendedor, setSelectedProductVendedor] = useState(null);

  const navigate = (view) => {
    window.history.pushState({ view }, '');
    setCurrentView(view);
  };

  const goBack = () => {
    window.history.back();
  };

  const goHome = () => {
    window.history.pushState({ view: 'home' }, '');
    setCurrentView('home');
  };

  useEffect(() => {
    // Sincronizar botón atrás del navegador con la app
    window.history.replaceState({ view: 'home' }, '');
    const handlePopState = (e) => {
      setCurrentView(e.state?.view || 'home');
    };
    window.addEventListener('popstate', handlePopState);

    // Verificar si hay usuario logueado
    const userData = api.getCurrentUser();
    if (userData) setUser(userData);

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    if (userData.role === 'gestor') {
      navigate('gestor-dashboard');
    } else if (userData.role === 'comerciante' || userData.role === 'admin') {
      navigate('admin-dashboard');
    } else {
      goHome();
    }
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    goHome();
  };

  const handleStoreClick = (vendedorId) => {
    setSelectedVendedorId(vendedorId);
    navigate('store-view');
  };

  const handlePuestoSelect = (vendedorId) => {
    setSelectedVendedorId(vendedorId);
    navigate('store-view');
  };

  const handleCartClick = () => navigate('cart');

  const handleProductClick = (product, vendedor) => {
    setSelectedProduct(product);
    setSelectedProductVendedor(vendedor);
    navigate('product-detail');
  };

  const handleCheckoutClick = () => navigate('checkout');
  const handleOrdersClick = () => navigate('mis-pedidos');

  const renderView = () => {
    switch(currentView) {
      case 'home':
        return <Home
          onLoginClick={() => navigate('loginOptions')}
          user={user}
          onLogout={handleLogout}
          onDashboardClick={() => navigate('admin-dashboard')}
          onMarketplaceClick={() => navigate('marketplace')}
          onSelectPuestoClick={() => navigate('select-puesto')}
          onCartClick={handleCartClick}
          onOrdersClick={handleOrdersClick}
        />;

      case 'select-puesto':
        return <SelectPuesto
          user={user}
          onLogout={handleLogout}
          onDashboardClick={() => navigate('admin-dashboard')}
          onPuestoSelect={handlePuestoSelect}
          onBack={goBack}
          onHomeClick={goHome}
          onMarketplaceClick={() => navigate('marketplace')}
          onCartClick={handleCartClick}
          onOrdersClick={handleOrdersClick}
        />;

      case 'marketplace':
        return <Marketplace
          user={user}
          onLogout={handleLogout}
          onDashboardClick={() => navigate('admin-dashboard')}
          onStoreClick={handleStoreClick}
          onBackHome={goHome}
          onHomeClick={goHome}
          onMarketplaceClick={() => navigate('marketplace')}
          onSelectPuestoClick={() => navigate('select-puesto')}
          onCartClick={handleCartClick}
          onOrdersClick={handleOrdersClick}
        />;

      case 'store-view':
        return <StoreView
          vendedorId={selectedVendedorId}
          user={user}
          onLogout={handleLogout}
          onDashboardClick={() => navigate('admin-dashboard')}
          onBack={goBack}
          onHomeClick={goHome}
          onMarketplaceClick={() => navigate('marketplace')}
          onSelectPuestoClick={() => navigate('select-puesto')}
          onProductClick={handleProductClick}
          onCartClick={handleCartClick}
          onOrdersClick={handleOrdersClick}
        />;

      case 'product-detail':
        return <ProductDetail
          product={selectedProduct}
          vendedor={selectedProductVendedor}
          user={user}
          onLogout={handleLogout}
          onDashboardClick={() => navigate('admin-dashboard')}
          onBack={goBack}
          onHomeClick={goHome}
          onMarketplaceClick={() => navigate('marketplace')}
          onSelectPuestoClick={() => navigate('select-puesto')}
          onCartClick={handleCartClick}
          onOrdersClick={handleOrdersClick}
        />;

      case 'cart':
        return <Cart
          user={user}
          onLogout={handleLogout}
          onDashboardClick={() => navigate('admin-dashboard')}
          onLoginClick={() => navigate('loginOptions')}
          onCartClick={handleCartClick}
          onBack={goBack}
          onHomeClick={goHome}
          onMarketplaceClick={() => navigate('marketplace')}
          onSelectPuestoClick={() => navigate('select-puesto')}
          onCheckout={handleCheckoutClick}
          onOrdersClick={handleOrdersClick}
        />;

      case 'checkout':
        return <Checkout
          user={user}
          onLogout={handleLogout}
          onDashboardClick={() => navigate('admin-dashboard')}
          onLoginClick={() => navigate('loginOptions')}
          onCartClick={handleCartClick}
          onBack={goBack}
          onHomeClick={goHome}
          onMarketplaceClick={() => navigate('marketplace')}
          onSelectPuestoClick={() => navigate('select-puesto')}
          onSuccess={goHome}
          onOrdersClick={handleOrdersClick}
        />;

      case 'loginOptions':
        return (
          <LoginOptions
            onLoginClick={() => navigate('login')}
            onRegisterClick={() => navigate('register')}
            onBack={goBack}
            onLogoClick={goHome}
          />
        );

      case 'login':
        return (
          <Login
            onSwitchToRegister={() => navigate('register')}
            onBack={goBack}
            onMenuClick={() => {}}
            onLogoClick={goHome}
            onLoginSuccess={handleLoginSuccess}
          />
        );

      case 'register':
        return (
          <Register
            onSwitchToLogin={() => navigate('login')}
            onBack={goBack}
            onMenuClick={() => {}}
            onLogoClick={goHome}
            onLoginSuccess={handleLoginSuccess}
          />
        );

      case 'mis-pedidos':
        if (!user) { goHome(); return null; }
        return <MisPedidos
          user={user}
          onLogout={handleLogout}
          onDashboardClick={() => navigate('admin-dashboard')}
          onHomeClick={goHome}
          onMarketplaceClick={() => navigate('marketplace')}
          onSelectPuestoClick={() => navigate('select-puesto')}
          onCartClick={handleCartClick}
          onOrdersClick={handleOrdersClick}
        />;

      case 'admin-dashboard':
        if (!user || (user.role !== 'comerciante' && user.role !== 'admin')) {
          goHome();
          return null;
        }
        return <AdminDashboard
          user={user}
          onLogout={handleLogout}
          onBackHome={goHome}
        />;

      case 'gestor-dashboard':
        if (!user || user.role !== 'gestor') {
          goHome();
          return null;
        }
        return <GestorDashboard
          user={user}
          onLogout={handleLogout}
          onBackHome={goHome}
        />;

      default:
        return <Home
          onLoginClick={() => navigate('loginOptions')}
          user={user}
          onLogout={handleLogout}
          onDashboardClick={() => navigate('admin-dashboard')}
          onMarketplaceClick={() => navigate('marketplace')}
        />;
    }
  };

  return (
    <CartProvider>
      <div className="app">
        {renderView()}
      </div>
      <Toaster position="top-right" />
    </CartProvider>
  );
}

export default App;