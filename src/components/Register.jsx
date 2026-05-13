import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './Register.css';
import { api } from '../services/api';

const PHONE_RE = /^[+\d][\d\s\-().]{6,19}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateFields(f) {
  const errors = {};
  if (!f.nombre.trim() || f.nombre.trim().length < 2)
    errors.nombre = 'El nombre debe tener al menos 2 caracteres';
  if (!f.apellidos.trim() || f.apellidos.trim().length < 2)
    errors.apellidos = 'Los apellidos deben tener al menos 2 caracteres';
  if (!f.email.trim())
    errors.email = 'El correo es obligatorio';
  else if (!EMAIL_RE.test(f.email))
    errors.email = 'Introduce un correo válido';
  if (!f.telefono.trim())
    errors.telefono = 'El teléfono es obligatorio';
  else if (!PHONE_RE.test(f.telefono.trim()))
    errors.telefono = 'Introduce un teléfono válido';
  if (!f.direccion.trim() || f.direccion.trim().length < 3)
    errors.direccion = 'La dirección debe tener al menos 3 caracteres';
  if (!f.password)
    errors.password = 'La contraseña es obligatoria';
  else if (f.password.length < 6)
    errors.password = 'Mínimo 6 caracteres';
  if (!f.confirmPassword)
    errors.confirmPassword = 'Confirma la contraseña';
  else if (f.password !== f.confirmPassword)
    errors.confirmPassword = 'Las contraseñas no coinciden';
  return errors;
}

const FIELDS = ['nombre', 'apellidos', 'email', 'telefono', 'direccion', 'password', 'confirmPassword'];
const initialTouched = Object.fromEntries(FIELDS.map(f => [f, false]));

function Register({ onBack, onSwitchToLogin, onLogoClick, onLoginSuccess, onSelectPuestoClick, onMapClick, onInstruccionesClick, onPageClick, onOrdersClick, onDashboardClick, user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '', apellidos: '', email: '', telefono: '',
    direccion: '', role: 'cliente', password: '', confirmPassword: '',
  });
  const [touched, setTouched] = useState(initialTouched);
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const errors = validateFields(formData);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setServerError('');
  };

  const handleBlur = (field) => setTouched(prev => ({ ...prev, [field]: true }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(Object.fromEntries(FIELDS.map(f => [f, true])));
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      const { confirmPassword, ...dataToSend } = formData;
      const response = await api.register(dataToSend);
      if (onLoginSuccess) onLoginSuccess(response.user);
      else onLogoClick();
    } catch (err) {
      setServerError(err.message || 'Error al registrarse. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const field = (name, type, placeholder) => (
    <div className="register-field">
      <input
        type={type}
        name={name}
        className={`register-input${touched[name] && errors[name] ? ' register-input--error' : ''}`}
        placeholder={placeholder}
        value={formData[name]}
        onChange={handleChange}
        onBlur={() => handleBlur(name)}
        disabled={loading}
        autoComplete={name === 'confirmPassword' ? 'new-password' : name === 'password' ? 'new-password' : name}
      />
      {touched[name] && errors[name] && (
        <p className="field-error">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <>
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} onLoginClick={onBack} onLogoClick={onLogoClick} />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelectPuestoClick={onSelectPuestoClick}
        onMapClick={onMapClick}
        onInstruccionesClick={onInstruccionesClick}
        onPageClick={onPageClick}
        onOrdersClick={onOrdersClick}
        onDashboardClick={onDashboardClick}
        user={user}
      />
      <div className="register-page">
        <div className="register-container">
          <h1 className="register-title">Plaza de Abastos</h1>

          <form className="register-form" onSubmit={handleSubmit} noValidate>
            {serverError && <p className="form-error-banner">{serverError}</p>}

            {field('nombre', 'text', 'Nombre')}
            {field('apellidos', 'text', 'Apellidos')}
            {field('email', 'email', 'Correo electrónico')}
            {field('telefono', 'tel', 'Teléfono')}
            {field('direccion', 'text', 'Dirección')}

            <div className="register-field">
              <select
                name="role"
                className="register-input"
                value={formData.role}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="cliente">Cliente</option>
                <option value="comerciante">Comerciante / Vendedor</option>
              </select>
            </div>

            {field('password', 'password', 'Contraseña')}
            {field('confirmPassword', 'password', 'Confirmar contraseña')}

            <button type="submit" className="register-button" disabled={loading}>
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>

            <button
              type="button"
              className="register-link-button"
              onClick={onSwitchToLogin}
              disabled={loading}
            >
              ¿Ya tienes cuenta? Inicia sesión
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
