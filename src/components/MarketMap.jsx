import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './MarketMap.css';

const CAT_COLOR = {
  'Frutas':      '#3d7a35',
  'Panadería':   '#9a7a2a',
  'Especias':    '#3a7a6a',
  'Comestibles': '#5a4a8a',
  'Jardinería':  '#4a7a3a',
};

const CAT_ICON = {
  'Frutas':      '🍓',
  'Panadería':   '🍞',
  'Especias':    '🌿',
  'Comestibles': '🧀',
  'Jardinería':  '🌱',
};

// Building exterior polygon points (irregular, matches real Mercado de Úbeda footprint)
// Wider base, diagonal cut at top-right corner
const BUILDING_POINTS = '72,32 710,18 772,88 756,508 62,508';

// Corridors: 1 main horizontal + 2 vertical (top) + 1 vertical (bottom-center) + 1 partial horizontal (bottom-left)
const CORRIDORS = [
  { x: 72,  y: 218, w: 684, h: 48  }, // main horizontal
  { x: 263, y: 32,  w: 40,  h: 186 }, // left vertical (top section)
  { x: 560, y: 18,  w: 40,  h: 200 }, // right vertical (top section)
  { x: 398, y: 266, w: 40,  h: 142 }, // center vertical (bottom section)
  { x: 72,  y: 408, w: 366, h: 38  }, // partial horizontal (bottom-left)
];

// 13 stalls — irregular sizes and positions, distributed by section, NOT grouped by category
// Sections: A (top-left), B (top-center), C (top-right), D (mid-left), E (right), F (bottom-left)
const STALLS = [
  {
    id: 1, x: 77,  y: 37,  w: 88,  h: 176,
    vid: '34d59fe5-c14e-493c-9059-0e69520d2748',
    label: 'Jurado',     full: 'Juan Jurado Ruíz',            cat: 'Frutas',
  },
  {
    id: 2, x: 170, y: 37,  w: 88,  h: 176,
    vid: 'fd93ea56-4cfc-4bae-b23e-415d55d8b80e',
    label: 'Molina Hig.', full: 'Mª del Mar Molina Higueras', cat: 'Panadería',
  },
  {
    id: 3, x: 308, y: 23,  w: 78,  h: 190,
    vid: 'bfa9c04f-c6c4-4803-99a0-faace7612128',
    label: 'Padilla',    full: 'Francisco Padilla Quesada',   cat: 'Frutas',
  },
  {
    id: 4, x: 390, y: 23,  w: 78,  h: 190,
    vid: 'ce8544ae-f625-4b5e-866c-e2d9aee24c10',
    label: 'Moyano',     full: 'Bartolomé Moyano Hurtado',    cat: 'Especias',
  },
  {
    id: 5, x: 472, y: 23,  w: 84,  h: 190,
    vid: '1a33b0b8-6e9a-4000-8146-b2846b2981d6',
    label: 'Rodríguez',  full: 'Rosa Mª Rodríguez',           cat: 'Comestibles',
  },
  {
    id: 6, x: 605, y: 23,  w: 100, h: 190,
    vid: '819ce9c1-ce5a-448e-8362-598fbbcc6fe3',
    label: 'Molina B.',  full: 'Salvador Molina Barbero',     cat: 'Frutas',
  },
  {
    id: 7, x: 689, y: 92,  w: 62,  h: 121,
    vid: 'e2141f28-8775-4d1c-8876-8683794a4a99',
    label: 'Moreno',     full: 'Alonso Moreno Manjón',        cat: 'Jardinería',
  },
  {
    id: 8, x: 77,  y: 270, w: 155, h: 133,
    vid: 'f82d133b-e9c3-4264-8acc-2682a368bd0f',
    label: 'Muñoz',      full: 'Dolores Muñoz Guerrero',      cat: 'Panadería',
  },
  {
    id: 9, x: 236, y: 270, w: 157, h: 133,
    vid: 'c1070484-ff1d-4a8b-8bf4-85e4bb9bb439',
    label: 'Juan Cortés', full: 'Ginés Juan Cortés',          cat: 'Frutas',
  },
  {
    id: 10, x: 443, y: 270, w: 148, h: 234,
    vid: 'dd1991e7-ae8a-4b7d-8bda-e56f2c3084f9',
    label: 'Molina M.',  full: 'Gaspar Molina Muñoz',         cat: 'Frutas',
  },
  {
    id: 11, x: 595, y: 270, w: 152, h: 234,
    vid: '095b2fcd-f30d-4bf1-b402-e1883fee661a',
    label: 'Molina Hip.', full: 'Mª Josefa Molina Hipólito',  cat: 'Comestibles',
  },
  {
    id: 12, x: 77,  y: 450, w: 156, h: 54,
    vid: 'a9f57f59-bbd3-43dd-8bba-2c92bbc1286e',
    label: 'López',      full: 'Rosendo López Alaminos',      cat: 'Frutas',
  },
  {
    id: 13, x: 237, y: 450, w: 157, h: 54,
    vid: '2e0b6709-687f-4f3c-8271-37e8500ccd43',
    label: 'Ruíz Pasc.', full: 'Mª Dolores Ruíz Pascual',    cat: 'Comestibles',
  },
];

function MarketMap({
  user, onLogout, onDashboardClick, onCartClick, onOrdersClick,
  onHomeClick, onMarketplaceClick, onSelectPuestoClick, onLoginClick, onStoreClick,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hovered, setHovered]         = useState(null);

  const headerProps = {
    onMenuClick: () => setSidebarOpen(s => !s),
    onLoginClick: onLoginClick || (() => {}),
    onLogoClick: onHomeClick,
    user, onLogout, onDashboardClick, onCartClick, onOrdersClick,
  };

  return (
    <div className="map-container">
      <Header {...headerProps} />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onMarketplaceClick={onMarketplaceClick}
        onSelectPuestoClick={onSelectPuestoClick}
        onMapClick={() => {}}
      />

      <main className="map-main">
        <h1 className="map-title">Plano del Mercado</h1>
        <p className="map-subtitle">Haz click en un puesto para ver su tienda</p>

        <div className="map-svg-wrap">
          <svg
            viewBox="0 0 828 528"
            className="map-svg"
            aria-label="Plano interactivo del Mercado Municipal de Úbeda"
          >
            {/* ── Suelo del edificio ── */}
            <polygon points={BUILDING_POINTS} fill="#fdf8f3" stroke="none" />

            {/* ── Pasillos ── */}
            {CORRIDORS.map((c, i) => (
              <rect key={i} x={c.x} y={c.y} width={c.w} height={c.h} fill="#ddd3c8" />
            ))}

            {/* ── Puestos ── */}
            {STALLS.map(s => {
              const isHov = hovered?.id === s.id;
              const color = CAT_COLOR[s.cat];
              const cx    = s.x + s.w / 2;
              const tall  = s.h >= 80;
              return (
                <g
                  key={s.id}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHovered(s)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => onStoreClick && onStoreClick(s.vid)}
                >
                  <rect
                    x={s.x} y={s.y} width={s.w} height={s.h}
                    rx="3" ry="3"
                    fill={color}
                    opacity={isHov ? 1 : 0.82}
                    stroke={isHov ? 'white' : 'rgba(0,0,0,0.15)'}
                    strokeWidth={isHov ? 2 : 1}
                  />
                  {/* número */}
                  <text
                    x={s.x + 5} y={s.y + 12}
                    fill="rgba(255,255,255,0.55)"
                    fontSize="9" fontFamily="Afacad, sans-serif" fontWeight="600"
                  >
                    {s.id}
                  </text>
                  {/* icono (solo si hay espacio) */}
                  {tall && (
                    <text
                      x={cx} y={s.y + s.h * 0.42}
                      textAnchor="middle" fontSize="20"
                      dominantBaseline="middle"
                    >
                      {CAT_ICON[s.cat]}
                    </text>
                  )}
                  {/* nombre */}
                  <text
                    x={cx} y={s.y + s.h - (tall ? 12 : s.h * 0.32)}
                    textAnchor="middle" fill="white"
                    fontSize="10" fontWeight="700"
                    fontFamily="Afacad, sans-serif"
                  >
                    {s.label}
                  </text>
                </g>
              );
            })}

            {/* ── Cabecera roja (encima de todo) ── */}
            <rect x={72} y={18} width={684} height={14} fill="#fdf8f3" />
            <polygon points={BUILDING_POINTS} fill="none" stroke="#8b2332" strokeWidth="3" />

            {/* ── Entrada ── */}
            <rect x={334} y={505} width={160} height={6} fill="#fdf8f3" />
            <text
              x={414} y={522}
              textAnchor="middle" fill="#8b2332"
              fontSize="10" fontWeight="700" fontFamily="Afacad, sans-serif"
              letterSpacing="2"
            >
              ▲ ENTRADA
            </text>
          </svg>

          {/* ── Tooltip ── */}
          {hovered && (
            <div className="map-tooltip">
              <span className="map-tooltip-icon">{CAT_ICON[hovered.cat]}</span>
              <div className="map-tooltip-body">
                <p className="map-tooltip-name">{hovered.full}</p>
                <p className="map-tooltip-cat">{hovered.cat}</p>
              </div>
              <span className="map-tooltip-cta">Ver tienda →</span>
            </div>
          )}
        </div>

        {/* ── Leyenda ── */}
        <div className="map-legend">
          {Object.entries(CAT_COLOR).map(([cat, color]) => (
            <div key={cat} className="map-legend-item">
              <span className="map-legend-dot" style={{ backgroundColor: color }} />
              <span className="map-legend-label">{cat}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default MarketMap;
