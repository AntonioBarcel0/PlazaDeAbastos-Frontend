import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useCart, isKg, itemSubtotal } from '../context/CartContext';
import './Cart.css';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

function Cart({ user, onLogout, onDashboardClick, onCartClick, onBack, onHomeClick, onMarketplaceClick, onSelectPuestoClick, onCheckout, onLoginClick, onOrdersClick }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { cart, cartByVendor, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="cart-container">
        <Header
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          onLoginClick={onLoginClick || (() => {})}
          onLogoClick={onHomeClick}
          user={user}
          onLogout={onLogout}
          onDashboardClick={onDashboardClick}
          onCartClick={onCartClick}
          onOrdersClick={onOrdersClick}
        />
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onMarketplaceClick={onMarketplaceClick}
          onSelectPuestoClick={onSelectPuestoClick}
        />
        <main className="cart-main">
          <div className="cart-empty">
            <span className="cart-empty-icon">🛒</span>
            <h2>Tu carrito está vacío</h2>
            <p>Añade productos desde cualquier puesto para empezar.</p>
            <button className="btn-back-shop" onClick={onBack}>
              Ir a comprar
            </button>
          </div>
        </main>
      </div>
    );
  }

  const vendorIds = Object.keys(cartByVendor);

  return (
    <div className="cart-container">
      <Header
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onLoginClick={onLoginClick || (() => {})}
        onLogoClick={onHomeClick}
        user={user}
        onLogout={onLogout}
        onDashboardClick={onDashboardClick}
        onCartClick={onCartClick}
        onOrdersClick={onOrdersClick}
      />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onMarketplaceClick={onMarketplaceClick}
        onSelectPuestoClick={onSelectPuestoClick}
      />

      <main className="cart-main">
        <button className="back-button" onClick={onBack}>
          ← Seguir comprando
        </button>

        <h1 className="cart-title">Tu carrito</h1>

        <div className="cart-layout">
          <div className="cart-items">
            {vendorIds.map(vid => {
              const group = cartByVendor[vid];
              return (
                <div key={vid} className="cart-vendor-group">
                  <h3 className="cart-vendor-heading">{group.nombre}</h3>
                  {group.items.map(item => (
                    <div key={item.productId} className="cart-item">
                      <div className="cart-item-image">
                        {item.imagen ? (
                          <img src={`${BASE_URL}${item.imagen}`} alt={item.nombre} />
                        ) : (
                          <div className="cart-item-image-placeholder">📦</div>
                        )}
                      </div>

                      <div className="cart-item-info">
                        <h3 className="cart-item-name">{item.nombre}</h3>
                        <p className="cart-item-price">{item.precio.toFixed(2)}€/{item.unidad}</p>
                      </div>

                      <div className="cart-item-controls">
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(item.productId, item.cantidad - (isKg(item.unidad) ? 50 : 1))}
                          disabled={isKg(item.unidad) && item.cantidad <= 50}
                        >
                          −
                        </button>
                        <span className="qty-value">
                          {isKg(item.unidad)
                            ? (item.cantidad >= 1000
                                ? `${(item.cantidad / 1000).toFixed(item.cantidad % 1000 === 0 ? 0 : 1)} kg`
                                : `${item.cantidad} g`)
                            : item.cantidad}
                        </span>
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(item.productId, item.cantidad + (isKg(item.unidad) ? 50 : 1))}
                          disabled={
                            isKg(item.unidad)
                              ? (item.stock != null && item.cantidad >= item.stock * 1000)
                              : (item.stock !== null && item.stock !== undefined && item.cantidad >= item.stock)
                          }
                        >
                          +
                        </button>
                      </div>

                      <div className="cart-item-subtotal">
                        {itemSubtotal(item).toFixed(2)}€
                      </div>

                      <button
                        className="cart-item-remove"
                        onClick={() => removeFromCart(item.productId)}
                        aria-label="Eliminar producto"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <h2 className="cart-summary-title">Resumen</h2>

            {vendorIds.map(vid => {
              const group = cartByVendor[vid];
              const vendorTotal = group.items.reduce((s, i) => s + itemSubtotal(i), 0);
              return (
                <div key={vid} className="cart-summary-row">
                  <span>{group.nombre} ({group.items.length})</span>
                  <span>{vendorTotal.toFixed(2)}€</span>
                </div>
              );
            })}

            <div className="cart-summary-total">
              <strong>Total</strong>
              <strong>{cartTotal.toFixed(2)}€</strong>
            </div>

            {!user && (
              <p className="cart-login-notice">
                Inicia sesión para poder realizar el pedido.
              </p>
            )}

            <button
              className="btn-checkout"
              onClick={onCheckout}
              disabled={!user}
            >
              Confirmar pedido →
            </button>

            <button className="btn-clear" onClick={clearCart}>
              Vaciar carrito
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Cart;
