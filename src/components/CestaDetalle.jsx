import { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import './CestaDetalle.css';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace('/api', '');

const TIPO_LABELS = {
  frutas: 'Frutas',
  verduras: 'Verduras',
  mixta: 'Frutas & Verduras',
  comestibles: 'Comestibles',
};

const TIPO_DESC = {
  frutas: 'Cestas de frutas frescas de temporada, seleccionadas directamente de los puestos del mercado.',
  verduras: 'Cestas de verduras y hortalizas frescas, recién llegadas de productores locales.',
  mixta: 'La combinación perfecta de frutas y verduras de temporada en una sola cesta.',
  comestibles: 'Productos de despensa de calidad: aceites, conservas, legumbres, especias y más.',
};

function CestaDetalle({
  tipo,
  user, onLogout, onDashboardClick, onCartClick, onOrdersClick,
  onHomeClick, onPageClick, onMarketplaceClick, onSelectPuestoClick,
  onMapClick, onInstruccionesClick, onLoginClick, onBack,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cestas, setCestas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { cart, addCestaToCart, updateQuantity } = useCart();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await api.getCestas(tipo);
        setCestas(data.cestas || []);
      } catch {
        setCestas([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [tipo]);

  const handleAdd = (cesta) => {
    if (!user) {
      toast.error('Inicia sesión para añadir cestas al carrito');
      return;
    }
    addCestaToCart(cesta, cesta.vendedor);
    toast.success(`"${cesta.nombre}" añadida al carrito`);
  };

  return (
    <div className="cd-container">
      <Header
        onMenuClick={() => setSidebarOpen(s => !s)}
        onLogoClick={onHomeClick}
        onLoginClick={onLoginClick || (() => {})}
        user={user}
        onLogout={onLogout}
        onDashboardClick={onDashboardClick}
        onCartClick={onCartClick}
        onOrdersClick={onOrdersClick}
      />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onPageClick={onPageClick}
        onSelectPuestoClick={onSelectPuestoClick}
        onMapClick={onMapClick}
        onInstruccionesClick={onInstruccionesClick}
        user={user}
        onLoginClick={onLoginClick}
        onOrdersClick={onOrdersClick}
        onDashboardClick={onDashboardClick}
      />

      <main className="cd-main">
        <div className="cd-header-section">
          <button className="cd-back-btn" onClick={onBack}>
            ← Volver
          </button>
          <p className="cd-tipo-label">Cestas predefinidas</p>
          <h1 className="cd-title">{TIPO_LABELS[tipo] || tipo}</h1>
          <p className="cd-subtitle">{TIPO_DESC[tipo] || ''}</p>
        </div>

        <div className="cd-content">
          {loading ? (
            <p className="cd-empty"><span>Cargando cestas...</span></p>
          ) : cestas.length === 0 ? (
            <div className="cd-empty">
              <h2>Sin cestas disponibles</h2>
              <p>Ningún puesto tiene cestas de este tipo por el momento. Vuelve pronto.</p>
            </div>
          ) : (
            <div className="cd-grid">
              {cestas.map(cesta => {
                const cestaCartItem = cart.find(i => i.cestaId === cesta.id);
                return (
                  <article key={cesta.id} className="cd-card">
                    {/* Imagen */}
                    <div className="cd-card-image">
                      {cesta.imagen ? (
                        <img
                          src={cesta.imagen.startsWith('http') ? cesta.imagen : `${BASE_URL}${cesta.imagen}`}
                          alt={cesta.nombre}
                          className="cd-card-img"
                        />
                      ) : (
                        <div className="cd-card-img-placeholder">🧺</div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="cd-card-body">
                      <p className="cd-vendor">
                        {cesta.vendedor
                          ? `${cesta.vendedor.nombre} ${cesta.vendedor.apellidos}`
                          : 'Puesto del mercado'}
                      </p>
                      <h2 className="cd-card-name">{cesta.nombre}</h2>
                      {cesta.descripcion && (
                        <p className="cd-card-desc">{cesta.descripcion}</p>
                      )}
                      {cesta.items && cesta.items.length > 0 && (
                        <p className="cd-card-items">{cesta.items.join(' · ')}</p>
                      )}
                    </div>

                    {/* Footer: precio + botón */}
                    <div className="cd-card-footer">
                      <span className="cd-card-price">{parseFloat(cesta.precio).toFixed(2)} €</span>
                      {cestaCartItem ? (
                        <div className="cd-qty-control">
                          <button onClick={() => updateQuantity(cesta.id, cestaCartItem.cantidad - 1)}>−</button>
                          <span>{cestaCartItem.cantidad}</span>
                          <button onClick={() => updateQuantity(cesta.id, cestaCartItem.cantidad + 1)}>+</button>
                        </div>
                      ) : (
                        <button className="cd-add-btn" onClick={() => handleAdd(cesta)}>
                          Añadir
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default CestaDetalle;
