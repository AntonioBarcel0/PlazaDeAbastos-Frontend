import { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import './ProductDetail.css';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace('/api', '');

function ProductDetail({ product, vendedor, user, onLogout, onDashboardClick, onBack, onHomeClick, onMarketplaceClick, onSelectPuestoClick, onCartClick, onOrdersClick }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { cart, addToCart, updateQuantity } = useCart();

  const cartItem = cart.find(i => i.productId === product.id);
  const agotado = product.stock !== null && product.stock !== undefined && product.stock === 0;
  const enLimite = cartItem && product.stock !== null && product.stock !== undefined && cartItem.cantidad >= product.stock;

  const handleAddToCart = () => {
    if (!vendedor) return;
    const result = addToCart(product, vendedor);
    if (result.conflict) {
      toast.error(`Tu carrito tiene productos de ${result.conflictVendorName}. Vacíalo primero.`);
    } else {
      toast.success('Añadido al carrito');
    }
  };

  return (
    <div className="product-detail-container">
      <Header
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onLoginClick={() => {}}
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

      <div className="product-detail-layout">
        <div className="product-detail-info">
          <button className="product-detail-back" onClick={onBack}>← Volver</button>

          <div className="product-detail-center">
            <h1 className="product-detail-name">{product.nombre}</h1>
            <p className="product-detail-price">
              {parseFloat(product.precio).toFixed(2)}€/{product.unidad}
            </p>
            {product.stock !== undefined && product.stock !== null && (
              <p className="product-detail-stock">Stock disponible: {product.stock}</p>
            )}
          </div>

          <div className="product-detail-bottom">
            {product.descripcion && (
              <p className="product-detail-origen">
                <strong>Descripción</strong> — {product.descripcion}
              </p>
            )}
            {cartItem ? (
              <div className="product-detail-qty">
                <button onClick={() => updateQuantity(product.id, cartItem.cantidad - 1)}>−</button>
                <span>{cartItem.cantidad}</span>
                <button onClick={() => updateQuantity(product.id, cartItem.cantidad + 1)} disabled={enLimite}>+</button>
              </div>
            ) : (
              <button
                className={`product-detail-add-btn${agotado ? ' product-detail-add-btn--agotado' : ''}`}
                onClick={handleAddToCart}
                disabled={agotado}
              >
                {agotado ? 'Agotado' : 'Añadir'}
              </button>
            )}
          </div>
        </div>

        <div className="product-detail-image">
          {product.imagen ? (
            <img
              src={`${BASE_URL}${product.imagen}`}
              alt={product.nombre}
              className="product-detail-img"
            />
          ) : (
            <div className="product-detail-img-placeholder" />
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
