import { useState, useEffect } from 'react';
import { Store } from 'lucide-react';
import Header from './Header';
import Sidebar from './Sidebar';
import Spinner from './Spinner';
import SeasonBadge from './SeasonBadge';
import VENDOR_IMAGES from '../utils/vendorImages';
import OriginBadge from './OriginBadge';
import { useCart, isKg } from '../context/CartContext';
import { api, BASE_URL } from '../services/api';
import toast from 'react-hot-toast';
import './StoreView.css';


function StoreView({ vendedorId, user, onLogout, onDashboardClick, onBack, onHomeClick, onMarketplaceClick, onSelectPuestoClick, onProductClick, onCartClick, onOrdersClick, onMapClick, onInstruccionesClick, onPageClick, onLoginClick }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [vendedor, setVendedor] = useState(null);
  const [productos, setProductos] = useState([]);
  const [cestas, setCestas] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // gramPicker: { [productId]: gramos } — productos kg con picker abierto
  const [gramPicker, setGramPicker] = useState({});
  const { cart, addToCart, addCestaToCart, updateQuantity } = useCart();

  const GRAM_STEP = 50;
  const GRAM_MIN  = 50;
  const gramMaxForProduct = (producto) =>
    producto.stock != null ? producto.stock * 1000 : 10000;

  const openGramPicker = (producto) => {
    setGramPicker(prev => ({ ...prev, [producto.id]: 250 }));
  };
  const closeGramPicker = (productId) => {
    setGramPicker(prev => { const n = { ...prev }; delete n[productId]; return n; });
  };
  const changeGrams = (productId, delta, producto) => {
    setGramPicker(prev => {
      const current = prev[productId] ?? 250;
      const next = Math.min(
        Math.max(GRAM_MIN, current + delta),
        gramMaxForProduct(producto)
      );
      return { ...prev, [productId]: next };
    });
  };

  useEffect(() => { loadVendedor(); }, [vendedorId]);
  useEffect(() => { filterProductos(); }, [productos, selectedCategoria, searchTerm]);

  const loadVendedor = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getVendedor(vendedorId);
      setVendedor(data.vendedor);
      setProductos(data.vendedor.productos || []);
      setCestas(data.vendedor.cestas || []);
    } catch (err) {
      console.error('Error al cargar vendedor:', err);
      setError('No se pudo cargar el puesto.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCestaToCart = (cesta) => {
    if (!vendedor) return;
    addCestaToCart(cesta, vendedor);
    toast.success(`"${cesta.nombre}" añadida al carrito`);
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

  const handleAddToCart = (producto, gramos = null) => {
    if (!vendedor) return;
    addToCart(producto, vendedor, gramos);
    closeGramPicker(producto.id);
  };

  const categorias = ['Todos', ...new Set(productos.map(p => p.categoria).filter(Boolean))];

  const headerProps = {
    onMenuClick: () => setSidebarOpen(!sidebarOpen),
    onLoginClick,
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
        onMapClick={onMapClick}
        onInstruccionesClick={onInstruccionesClick}
        onPageClick={onPageClick}
        user={user}
        onOrdersClick={onOrdersClick}
        onDashboardClick={onDashboardClick}
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
          {vendedor.imagenPrincipal || VENDOR_IMAGES[vendedor.id] ? (
            <img
              src={vendedor.imagenPrincipal ? (vendedor.imagenPrincipal.startsWith('http') ? vendedor.imagenPrincipal : `${BASE_URL}${vendedor.imagenPrincipal}`) : VENDOR_IMAGES[vendedor.id]}
              alt={vendedor.nombreCompleto}
              className="sv-hero-img"
            />
          ) : (
            <div className="sv-hero-img-placeholder"><Store size={64} strokeWidth={1.5} color="#8b2332" /></div>
          )}
        </div>
      </div>

      {/* ── Sección de productos ── */}
      <div className="sv-products-wrap">
        <main className="sv-products-main">
          <div className="sv-products-controls">
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
          </div>

          {/* Cestas predefinidas del puesto */}
          {cestas.length > 0 && (
            <div className="sv-cestas-section">
              <h2 className="sv-cestas-title">Cestas predefinidas</h2>
              <div className="sv-cestas-grid">
                {cestas.map(cesta => {
                  const cestaCartItem = cart.find(i => i.cestaId === cesta.id);
                  return (
                    <div key={cesta.id} className="sv-cesta-card">
                      <div className="sv-cesta-card-body">
                        <p className="sv-cesta-tipo">{cesta.tipo}</p>
                        <h3 className="sv-cesta-nombre">{cesta.nombre}</h3>
                        {cesta.descripcion && (
                          <p className="sv-cesta-desc">{cesta.descripcion}</p>
                        )}
                        {cesta.items && cesta.items.length > 0 && (
                          <p className="sv-cesta-items">{cesta.items.join(' · ')}</p>
                        )}
                      </div>
                      <div className="sv-cesta-card-footer">
                        <span className="sv-cesta-precio">{parseFloat(cesta.precio).toFixed(2)} €</span>
                        {cestaCartItem ? (
                          <div className="product-qty-control">
                            <button onClick={() => updateQuantity(cesta.id, cestaCartItem.cantidad - 1)}>−</button>
                            <span>{cestaCartItem.cantidad}</span>
                            <button onClick={() => updateQuantity(cesta.id, cestaCartItem.cantidad + 1)}>+</button>
                          </div>
                        ) : (
                          <button className="product-add-btn" onClick={() => handleAddCestaToCart(cesta)}>
                            añadir
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
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
              filteredProductos.map(producto => {
                const cartItem = cart.find(i => i.productId === producto.id);
                const agotado = producto.stock !== null && producto.stock !== undefined && producto.stock === 0;
                const porPeso = isKg(producto.unidad);
                const pickerGrams = gramPicker[producto.id];
                const pickerOpen = pickerGrams !== undefined;
                const maxGramos = gramMaxForProduct(producto);

                return (
                  <div
                    key={producto.id}
                    className="product-card"
                    onClick={() => onProductClick && onProductClick(producto, vendedor)}
                  >
                    {/* ── Nombre + precio (arriba) ── */}
                    <div className="product-card-top">
                      <h3 className="product-name">{producto.nombre}</h3>
                      <p className="product-price-line">
                        {parseFloat(producto.precio).toFixed(2)}€
                        <span className="product-unit">/{producto.unidad}</span>
                      </p>
                      <div className="product-card-badges">
                        <SeasonBadge nombre={producto.nombre} categoria={producto.categoria} variant="card" />
                        <OriginBadge nombre={producto.nombre} descripcion={producto.descripcion} variant="card" />
                      </div>
                    </div>

                    {/* ── Imagen ── */}
                    <div className="product-image-container">
                      {producto.imagen ? (
                        <img
                          src={producto.imagen.startsWith('http') ? producto.imagen : `${BASE_URL}${producto.imagen}`}
                          alt={producto.nombre}
                          className="product-image"
                        />
                      ) : (
                        <div className="product-image-placeholder">📦</div>
                      )}
                    </div>

                    {/* ── Botón / picker / qty (abajo) ── */}
                    <div className="product-card-bottom" onClick={e => e.stopPropagation()}>
                      {cartItem && porPeso && (
                        <div className="product-qty-control">
                          <button
                            onClick={() => updateQuantity(producto.id, cartItem.cantidad - GRAM_STEP)}
                            disabled={cartItem.cantidad <= GRAM_MIN}
                          >−</button>
                          <span>
                            {cartItem.cantidad >= 1000
                              ? `${(cartItem.cantidad / 1000).toFixed(cartItem.cantidad % 1000 === 0 ? 0 : 1)} kg`
                              : `${cartItem.cantidad} g`}
                          </span>
                          <button
                            onClick={() => updateQuantity(producto.id, cartItem.cantidad + GRAM_STEP)}
                            disabled={cartItem.cantidad >= maxGramos}
                          >+</button>
                        </div>
                      )}

                      {cartItem && !porPeso && (
                        <div className="product-qty-control">
                          <button onClick={() => updateQuantity(producto.id, cartItem.cantidad - 1)}>−</button>
                          <span>{cartItem.cantidad}</span>
                          <button
                            onClick={() => updateQuantity(producto.id, cartItem.cantidad + 1)}
                            disabled={producto.stock != null && cartItem.cantidad >= producto.stock}
                          >+</button>
                        </div>
                      )}

                      {!cartItem && porPeso && pickerOpen && (
                        <div className="gram-picker">
                          <div className="gram-picker-controls">
                            <button
                              onClick={() => changeGrams(producto.id, -GRAM_STEP, producto)}
                              disabled={pickerGrams <= GRAM_MIN}
                            >−</button>
                            <span className="gram-picker-value">
                              {pickerGrams >= 1000
                                ? `${(pickerGrams / 1000).toFixed(pickerGrams % 1000 === 0 ? 0 : 1)} kg`
                                : `${pickerGrams} g`}
                            </span>
                            <button
                              onClick={() => changeGrams(producto.id, GRAM_STEP, producto)}
                              disabled={pickerGrams >= maxGramos}
                            >+</button>
                          </div>
                          <p className="gram-picker-price">
                            {((pickerGrams / 1000) * parseFloat(producto.precio)).toFixed(2)}€
                          </p>
                          <button
                            className="gram-picker-add"
                            onClick={() => handleAddToCart(producto, pickerGrams)}
                          >Añadir</button>
                        </div>
                      )}

                      {!cartItem && !(porPeso && pickerOpen) && (
                        <button
                          className={`product-add-btn${agotado ? ' product-add-btn--agotado' : ''}`}
                          onClick={() => {
                            if (agotado) return;
                            if (porPeso) openGramPicker(producto);
                            else handleAddToCart(producto);
                          }}
                          disabled={agotado}
                        >
                          {agotado ? 'Agotado' : 'añadir'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default StoreView;
