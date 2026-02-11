import { useState } from 'react';
import Header from './Header';
import './Login.css';
import { api, auth } from '../services/api';

function Login({ onSwitchToRegister, onBack, onMenuClick, onLogoClick }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.login({ email, password });

      // Guardar token y usuario
      auth.setToken(response.token);
      auth.setUser(response.user);

      setSuccess(true);

      // Redirigir al inicio después de 1 segundo
      setTimeout(() => {
        onLogoClick(); // Volver a home
      }, 1000);

    } catch (error) {
      setError(error.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header 
        onMenuClick={onMenuClick} 
        onLoginClick={onBack}
        onLogoClick={onLogoClick}
      />
      <div className="login-page">
        <div className="login-container">
          <h1 className="login-title">Plaza de Abastos</h1>

          {error && (
            <div style={{
              backgroundColor: '#ff4444',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '8px',
              marginBottom: '20px',
              textAlign: 'center',
              maxWidth: '400px'
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              backgroundColor: '#00C851',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '8px',
              marginBottom: '20px',
              textAlign: 'center',
              maxWidth: '400px'
            }}>
              ✅ ¡Login exitoso! Redirigiendo...
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <input
              type="email"
              className="login-input"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />

            <input
              type="password"
              className="login-input"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />

            <button 
              type="submit" 
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Enviar'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;