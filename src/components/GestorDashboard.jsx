import { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Spinner from './Spinner';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import './GestorDashboard.css';

const ESTADO_LABEL = {
  pendiente:  'Pendiente',
  confirmado: 'Confirmado',
  preparando: 'Preparando',
  listo:      'Listo',
  entregado:  'Entregado',
  cancelado:  'Cancelado',
};

const MODO_TABS = [
  { value: 'todos',     label: 'Todos' },
  { value: 'domicilio', label: 'Domicilio' },
  { value: 'recogida',  label: 'Recogida' },
];

const ESTADO_FILTER = [
  { value: 'todos',     label: 'Todos los estados' },
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'confirmado','label': 'Confirmado' },
  { value: 'preparando', label: 'Preparando' },
  { value: 'listo',     label: 'Listo' },
  { value: 'entregado', label: 'Entregado' },
  { value: 'cancelado', label: 'Cancelado' },
];

function GestorDashboard({ user, onLogout, onBackHome, onSelectPuestoClick, onMapClick, onInstruccionesClick, onPageClick, onCartClick, onOrdersClick, onLoginClick }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modoTab, setModoTab] = useState('todos');
  const [estadoFilter, setEstadoFilter] = useState('todos');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [delivering, setDelivering] = useState(false);

  useEffect(() => {
    loadData();
  }, [modoTab, estadoFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (modoTab !== 'todos') filters.modoEntrega = modoTab;
      if (estadoFilter !== 'todos') filters.estado = estadoFilter;

      const [ordersRes, statsRes] = await Promise.all([
        api.getAllOrders(filters),
        api.getGestorStats()
      ]);

      setOrders(ordersRes.orders || []);
      setStats(statsRes.stats);
    } catch (err) {
      toast.error('Error al cargar los pedidos');
    } finally {
      setLoading(false);
    }
  };

  const handleDeliver = async (orderId) => {
    setDelivering(true);
    try {
      await api.deliverOrder(orderId);
      toast.success('Pedido marcado como entregado');
      setSelectedOrder(null);
      loadData();
    } catch (err) {
      toast.error(err.message || 'Error al marcar como entregado');
    } finally {
      setDelivering(false);
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });

  const formatDateTime = (dateStr) =>
    new Date(dateStr).toLocaleString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

  const headerProps = {
    onMenuClick: () => setSidebarOpen(!sidebarOpen),
    onLoginClick: () => {},
    onLogoClick: onBackHome,
    user,
    onLogout,
    onDashboardClick: () => {},
    onCartClick: () => {},
    onOrdersClick: () => {},
  };

  return (
    <div className="gd-container">
      <Header {...headerProps} />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelectPuestoClick={onSelectPuestoClick}
        onMapClick={onMapClick}
        onInstruccionesClick={onInstruccionesClick}
        onPageClick={onPageClick}
        user={user}
        onLoginClick={onLoginClick}
        onOrdersClick={onOrdersClick}
        onDashboardClick={() => {}}
      />

      <main className="gd-main">
        {/* Cabecera */}
        <div className="gd-page-header">
          <div>
            <h1 className="gd-title">Gestión de Reparto</h1>
            <p className="gd-subtitle">Plaza de Abastos — panel del gestor</p>
          </div>
          <button className="gd-btn-refresh" onClick={loadData}>
            Actualizar
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="gd-stats">
            <div className="gd-stat-card gd-stat-card--accent">
              <span className="gd-stat-num">{stats.listoParaEntregar}</span>
              <span className="gd-stat-label">Listos para entregar</span>
            </div>
            <div className="gd-stat-card">
              <span className="gd-stat-num">{stats.domicilioPendiente}</span>
              <span className="gd-stat-label">Domicilios pendientes</span>
            </div>
            <div className="gd-stat-card">
              <span className="gd-stat-num">{stats.recogidaPendiente}</span>
              <span className="gd-stat-label">Recogidas pendientes</span>
            </div>
            <div className="gd-stat-card">
              <span className="gd-stat-num">{stats.entregadosHoy}</span>
              <span className="gd-stat-label">Entregados hoy</span>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="gd-filters">
          <div className="gd-tabs">
            {MODO_TABS.map(t => (
              <button
                key={t.value}
                className={`gd-tab ${modoTab === t.value ? 'active' : ''}`}
                onClick={() => setModoTab(t.value)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <select
            className="gd-select"
            value={estadoFilter}
            onChange={e => setEstadoFilter(e.target.value)}
          >
            {ESTADO_FILTER.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Tabla de pedidos */}
        {loading ? (
          <Spinner message="Cargando pedidos..." />
        ) : orders.length === 0 ? (
          <div className="gd-empty">
            No hay pedidos con los filtros seleccionados.
          </div>
        ) : (
          <div className="gd-table-wrapper">
            <table className="gd-table">
              <thead>
                <tr>
                  <th>Ref.</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Modo</th>
                  <th>Dirección</th>
                  <th>Puestos</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td className="gd-ref">#{order.id.substring(0, 8)}</td>
                    <td>
                      <span className="gd-client-name">
                        {order.cliente.nombre} {order.cliente.apellidos}
                      </span>
                      {order.telefonoContacto && (
                        <span className="gd-client-phone">{order.telefonoContacto}</span>
                      )}
                    </td>
                    <td className="gd-date">{formatDate(order.createdAt)}</td>
                    <td>
                      <span className={`gd-modo-badge ${order.modoEntrega}`}>
                        {order.modoEntrega === 'domicilio' ? 'Domicilio' : 'Recogida'}
                      </span>
                    </td>
                    <td className="gd-address">
                      {order.modoEntrega === 'domicilio'
                        ? (order.direccionEntrega || '—')
                        : <span className="gd-text-muted">En el mercado</span>}
                    </td>
                    <td className="gd-center">{order.subOrders?.length || 0}</td>
                    <td className="gd-total">{parseFloat(order.total).toFixed(2)}€</td>
                    <td>
                      <span className={`gd-estado-badge gd-estado--${order.estado}`}>
                        {ESTADO_LABEL[order.estado]}
                      </span>
                    </td>
                    <td>
                      <div className="gd-actions">
                        <button
                          className="gd-btn-detail"
                          onClick={() => setSelectedOrder(order)}
                        >
                          Ver
                        </button>
                        {order.estado === 'listo' && (
                          <button
                            className="gd-btn-deliver"
                            onClick={() => handleDeliver(order.id)}
                            disabled={delivering}
                          >
                            Entregar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Modal de detalle */}
      {selectedOrder && (
        <div className="gd-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="gd-modal" onClick={e => e.stopPropagation()}>
            <div className="gd-modal-header">
              <h2>Pedido #{selectedOrder.id.substring(0, 8)}</h2>
              <button className="gd-modal-close" onClick={() => setSelectedOrder(null)}>✕</button>
            </div>

            <div className="gd-modal-body">
              {/* Info grid */}
              <div className="gd-modal-grid">
                <div className="gd-info-section">
                  <h3>Cliente</h3>
                  <p><strong>Nombre:</strong> {selectedOrder.cliente.nombre} {selectedOrder.cliente.apellidos}</p>
                  <p><strong>Email:</strong> {selectedOrder.cliente.email}</p>
                  {selectedOrder.telefonoContacto && (
                    <p><strong>Teléfono:</strong> {selectedOrder.telefonoContacto}</p>
                  )}
                  {selectedOrder.direccionEntrega && (
                    <p><strong>Dirección entrega:</strong> {selectedOrder.direccionEntrega}</p>
                  )}
                  {selectedOrder.notasCliente && (
                    <p><strong>Notas:</strong> {selectedOrder.notasCliente}</p>
                  )}
                </div>

                <div className="gd-info-section">
                  <h3>Pedido</h3>
                  <p><strong>Fecha:</strong> {formatDateTime(selectedOrder.createdAt)}</p>
                  <p>
                    <strong>Modo:</strong>{' '}
                    {selectedOrder.modoEntrega === 'domicilio' ? 'Entrega a domicilio' : 'Recogida en el mercado'}
                  </p>
                  <p>
                    <strong>Estado:</strong>{' '}
                    <span className={`gd-estado-badge gd-estado--${selectedOrder.estado}`}>
                      {ESTADO_LABEL[selectedOrder.estado]}
                    </span>
                  </p>
                  <p><strong>Total:</strong> <span className="gd-modal-total">{parseFloat(selectedOrder.total).toFixed(2)}€</span></p>
                </div>
              </div>

              {/* Sub-pedidos por puesto */}
              <div className="gd-info-section">
                <h3>Puestos incluidos</h3>
                {(selectedOrder.subOrders || []).map(sub => (
                  <div key={sub.id} className="gd-sub-block">
                    <div className="gd-sub-header">
                      <span className="gd-sub-vendor">
                        {sub.vendedor.nombre} {sub.vendedor.apellidos}
                        {sub.vendedor.especialidad && (
                          <span className="gd-sub-esp"> — {sub.vendedor.especialidad}</span>
                        )}
                      </span>
                      <span className={`gd-estado-badge gd-estado--${sub.estado}`}>
                        {ESTADO_LABEL[sub.estado]}
                      </span>
                    </div>
                    <ul className="gd-sub-items">
                      {(sub.items || []).map(item => (
                        <li key={item.id}>
                          <span>{item.nombreProducto}</span>
                          <span className="gd-item-qty">
                            {item.unidad === 'kg'
                              ? (item.cantidad >= 1000
                                  ? `${(item.cantidad / 1000).toFixed(item.cantidad % 1000 === 0 ? 0 : 1)} kg`
                                  : `${item.cantidad} g`)
                              : `${item.cantidad} ${item.unidad}`}
                          </span>
                          <span className="gd-item-price">{parseFloat(item.subtotal).toFixed(2)}€</span>
                        </li>
                      ))}
                    </ul>
                    <div className="gd-sub-subtotal">
                      Subtotal puesto: {parseFloat(sub.subtotal).toFixed(2)}€
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="gd-modal-footer">
              {selectedOrder.estado === 'listo' && (
                <button
                  className="gd-btn-deliver-modal"
                  onClick={() => handleDeliver(selectedOrder.id)}
                  disabled={delivering}
                >
                  {delivering ? 'Procesando...' : 'Marcar como entregado'}
                </button>
              )}
              <button className="gd-btn-cancel" onClick={() => setSelectedOrder(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestorDashboard;
