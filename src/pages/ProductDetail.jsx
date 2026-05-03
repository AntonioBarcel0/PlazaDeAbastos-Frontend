import { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import SeasonBadge from '../components/SeasonBadge';
import OriginBadge from '../components/OriginBadge';
import { useCart, isKg } from '../context/CartContext';
import toast from 'react-hot-toast';
import './ProductDetail.css';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace('/api', '');

const GRAM_STEP = 50;
const GRAM_MIN  = 50;

function ProductDetail({ product, vendedor, user, onLogout, onDashboardClick, onBack, onHomeClick, onMarketplaceClick, onSelectPuestoClick, onCartClick, onOrdersClick, onPageClick }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [gramos, setGramos] = useState(250); // solo para productos por peso
  const { cart, addToCart, updateQuantity } = useCart();

  const porPeso = isKg(product.unidad);
  const cartItem = cart.find(i => i.productId === product.id);
  const agotado = product.stock !== null && product.stock !== undefined && product.stock === 0;
  const maxGramos = product.stock != null ? product.stock * 1000 : 10000;

  const handleAddToCart = () => {
    if (!vendedor) return;
    addToCart(product, vendedor, porPeso ? gramos : null);
    toast.success('Añadido al carrito');
  };

  const handleGramChange = (delta) => {
    setGramos(prev => Math.min(Math.max(GRAM_MIN, prev + delta), maxGramos));
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
        onPageClick={onPageClick}
      />

      <div className="product-detail-layout">
        <div className="product-detail-info">
          <button className="product-detail-back" onClick={onBack}>← Volver</button>

          <div className="product-detail-center">
            <h1 className="product-detail-name">{product.nombre}</h1>
            <div className="product-detail-badges">
              <SeasonBadge nombre={product.nombre} categoria={product.categoria} variant="detail" />
              <OriginBadge nombre={product.nombre} descripcion={product.descripcion} variant="detail" />
            </div>
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

            {porPeso ? (
              /* ── Selector de gramos ── */
              cartItem ? (
                <div className="product-detail-qty">
                  <button
                    onClick={() => updateQuantity(product.id, cartItem.cantidad - GRAM_STEP)}
                    disabled={cartItem.cantidad <= GRAM_MIN}
                  >−</button>
                  <span>
                    {cartItem.cantidad >= 1000
                      ? `${(cartItem.cantidad / 1000).toFixed(cartItem.cantidad % 1000 === 0 ? 0 : 1)} kg`
                      : `${cartItem.cantidad} g`}
                  </span>
                  <button
                    onClick={() => updateQuantity(product.id, cartItem.cantidad + GRAM_STEP)}
                    disabled={cartItem.cantidad >= maxGramos}
                  >+</button>
                </div>
              ) : (
                <div className="product-detail-gram-selector">
                  <div className="product-detail-qty">
                    <button onClick={() => handleGramChange(-GRAM_STEP)} disabled={gramos <= GRAM_MIN}>−</button>
                    <span>
                      {gramos >= 1000
                        ? `${(gramos / 1000).toFixed(gramos % 1000 === 0 ? 0 : 1)} kg`
                        : `${gramos} g`}
                    </span>
                    <button onClick={() => handleGramChange(GRAM_STEP)} disabled={gramos >= maxGramos}>+</button>
                  </div>
                  <p className="product-detail-gram-price">
                    {((gramos / 1000) * parseFloat(product.precio)).toFixed(2)}€
                  </p>
                  <button
                    className="product-detail-add-btn"
                    onClick={handleAddToCart}
                    disabled={agotado}
                  >
                    {agotado ? 'Agotado' : 'Añadir al carrito'}
                  </button>
                </div>
              )
            ) : (
              /* ── Control por unidad (comportamiento original) ── */
              cartItem ? (
                <div className="product-detail-qty">
                  <button onClick={() => updateQuantity(product.id, cartItem.cantidad - 1)}>−</button>
                  <span>{cartItem.cantidad}</span>
                  <button
                    onClick={() => updateQuantity(product.id, cartItem.cantidad + 1)}
                    disabled={product.stock != null && cartItem.cantidad >= product.stock}
                  >+</button>
                </div>
              ) : (
                <button
                  className={`product-detail-add-btn${agotado ? ' product-detail-add-btn--agotado' : ''}`}
                  onClick={handleAddToCart}
                  disabled={agotado}
                >
                  {agotado ? 'Agotado' : 'Añadir'}
                </button>
              )
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
