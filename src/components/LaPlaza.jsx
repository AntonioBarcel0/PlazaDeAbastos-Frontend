import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getCurrentSeason } from '../utils/seasonality';
import { api, BASE_URL } from '../services/api';
import './LaPlaza.css';


const VENDORS = [
  'Frutas Jurado', 'Frutas Padilla', 'Frutas Molina', 'Comestibles Rodríguez',
  'Especias Moyano', 'Panadería Muñoz', 'Verduras Cortés', 'Jardinería Moreno',
];

/* Keywords de temporada por estación (sin tildes, minúsculas) */
const SEASON_KEYWORDS = {
  primavera: ['alcachofa','freson','fresa','esparrago','guisante','haba','lechuga','rabano','cereza','albaricoque','acelga','espinaca'],
  verano:    ['berenjena','calabacin','sandia','tomate','pepino','melocoton','melon','pimiento','ciruela','higo','lechuga','esparrago','albaricoque','cereza'],
  otono:     ['brocoli','castana','caqui','champinon','coliflor','granada','manzana','membrillo','nuez','pera','seta','uva','higo','pimiento','alcachofa'],
  invierno:  ['col','limon','mandarina','naranja','puerro','repollo','zanahoria','brocoli','coliflor','manzana','pera','acelga','espinaca'],
};

const normalize = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

function isSeasonalProduct(product) {
  const season = getCurrentSeason();
  const keywords = SEASON_KEYWORDS[season] || [];
  const text = normalize(product.nombre + ' ' + (product.categoria || ''));
  return keywords.some(kw => text.includes(kw));
}

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
  const [seasonalProducts, setSeasonalProducts] = useState([]);
  const [seasonalPage, setSeasonalPage] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [slideDirection, setSlideDirection] = useState('next');
  const carouselRef = useRef(null);

  useEffect(() => {
    const key = todayKey();

    api.getProducts().then(data => {
      const products = (data.products || data.productos || []).filter(p => p.disponible !== false && p.stock !== 0);

      // Validar caché: descartar si algún producto ya no existe o no tiene imagen
      const cached = localStorage.getItem(key);
      let sel = null;
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          const ids = new Set(products.map(p => p.id));
          const valid = parsed.every(p => p && ids.has(p.id));
          if (valid) sel = parsed.map(p => products.find(fp => fp.id === p.id) || p);
        } catch {}
      }

      if (!sel) {
        const rand = seededRand(dateSeed());
        sel = pickN(products, 3, rand);
        localStorage.setItem(key, JSON.stringify(sel));
      }

      setRecos(sel);

      // Productos de temporada
      const seasonal = products.filter(isSeasonalProduct);
      setSeasonalProducts(seasonal);
    }).catch(() => {});
  }, []);

  const totalPages = Math.ceil(seasonalProducts.length / 2);
  const visibleSeasonal = seasonalProducts.slice(seasonalPage * 2, seasonalPage * 2 + 2);

  const slideTo = (newPage, direction) => {
    if (isSliding) return;
    setSlideDirection(direction);
    setIsSliding(true);
    setTimeout(() => {
      setSeasonalPage(newPage);
      setIsSliding(false);
    }, 400);
  };

  const prevSeasonal = () => {
    if (seasonalPage > 0) slideTo(seasonalPage - 1, 'prev');
  };
  const nextSeasonal = () => {
    if (seasonalPage < totalPages - 1) slideTo(seasonalPage + 1, 'next');
  };

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
                  <img src={producto.imagen.startsWith('http') ? producto.imagen : `${BASE_URL}${producto.imagen}`} alt={producto.nombre} className="rec-image" />
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
      {seasonalProducts.length > 0 && (
        <section className="seasonal-section">
          <div className="seasonal-badge-wrap">
            <span className="seasonal-badge">Productos de temporada</span>
          </div>

          <div className="seasonal-carousel" ref={carouselRef}>
            <button
              className="seasonal-arrow seasonal-arrow--left"
              onClick={prevSeasonal}
              disabled={seasonalPage === 0}
              aria-label="Anterior"
            >
              <ChevronLeft size={28} />
            </button>

            <div className="seasonal-track-wrapper">
              <div className={`seasonal-grid ${isSliding ? `seasonal-slide-${slideDirection}` : ''}`}>
                {visibleSeasonal.map(product => (
                  <div
                    key={product.id}
                    className="seasonal-card"
                    onClick={() => product.vendedorId && onStoreClick && onStoreClick(product.vendedorId)}
                    style={{ cursor: product.vendedorId ? 'pointer' : 'default' }}
                  >
                    {product.imagen ? (
                      <img
                        src={product.imagen.startsWith('http') ? product.imagen : `${BASE_URL}${product.imagen}`}
                        alt={product.nombre}
                        className="seasonal-img"
                      />
                    ) : (
                      <div className="seasonal-img seasonal-img--placeholder" />
                    )}
                    <div className="seasonal-overlay">
                      <div className="seasonal-overlay-top">
                        <span className="seasonal-tag">De temporada</span>
                      </div>
                      <div className="seasonal-overlay-bottom">
                        <h3 className="seasonal-name">{product.nombre}</h3>
                        <p className="seasonal-price">{parseFloat(product.precio).toFixed(2)}€/{product.unidad}</p>
                        <button className="seasonal-btn" onClick={(e) => { e.stopPropagation(); product.vendedorId && onStoreClick && onStoreClick(product.vendedorId); }}>
                          Ver producto
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              className="seasonal-arrow seasonal-arrow--right"
              onClick={nextSeasonal}
              disabled={seasonalPage >= totalPages - 1}
              aria-label="Siguiente"
            >
              <ChevronRight size={28} />
            </button>
          </div>

          {totalPages > 1 && (
            <div className="seasonal-dots">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  className={`seasonal-dot ${i === seasonalPage ? 'seasonal-dot--active' : ''}`}
                  onClick={() => slideTo(i, i > seasonalPage ? 'next' : 'prev')}
                  aria-label={`Página ${i + 1}`}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </>
  );
}

export default LaPlaza;
