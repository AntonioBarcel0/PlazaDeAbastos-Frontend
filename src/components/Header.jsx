import { useState, useRef, useEffect } from 'react';
import { LogIn, ShoppingBasket, User, ClipboardList, LayoutDashboard, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Header.css';

function Header({ onMenuClick, onLoginClick, onLogoClick, user, onLogout, onDashboardClick, onCartClick, onOrdersClick }) {
  const { cartCount } = useCart();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileOpen]);

  return (
    <header className="header">
      <button className="menu-btn" onClick={onMenuClick} aria-label="Abrir menú">
        Menú
      </button>

      <button className="logo" onClick={onLogoClick} aria-label="Ir al inicio">
        <img
          src="https://res.cloudinary.com/dlmnchkjg/image/upload/v1770289985/Captura_de_pantalla_2026-02-05_a_las_12.12.57_fhymgg.png"
          alt="logo"
          className="logo-image"
        />
      </button>

      <div className="right-section">
        {user ? (
          <div className="profile-wrapper" ref={profileRef}>
            <button
              className="profile-btn"
              onClick={() => setProfileOpen(!profileOpen)}
              aria-label="Mi perfil"
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

        <button className="cart-btn" onClick={onCartClick} aria-label="Carrito de compra">
          <ShoppingBasket size={44} strokeWidth={2.3} color="white" />
          {cartCount > 0 && (
            <span className="cart-badge">{cartCount}</span>
          )}
        </button>
      </div>
    </header>
  );
}

export default Header;
