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
import PaymentGateway from './components/PaymentGateway';
import MarketMap from './components/MarketMap';
import PostalCheck from './components/PostalCheck';
import ProductDetail from './pages/ProductDetail';
import MisPedidos from './components/MisPedidos';
import EligeTuCesta from './components/EligeTuCesta';
import CrearCesta from './components/CrearCesta';
import ComprarCesta from './components/ComprarCesta';
import CestaDetalle from './components/CestaDetalle';
import AtencionCliente from './components/AtencionCliente';
import Contacto from './components/Contacto';
import FAQ from './components/FAQ';
import Privacidad from './components/Privacidad';
import Terminos from './components/Terminos';
import Cookies from './components/Cookies';
import ClientProfile from './components/ClientProfile';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import LogoutModal from './components/LogoutModal';
import { CartProvider } from './context/CartContext';
import { api } from './services/api';
import toast, { Toaster } from 'react-hot-toast';
import './App.css';
import './components/AuthForms.css';

function App() {
  const [currentView, setCurrentView] = useState(() => {
    return sessionStorage.getItem('currentView') || 'home';
  });
  const [user, setUser] = useState(null);
  const [selectedVendedorId, setSelectedVendedorId] = useState(() => sessionStorage.getItem('selectedVendedorId') || null);
  const [selectedProduct, setSelectedProduct] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('selectedProduct')); } catch { return null; }
  });
  const [selectedProductVendedor, setSelectedProductVendedor] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('selectedProductVendedor')); } catch { return null; }
  });
  const [pendingOrderData, setPendingOrderData] = useState(null);
  const [selectedTipo, setSelectedTipo] = useState(() => sessionStorage.getItem('selectedTipo') || null);
  const [postalCode, setPostalCode] = useState(() => sessionStorage.getItem('postalCode') || null);
  const [postalPendingView, setPostalPendingView] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = (view) => {
    window.scrollTo(0, 0);
    window.history.pushState({ view }, '');
    sessionStorage.setItem('currentView', view);
    setCurrentView(view);
  };

  const goBack = () => {
    window.history.back();
  };

  const goHome = () => {
    window.scrollTo(0, 0);
    window.history.pushState({ view: 'home' }, '');
    sessionStorage.setItem('currentView', 'home');
    setCurrentView('home');
  };

  useEffect(() => {
    // Sincronizar botón atrás del navegador con la app
    const savedView = sessionStorage.getItem('currentView') || 'home';
    window.history.replaceState({ view: savedView }, '');
    const handlePopState = (e) => {
      const view = e.state?.view || 'home';
      sessionStorage.setItem('currentView', view);
      if (view === 'store-view') {
        setSelectedVendedorId(sessionStorage.getItem('selectedVendedorId'));
      }
      setCurrentView(view);
    };
    window.addEventListener('popstate', handlePopState);

    // Verificar si hay usuario logueado
    const userData = api.getCurrentUser();
    if (userData) setUser(userData);

    // Manejar tokens de verificación y reset en la URL
    const params = new URLSearchParams(window.location.search);
    const verifyToken = params.get('verify');
    const resetToken = params.get('reset');
    if (verifyToken) {
      api.verifyEmail(verifyToken).then(data => {
        toast.success(data.message || 'Email verificado correctamente');
        // Actualizar usuario en localStorage si está logueado
        if (userData) {
          const updated = { ...userData, emailVerificado: true };
          localStorage.setItem('user', JSON.stringify(updated));
          setUser(updated);
        }
      }).catch(err => {
        toast.error(err.message || 'Error al verificar email');
      }).finally(() => {
        window.history.replaceState({}, '', window.location.pathname);
      });
    }
    if (resetToken) {
      sessionStorage.setItem('resetToken', resetToken);
      window.history.replaceState({}, '', window.location.pathname);
      sessionStorage.setItem('currentView', 'reset-password');
      setCurrentView('reset-password');
    }

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
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    api.logout();
    setUser(null);
    goHome();
  };

  const handleStoreClick = (vendedorId) => {
    sessionStorage.setItem('selectedVendedorId', vendedorId);
    setSelectedVendedorId(vendedorId);
    navigate('store-view');
  };

  const handlePuestoSelect = (vendedorId) => {
    sessionStorage.setItem('selectedVendedorId', vendedorId);
    setSelectedVendedorId(vendedorId);
    navigate('store-view');
  };

  const handleCartClick = () => {
    if (!postalCode) {
      setPostalPendingView('cart');
      navigate('postal-check');
    } else {
      navigate('cart');
    }
  };

  const handlePostalConfirm = (code) => {
    sessionStorage.setItem('postalCode', code);
    setPostalCode(code);
    navigate(postalPendingView || 'cart');
    setPostalPendingView(null);
  };

  const handlePostalCancel = () => {
    setPostalPendingView(null);
    goBack();
  };

  const handleProductClick = (product, vendedor) => {
    sessionStorage.setItem('selectedProduct', JSON.stringify(product));
    sessionStorage.setItem('selectedProductVendedor', JSON.stringify(vendedor));
    setSelectedProduct(product);
    setSelectedProductVendedor(vendedor);
    navigate('product-detail');
  };

  const handleCheckoutClick = () => navigate('checkout');
  const handleOrdersClick = () => navigate('mis-pedidos');
  const handleMapClick = () => navigate('market-map');

  const handlePageClick = (view) => navigate(view);

  const handleCrearCesta = () => {
    if (!postalCode) {
      setPostalPendingView('crear-cesta');
      navigate('postal-check');
    } else {
      navigate('crear-cesta');
    }
  };

  const handleComprarCesta = () => {
    if (!postalCode) {
      setPostalPendingView('comprar-cesta');
      navigate('postal-check');
    } else {
      navigate('comprar-cesta');
    }
  };

  const handleInstruccionesClick = () => {
    goHome();
    setTimeout(() => {
      document.getElementById('how-to-order')?.scrollIntoView({ behavior: 'smooth' });
    }, 350);
  };
  const handlePaymentRequest = (orderData) => {
    setPendingOrderData(orderData);
    navigate('payment');
  };

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
          onMapClick={handleMapClick}
          onInstruccionesClick={handleInstruccionesClick}
          onPageClick={handlePageClick}
          onStoreClick={handleStoreClick}
          onProductClick={handleProductClick}
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
          onMapClick={handleMapClick}
          onInstruccionesClick={handleInstruccionesClick}
          onPageClick={handlePageClick}
          onLoginClick={() => navigate('loginOptions')}
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
          onMapClick={handleMapClick}
          onInstruccionesClick={handleInstruccionesClick}
          onPageClick={handlePageClick}
          onLoginClick={() => navigate('loginOptions')}
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
          onMapClick={handleMapClick}
          onInstruccionesClick={handleInstruccionesClick}
          onPageClick={handlePageClick}
          onLoginClick={() => navigate('loginOptions')}
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
          onMapClick={handleMapClick}
          onInstruccionesClick={handleInstruccionesClick}
          onPageClick={handlePageClick}
          onLoginClick={() => navigate('loginOptions')}
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
          onMapClick={handleMapClick}
          onInstruccionesClick={handleInstruccionesClick}
          onPageClick={handlePageClick}
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
          onPaymentRequest={handlePaymentRequest}
          onMapClick={handleMapClick}
          onInstruccionesClick={handleInstruccionesClick}
          onPageClick={handlePageClick}
        />;

      case 'payment':
        return <PaymentGateway
          user={user}
          onLogout={handleLogout}
          onDashboardClick={() => navigate('admin-dashboard')}
          onLoginClick={() => navigate('loginOptions')}
          onCartClick={handleCartClick}
          onBack={() => navigate('checkout')}
          onHomeClick={goHome}
          onMarketplaceClick={() => navigate('marketplace')}
          onSelectPuestoClick={() => navigate('select-puesto')}
          onSuccess={goHome}
          onOrdersClick={handleOrdersClick}
          orderData={pendingOrderData}
          onMapClick={handleMapClick}
          onInstruccionesClick={handleInstruccionesClick}
          onPageClick={handlePageClick}
        />;

      case 'loginOptions':
        return (
          <LoginOptions
            onLoginClick={() => navigate('login')}
            onRegisterClick={() => navigate('register')}
            onBack={goBack}
            onLogoClick={goHome}
            onSelectPuestoClick={() => navigate('select-puesto')}
            onMapClick={handleMapClick}
            onInstruccionesClick={handleInstruccionesClick}
            onPageClick={handlePageClick}
            onOrdersClick={handleOrdersClick}
            onDashboardClick={() => navigate('admin-dashboard')}
            user={user}
          />
        );

      case 'login':
        return (
          <Login
            onSwitchToRegister={() => navigate('register')}
            onBack={goBack}
            onLogoClick={goHome}
            onLoginSuccess={handleLoginSuccess}
            onSelectPuestoClick={() => navigate('select-puesto')}
            onMapClick={() => navigate('map')}
            onInstruccionesClick={() => navigate('instrucciones')}
            onPageClick={navigate}
            onOrdersClick={() => navigate('mis-pedidos')}
            onDashboardClick={() => navigate('dashboard')}
            user={user}
            onForgotPassword={() => navigate('forgot-password')}
          />
        );

      case 'register':
        return (
          <Register
            onSwitchToLogin={() => navigate('login')}
            onBack={goBack}
            onLogoClick={goHome}
            onLoginSuccess={handleLoginSuccess}
            onSelectPuestoClick={() => navigate('select-puesto')}
            onMapClick={() => navigate('map')}
            onInstruccionesClick={() => navigate('instrucciones')}
            onPageClick={navigate}
            onOrdersClick={() => navigate('mis-pedidos')}
            onDashboardClick={() => navigate('dashboard')}
            user={user}
          />
        );

      case 'forgot-password':
        return (
          <ForgotPassword
            onBack={() => navigate('login')}
            onLogoClick={goHome}
          />
        );

      case 'reset-password':
        return (
          <ResetPassword
            onLoginClick={() => navigate('login')}
            onLogoClick={goHome}
          />
        );

      case 'mi-perfil':
        if (!user) { goHome(); return null; }
        return <ClientProfile
          user={user}
          onLogout={handleLogout}
          onDashboardClick={() => navigate('admin-dashboard')}
          onHomeClick={goHome}
          onMarketplaceClick={() => navigate('marketplace')}
          onSelectPuestoClick={() => navigate('select-puesto')}
          onCartClick={handleCartClick}
          onOrdersClick={handleOrdersClick}
          onMapClick={handleMapClick}
          onInstruccionesClick={handleInstruccionesClick}
          onPageClick={handlePageClick}
          onLoginClick={() => navigate('loginOptions')}
          onUserUpdate={(updated) => setUser(updated)}
        />;

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
          onMapClick={handleMapClick}
          onInstruccionesClick={handleInstruccionesClick}
          onPageClick={handlePageClick}
          onLoginClick={() => navigate('loginOptions')}
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
          onSelectPuestoClick={() => navigate('select-puesto')}
          onMapClick={handleMapClick}
          onInstruccionesClick={handleInstruccionesClick}
          onPageClick={handlePageClick}
          onCartClick={handleCartClick}
          onOrdersClick={handleOrdersClick}
          onLoginClick={() => navigate('loginOptions')}
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
          onSelectPuestoClick={() => navigate('select-puesto')}
          onMapClick={handleMapClick}
          onInstruccionesClick={handleInstruccionesClick}
          onPageClick={handlePageClick}
          onCartClick={handleCartClick}
          onOrdersClick={handleOrdersClick}
          onLoginClick={() => navigate('loginOptions')}
        />;

      case 'postal-check':
        return <PostalCheck
          user={user}
          onLogout={handleLogout}
          onDashboardClick={() => navigate('admin-dashboard')}
          onLoginClick={() => navigate('loginOptions')}
          onCartClick={handleCartClick}
          onOrdersClick={handleOrdersClick}
          onHomeClick={goHome}
          onConfirm={handlePostalConfirm}
          onCancel={handlePostalCancel}
        />;

      case 'market-map':
        return <MarketMap
          user={user}
          onLogout={handleLogout}
          onDashboardClick={() => navigate('admin-dashboard')}
          onLoginClick={() => navigate('loginOptions')}
          onCartClick={handleCartClick}
          onHomeClick={goHome}
          onMarketplaceClick={() => navigate('marketplace')}
          onSelectPuestoClick={() => navigate('select-puesto')}
          onOrdersClick={handleOrdersClick}
          onStoreClick={handleStoreClick}
          onInstruccionesClick={handleInstruccionesClick}
          onPageClick={handlePageClick}
        />;

      case 'comprar-cesta':
        return <ComprarCesta
          user={user}
          onLogout={handleLogout}
          onDashboardClick={() => navigate('admin-dashboard')}
          onLoginClick={() => navigate('loginOptions')}
          onCartClick={handleCartClick}
          onOrdersClick={handleOrdersClick}
          onHomeClick={goHome}
          onMarketplaceClick={() => navigate('marketplace')}
          onSelectPuestoClick={() => navigate('select-puesto')}
          onMapClick={handleMapClick}
          onInstruccionesClick={handleInstruccionesClick}
          onPageClick={handlePageClick}
          onTipoSelect={(tipo) => { sessionStorage.setItem('selectedTipo', tipo); setSelectedTipo(tipo); navigate('cesta-detalle'); }}
        />;

      case 'cesta-detalle':
        return <CestaDetalle
          tipo={selectedTipo}
          user={user}
          onLogout={handleLogout}
          onDashboardClick={() => navigate('admin-dashboard')}
          onLoginClick={() => navigate('loginOptions')}
          onCartClick={handleCartClick}
          onOrdersClick={handleOrdersClick}
          onHomeClick={goHome}
          onMarketplaceClick={() => navigate('marketplace')}
          onSelectPuestoClick={() => navigate('select-puesto')}
          onMapClick={handleMapClick}
          onInstruccionesClick={handleInstruccionesClick}
          onPageClick={handlePageClick}
          onBack={() => navigate('comprar-cesta')}
        />;

      case 'crear-cesta':
        return <CrearCesta
          user={user}
          onLogout={handleLogout}
          onDashboardClick={() => navigate('admin-dashboard')}
          onLoginClick={() => navigate('loginOptions')}
          onCartClick={handleCartClick}
          onOrdersClick={handleOrdersClick}
          onHomeClick={goHome}
          onMarketplaceClick={() => navigate('marketplace')}
          onSelectPuestoClick={() => navigate('select-puesto')}
          onMapClick={handleMapClick}
          onInstruccionesClick={handleInstruccionesClick}
          onPageClick={handlePageClick}
          onPuestosClick={() => navigate('select-puesto')}
        />;

      case 'elige-tu-cesta':
        return <EligeTuCesta
          user={user}
          onLogout={handleLogout}
          onDashboardClick={() => navigate('admin-dashboard')}
          onLoginClick={() => navigate('loginOptions')}
          onCartClick={handleCartClick}
          onOrdersClick={handleOrdersClick}
          onHomeClick={goHome}
          onMarketplaceClick={() => navigate('marketplace')}
          onSelectPuestoClick={() => navigate('select-puesto')}
          onMapClick={handleMapClick}
          onInstruccionesClick={handleInstruccionesClick}
          onPageClick={handlePageClick}
          onCrearCesta={handleCrearCesta}
          onComprarCesta={handleComprarCesta}
        />;

      case 'cliente':
      case 'contacto':
      case 'faq':
      case 'privacidad':
      case 'terminos':
      case 'cookies': {
        const infoProps = {
          user, onLogout: handleLogout,
          onDashboardClick: () => navigate('admin-dashboard'),
          onCartClick: handleCartClick,
          onOrdersClick: handleOrdersClick,
          onHomeClick: goHome,
          onLoginClick: () => navigate('loginOptions'),
          onMarketplaceClick: () => navigate('marketplace'),
          onSelectPuestoClick: () => navigate('select-puesto'),
          onMapClick: handleMapClick,
          onInstruccionesClick: handleInstruccionesClick,
          onPageClick: handlePageClick,
        };
        if (currentView === 'cliente')    return <AtencionCliente {...infoProps} />;
        if (currentView === 'contacto')   return <Contacto {...infoProps} />;
        if (currentView === 'faq')        return <FAQ {...infoProps} />;
        if (currentView === 'privacidad') return <Privacidad {...infoProps} />;
        if (currentView === 'terminos')   return <Terminos {...infoProps} />;
        if (currentView === 'cookies')    return <Cookies {...infoProps} />;
        break;
      }

      default:
        return <Home
          onLoginClick={() => navigate('loginOptions')}
          user={user}
          onLogout={handleLogout}
          onDashboardClick={() => navigate('admin-dashboard')}
          onMarketplaceClick={() => navigate('marketplace')}
          onStoreClick={handleStoreClick}
        />;
    }
  };

  const handleResendVerification = async () => {
    try {
      await api.resendVerification();
      toast.success('Email de verificación reenviado');
    } catch (err) {
      toast.error(err.message || 'Error al reenviar');
    }
  };

  return (
    <CartProvider>
      <div className="app">
        {user && user.emailVerificado === false && (
          <div className="email-verify-banner">
            <span>Tu email no está verificado. Revisa tu bandeja de entrada.</span>
            <button onClick={handleResendVerification}>Reenviar email</button>
          </div>
        )}
        {renderView()}
      </div>
      <Toaster position="top-right" />
      {showLogoutModal && (
        <LogoutModal
          onConfirm={confirmLogout}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </CartProvider>
  );
}

export default App;