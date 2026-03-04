import { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { api } from '../services/api';
import './Marketplace.css';

function Marketplace({ user, onLogout, onDashboardClick, onStoreClick, onBackHome }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [vendedores, setVendedores] = useState([]);
  const [filteredVendedores, setFilteredVendedores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const categoriasBase = [
    'Todos',
    'Frutas',
    'Verduras',
    'Pescado',
    'Carne',
    'Embutidos',
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
      const data = await api.getVendedores();
      setVendedores(data.vendedores || []);
    } catch (error) {
      console.error('Error al cargar vendedores:', error);
      alert('Error al cargar puestos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filterVendedores = () => {
    let filtered = vendedores;

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
    if (onBackHome) {
      onBackHome();
    }
  };

  const getCategoriaPrincipal = (categorias) => {
    if (!categorias || categorias.length === 0) return 'Sin categoría';
    return categorias[0];
  };

  if (loading) {
    return (
      <div className="marketplace-container">
        <Header 
          onMenuClick={handleMenuClick}
          onLoginClick={() => {}}
          onLogoClick={handleLogoClick}
          user={user}
          onLogout={onLogout}
          onDashboardClick={onDashboardClick}
        />
        <div className="loading-container">Cargando puestos...</div>
      </div>
    );
  }

  return (
    <div className="marketplace-container">
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
                  {vendedor.imagenPrincipal ? (
                    <img 
                      src={`http://localhost:3001${vendedor.imagenPrincipal}`}
                      alt={vendedor.nombreCompleto}
                      className="store-image"
                    />
                  ) : (
                    <div className="store-image-placeholder">
                      🏪
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
