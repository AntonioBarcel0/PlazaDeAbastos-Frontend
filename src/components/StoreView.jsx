import { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { api } from '../services/api';
import './StoreView.css';

function StoreView({ vendedorId, user, onLogout, onDashboardClick, onBack }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [vendedor, setVendedor] = useState(null);
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    loadVendedor();
  }, [vendedorId]);

  useEffect(() => {
    filterProductos();
  }, [productos, selectedCategoria, searchTerm]);

  const loadVendedor = async () => {
    try {
      setLoading(true);
      const data = await api.getVendedor(vendedorId);
      setVendedor(data.vendedor);
      setProductos(data.vendedor.productos || []);
    } catch (error) {
      console.error('Error al cargar vendedor:', error);
      alert('Error al cargar el puesto: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filterProductos = () => {
    let filtered = productos;

    // Filtrar por categoría
    if (selectedCategoria !== 'Todos') {
      filtered = filtered.filter(p => p.categoria === selectedCategoria);
    }

    // Filtrar por búsqueda
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.nombre.toLowerCase().includes(search) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(search))
      );
    }

    setFilteredProductos(filtered);
  };

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogoClick = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleAddToCart = (producto) => {
    // Aquí puedes implementar la lógica del carrito
    alert(`${producto.nombre} añadido al carrito`);
  };

  // Obtener categorías únicas de los productos
  const categorias = ['Todos', ...new Set(productos.map(p => p.categoria).filter(Boolean))];

  if (loading) {
    return (
      <div className="store-view-container">
        <Header 
          onMenuClick={handleMenuClick}
          onLoginClick={() => {}}
          onLogoClick={handleLogoClick}
          user={user}
          onLogout={onLogout}
          onDashboardClick={onDashboardClick}
        />
        <div className="loading-container">Cargando productos...</div>
      </div>
    );
  }

  if (!vendedor) {
    return (
      <div className="store-view-container">
        <Header 
          onMenuClick={handleMenuClick}
          onLoginClick={() => {}}
          onLogoClick={handleLogoClick}
          user={user}
          onLogout={onLogout}
          onDashboardClick={onDashboardClick}
        />
        <div className="error-container">Puesto no encontrado</div>
      </div>
    );
  }

  return (
    <div className="store-view-container">
      <Header 
        onMenuClick={handleMenuClick}
        onLoginClick={() => {}}
        onLogoClick={handleLogoClick}
        user={user}
        onLogout={onLogout}
        onDashboardClick={onDashboardClick}
      />

      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLoginClick={() => {}}
        user={user}
        onLogout={onLogout}
        onDashboardClick={onDashboardClick}
      />

      <main className="store-view-main">
        {/* Botón volver */}
        <button className="back-button" onClick={onBack}>
          ← Volver a Puestos
        </button>

        {/* Información del vendedor */}
        <div className="vendor-header">
          <h1 className="vendor-name">{vendedor.nombreCompleto}</h1>
          {vendedor.telefono && (
            <p className="vendor-contact">📞 {vendedor.telefono}</p>
          )}
          {vendedor.direccion && (
            <p className="vendor-location">📍 {vendedor.direccion}</p>
          )}
        </div>

        <h2 className="products-section-title">Productos</h2>

        {/* Barra de búsqueda y filtros */}
        <div className="store-controls">
          <input
            type="text"
            className="store-search"
            placeholder="Buscar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="store-actions">
            <button className="btn-filter">Filtrar</button>
            <button className="btn-order">Ordenar</button>
          </div>
        </div>

        {/* Categorías */}
        {categorias.length > 1 && (
          <div className="store-categories">
            {categorias.map(cat => (
              <button
                key={cat}
                className={`category-btn ${selectedCategoria === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategoria(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Grid de productos */}
        <div className="products-grid">
          {filteredProductos.length === 0 ? (
            <div className="empty-message">
              No hay productos disponibles {selectedCategoria !== 'Todos' ? `en ${selectedCategoria}` : ''}
            </div>
          ) : (
            filteredProductos.map(producto => (
              <div key={producto.id} className="product-card">
                <div className="product-image-container">
                  {producto.imagen ? (
                    <img 
                      src={`http://localhost:3001${producto.imagen}`}
                      alt={producto.nombre}
                      className="product-image"
                    />
                  ) : (
                    <div className="product-image-placeholder">
                      📦
                    </div>
                  )}
                  <button 
                    className="product-add-btn"
                    onClick={() => handleAddToCart(producto)}
                  >
                    añadir
                  </button>
                </div>
                <div className="product-info">
                  <h3 className="product-name">{producto.nombre}</h3>
                  {producto.descripcion && (
                    <p className="product-description">{producto.descripcion}</p>
                  )}
                  <div className="product-price-container">
                    <span className="product-price">
                      {parseFloat(producto.precio).toFixed(2)}€
                    </span>
                    <span className="product-unit">/{producto.unidad}</span>
                  </div>
                  {producto.stock !== undefined && producto.stock !== null && (
                    <p className="product-stock">
                      Stock: {producto.stock}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default StoreView;
