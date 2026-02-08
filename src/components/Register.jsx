import { useState } from 'react';
import Header from './Header';
import './Register.css';

function Register({ onBack, onSwitchToLogin, onMenuClick, onLogoClick }) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    direccion: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación simple de contraseñas
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    // Aquí irá la lógica de registro
    console.log('Registro:', formData);
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

          <form className="register-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="nombre"
              className="register-input"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="apellidos"
              className="register-input"
              placeholder="Apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              className="register-input"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="tel"
              name="telefono"
              className="register-input"
              placeholder="Teléfono"
              value={formData.telefono}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="direccion"
              className="register-input"
              placeholder="Dirección"
              value={formData.direccion}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              className="register-input"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="confirmPassword"
              className="register-input"
              placeholder="Confirmar contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <button type="submit" className="register-button">
              Registrarse
            </button>

            <button 
              type="button" 
              className="register-link-button"
              onClick={onSwitchToLogin}
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