import { useState } from 'react';
import './PostalCheck.css';

const VALID_PREFIXES = { '23': 'Jaén', '18': 'Granada', '14': 'Córdoba', '02': 'Albacete' };

function PostalCheck({ onConfirm, onCancel }) {
  const [code, setCode]     = useState('');
  const [status, setStatus] = useState(null); // null | 'ok' | 'error'
  const [zona, setZona]     = useState('');

  const handleChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 5);
    setCode(val);
    setStatus(null);
    setZona('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.length !== 5) return;
    const provincia = VALID_PREFIXES[code.slice(0, 2)];
    if (provincia) { setZona(provincia); setStatus('ok'); }
    else            { setStatus('error'); }
  };

  return (
    <div className="postal-page" style={{ position: 'relative' }}>
      <button className="postal-back" onClick={onCancel}>← volver</button>

      <img
        src="https://res.cloudinary.com/dlmnchkjg/image/upload/v1770289985/Captura_de_pantalla_2026-02-05_a_las_12.12.57_fhymgg.png"
        alt="Plaza de Abastos"
        className="postal-logo"
      />

      <div className="postal-inner">
        <form onSubmit={handleSubmit} noValidate style={{ width: '100%' }}>
          <input
            className={`postal-input${status === 'ok' ? ' is-ok' : status === 'error' ? ' is-error' : ''}`}
            type="text"
            inputMode="numeric"
            placeholder="código postal"
            value={code}
            onChange={handleChange}
            maxLength={5}
            autoFocus
          />

          <div className="postal-divider" />

          {status === null && (
            <p className="postal-sub">
              Antes de continuar, comprueba que<br />repartimos en tu localidad.
            </p>
          )}
          {status === 'ok' && (
            <p className="postal-feedback postal-feedback--ok">
              ¡Perfecto! Repartimos en {zona}.
            </p>
          )}
          {status === 'error' && (
            <p className="postal-feedback postal-feedback--error">
              Lo sentimos, de momento no repartimos<br />en esa zona.
            </p>
          )}

          <div className="postal-actions">
            {status === 'ok' ? (
              <button type="button" className="postal-btn postal-btn--primary" onClick={() => onConfirm(code)}>
                Continuar con el pedido
              </button>
            ) : (
              <button type="submit" className="postal-btn postal-btn--primary" disabled={code.length !== 5}>
                Comprobar zona
              </button>
            )}
            <button type="button" className="postal-btn postal-btn--ghost" onClick={onCancel}>
              cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostalCheck;
