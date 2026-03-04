import { useState, useEffect } from 'react';
import { api } from '../services/api';
import ProductForm from './ProductForm';
import OrderManagement from './OrderManagement';
import './AdminDashboard.css';

function AdminDashboard({ user: propUser, onLogout, onBackHome }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [user, setUser] = useState(propUser);
  const [activeTab, setActiveTab] = useState('productos'); // 'productos' o 'pedidos'

  useEffect(() => {
    if (!user) {
      const userData = api.getCurrentUser();
      setUser(userData);
    }
    loadProducts();
  }, [user]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getMyProducts();
      setProducts(data.products);
    } catch (error) {
      alert('Error al cargar productos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      await api.deleteProduct(id);
      alert('Producto eliminado correctamente');
      loadProducts();
    } catch (error) {
      alert('Error al eliminar: ' + error.message);
    }
  };

  const handleFormClose = (saved) => {
    setShowForm(false);
    setEditingProduct(null);
    if (saved) {
      loadProducts();
    }
  };

  const handleToggleDisponible = async (product) => {
    try {
      await api.updateProduct(product.id, {
        disponible: !product.disponible
      });
      loadProducts();
    } catch (error) {
      alert('Error al actualizar disponibilidad: ' + error.message);
    }
  };

  if (loading) {
    return <div className="admin-dashboard"><div className="loading">Cargando...</div></div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-nav">
        <button className="btn-back" onClick={onBackHome}>
          ← Volver al Inicio
        </button>
        <button className="btn-logout" onClick={onLogout}>
          Cerrar Sesión
        </button>
      </div>

      <div className="dashboard-header">
        <div>
          <h1>Panel de Control</h1>
          <p>Bienvenido, {user?.nombre} {user?.apellidos}</p>
        </div>
        {activeTab === 'productos' && (
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            + Nuevo Producto
          </button>
        )}
      </div>

      {/* Pestañas de navegación */}
      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'productos' ? 'active' : ''}`}
          onClick={() => setActiveTab('productos')}
        >
          📦 Productos
        </button>
        <button 
          className={`tab-button ${activeTab === 'pedidos' ? 'active' : ''}`}
          onClick={() => setActiveTab('pedidos')}
        >
          📋 Pedidos
        </button>
      </div>

      {/* Contenido según la pestaña activa */}
      {activeTab === 'productos' ? (
        <>
          <div className="dashboard-stats">
            <div className="stat-card">
              <h3>{products.length}</h3>
              <p>Productos totales</p>
            </div>
            <div className="stat-card">
              <h3>{products.filter(p => p.disponible).length}</h3>
              <p>Disponibles</p>
            </div>
            <div className="stat-card">
              <h3>{products.filter(p => !p.disponible).length}</h3>
              <p>No disponibles</p>
            </div>
          </div>

          {showForm && (
            <ProductForm
              product={editingProduct}
              onClose={handleFormClose}
            />
          )}

          <div className="products-table">
            <h2>Mis Productos</h2>
            {products.length === 0 ? (
              <div className="empty-state">
                <p>No tienes productos aún</p>
                <button className="btn-primary" onClick={() => setShowForm(true)}>
                  Crear primer producto
                </button>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Unidad</th>
                    <th>Stock</th>
                    <th>Categoría</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id}>
                      <td>
                        {product.imagen ? (
                          <img 
                            src={`http://localhost:3001${product.imagen}`} 
                            alt={product.nombre}
                            className="product-thumb"
                          />
                        ) : (
                          <div className="product-thumb no-image">Sin imagen</div>
                        )}
                      </td>
                      <td>{product.nombre}</td>
                      <td>{parseFloat(product.precio).toFixed(2)}€</td>
                      <td>{product.unidad}</td>
                      <td>{product.stock}</td>
                      <td>{product.categoria || '-'}</td>
                      <td>
                        <button 
                          className={`status-badge ${product.disponible ? 'available' : 'unavailable'}`}
                          onClick={() => handleToggleDisponible(product)}
                        >
                          {product.disponible ? 'Disponible' : 'No disponible'}
                        </button>
                      </td>
                      <td className="actions">
                        <button 
                          className="btn-edit" 
                          onClick={() => handleEdit(product)}
                        >
                          Editar
                        </button>
                        <button 
                          className="btn-delete" 
                          onClick={() => handleDelete(product.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      ) : (
        <OrderManagement />
      )}
    </div>
  );
}

export default AdminDashboard;
