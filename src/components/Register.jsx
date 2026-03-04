import { useState } from 'react';
import Header from './Header';
import './Register.css';
import { api } from '../services/api';

function Register({ onBack, onSwitchToLogin, onMenuClick, onLogoClick, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    direccion: '',
    role: 'cliente',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Limpiar error al escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validación de contraseñas
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      // Enviar datos al backend (sin confirmPassword)
      const { confirmPassword, ...dataToSend } = formData;

      const response = await api.register(dataToSend);

      setSuccess(true);

      // Redirigir al inicio después de 2 segundos
      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess(response.user);
        } else {
          onLogoClick(); // Volver a home
        }
      }, 2000);

    } catch (error) {
      setError(error.message || 'Error al registrarse. Intenta de nuevo.');
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
      <div className="register-page">
        <div className="register-container">
          <h1 className="register-title">Plaza de Abastos</h1>

          {error && (
            <div style={{
              backgroundColor: '#ff4444',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '8px',
              marginBottom: '20px',
              textAlign: 'center'
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
              textAlign: 'center'
            }}>
              ✅ ¡Registro exitoso! Redirigiendo...
            </div>
          )}

          <form className="register-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="nombre"
              className="register-input"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <input
              type="text"
              name="apellidos"
              className="register-input"
              placeholder="Apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <input
              type="email"
              name="email"
              className="register-input"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <input
              type="tel"
              name="telefono"
              className="register-input"
              placeholder="Teléfono"
              value={formData.telefono}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <input
              type="text"
              name="direccion"
              className="register-input"
              placeholder="Dirección"
              value={formData.direccion}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <select
              name="role"
              className="register-input"
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="cliente">Cliente</option>
              <option value="comerciante">Comerciante/Vendedor</option>
            </select>

            <input
              type="password"
              name="password"
              className="register-input"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <input
              type="password"
              name="confirmPassword"
              className="register-input"
              placeholder="Confirmar contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <button 
              type="submit" 
              className="register-button"
              disabled={loading}
            >
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