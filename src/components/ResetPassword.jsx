import { useState } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import './AuthForms.css';

function ResetPassword({ onLoginClick, onLogoClick }) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = sessionStorage.getItem('resetToken');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) { toast.error('La contraseña debe tener al menos 6 caracteres'); return; }
    if (password !== confirm) { toast.error('Las contraseñas no coinciden'); return; }
    if (!token) { toast.error('Token de reset no encontrado'); return; }
    try {
      setLoading(true);
      await api.resetPassword(token, password);
      sessionStorage.removeItem('resetToken');
      setDone(true);
      toast.success('Contraseña restablecida correctamente');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <header className="auth-header">
        <div />
        <button className="auth-logo" onClick={onLogoClick}>
          <img
            src="https://res.cloudinary.com/dlmnchkjg/image/upload/v1770289985/Captura_de_pantalla_2026-02-05_a_las_12.12.57_fhymgg.png"
            alt="logo"
            className="auth-logo-img"
          />
        </button>
      </header>

      <main className="auth-main">
        <h1 className="auth-title">Nueva contraseña</h1>

        {done ? (
          <div className="auth-success">
            <p>Tu contraseña ha sido restablecida correctamente.</p>
            <button className="auth-btn" onClick={onLoginClick}>Iniciar sesión</button>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label" htmlFor="rp-pass">Nueva contraseña</label>
              <input
                id="rp-pass"
                className="auth-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                autoFocus
              />
            </div>
            <div className="auth-field">
              <label className="auth-label" htmlFor="rp-confirm">Repetir contraseña</label>
              <input
                id="rp-confirm"
                className="auth-input"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repite la contraseña"
                required
              />
            </div>
            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Restablecer contraseña'}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}

export default ResetPassword;
