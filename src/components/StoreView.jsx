import { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Spinner from './Spinner';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import './StoreView.css';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

function StoreView({ vendedorId, user, onLogout, onDashboardClick, onBack, onHomeClick, onMarketplaceClick, onSelectPuestoClick, onProductClick, onCartClick, onOrdersClick }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [vendedor, setVendedor] = useState(null);
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [conflictPending, setConflictPending] = useState(null);
  const { cart, addToCart, forceAddToCart, updateQuantity } = useCart();

  useEffect(() => { loadVendedor(); }, [vendedorId]);
  useEffect(() => { filterProductos(); }, [productos, selectedCategoria, searchTerm]);

  const loadVendedor = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getVendedor(vendedorId);
      setVendedor(data.vendedor);
      setProductos(data.vendedor.productos || []);
    } catch (err) {
      console.error('Error al cargar vendedor:', err);
      setError('No se pudo cargar el puesto.');
    } finally {
      setLoading(false);
    }
  };

  const filterProductos = () => {
    let filtered = productos;
    if (selectedCategoria !== 'Todos') {
      filtered = filtered.filter(p => p.categoria === selectedCategoria);
    }
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.nombre.toLowerCase().includes(search) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(search))
      );
    }
    setFilteredProductos(filtered);
  };

  const handleAddToCart = (producto) => {
    if (!vendedor) return;
    const result = addToCart(producto, vendedor);
    if (result.conflict) {
      setConflictPending({ producto, conflictVendorName: result.conflictVendorName });
    }
  };

  const handleConflictConfirm = () => {
    if (conflictPending) {
      forceAddToCart(conflictPending.producto, vendedor);
      setConflictPending(null);
    }
  };

  const categorias = ['Todos', ...new Set(productos.map(p => p.categoria).filter(Boolean))];

  const headerProps = {
    onMenuClick: () => setSidebarOpen(!sidebarOpen),
    onLoginClick: () => {},
    onLogoClick: onHomeClick,
    user,
    onLogout,
    onDashboardClick,
    onCartClick,
    onOrdersClick,
  };

  if (loading) {
    return (
      <div className="store-view-container">
        <Header {...headerProps} />
        <Spinner message="Cargando puesto..." />
      </div>
    );
  }

  if (error || !vendedor) {
    return (
      <div className="store-view-container">
        <Header {...headerProps} />
        <div className="error-container">
          <p>{error || 'Puesto no encontrado.'}</p>
          {error && <button className="retry-btn" onClick={loadVendedor}>Reintentar</button>}
        </div>
      </div>
    );
  }

  return (
    <div className="store-view-container">
      <Header {...headerProps} />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onMarketplaceClick={onMarketplaceClick}
        onSelectPuestoClick={onSelectPuestoClick}
      />

      {/* ── Hero del puesto ── */}
      <div className="sv-hero">
        <div className="sv-hero-info">
          <button className="sv-back" onClick={onBack}>← Volver</button>

          <div className="sv-hero-center">
            <h1 className="sv-vendor-name">{vendedor.nombreCompleto}</h1>
            {vendedor.especialidad && (
              <p className="sv-vendor-esp">{vendedor.especialidad}</p>
            )}
            {vendedor.telefono && (
              <p className="sv-vendor-meta">📞 {vendedor.telefono}</p>
            )}
            {vendedor.direccion && (
              <p className="sv-vendor-meta">📍 {vendedor.direccion}</p>
            )}
          </div>

          <div className="sv-hero-bottom">
            <span className="sv-products-count">
              {productos.length} {productos.length === 1 ? 'producto' : 'productos'}
            </span>
          </div>
        </div>

        <div className="sv-hero-image">
          {vendedor.imagenPrincipal ? (
            <img
              src={`${BASE_URL}${vendedor.imagenPrincipal}`}
              alt={vendedor.nombreCompleto}
              className="sv-hero-img"
            />
          ) : (
            <div className="sv-hero-img-placeholder">🏪</div>
          )}
        </div>
      </div>

      {/* ── Sección de productos ── */}
      <div className="sv-products-wrap">
        <main className="sv-products-main">
          <h2 className="sv-products-title">Productos</h2>

          {/* Búsqueda */}
          <div className="store-controls">
            <input
              type="text"
              className="store-search"
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Categorías */}
          {categorias.length > 1 && (
            <div className="store-categories">
              {categorias.map(cat => (
                <button
                  key={cat}
                  className={`category-btn${selectedCategoria === cat ? ' active' : ''}`}
                  onClick={() => setSelectedCategoria(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Banner conflicto */}
          {conflictPending && (
            <div className="cart-conflict-banner">
              <p>
                Tu carrito tiene productos de <strong>{conflictPending.conflictVendorName}</strong>.
                Si continúas, se vaciará el carrito actual.
              </p>
              <div className="cart-conflict-actions">
                <button className="conflict-btn-cancel" onClick={() => setConflictPending(null)}>
                  Cancelar
                </button>
                <button className="conflict-btn-confirm" onClick={handleConflictConfirm}>
                  Vaciar y añadir
                </button>
              </div>
            </div>
          )}

          {/* Grid de productos */}
          <div className="products-grid">
            {filteredProductos.length === 0 ? (
              <div className="empty-message">
                No hay productos disponibles{selectedCategoria !== 'Todos' ? ` en ${selectedCategoria}` : ''}
              </div>
            ) : (
              filteredProductos.map(producto => (
                <div
                  key={producto.id}
                  className="product-card"
                  onClick={() => onProductClick && onProductClick(producto, vendedor)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="product-image-container">
                    {producto.imagen ? (
                      <img
                        src={`${BASE_URL}${producto.imagen}`}
                        alt={producto.nombre}
                        className="product-image"
                      />
                    ) : (
                      <div className="product-image-placeholder">📦</div>
                    )}
                    {(() => {
                      const cartItem = cart.find(i => i.productId === producto.id);
                      const agotado = producto.stock !== null && producto.stock !== undefined && producto.stock === 0;
                      const enLimite = cartItem && producto.stock !== null && producto.stock !== undefined && cartItem.cantidad >= producto.stock;
                      return cartItem ? (
                        <div className="product-qty-control" onClick={e => e.stopPropagation()}>
                          <button onClick={() => updateQuantity(producto.id, cartItem.cantidad - 1)}>−</button>
                          <span>{cartItem.cantidad}</span>
                          <button onClick={() => updateQuantity(producto.id, cartItem.cantidad + 1)} disabled={enLimite}>+</button>
                        </div>
                      ) : (
                        <button
                          className={`product-add-btn${agotado ? ' product-add-btn--agotado' : ''}`}
                          onClick={e => { e.stopPropagation(); if (!agotado) handleAddToCart(producto); }}
                          disabled={agotado}
                        >
                          {agotado ? 'Agotado' : 'añadir'}
                        </button>
                      );
                    })()}
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{producto.nombre}</h3>
                    {producto.descripcion && (
                      <p className="product-description">{producto.descripcion}</p>
                    )}
                    <div className="product-price-container">
                      <span className="product-price">{parseFloat(producto.precio).toFixed(2)}€</span>
                      <span className="product-unit">/{producto.unidad}</span>
                    </div>
                    {producto.stock !== undefined && producto.stock !== null && (
                      <p className="product-stock">Stock: {producto.stock}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default StoreView;
