import Header from './Header';
import './LoginOptions.css';

function LoginOptions({ onRegisterClick, onLoginClick, onMenuClick, onBack, onLogoClick }) {
  return (
    <>
      <Header 
        onMenuClick={onMenuClick} 
        onLoginClick={onBack}
        onLogoClick={onLogoClick}
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