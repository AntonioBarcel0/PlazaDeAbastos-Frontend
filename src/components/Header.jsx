import { LogIn, ShoppingBasket } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Header.css';

function Header({ onMenuClick, onLoginClick, onLogoClick, user, onLogout, onDashboardClick, onCartClick, onOrdersClick }) {
  const { cartCount } = useCart();
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
          <>
            <span className="user-name">{user.nombre}</span>
            {user.role === 'cliente' && onOrdersClick && (
              <button className="orders-btn" onClick={onOrdersClick} aria-label="Mis pedidos">
                📋
              </button>
            )}
            {(user.role === 'comerciante' || user.role === 'admin') && onDashboardClick && (
              <button className="dashboard-btn" onClick={onDashboardClick} aria-label="Panel de control">
                📊
              </button>
            )}
            <button className="log-btn" onClick={onLogout} aria-label="Cerrar sesión">
              🚪
            </button>
          </>
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