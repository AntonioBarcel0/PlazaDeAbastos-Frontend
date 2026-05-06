import { useState, useEffect } from 'react';
import { Store } from 'lucide-react';
import Header from './Header';
import Sidebar from './Sidebar';
import Spinner from './Spinner';
import { api } from '../services/api';
import VENDOR_IMAGES from '../utils/vendorImages';
import './Marketplace.css';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

const EXCLUDED_KEYWORDS = ['carnicer', 'pescader', 'charcuter', 'carne', 'pescado', 'marisco'];

function Marketplace({ user, onLogout, onDashboardClick, onStoreClick, onHomeClick, onMarketplaceClick, onSelectPuestoClick, onCartClick, onOrdersClick, onMapClick, onInstruccionesClick, onPageClick }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [vendedores, setVendedores] = useState([]);
  const [filteredVendedores, setFilteredVendedores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categoriasBase = [
    'Todos',
    'Frutas',
    'Verduras',
    'Lácteos',
    'Pan y Bollería',
    'Conservas',
    'Especias',
    'Otros'
  ];

  useEffect(() => {
    loadVendedores();
  }, []);

  useEffect(() => {
    filterVendedores();
  }, [vendedores, selectedCategoria, searchTerm]);

  const loadVendedores = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getVendedores();
      setVendedores(data.vendedores || []);
    } catch (err) {
      console.error('Error al cargar vendedores:', err);
      setError('No se pudieron cargar los puestos.');
    } finally {
      setLoading(false);
    }
  };

  const filterVendedores = () => {
    let filtered = vendedores.filter(v => {
      const esp = (v.especialidad || '').toLowerCase();
      const cats = (v.categorias || []).map(c => c.toLowerCase());
      return !EXCLUDED_KEYWORDS.some(kw => esp.includes(kw) || cats.some(c => c.includes(kw)));
    });

    // Filtrar por categoría
    if (selectedCategoria !== 'Todos') {
      filtered = filtered.filter(v => 
        v.categorias && v.categorias.includes(selectedCategoria)
      );
    }

    // Filtrar por búsqueda
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(v =>
        v.nombreCompleto.toLowerCase().includes(search)
      );
    }

    setFilteredVendedores(filtered);
  };

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogoClick = () => {
    if (onHomeClick) onHomeClick();
  };

  const getCategoriaPrincipal = (categorias) => {
    if (!categorias || categorias.length === 0) return 'Sin categoría';
    return categorias[0];
  };

  const headerProps = {
    onMenuClick: handleMenuClick,
    onLoginClick: () => {},
    onLogoClick: handleLogoClick,
    user,
    onLogout,
    onDashboardClick,
    onCartClick,
    onOrdersClick,
  };

  if (loading) {
    return (
      <div className="marketplace-container">
        <Header {...headerProps} />
        <Spinner message="Cargando puestos..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="marketplace-container">
        <Header {...headerProps} />
        <div className="error-container">
          <p>{error}</p>
          <button className="retry-btn" onClick={loadVendedores}>Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="marketplace-container">
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

      <main className="marketplace-main">
        <h1 className="marketplace-title">Puestos</h1>

        {/* Barra de búsqueda y filtros */}
        <div className="marketplace-controls">
          <input
            type="text"
            className="marketplace-search"
            placeholder="Buscar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="marketplace-actions">
            <button className="btn-filter">Filtrar</button>
            <button className="btn-order">Ordenar</button>
          </div>
        </div>

        {/* Categorías */}
        <div className="marketplace-categories">
          {categoriasBase.map(cat => (
            <button
              key={cat}
              className={`category-btn ${selectedCategoria === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategoria(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid de puestos */}
        <div className="marketplace-grid">
          {filteredVendedores.length === 0 ? (
            <div className="empty-message">
              No se encontraron puestos {selectedCategoria !== 'Todos' ? `en la categoría ${selectedCategoria}` : ''}
            </div>
          ) : (
            filteredVendedores.map(vendedor => (
              <div key={vendedor.id} className="store-card">
                <div className="store-image-container">
                  {vendedor.imagenPrincipal || VENDOR_IMAGES[vendedor.id] ? (
                    <img
                      src={vendedor.imagenPrincipal ? (vendedor.imagenPrincipal.startsWith('http') ? vendedor.imagenPrincipal : `${BASE_URL}${vendedor.imagenPrincipal}`) : VENDOR_IMAGES[vendedor.id]}
                      alt={vendedor.nombreCompleto}
                      className="store-image"
                    />
                  ) : (
                    <div className="store-image-placeholder">
                      <Store size={48} strokeWidth={1.5} color="#8b2332" />
                    </div>
                  )}
                  <button 
                    className="store-view-btn"
                    onClick={() => onStoreClick(vendedor.id)}
                  >
                    Ver más
                  </button>
                </div>
                <div className="store-info">
                  <h3 className="store-name">{vendedor.nombreCompleto}</h3>
                  <p className="store-category">{getCategoriaPrincipal(vendedor.categorias)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default Marketplace;
