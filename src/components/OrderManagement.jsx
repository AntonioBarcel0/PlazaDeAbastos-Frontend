import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import './OrderManagement.css';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterEstado, setFilterEstado] = useState('todos');
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await api.getMyOrders();
      setOrders(response.orders);
      setError('');
    } catch (err) {
      setError(err.message || 'Error al cargar los pedidos');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (orderId) => {
    try {
      const response = await api.getOrderById(orderId);
      setSelectedOrder(response.order);
      setShowDetailsModal(true);
    } catch (err) {
      alert('Error al cargar detalles del pedido');
    }
  };

  const handleChangeStatus = async (orderId, newEstado) => {
    try {
      await api.updateOrderStatus(orderId, newEstado);
      loadOrders(); // Recargar lista
      alert('Estado actualizado correctamente');
    } catch (err) {
      alert('Error al actualizar el estado');
    }
  };

  const handleUpdateNotes = async (orderId, notas) => {
    try {
      await api.updateVendorNotes(orderId, notas);
      alert('Notas actualizadas correctamente');
    } catch (err) {
      alert('Error al actualizar las notas');
    }
  };

  const getEstadoBadgeClass = (estado) => {
    const classes = {
      'pendiente': 'badge-pendiente',
      'confirmado': 'badge-confirmado',
      'preparando': 'badge-preparando',
      'listo': 'badge-listo',
      'entregado': 'badge-entregado',
      'cancelado': 'badge-cancelado'
    };
    return classes[estado] || '';
  };

  const estadosLabels = {
    'pendiente': 'Pendiente',
    'confirmado': 'Confirmado',
    'preparando': 'Preparando',
    'listo': 'Listo para recoger',
    'entregado': 'Entregado',
    'cancelado': 'Cancelado'
  };

  const filteredOrders = filterEstado === 'todos' 
    ? orders 
    : orders.filter(order => order.estado === filterEstado);

  if (loading) {
    return <div className="loading">Cargando pedidos...</div>;
  }

  return (
    <div className="order-management">
      <div className="order-header">
        <h2>Gestión de Pedidos</h2>
        <button className="btn-refresh" onClick={loadOrders}>
          🔄 Actualizar
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="order-filters">
        <label>Filtrar por estado:</label>
        <select 
          value={filterEstado} 
          onChange={(e) => setFilterEstado(e.target.value)}
          className="filter-select"
        >
          <option value="todos">Todos</option>
          <option value="pendiente">Pendientes</option>
          <option value="confirmado">Confirmados</option>
          <option value="preparando">Preparando</option>
          <option value="listo">Listos</option>
          <option value="entregado">Entregados</option>
          <option value="cancelado">Cancelados</option>
        </select>
      </div>

      <div className="order-stats">
        <div className="stat-card">
          <h3>{orders.filter(o => o.estado === 'pendiente').length}</h3>
          <p>Pendientes</p>
        </div>
        <div className="stat-card">
          <h3>{orders.filter(o => o.estado === 'preparando').length}</h3>
          <p>Preparando</p>
        </div>
        <div className="stat-card">
          <h3>{orders.filter(o => o.estado === 'listo').length}</h3>
          <p>Listos</p>
        </div>
        <div className="stat-card">
          <h3>{orders.length}</h3>
          <p>Total</p>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="no-orders">
          <p>No hay pedidos {filterEstado !== 'todos' ? `en estado "${estadosLabels[filterEstado]}"` : ''}</p>
        </div>
      ) : (
        <div className="orders-table">
          <table>
            <thead>
              <tr>
                <th>Nº Pedido</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Items</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id.substring(0, 8)}</td>
                  <td>{order.clienteNombre}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString('es-ES')}</td>
                  <td>{order.totalItems} productos</td>
                  <td className="total">{parseFloat(order.total).toFixed(2)}€</td>
                  <td>
                    <select 
                      value={order.estado}
                      onChange={(e) => handleChangeStatus(order.id, e.target.value)}
                      className={`status-select ${getEstadoBadgeClass(order.estado)}`}
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="confirmado">Confirmado</option>
                      <option value="preparando">Preparando</option>
                      <option value="listo">Listo</option>
                      <option value="entregado">Entregado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </td>
                  <td>
                    <button 
                      className="btn-ver-detalles"
                      onClick={() => handleViewDetails(order.id)}
                    >
                      Ver Detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de detalles */}
      {showDetailsModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalles del Pedido #{selectedOrder.id.substring(0, 8)}</h2>
              <button className="btn-close" onClick={() => setShowDetailsModal(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="order-info-grid">
                <div className="info-section">
                  <h3>Información del Cliente</h3>
                  <p><strong>Nombre:</strong> {selectedOrder.cliente.nombre} {selectedOrder.cliente.apellidos}</p>
                  <p><strong>Email:</strong> {selectedOrder.cliente.email}</p>
                  <p><strong>Teléfono:</strong> {selectedOrder.telefonoContacto || selectedOrder.cliente.telefono}</p>
                  {selectedOrder.direccionEntrega && (
                    <p><strong>Dirección:</strong> {selectedOrder.direccionEntrega}</p>
                  )}
                </div>

                <div className="info-section">
                  <h3>Información del Pedido</h3>
                  <p><strong>Fecha:</strong> {new Date(selectedOrder.createdAt).toLocaleString('es-ES')}</p>
                  <p><strong>Estado:</strong> <span className={`badge ${getEstadoBadgeClass(selectedOrder.estado)}`}>{estadosLabels[selectedOrder.estado]}</span></p>
                  <p><strong>Total:</strong> <span className="total-price">{parseFloat(selectedOrder.total).toFixed(2)}€</span></p>
                  {selectedOrder.fechaEntrega && (
                    <p><strong>Fecha entrega:</strong> {new Date(selectedOrder.fechaEntrega).toLocaleDateString('es-ES')}</p>
                  )}
                </div>
              </div>

              {selectedOrder.notasCliente && (
                <div className="info-section">
                  <h3>Notas del Cliente</h3>
                  <p className="notas">{selectedOrder.notasCliente}</p>
                </div>
              )}

              <div className="info-section">
                <h3>Productos</h3>
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Precio Unit.</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map(item => (
                      <tr key={item.id}>
                        <td>{item.nombreProducto}</td>
                        <td>{item.cantidad} {item.unidad}</td>
                        <td>{parseFloat(item.precioUnitario).toFixed(2)}€</td>
                        <td>{parseFloat(item.subtotal).toFixed(2)}€</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3"><strong>TOTAL</strong></td>
                      <td><strong>{parseFloat(selectedOrder.total).toFixed(2)}€</strong></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="info-section">
                <h3>Notas del Vendedor</h3>
                <textarea 
                  className="vendor-notes"
                  defaultValue={selectedOrder.notasVendedor || ''}
                  placeholder="Añadir notas internas sobre el pedido..."
                  onBlur={(e) => handleUpdateNotes(selectedOrder.id, e.target.value)}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowDetailsModal(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
