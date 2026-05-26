import { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { api, BASE_URL } from '../services/api';
import toast from 'react-hot-toast';
import ProductForm from './ProductForm';
import OrderManagement from './OrderManagement';
import './AdminDashboard.css';


function AdminDashboard({ user: propUser, onLogout, onBackHome, onSelectPuestoClick, onMapClick, onInstruccionesClick, onPageClick, onCartClick, onOrdersClick, onLoginClick }) {
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
  const [cestaImageFile, setCestaImageFile] = useState(null);
  const [cestaImagePreview, setCestaImagePreview] = useState(null);
  const [cestaSubmitting, setCestaSubmitting] = useState(false);
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
    } catch {
      toast.error('No se pudieron cargar las cestas');
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
    setCestaImageFile(null);
    setCestaImagePreview(null);
    setShowCestaForm(true);
  };

  const handleCestaSubmit = async (e) => {
    e.preventDefault();
    if (cestaSubmitting) return;
    const payload = {
      tipo: cestaForm.tipo,
      nombre: cestaForm.nombre.trim(),
      precio: parseFloat(cestaForm.precio),
      descripcion: cestaForm.descripcion.trim() || null,
      items: cestaForm.items ? cestaForm.items.split(',').map(s => s.trim()).filter(Boolean) : [],
      imagenFile: cestaImageFile || undefined,
    };
    setCestaSubmitting(true);
    try {
      if (editingCesta) {
        const result = await api.updateCesta(editingCesta.id, payload);
        setCestas(prev => prev.map(c => c.id === editingCesta.id ? result.cesta : c));
        toast.success('Cesta actualizada correctamente');
      } else {
        const result = await api.createCesta(payload);
        setCestas(prev => [result.cesta, ...prev]);
        toast.success('Cesta creada correctamente');
      }
      setShowCestaForm(false);
      setEditingCesta(null);
      loadCestas();
    } catch (err) {
      toast.error(err.message || 'No se pudo guardar la cesta');
    } finally {
      setCestaSubmitting(false);
    }
  };

  const handleDeleteCesta = async (id) => {
    if (!confirm('¿Eliminar esta cesta?')) return;
    try {
      await api.deleteCesta(id);
      toast.success('Cesta eliminada');
      loadCestas();
    } catch (err) {
      toast.error(err.message || 'No se pudo eliminar la cesta');
    }
  };

  const handleToggleCestaActiva = async (cesta) => {
    try {
      await api.updateCesta(cesta.id, { activa: !cesta.activa });
      loadCestas();
    } catch {
      toast.error('No se pudo cambiar el estado de la cesta');
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
      toast.error(err.message || 'No se pudo guardar el perfil');
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
      toast.error('No se pudieron cargar los productos');
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
      toast.error(error.message || 'No se pudo eliminar el producto');
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
      toast.error(error.message || 'No se pudo cambiar la disponibilidad');
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
        onSelectPuestoClick={onSelectPuestoClick}
        onMapClick={onMapClick}
        onInstruccionesClick={onInstruccionesClick}
        onPageClick={onPageClick}
        user={user}
        onLoginClick={onLoginClick}
        onOrdersClick={onOrdersClick}
        onDashboardClick={() => {}}
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
                    src={profilePreview || (profileData.imagenPerfil?.startsWith('http') ? profileData.imagenPerfil : `${BASE_URL}${profileData.imagenPerfil}`)}
                    alt="Imagen del puesto"
                    className="profile-img"
                  />
                ) : (
                  <div className="profile-img-placeholder"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#8b2332" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"/></svg></div>
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
                                src={product.imagen.startsWith('http') ? product.imagen : `${BASE_URL}${product.imagen}`}
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
                              src={product.imagen.startsWith('http') ? product.imagen : `${BASE_URL}${product.imagen}`}
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
                      type="text"
                      inputMode="decimal"
                      required
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
                <div className="form-group">
                  <label>Imagen de la cesta</label>
                  <div className="cesta-img-upload">
                    {(cestaImagePreview || (editingCesta?.imagen)) && (
                      <img
                        src={cestaImagePreview || (editingCesta.imagen.startsWith('http') ? editingCesta.imagen : `${BASE_URL}${editingCesta.imagen}`)}
                        alt="Preview"
                        className="cesta-img-preview"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files[0];
                        if (!file) return;
                        setCestaImageFile(file);
                        setCestaImagePreview(URL.createObjectURL(file));
                      }}
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary" disabled={cestaSubmitting}>
                    {cestaSubmitting ? 'Guardando...' : editingCesta ? 'Guardar cambios' : 'Crear cesta'}
                  </button>
                  <button type="button" className="btn-cancel" disabled={cestaSubmitting} onClick={() => { setShowCestaForm(false); setEditingCesta(null); }}>
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
              <div className="cestas-list">
                {cestas.map(cesta => (
                  <div className="cesta-card" key={cesta.id}>
                    {cesta.imagen && (
                      <img
                        src={cesta.imagen.startsWith('http') ? cesta.imagen : `${BASE_URL}${cesta.imagen}`}
                        alt={cesta.nombre}
                        className="cesta-card-img"
                      />
                    )}
                    <div className="product-card-header">
                      <div className="product-card-title">
                        <h3>{cesta.nombre}</h3>
                        <p className="product-card-category">{cesta.tipo}</p>
                      </div>
                    </div>
                    {cesta.descripcion && (
                      <p className="cesta-card-desc">{cesta.descripcion}</p>
                    )}
                    {cesta.items && cesta.items.length > 0 && (
                      <p className="cesta-card-items">
                        {cesta.items.join(' · ')}
                      </p>
                    )}
                    <div className="product-card-footer">
                      <span className="cesta-card-price">
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
