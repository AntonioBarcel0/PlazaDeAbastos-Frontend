import { useState, useRef, useEffect } from 'react';
import { LogIn, ShoppingBasket, User, ClipboardList, LayoutDashboard, LogOut, X, Search, ArrowLeft } from 'lucide-react';
import { useCart, isKg, itemSubtotal, isCestaItem } from '../context/CartContext';
import { api, BASE_URL } from '../services/api';
import './Header.css';

function Header({ onMenuClick, onLoginClick, onLogoClick, user, onLogout, onDashboardClick, onCartClick, onOrdersClick }) {
  const { cart, cartCount, cartByVendor, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    if (profileOpen || searchOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileOpen, searchOpen]);

  // Cargar productos una sola vez cuando se abre el buscador
  useEffect(() => {
    if (searchOpen && allProducts.length === 0) {
      api.getProducts().then(data => {
        const products = (data.products || data.productos || []).filter(p => p.disponible !== false && p.stock !== 0);
        setAllProducts(products);
      }).catch(() => {});
    }
  }, [searchOpen]);

  useEffect(() => {
    if (!searchTerm.trim()) { setSearchResults([]); return; }
    const q = searchTerm.toLowerCase();
    const results = allProducts.filter(p =>
      p.nombre.toLowerCase().includes(q) ||
      (p.categoria && p.categoria.toLowerCase().includes(q))
    ).slice(0, 8);
    setSearchResults(results);
  }, [searchTerm, allProducts]);

  const handleCartToggle = () => {
    setCartOpen(prev => !prev);
    setProfileOpen(false);
    setSearchOpen(false);
  };

  const handleProfileToggle = () => {
    setProfileOpen(prev => !prev);
    setCartOpen(false);
    setSearchOpen(false);
  };

  const handleSearchToggle = () => {
    setSearchOpen(prev => !prev);
    setProfileOpen(false);
    setCartOpen(false);
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleSearchSelect = (product) => {
    setSearchOpen(false);
    setSearchTerm('');
    setSearchResults([]);
    if (product.vendedorId) {
      sessionStorage.setItem('selectedVendedorId', product.vendedorId);
      sessionStorage.setItem('currentView', 'store-view');
      window.scrollTo(0, 0);
      window.history.pushState({ view: 'store-view' }, '');
      window.dispatchEvent(new PopStateEvent('popstate', { state: { view: 'store-view' } }));
    }
  };

  const handleCheckout = () => {
    setCartOpen(false);
    onCartClick();
  };

  const currentView = sessionStorage.getItem('currentView') || 'home';
  const showBack = currentView !== 'home';

  return (
    <header className="header">
      <div className="header-left">
        {showBack && (
          <button className="back-arrow-btn" onClick={() => window.history.back()} aria-label="Volver">
            <ArrowLeft size={22} strokeWidth={2.4} />
          </button>
        )}
        <button className="menu-btn" onClick={onMenuClick} aria-label="Abrir menú">
          Menú
        </button>
      </div>

      <button className="logo" onClick={onLogoClick} aria-label="Ir al inicio">
        <img
          src="https://res.cloudinary.com/dlmnchkjg/image/upload/v1770289985/Captura_de_pantalla_2026-02-05_a_las_12.12.57_fhymgg.png"
          alt="logo"
          className="logo-image"
        />
      </button>

      <div className="right-section">
        {/* Buscador */}
        <div className="search-wrapper" ref={searchRef}>
          <button
            className="search-btn"
            onClick={handleSearchToggle}
            aria-label="Buscar productos"
            aria-expanded={searchOpen}
          >
            <Search size={22} strokeWidth={2.4} />
          </button>

          {searchOpen && (
            <div className="search-dropdown">
              <input
                type="text"
                className="search-input"
                placeholder="Buscar producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
              {searchResults.length > 0 && (
                <ul className="search-results">
                  {searchResults.map(product => (
                    <li key={product.id}>
                      <button
                        className="search-result-item"
                        onClick={() => handleSearchSelect(product)}
                      >
                        {product.imagen && (
                          <img
                            src={product.imagen.startsWith('http') ? product.imagen : `${BASE_URL}${product.imagen}`}
                            alt=""
                            className="search-result-img"
                          />
                        )}
                        <div className="search-result-info">
                          <span className="search-result-name">{product.nombre}</span>
                          <span className="search-result-price">{parseFloat(product.precio).toFixed(2)}/{product.unidad}</span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {searchTerm.trim() && searchResults.length === 0 && (
                <p className="search-no-results">Sin resultados</p>
              )}
            </div>
          )}
        </div>

        {user ? (
          <div className="profile-wrapper" ref={profileRef}>
            <button
              className="profile-btn"
              onClick={handleProfileToggle}
              aria-label="Mi perfil"
              aria-expanded={profileOpen}
            >
              <User size={22} strokeWidth={2.2} />
              <span className="profile-btn-name">{user.nombre}</span>
            </button>

            {profileOpen && (
              <div className="profile-dropdown">
                <div className="profile-dropdown-header">
                  <p className="profile-dropdown-name">{user.nombre} {user.apellidos}</p>
                  <p className="profile-dropdown-role">
                    {user.role === 'comerciante' ? 'Comerciante' : user.role === 'gestor' ? 'Gestor' : user.role === 'admin' ? 'Admin' : 'Cliente'}
                  </p>
                </div>
                <div className="profile-dropdown-divider" />
                {user.role === 'cliente' && (
                  <button className="profile-dropdown-item" onClick={() => {
                    setProfileOpen(false);
                    sessionStorage.setItem('currentView', 'mi-perfil');
                    window.scrollTo(0, 0);
                    window.history.pushState({ view: 'mi-perfil' }, '');
                    window.dispatchEvent(new PopStateEvent('popstate', { state: { view: 'mi-perfil' } }));
                  }}>
                    <User size={18} strokeWidth={2} />
                    Mi perfil
                  </button>
                )}
                {user.role === 'cliente' && onOrdersClick && (
                  <button className="profile-dropdown-item" onClick={() => { setProfileOpen(false); onOrdersClick(); }}>
                    <ClipboardList size={18} strokeWidth={2} />
                    Mis pedidos
                  </button>
                )}
                {(user.role === 'comerciante' || user.role === 'admin') && onDashboardClick && (
                  <button className="profile-dropdown-item" onClick={() => { setProfileOpen(false); onDashboardClick(); }}>
                    <LayoutDashboard size={18} strokeWidth={2} />
                    Panel de control
                  </button>
                )}
                {user.role === 'gestor' && onDashboardClick && (
                  <button className="profile-dropdown-item" onClick={() => { setProfileOpen(false); onDashboardClick(); }}>
                    <LayoutDashboard size={18} strokeWidth={2} />
                    Panel de gestor
                  </button>
                )}
                <div className="profile-dropdown-divider" />
                <button className="profile-dropdown-item profile-dropdown-logout" onClick={() => { setProfileOpen(false); onLogout(); }}>
                  <LogOut size={18} strokeWidth={2} />
                  Cerrar sesion
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className="log-btn" onClick={onLoginClick} aria-label="registro">
            <LogIn size={44} strokeWidth={2.8} color="white" />
          </button>
        )}

        {/* ── Botón carrito ── */}
        <button
          className="cart-btn"
          onClick={handleCartToggle}
          aria-label="Carrito de compra"
          aria-expanded={cartOpen}
        >
          <ShoppingBasket size={44} strokeWidth={2.3} color="white" />
          {cartCount > 0 && (
            <span className="cart-badge">{cartCount}</span>
          )}
        </button>
      </div>

      {/* ── Backdrop ── */}
      <div
        className={`cart-backdrop ${cartOpen ? 'open' : ''}`}
        onClick={() => setCartOpen(false)}
        aria-hidden="true"
      />

      {/* ── Panel lateral del carrito ── */}
      <div
        className={`cart-panel ${cartOpen ? 'open' : ''}`}
        role="dialog"
        aria-label="Carrito de compra"
        aria-modal="true"
      >
        {/* Cabecera del panel */}
        <div className="cart-panel-header">
          <div className="cart-panel-title-row">
            <h2 className="cart-panel-title">Tu carrito</h2>
            {cartCount > 0 && (
              <span className="cart-panel-count">{cartCount}</span>
            )}
          </div>
          <button
            className="cart-panel-close"
            onClick={() => setCartOpen(false)}
            aria-label="Cerrar carrito"
          >
            <X size={22} strokeWidth={2.2} />
          </button>
        </div>

        {/* Cuerpo */}
        {cart.length === 0 ? (
          <div className="cart-panel-empty">
            <ShoppingBasket size={48} strokeWidth={1.4} color="#ccc" />
            <p>Tu carrito está vacío</p>
          </div>
        ) : (
          <>
            {/* Items con scroll */}
            <div className="cart-panel-items">
              {Object.keys(cartByVendor).map(vid => {
                const group = cartByVendor[vid];
                return (
                  <div key={vid} className="cart-panel-vendor">
                    <p className="cart-panel-vendor-name">{group.nombre}</p>

                    {group.items.map(item => {
                      const isCesta = isCestaItem(item);
                      const itemId = isCesta ? item.cestaId : item.productId;
                      return (
                        <div key={itemId} className="cart-panel-item">
                          <div className="cart-panel-item-img">
                            {!isCesta && item.imagen ? (
                              <img src={`${BASE_URL}${item.imagen}`} alt={item.nombre} />
                            ) : (
                              <span className="cart-panel-item-placeholder">
                                {isCesta ? '🧺' : '📦'}
                              </span>
                            )}
                          </div>

                          <div className="cart-panel-item-info">
                            <p className="cart-panel-item-name">{item.nombre}</p>
                            <p className="cart-panel-item-subtotal">
                              {itemSubtotal(item).toFixed(2)}€
                            </p>

                            <div className="cart-panel-item-controls">
                              <button
                                className="cp-qty-btn"
                                onClick={() => updateQuantity(itemId, item.cantidad - (isKg(item.unidad) ? 50 : 1), isCesta ? null : item.vendedorId)}
                                disabled={isKg(item.unidad) && item.cantidad <= 50}
                                aria-label="Reducir cantidad"
                              >
                                −
                              </button>
                              <span className="cp-qty-value">
                                {isKg(item.unidad)
                                  ? (item.cantidad >= 1000
                                      ? `${(item.cantidad / 1000).toFixed(item.cantidad % 1000 === 0 ? 0 : 1)} kg`
                                      : `${item.cantidad} g`)
                                  : item.cantidad}
                              </span>
                              <button
                                className="cp-qty-btn"
                                onClick={() => updateQuantity(itemId, item.cantidad + (isKg(item.unidad) ? 50 : 1), isCesta ? null : item.vendedorId)}
                                disabled={
                                  !isCesta && (isKg(item.unidad)
                                    ? (item.stock != null && item.cantidad >= item.stock * 1000)
                                    : (item.stock !== null && item.stock !== undefined && item.cantidad >= item.stock))
                                }
                                aria-label="Aumentar cantidad"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <button
                            className="cart-panel-item-remove"
                            onClick={() => removeFromCart(itemId, isCesta ? null : item.vendedorId)}
                            aria-label={`Eliminar ${item.nombre}`}
                          >
                            <X size={16} strokeWidth={2.5} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Pie fijo */}
            <div className="cart-panel-footer">
              <div className="cart-panel-total">
                <span>Total</span>
                <strong>{cartTotal.toFixed(2)}€</strong>
              </div>

              {!user && (
                <p className="cart-panel-login-notice">
                  Inicia sesión para poder realizar el pedido.
                </p>
              )}

              <button
                className="cart-panel-checkout"
                onClick={handleCheckout}
                disabled={!user}
              >
                Confirmar pedido →
              </button>

              <button className="cart-panel-clear" onClick={clearCart}>
                Vaciar carrito
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
