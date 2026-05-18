import { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Spinner from './Spinner';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import './ClientProfile.css';

function ClientProfile({ user, onLogout, onDashboardClick, onHomeClick, onMarketplaceClick, onSelectPuestoClick, onCartClick, onOrdersClick, onMapClick, onInstruccionesClick, onPageClick, onLoginClick, onUserUpdate }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ nombre: '', apellidos: '', telefono: '', direccion: '' });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await api.getProfile();
      const u = data.user;
      setForm({
        nombre: u.nombre || '',
        apellidos: u.apellidos || '',
        telefono: u.telefono || '',
        direccion: u.direccion || '',
      });
    } catch (err) {
      console.error('Error al cargar perfil:', err);
      toast.error('No se pudo cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.apellidos.trim()) {
      toast.error('Nombre y apellidos son obligatorios');
      return;
    }
    try {
      setSaving(true);
      const data = await api.updateProfile(form);
      toast.success('Perfil actualizado');
      if (onUserUpdate && data.user) onUserUpdate(data.user);
    } catch (err) {
      toast.error(err.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const headerProps = {
    onMenuClick: () => setSidebarOpen(s => !s),
    onLoginClick,
    onLogoClick: onHomeClick,
    user,
    onLogout,
    onDashboardClick,
    onCartClick,
    onOrdersClick,
  };

  return (
    <div className="cp-container">
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

      <main className="cp-main">
        <h1 className="cp-title">Mi perfil</h1>

        {loading ? (
          <Spinner message="Cargando perfil..." />
        ) : (
          <form className="cp-form" onSubmit={handleSubmit}>
            <div className="cp-field">
              <label className="cp-label" htmlFor="cp-email">Email</label>
              <input
                id="cp-email"
                className="cp-input cp-input--disabled"
                type="email"
                value={user?.email || ''}
                disabled
              />
              <span className="cp-hint">El email no se puede modificar</span>
            </div>

            <div className="cp-row">
              <div className="cp-field">
                <label className="cp-label" htmlFor="cp-nombre">Nombre</label>
                <input
                  id="cp-nombre"
                  className="cp-input"
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="cp-field">
                <label className="cp-label" htmlFor="cp-apellidos">Apellidos</label>
                <input
                  id="cp-apellidos"
                  className="cp-input"
                  type="text"
                  name="apellidos"
                  value={form.apellidos}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="cp-field">
              <label className="cp-label" htmlFor="cp-telefono">Teléfono</label>
              <input
                id="cp-telefono"
                className="cp-input"
                type="tel"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                placeholder="Ej: 600 123 456"
              />
            </div>

            <div className="cp-field">
              <label className="cp-label" htmlFor="cp-direccion">Dirección</label>
              <textarea
                id="cp-direccion"
                className="cp-input cp-textarea"
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
                rows={3}
                placeholder="Dirección de entrega por defecto"
              />
            </div>

            <button className="cp-save-btn" type="submit" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}

export default ClientProfile;
