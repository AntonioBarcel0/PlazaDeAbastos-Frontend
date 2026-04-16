import { useState, useEffect } from 'react';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import LoginOptions from './components/LoginOptions';
import AdminDashboard from './components/AdminDashboard';
import Marketplace from './components/Marketplace';
import StoreView from './components/StoreView';
import SelectPuesto from './components/SelectPuesto';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import { CartProvider } from './context/CartContext';
import { api } from './services/api';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [prevView, setPrevView] = useState('marketplace');
  const [user, setUser] = useState(null);
  const [selectedVendedorId, setSelectedVendedorId] = useState(null);

  useEffect(() => {
    // Verificar si hay usuario logueado
    const userData = api.getCurrentUser();
    if (userData) {
      setUser(userData);
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    // Redirigir según el rol
    if (userData.role === 'comerciante' || userData.role === 'admin') {
      setCurrentView('admin-dashboard');
    } else {
      setCurrentView('home');
    }
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    setCurrentView('home');
  };

  const handleStoreClick = (vendedorId) => {
    setSelectedVendedorId(vendedorId);
    setCurrentView('store-view');
  };

  const handlePuestoSelect = (vendedorId) => {
    setSelectedVendedorId(vendedorId);
    setCurrentView('store-view');
  };

  const handleCartClick = () => {
    setPrevView(currentView);
    setCurrentView('cart');
  };

  const handleCheckoutClick = () => setCurrentView('checkout');

  const renderView = () => {
    switch(currentView) {
      case 'home':
        return <Home
          onLoginClick={() => setCurrentView('loginOptions')}
          user={user}
          onLogout={handleLogout}
          onDashboardClick={() => setCurrentView('admin-dashboard')}
          onMarketplaceClick={() => setCurrentView('marketplace')}
          onSelectPuestoClick={() => setCurrentView('select-puesto')}
          onCartClick={handleCartClick}
        />;

      case 'select-puesto':
        return <SelectPuesto
          user={user}
          onLogout={handleLogout}
          onDashboardClick={() => setCurrentView('admin-dashboard')}
          onPuestoSelect={handlePuestoSelect}
          onBack={() => setCurrentView('home')}
          onCartClick={handleCartClick}
        />;

      case 'marketplace':
        return <Marketplace
          user={user}
          onLogout={handleLogout}
          onDashboardClick={() => setCurrentView('admin-dashboard')}
          onStoreClick={handleStoreClick}
          onBackHome={() => setCurrentView('home')}
          onCartClick={handleCartClick}
        />;

      case 'store-view':
        return <StoreView
          vendedorId={selectedVendedorId}
          user={user}
          onLogout={handleLogout}
          onDashboardClick={() => setCurrentView('admin-dashboard')}
          onBack={() => setCurrentView('marketplace')}
          onCartClick={handleCartClick}
        />;

      case 'cart':
        return <Cart
          user={user}
          onLogout={handleLogout}
          onDashboardClick={() => setCurrentView('admin-dashboard')}
          onLoginClick={() => setCurrentView('loginOptions')}
          onCartClick={handleCartClick}
          onBack={() => setCurrentView(prevView)}
          onCheckout={handleCheckoutClick}
        />;

      case 'checkout':
        return <Checkout
          user={user}
          onLogout={handleLogout}
          onDashboardClick={() => setCurrentView('admin-dashboard')}
          onLoginClick={() => setCurrentView('loginOptions')}
          onCartClick={handleCartClick}
          onBack={() => setCurrentView('cart')}
          onSuccess={() => setCurrentView('home')}
        />;

      case 'loginOptions':
        return (
          <LoginOptions 
            onLoginClick={() => setCurrentView('login')}
            onRegisterClick={() => setCurrentView('register')}
            onBack={() => setCurrentView('home')}
            onLogoClick={() => setCurrentView('home')}
          />
        );

      case 'login':
        return (
          <Login 
            onSwitchToRegister={() => setCurrentView('register')}
            onBack={() => setCurrentView('loginOptions')}
            onMenuClick={() => {}}
            onLogoClick={() => setCurrentView('home')}
            onLoginSuccess={handleLoginSuccess}
          />
        );

      case 'register':
        return (
          <Register 
            onSwitchToLogin={() => setCurrentView('login')}
            onBack={() => setCurrentView('loginOptions')}
            onMenuClick={() => {}}
            onLogoClick={() => setCurrentView('home')}
            onLoginSuccess={handleLoginSuccess}
          />
        );

      case 'admin-dashboard':
        if (!user || (user.role !== 'comerciante' && user.role !== 'admin')) {
          setCurrentView('home');
          return null;
        }
        return <AdminDashboard 
          user={user}
          onLogout={handleLogout}
          onBackHome={() => setCurrentView('home')}
        />;

      default:
        return <Home 
          onLoginClick={() => setCurrentView('loginOptions')}
          user={user}
          onLogout={handleLogout}
          onDashboardClick={() => setCurrentView('admin-dashboard')}
          onMarketplaceClick={() => setCurrentView('marketplace')}
        />;
    }
  };

  return (
    <CartProvider>
      <div className="app">
        {renderView()}
      </div>
    </CartProvider>
  );
}

export default App;