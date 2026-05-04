import { useState, useEffect } from 'react';
import { api } from '../services/api';
import './LaPlaza.css';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

const VENDORS = [
  'Frutas Jurado', 'Frutas Padilla', 'Frutas Molina', 'Comestibles Rodríguez',
  'Especias Moyano', 'Panadería Muñoz', 'Verduras Cortés', 'Jardinería Moreno',
];

const SEASONAL = [
  { id: 1, name: 'Alcachofa', price: '3,99€/Kg' },
  { id: 2, name: 'Alcachofa', price: '3,99€/Kg' },
];

function seededRand(seed) {
  let s = seed >>> 0;
  return () => { s = (Math.imul(1664525, s) + 1013904223) >>> 0; return s / 4294967296; };
}
function pickN(arr, n, rand) {
  const pool = [...arr]; const out = [];
  while (out.length < n && pool.length > 0) { const i = Math.floor(rand() * pool.length); out.push(pool.splice(i, 1)[0]); }
  return out;
}
function todayKey() { const d = new Date(); return `recos_${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`; }
function dateSeed() { const d = new Date(); return d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate(); }

function LaPlaza({ onMarketplaceClick, onStoreClick }) {
  const [recos, setRecos] = useState([null, null, null]);

  useEffect(() => {
    const key = todayKey();
    const cached = localStorage.getItem(key);
    if (cached) { try { setRecos(JSON.parse(cached)); return; } catch {} }
    api.getProducts().then(data => {
      const products = (data.products || data.productos || []).filter(p => p.disponible !== false && p.stock !== 0);
      const rand = seededRand(dateSeed());
      const sel = pickN(products, 3, rand);
      localStorage.setItem(key, JSON.stringify(sel));
      setRecos(sel);
    }).catch(() => {});
  }, []);
  return (
    <>
      <section className="laplaza-section">
        <h2 className="laplaza-title">La Plaza</h2>

        {/* Marquee de nombres de vendedores */}
        <div className="vendors-marquee">
          <div className="vendors-track">
            {[...VENDORS, ...VENDORS].map((vendor, i) => (
              <span key={i} className="vendor-item">{vendor}</span>
            ))}
          </div>
        </div>

        {/* Recomendaciones */}
        <div className="recommendations-wrap">
          <h3 className="recommendations-title">Recomendaciones</h3>
          <div className="recommendations-grid">
            {recos.map((producto, i) => (
              <div
                key={i}
                className="rec-card"
                onClick={() => producto?.vendedorId && onStoreClick && onStoreClick(producto.vendedorId)}
                style={{ cursor: producto?.vendedorId ? 'pointer' : 'default' }}
              >
                {producto?.imagen && (
                  <img src={`${BASE_URL}${producto.imagen}`} alt={producto.nombre} className="rec-image" />
                )}
                {producto && (
                  <div className="rec-overlay">
                    <p className="rec-overlay-name">{producto.nombre}</p>
                    <p className="rec-overlay-price">{parseFloat(producto.precio).toFixed(2)}€/{producto.unidad}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Productos de temporada */}
      <section className="seasonal-section">
        <div className="seasonal-badge-wrap">
          <span className="seasonal-badge">Productos de temporada</span>
        </div>
        <div className="seasonal-grid">
          {SEASONAL.map(product => (
            <div key={product.id} className="seasonal-card">
              {/* TODO: añadir background-image con URL de Cloudinary en .seasonal-img */}
              <div className="seasonal-img" />
              <div className="seasonal-name-band">
                <h3 className="seasonal-name">{product.name}</h3>
              </div>
              <div className="seasonal-footer">
                <p className="seasonal-price">{product.price}</p>
                <button className="seasonal-btn" onClick={onMarketplaceClick}>
                  Ver producto
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default LaPlaza;
