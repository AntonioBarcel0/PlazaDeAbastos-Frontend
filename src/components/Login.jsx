import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './Login.css';
import { api } from '../services/api';

function validateFields(email, password) {
  const errors = {};
  if (!email.trim()) {
    errors.email = 'El correo es obligatorio';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Introduce un correo válido';
  }
  if (!password) {
    errors.password = 'La contraseña es obligatoria';
  }
  return errors;
}

function Login({ onBack, onLogoClick, onLoginSuccess, onSelectPuestoClick, onMapClick, onInstruccionesClick, onPageClick, onOrdersClick, onDashboardClick, user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const errors = validateFields(email, password);

  const handleBlur = (field) => setTouched(prev => ({ ...prev, [field]: true }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (Object.keys(errors).length > 0) return;

    setServerError('');
    setLoading(true);
    try {
      const response = await api.login({ email, password });
      if (onLoginSuccess) onLoginSuccess(response.user);
      else onLogoClick();
    } catch (err) {
      setServerError(err.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

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
      <div className="login-page">
        <div className="login-container">
          <h1 className="login-title">Plaza de Abastos</h1>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {serverError && <p className="form-error-banner">{serverError}</p>}

            <div className="login-field">
              <input
                type="email"
                className={`login-input${touched.email && errors.email ? ' login-input--error' : ''}`}
                placeholder="Correo electrónico"
                value={email}
                onChange={e => { setEmail(e.target.value); setServerError(''); }}
                onBlur={() => handleBlur('email')}
                disabled={loading}
                autoComplete="email"
              />
              {touched.email && errors.email && (
                <p className="field-error">{errors.email}</p>
              )}
            </div>

            <div className="login-field">
              <input
                type="password"
                className={`login-input${touched.password && errors.password ? ' login-input--error' : ''}`}
                placeholder="Contraseña"
                value={password}
                onChange={e => { setPassword(e.target.value); setServerError(''); }}
                onBlur={() => handleBlur('password')}
                disabled={loading}
                autoComplete="current-password"
              />
              {touched.password && errors.password && (
                <p className="field-error">{errors.password}</p>
              )}
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Iniciando sesión...' : 'Enviar'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
