import { useState } from 'react';
import Header from './Header';
import './Login.css';

function Login({ onSwitchToRegister, onBack, onMenuClick, onLogoClick }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí irá la lógica de autenticación
    console.log('Login:', { email, password });
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

          <form className="login-form" onSubmit={handleSubmit}>
            <input
              type="email"
              className="login-input"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              className="login-input"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="login-button">
              Enviar
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;