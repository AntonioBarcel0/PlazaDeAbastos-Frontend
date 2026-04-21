import { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Spinner from './Spinner';
import { api } from '../services/api';
import './MisPedidos.css';

const ESTADO_LABEL = {
  pendiente:   'Pendiente',
  confirmado:  'Confirmado',
  preparando:  'Preparando',
  listo:       'Listo para recoger',
  entregado:   'Entregado',
  cancelado:   'Cancelado',
};

function MisPedidos({ user, onLogout, onDashboardClick, onHomeClick, onMarketplaceClick, onSelectPuestoClick, onCartClick, onOrdersClick }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPedidos();
  }, []);

  const loadPedidos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getMyPurchases();
      setPedidos(data.orders || []);
    } catch (err) {
      console.error('Error al cargar pedidos:', err);
      setError('No se pudieron cargar tus pedidos.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  };

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
      <div className="mp-container">
        <Header {...headerProps} />
        <Spinner message="Cargando tus pedidos..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mp-container">
        <Header {...headerProps} />
        <div className="error-container">
          <p>{error}</p>
          <button className="retry-btn" onClick={loadPedidos}>Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mp-container">
      <Header {...headerProps} />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onMarketplaceClick={onMarketplaceClick}
        onSelectPuestoClick={onSelectPuestoClick}
      />

      <main className="mp-main">
        <h1 className="mp-title">Mis pedidos</h1>

        {pedidos.length === 0 ? (
          <div className="mp-empty">
            <p>Aún no has realizado ningún pedido.</p>
            <button className="mp-empty-btn" onClick={onMarketplaceClick}>
              Explorar puestos
            </button>
          </div>
        ) : (
          <div className="mp-list">
            {pedidos.map(pedido => (
              <div key={pedido.id} className="mp-card">
                <div className="mp-card-header">
                  <div className="mp-card-vendor">
                    <span className="mp-vendor-name">
                      {pedido.vendedor.nombre} {pedido.vendedor.apellidos}
                    </span>
                    {pedido.vendedor.especialidad && (
                      <span className="mp-vendor-esp">{pedido.vendedor.especialidad}</span>
                    )}
                  </div>
                  <div className="mp-card-meta">
                    <span className="mp-date">{formatDate(pedido.createdAt)}</span>
                    <span className={`mp-badge mp-badge--${pedido.estado}`}>
                      {ESTADO_LABEL[pedido.estado] || pedido.estado}
                    </span>
                  </div>
                </div>

                <ul className="mp-items">
                  {pedido.items.map(item => (
                    <li key={item.id} className="mp-item">
                      <span className="mp-item-name">{item.nombreProducto}</span>
                      <span className="mp-item-qty">× {item.cantidad} {item.unidad}</span>
                      <span className="mp-item-price">
                        {parseFloat(item.subtotal).toFixed(2)}€
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mp-card-footer">
                  {pedido.notasVendedor && (
                    <p className="mp-vendor-note">
                      <strong>Nota del puesto:</strong> {pedido.notasVendedor}
                    </p>
                  )}
                  <span className="mp-total">Total: {parseFloat(pedido.total).toFixed(2)}€</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default MisPedidos;
