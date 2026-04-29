import { useState } from 'react';
import './PostalCheck.css';

const UBEDA = { lat: 38.0098, lon: -3.3733 };
const MAX_KM = 20;

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = (x) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function geocodePostalCode(code) {
  const url = `https://nominatim.openstreetmap.org/search?postalcode=${code}&country=es&format=json&limit=1&addressdetails=1`;
  const res = await fetch(url, { headers: { 'Accept-Language': 'es' } });
  if (!res.ok) throw new Error('Error de red');
  const data = await res.json();
  if (!data.length) return null;
  const { lat, lon, address } = data[0];
  const ciudad =
    address.city || address.town || address.village || address.municipality || '';
  return { lat: parseFloat(lat), lon: parseFloat(lon), ciudad };
}

function PostalCheck({ onConfirm, onCancel }) {
  const [code, setCode]     = useState('');
  const [status, setStatus] = useState(null); // null | 'loading' | 'ok' | 'far' | 'notfound' | 'neterror'
  const [info, setInfo]     = useState(null); // { ciudad, km }

  const handleChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 5);
    setCode(val);
    setStatus(null);
    setInfo(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.length !== 5) return;

    setStatus('loading');
    setInfo(null);

    try {
      const result = await geocodePostalCode(code);
      if (!result) { setStatus('notfound'); return; }

      const km = haversine(UBEDA.lat, UBEDA.lon, result.lat, result.lon);
      const rounded = Math.round(km);
      setInfo({ ciudad: result.ciudad, km: rounded });
      setStatus(km <= MAX_KM ? 'ok' : 'far');
    } catch {
      setStatus('neterror');
    }
  };

  const inputClass = `postal-input${
    status === 'ok'  ? ' is-ok'    :
    status === 'far' || status === 'notfound' || status === 'neterror' ? ' is-error' : ''
  }`;

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
            className={inputClass}
            type="text"
            inputMode="numeric"
            placeholder="código postal"
            value={code}
            onChange={handleChange}
            maxLength={5}
            autoFocus
            disabled={status === 'loading'}
          />

          <div className="postal-divider" />

          {/* Mensajes de estado */}
          {(status === null || status === 'loading') && (
            <p className="postal-sub">
              {status === 'loading'
                ? 'Comprobando tu localidad…'
                : 'Antes de continuar, comprueba que repartimos en tu localidad.'}
            </p>
          )}
          {status === 'ok' && info && (
            <p className="postal-feedback postal-feedback--ok">
              ¡Perfecto! {info.ciudad && <>{info.ciudad} está a </>}
              solo {info.km} km de Úbeda. Repartimos en tu zona.
            </p>
          )}
          {status === 'far' && info && (
            <p className="postal-feedback postal-feedback--error">
              {info.ciudad && <>{info.ciudad} está a </>}{info.km} km de Úbeda.
              De momento solo repartimos en un radio de {MAX_KM} km.
            </p>
          )}
          {status === 'notfound' && (
            <p className="postal-feedback postal-feedback--error">
              No hemos encontrado ese código postal. Comprueba que es correcto.
            </p>
          )}
          {status === 'neterror' && (
            <p className="postal-feedback postal-feedback--error">
              Error de conexión. Inténtalo de nuevo.
            </p>
          )}

          <div className="postal-actions">
            {status === 'ok' ? (
              <button
                type="button"
                className="postal-btn postal-btn--primary"
                onClick={() => onConfirm(code)}
              >
                Continuar con el pedido
              </button>
            ) : (
              <button
                type="submit"
                className="postal-btn postal-btn--primary"
                disabled={code.length !== 5 || status === 'loading'}
              >
                {status === 'loading' ? 'Comprobando…' : 'Comprobar zona'}
              </button>
            )}
            <button
              type="button"
              className="postal-btn postal-btn--ghost"
              onClick={onCancel}
            >
              cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostalCheck;
