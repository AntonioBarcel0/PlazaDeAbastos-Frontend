import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './LoginOptions.css';

function LoginOptions({ onRegisterClick, onLoginClick, onBack, onLogoClick, onSelectPuestoClick, onMapClick, onInstruccionesClick, onPageClick, onOrdersClick, onDashboardClick, user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <Header
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onLoginClick={onBack}
        onLogoClick={onLogoClick}
      />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelectPuestoClick={onSelectPuestoClick}
        onMapClick={onMapClick}
        onInstruccionesClick={onInstruccionesClick}
        onPageClick={onPageClick}
        onOrdersClick={onOrdersClick}
        onDashboardClick={onDashboardClick}
        onLoginClick={onLoginClick}
        user={user}
      />
      <div className="login-options-page">
        <div className="login-options-container">
          <h1 className="login-options-title">Plaza de Abastos</h1>

          <div className="options-buttons">
            <button className="option-button" onClick={onRegisterClick}>
              Regístrate
            </button>

            <button className="option-button" onClick={onLoginClick}>
              Inicia sesión
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginOptions;