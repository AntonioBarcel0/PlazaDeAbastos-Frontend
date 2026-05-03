import { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import ProductForm from './ProductForm';
import OrderManagement from './OrderManagement';
import './AdminDashboard.css';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace('/api', '');

function AdminDashboard({ user: propUser, onLogout, onBackHome }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [user, setUser] = useState(propUser);
  const [activeTab, setActiveTab] = useState('productos'); // 'productos' | 'pedidos' | 'cestas' | 'perfil'
  const [profileData, setProfileData] = useState({ especialidad: '', imagenPerfil: null });

  // Cestas predefinidas
  const [cestas, setCestas] = useState([]);
  const [cestasLoading, setCestasLoading] = useState(false);
  const [showCestaForm, setShowCestaForm] = useState(false);
  const [editingCesta, setEditingCesta] = useState(null);
  const [cestaForm, setCestaForm] = useState({ tipo: 'frutas', nombre: '', precio: '', descripcion: '', items: '' });
  const [profilePreview, setProfilePreview] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [profileSaving, setProfileSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      const userData = api.getCurrentUser();
      setUser(userData);
    }
    loadProducts();
  }, [user]);

  useEffect(() => {
    if (activeTab === 'cestas') loadCestas();
  }, [activeTab]);

  const loadCestas = async () => {
    try {
      setCestasLoading(true);
      const data = await api.getMisCestas();
      setCestas(data.cestas || []);
    } catch (err) {
      toast.error('Error al cargar cestas: ' + err.message);
    } finally {
      setCestasLoading(false);
    }
  };

  const openCestaForm = (cesta = null) => {
    setEditingCesta(cesta);
    setCestaForm(cesta ? {
      tipo: cesta.tipo,
      nombre: cesta.nombre,
      precio: String(cesta.precio),
      descripcion: cesta.descripcion || '',
      items: (cesta.items || []).join(', '),
    } : { tipo: 'frutas', nombre: '', precio: '', descripcion: '', items: '' });
    setShowCestaForm(true);
  };

  const handleCestaSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      tipo: cestaForm.tipo,
      nombre: cestaForm.nombre.trim(),
      precio: parseFloat(cestaForm.precio),
      descripcion: cestaForm.descripcion.trim() || null,
      items: cestaForm.items ? cestaForm.items.split(',').map(s => s.trim()).filter(Boolean) : [],
    };
    try {
      if (editingCesta) {
        await api.updateCesta(editingCesta.id, payload);
        toast.success('Cesta actualizada correctamente');
      } else {
        await api.createCesta(payload);
        toast.success('Cesta creada correctamente');
      }
      setShowCestaForm(false);
      setEditingCesta(null);
      loadCestas();
    } catch (err) {
      toast.error('Error: ' + err.message);
    }
  };

  const handleDeleteCesta = async (id) => {
    if (!confirm('¿Eliminar esta cesta?')) return;
    try {
      await api.deleteCesta(id);
      toast.success('Cesta eliminada');
      loadCestas();
    } catch (err) {
      toast.error('Error: ' + err.message);
    }
  };

  const handleToggleCestaActiva = async (cesta) => {
    try {
      await api.updateCesta(cesta.id, { activa: !cesta.activa });
      loadCestas();
    } catch (err) {
      toast.error('Error al actualizar: ' + err.message);
    }
  };

  useEffect(() => {
    if (activeTab === 'perfil' && user) {
      api.getVendedor(user.id)
        .then(data => {
          setProfileData({
            especialidad: data.vendedor.especialidad || '',
            imagenPerfil: data.vendedor.imagenPerfil || null,
          });
        })
        .catch(() => {});
    }
  }, [activeTab, user]);

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const handleProfileSave = async () => {
    setProfileSaving(true);
    try {
      const formData = new FormData();
      formData.append('especialidad', profileData.especialidad);
      if (profileFile) formData.append('imagenPerfil', profileFile);
      const result = await api.updateVendorProfile(formData);
      const stored = api.getCurrentUser();
      if (stored) {
        stored.especialidad = result.vendedor.especialidad;
        stored.imagenPerfil = result.vendedor.imagenPerfil;
        localStorage.setItem('user', JSON.stringify(stored));
        setUser({ ...user, ...result.vendedor });
      }
      setProfileData(prev => ({ ...prev, imagenPerfil: result.vendedor.imagenPerfil }));
      setProfileFile(null);
      setProfilePreview(null);
      toast.success('Perfil actualizado correctamente');
    } catch (err) {
      toast.error('Error al guardar: ' + err.message);
    } finally {
      setProfileSaving(false);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getMyProducts();
      setProducts(data.products);
    } catch (error) {
      toast.error('Error al cargar productos: ' + error.message);
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
      toast.success('Producto eliminado correctamente');
      loadProducts();
    } catch (error) {
      toast.error('Error al eliminar: ' + error.message);
    }
  };

  const handleFormClose = (saved) => {
    setShowForm(false);
    setEditingProduct(null);
    if (saved) loadProducts();
  };

  const handleToggleDisponible = async (product) => {
    try {
      await api.updateProduct(product.id, { disponible: !product.disponible });
      loadProducts();
    } catch (error) {
      toast.error('Error al actualizar disponibilidad: ' + error.message);
    }
  };

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

  if (loading) {
    return (
      <div className="admin-dashboard">
        <Header {...headerProps} />
        <div className="loading">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <Header {...headerProps} />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onMarketplaceClick={() => {}}
        onSelectPuestoClick={() => {}}
      />

      <main className="admin-main">
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
          {activeTab === 'cestas' && (
            <button className="btn-primary" onClick={() => openCestaForm()}>
              + Nueva Cesta
            </button>
          )}
        </div>

        <div className="dashboard-tabs">
          <button
            className={`tab-button ${activeTab === 'productos' ? 'active' : ''}`}
            onClick={() => setActiveTab('productos')}
          >
            Productos
          </button>
          <button
            className={`tab-button ${activeTab === 'pedidos' ? 'active' : ''}`}
            onClick={() => setActiveTab('pedidos')}
          >
            Pedidos
          </button>
          <button
            className={`tab-button ${activeTab === 'cestas' ? 'active' : ''}`}
            onClick={() => setActiveTab('cestas')}
          >
            Mis Cestas
          </button>
          <button
            className={`tab-button ${activeTab === 'perfil' ? 'active' : ''}`}
            onClick={() => setActiveTab('perfil')}
          >
            Mi Puesto
          </button>
        </div>

        {activeTab === 'perfil' && (
          <div className="profile-tab">
            <div className="profile-image-section">
              <div
                className="profile-image-wrapper"
                onClick={() => document.getElementById('profile-img-input').click()}
              >
                {profilePreview || profileData.imagenPerfil ? (
                  <img
                    src={profilePreview || `${BASE_URL}${profileData.imagenPerfil}`}
                    alt="Imagen del puesto"
                    className="profile-img"
                  />
                ) : (
                  <div className="profile-img-placeholder">🏪</div>
                )}
                <div className="profile-img-overlay">Cambiar imagen</div>
              </div>
              <input
                id="profile-img-input"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleProfileImageChange}
              />
              <p className="profile-img-hint">Haz clic en la imagen para cambiarla</p>
            </div>

            <div className="profile-fields">
              <div className="profile-field-group">
                <label>Especialidad del puesto</label>
                <input
                  type="text"
                  placeholder="Ej: Frutas y verduras, Comestibles..."
                  value={profileData.especialidad}
                  onChange={e => setProfileData(prev => ({ ...prev, especialidad: e.target.value }))}
                />
                <span className="profile-field-hint">
                  Aparece en tu tarjeta del marketplace y en la cabecera de tu puesto
                </span>
              </div>

              <button
                className="btn-save-profile"
                onClick={handleProfileSave}
                disabled={profileSaving}
              >
                {profileSaving ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'productos' && (
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
                <>
                  {/* Tabla para desktop */}
                  <table className="products-desktop-table">
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
                                src={`${BASE_URL}${product.imagen}`}
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
                          <td>{product.categoria || '—'}</td>
                          <td>
                            <button
                              className={`status-badge ${product.disponible ? 'available' : 'unavailable'}`}
                              onClick={() => handleToggleDisponible(product)}
                            >
                              {product.disponible ? 'Disponible' : 'No disponible'}
                            </button>
                          </td>
                          <td className="actions">
                            <button className="btn-edit" onClick={() => handleEdit(product)}>
                              Editar
                            </button>
                            <button className="btn-delete" onClick={() => handleDelete(product.id)}>
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Tarjetas para móvil */}
                  <div className="products-mobile-cards">
                    {products.map(product => (
                      <div className="product-card" key={product.id}>
                        <div className="product-card-header">
                          {product.imagen ? (
                            <img
                              src={`${BASE_URL}${product.imagen}`}
                              alt={product.nombre}
                              className="product-card-img"
                            />
                          ) : (
                            <div className="product-card-img no-image">Sin imagen</div>
                          )}
                          <div className="product-card-title">
                            <h3>{product.nombre}</h3>
                            <p className="product-card-category">{product.categoria || 'Sin categoría'}</p>
                          </div>
                        </div>
                        <div className="product-card-details">
                          <div className="product-card-detail">
                            <span className="detail-label">Precio</span>
                            <span className="detail-value">{parseFloat(product.precio).toFixed(2)}€/{product.unidad}</span>
                          </div>
                          <div className="product-card-detail">
                            <span className="detail-label">Stock</span>
                            <span className="detail-value">{product.stock}</span>
                          </div>
                        </div>
                        <div className="product-card-footer">
                          <button
                            className={`status-badge ${product.disponible ? 'available' : 'unavailable'}`}
                            onClick={() => handleToggleDisponible(product)}
                          >
                            {product.disponible ? 'Disponible' : 'No disponible'}
                          </button>
                          <div className="product-card-actions">
                            <button className="btn-edit" onClick={() => handleEdit(product)}>Editar</button>
                            <button className="btn-delete" onClick={() => handleDelete(product.id)}>Eliminar</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {activeTab === 'cestas' && (
          <div className="products-table">
            <h2>Mis Cestas Predefinidas</h2>

            {showCestaForm && (
              <form className="cesta-form" onSubmit={handleCestaSubmit}>
                <h3>{editingCesta ? 'Editar cesta' : 'Nueva cesta'}</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Tipo</label>
                    <select
                      value={cestaForm.tipo}
                      onChange={e => setCestaForm(p => ({ ...p, tipo: e.target.value }))}
                    >
                      <option value="frutas">Frutas</option>
                      <option value="verduras">Verduras</option>
                      <option value="mixta">Frutas &amp; Verduras</option>
                      <option value="comestibles">Comestibles</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Nombre</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Cesta de temporada"
                      value={cestaForm.nombre}
                      onChange={e => setCestaForm(p => ({ ...p, nombre: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Precio (€)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={cestaForm.precio}
                      onChange={e => setCestaForm(p => ({ ...p, precio: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Descripción</label>
                  <textarea
                    rows={2}
                    placeholder="Breve descripción de la cesta..."
                    value={cestaForm.descripcion}
                    onChange={e => setCestaForm(p => ({ ...p, descripcion: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>Contenido (separado por comas)</label>
                  <input
                    type="text"
                    placeholder="Ej: Manzana, Naranja, Pera, Kiwi"
                    value={cestaForm.items}
                    onChange={e => setCestaForm(p => ({ ...p, items: e.target.value }))}
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    {editingCesta ? 'Guardar cambios' : 'Crear cesta'}
                  </button>
                  <button type="button" className="btn-cancel" onClick={() => { setShowCestaForm(false); setEditingCesta(null); }}>
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            {cestasLoading ? (
              <p>Cargando cestas...</p>
            ) : cestas.length === 0 ? (
              <div className="empty-state">
                <p>No tienes cestas predefinidas aún</p>
                <button className="btn-primary" onClick={() => openCestaForm()}>
                  Crear primera cesta
                </button>
              </div>
            ) : (
              <div className="products-mobile-cards">
                {cestas.map(cesta => (
                  <div className="product-card" key={cesta.id}>
                    <div className="product-card-header">
                      <div className="product-card-title">
                        <h3>{cesta.nombre}</h3>
                        <p className="product-card-category">{cesta.tipo}</p>
                      </div>
                    </div>
                    {cesta.descripcion && (
                      <p style={{ padding: '0 1rem', color: '#555', fontSize: '0.92rem' }}>{cesta.descripcion}</p>
                    )}
                    {cesta.items && cesta.items.length > 0 && (
                      <p style={{ padding: '0 1rem 0.5rem', color: '#8b2332', fontSize: '0.88rem' }}>
                        {cesta.items.join(' · ')}
                      </p>
                    )}
                    <div className="product-card-footer">
                      <span style={{ fontFamily: "'Alfa Slab One', serif", color: '#8b2332', fontSize: '1.3rem' }}>
                        {parseFloat(cesta.precio).toFixed(2)} €
                      </span>
                      <button
                        className={`status-badge ${cesta.activa ? 'available' : 'unavailable'}`}
                        onClick={() => handleToggleCestaActiva(cesta)}
                      >
                        {cesta.activa ? 'Activa' : 'Inactiva'}
                      </button>
                      <div className="product-card-actions">
                        <button className="btn-edit" onClick={() => openCestaForm(cesta)}>Editar</button>
                        <button className="btn-delete" onClick={() => handleDeleteCesta(cesta.id)}>Eliminar</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'pedidos' && <OrderManagement />}
      </main>
    </div>
  );
}

export default AdminDashboard;
