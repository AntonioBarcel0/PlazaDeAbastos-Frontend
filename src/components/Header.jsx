import { ShoppingBag, Menu } from 'lucide-react';
import './Header.css';

function Header({ onMenuClick }) {
  return (
    <header className="header">
      <button className="menu-btn" onClick={onMenuClick} aria-label="Abrir menú">
        <Menu size={28} />
      </button>

      <div className="logo">
        <span className="logo-text">PdA</span>
      </div>

      <button className="cart-btn" aria-label="Carrito de compra">
        <ShoppingBag size={28} />
      </button>
    </header>
  );
}

export default Header;