import { useState } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import './AuthForms.css';

function ForgotPassword({ onBack, onLogoClick }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { toast.error('Introduce tu email'); return; }
    try {
      setLoading(true);
      await api.forgotPassword(email.trim());
      setSent(true);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <header className="auth-header">
        <button className="auth-back" onClick={onBack}>← Volver</button>
        <button className="auth-logo" onClick={onLogoClick}>
          <img
            src="https://res.cloudinary.com/dlmnchkjg/image/upload/v1770289985/Captura_de_pantalla_2026-02-05_a_las_12.12.57_fhymgg.png"
            alt="logo"
            className="auth-logo-img"
          />
        </button>
      </header>

      <main className="auth-main">
        <h1 className="auth-title">Recuperar contraseña</h1>

        {sent ? (
          <div className="auth-success">
            <p>Si el email está registrado, recibirás un enlace para restablecer tu contraseña.</p>
            <p className="auth-hint">Revisa también la carpeta de spam.</p>
            <button className="auth-btn" onClick={onBack}>Volver al inicio de sesión</button>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            <p className="auth-subtitle">Introduce el email asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.</p>
            <div className="auth-field">
              <label className="auth-label" htmlFor="fp-email">Email</label>
              <input
                id="fp-email"
                className="auth-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                autoFocus
              />
            </div>
            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar enlace'}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}

export default ForgotPassword;
