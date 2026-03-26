import { useState, useEffect, useRef } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { api } from '../services/api';
import './SelectPuesto.css';

const CATEGORIAS = ['Todos', 'Frutería', 'Pescadería', 'Carnicería', 'Comestibles', 'Otros'];

// Palabras clave para emparejar cada categoría de filtro con la especialidad del vendedor
const FILTER_KEYWORDS = {
  'Frutería':    ['fruta', 'frutas'],
  'Pescadería':  ['pescad', 'marisco'],
  'Carnicería':  ['carne', 'carnes', 'carniced', 'carnicer'],
  'Comestibles': ['comestible', 'charcuter', 'queso'],
  'Otros':       ['jardiner', 'especia', 'panadera', 'panader'],
};

const SORT_OPTIONS = [
  { value: 'az', label: 'Nombre (A–Z)' },
  { value: 'za', label: 'Nombre (Z–A)' },
  { value: 'cat', label: 'Categoría' },
];

function SelectPuesto({ user, onLogout, onDashboardClick, onPuestoSelect, onBack }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [vendedores, setVendedores] = useState([]);
  const [filteredVendedores, setFilteredVendedores] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('az');
  const [sortOpen, setSortOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const sortRef = useRef(null);

  useEffect(() => {
    loadVendedores();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [vendedores, selectedCategoria, searchTerm, sortBy]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadVendedores = async () => {
    try {
      setLoading(true);
      const data = await api.getVendedores();
      setVendedores(data.vendedores || []);
    } catch (error) {
      console.error('Error al cargar vendedores:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...vendedores];

    if (selectedCategoria !== 'Todos') {
      const keywords = FILTER_KEYWORDS[selectedCategoria] || [selectedCategoria.toLowerCase()];
      result = result.filter(v =>
        v.categorias && v.categorias.some(cat =>
          keywords.some(kw => cat.toLowerCase().includes(kw))
        )
      );
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(v => v.nombreCompleto.toLowerCase().includes(q));
    }

    result.sort((a, b) => {
      if (sortBy === 'az') return a.nombreCompleto.localeCompare(b.nombreCompleto);
      if (sortBy === 'za') return b.nombreCompleto.localeCompare(a.nombreCompleto);
      if (sortBy === 'cat') {
        const catA = (a.categorias && a.categorias[0]) || '';
        const catB = (b.categorias && b.categorias[0]) || '';
        return catA.localeCompare(catB);
      }
      return 0;
    });

    setFilteredVendedores(result);
  };

  const getCategoriaPrincipal = (categorias) => {
    if (!categorias || categorias.length === 0) return 'Sin categoría';
    return categorias[0];
  };

  const currentSortLabel = SORT_OPTIONS.find(o => o.value === sortBy)?.label;

  if (loading) {
    return (
      <div className="sp-container">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          onLoginClick={() => {}}
          onLogoClick={onBack}
          user={user}
          onLogout={onLogout}
          onDashboardClick={onDashboardClick}
        />
        <div className="sp-loading">Cargando puestos...</div>
      </div>
    );
  }

  return (
    <div className="sp-container">
      <Header
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onLoginClick={() => {}}
        onLogoClick={onBack}
        user={user}
        onLogout={onLogout}
        onDashboardClick={onDashboardClick}
      />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        onLogout={onLogout}
        onDashboardClick={onDashboardClick}
      />

      <main className="sp-main">
        {/* Título + buscador */}
        <div className="sp-top-row">
          <h1 className="sp-title">Puestos</h1>
          <input
            type="text"
            className="sp-search"
            placeholder="Buscar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Categorías + acciones */}
        <div className="sp-controls-row">
          <div className="sp-categories">
            {CATEGORIAS.map(cat => (
              <button
                key={cat}
                className={`sp-cat-btn ${selectedCategoria === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategoria(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="sp-actions">
            {/* Filtrar — las categorías ya actúan de filtro */}
            <button
              className="sp-action-btn"
              onClick={() => setSelectedCategoria('Todos')}
              title="Quitar filtros"
            >
              Filtrar
            </button>

            {/* Ordenar con dropdown */}
            <div className="sp-sort-wrapper" ref={sortRef}>
              <button
                className={`sp-action-btn ${sortOpen ? 'active' : ''}`}
                onClick={() => setSortOpen(!sortOpen)}
              >
                {currentSortLabel}
              </button>
              {sortOpen && (
                <ul className="sp-sort-dropdown">
                  {SORT_OPTIONS.map(opt => (
                    <li
                      key={opt.value}
                      className={`sp-sort-option ${sortBy === opt.value ? 'selected' : ''}`}
                      onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                    >
                      {opt.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Grid de puestos */}
        <div className="sp-grid">
          {filteredVendedores.length === 0 ? (
            <p className="sp-empty">
              No se encontraron puestos{selectedCategoria !== 'Todos' ? ` en ${selectedCategoria}` : ''}.
            </p>
          ) : (
            filteredVendedores.map(vendedor => (
              <div key={vendedor.id} className="sp-card">
                <div className="sp-card-image-wrap">
                  {vendedor.imagenPrincipal ? (
                    <img
                      src={`http://localhost:3001${vendedor.imagenPrincipal}`}
                      alt={vendedor.nombreCompleto}
                      className="sp-card-image"
                    />
                  ) : (
                    <div className="sp-card-placeholder" />
                  )}
                  <button
                    className="sp-select-btn"
                    onClick={() => onPuestoSelect(vendedor.id)}
                  >
                    Seleccionar
                  </button>
                </div>
                <div className="sp-card-info">
                  <h3 className="sp-card-name">{vendedor.nombreCompleto}</h3>
                  <p className="sp-card-cat">{getCategoriaPrincipal(vendedor.categorias)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default SelectPuesto;
