import { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { api } from '../services/api';
import './MarketMap.css';

const CAT_COLOR = {
  'Frutas':      '#c0392b',
  'Panadería':   '#d4850a',
  'Especias':    '#1a8a6e',
  'Comestibles': '#7b3fa0',
  'Jardinería':  '#27833a',
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
  { id: 1,  x: 77,  y: 37,  w: 88,  h: 176, label: 'Jurado',      full: 'Juan Jurado Ruíz',            cat: 'Frutas' },
  { id: 2,  x: 170, y: 37,  w: 88,  h: 176, label: 'Molina Hig.', full: 'Mª del Mar Molina Higueras',  cat: 'Panadería' },
  { id: 3,  x: 308, y: 23,  w: 78,  h: 190, label: 'Padilla',     full: 'Francisco Padilla Quesada',   cat: 'Frutas' },
  { id: 4,  x: 390, y: 23,  w: 78,  h: 190, label: 'Moyano',      full: 'Bartolomé Moyano Hurtado',    cat: 'Especias' },
  { id: 5,  x: 472, y: 23,  w: 84,  h: 190, label: 'Rodríguez',   full: 'Rosa Mª Rodríguez',           cat: 'Comestibles' },
  { id: 6,  x: 605, y: 23,  w: 100, h: 190, label: 'Molina B.',   full: 'Salvador Molina Barbero',      cat: 'Frutas' },
  { id: 7,  x: 689, y: 92,  w: 62,  h: 121, label: 'Moreno',      full: 'Alonso Moreno Manjón',         cat: 'Jardinería' },
  { id: 8,  x: 77,  y: 270, w: 155, h: 133, label: 'Muñoz',       full: 'Dolores Muñoz Guerrero',       cat: 'Panadería' },
  { id: 9,  x: 236, y: 270, w: 157, h: 133, label: 'Juan Cortés', full: 'Ginés Juan Cortés',            cat: 'Frutas' },
  { id: 10, x: 443, y: 270, w: 148, h: 234, label: 'Molina M.',   full: 'Gaspar Molina Muñoz',          cat: 'Frutas' },
  { id: 11, x: 595, y: 270, w: 152, h: 234, label: 'Molina Hip.', full: 'Mª Josefa Molina Hipólito',   cat: 'Comestibles' },
  { id: 12, x: 77,  y: 450, w: 156, h: 54,  label: 'López',       full: 'Rosendo López Alaminos',       cat: 'Frutas' },
  { id: 13, x: 237, y: 450, w: 157, h: 54,  label: 'Ruíz Pasc.',  full: 'Mª Dolores Ruíz Pascual',     cat: 'Comestibles' },
];

const normalize = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

function MarketMap({
  user, onLogout, onDashboardClick, onCartClick, onOrdersClick,
  onHomeClick, onMarketplaceClick, onSelectPuestoClick, onLoginClick, onStoreClick, onInstruccionesClick, onPageClick,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hovered, setHovered]         = useState(null);
  const [hoveredCat, setHoveredCat]   = useState(null);
  const [vendorMap, setVendorMap]     = useState({});

  useEffect(() => {
    api.getVendedores().then(data => {
      const vendors = data.vendedores || [];
      const map = {};
      STALLS.forEach(s => {
        const nFull = normalize(s.full);
        const match = vendors.find(v => normalize(v.nombreCompleto).includes(nFull) || nFull.includes(normalize(v.nombreCompleto)));
        if (match) map[s.id] = match.id;
      });
      setVendorMap(map);
    }).catch(() => {});
  }, []);

  const handleStallClick = (stall) => {
    const realId = vendorMap[stall.id];
    if (realId && onStoreClick) onStoreClick(realId);
  };

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
        onInstruccionesClick={onInstruccionesClick}
        onPageClick={onPageClick}
        user={user}
        onLoginClick={onLoginClick}
        onOrdersClick={onOrdersClick}
        onDashboardClick={onDashboardClick}
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
              const isHov     = hovered?.id === s.id;
              const isCatHov  = hoveredCat === s.cat;
              const hasCatFilter = hoveredCat !== null;
              const color = CAT_COLOR[s.cat];
              const cx    = s.x + s.w / 2;
              const cy    = s.y + s.h / 2;

              const opacity     = hasCatFilter ? (isCatHov ? 1 : 0.18) : (isHov ? 1 : 0.82);
              const strokeColor = (isHov || (hasCatFilter && isCatHov)) ? 'white' : 'rgba(0,0,0,0.15)';
              const strokeW     = (isHov || (hasCatFilter && isCatHov)) ? 2 : 1;

              return (
                <g
                  key={s.id}
                  style={{ cursor: vendorMap[s.id] ? 'pointer' : 'default' }}
                  onMouseEnter={() => setHovered(s)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => handleStallClick(s)}
                >
                  <rect
                    x={s.x} y={s.y} width={s.w} height={s.h}
                    rx="3" ry="3"
                    fill={color}
                    opacity={opacity}
                    stroke={strokeColor}
                    strokeWidth={strokeW}
                  />
                  {/* número */}
                  <text
                    x={s.x + 5} y={s.y + 12}
                    fill="rgba(255,255,255,0.55)"
                    fontSize="9" fontFamily="Afacad, sans-serif" fontWeight="600"
                  >
                    {s.id}
                  </text>
                  {/* nombre */}
                  <text
                    x={cx} y={cy + 4}
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

            {/* ── Entrada principal (sur) ── */}
            <rect x={334} y={505} width={160} height={6} fill="#fdf8f3" />
            <text
              x={414} y={522}
              textAnchor="middle" fill="#8b2332"
              fontSize="10" fontWeight="700" fontFamily="Afacad, sans-serif"
              letterSpacing="2"
            >
              ▲ ENTRADA
            </text>

            {/* ── Entrada superior-izquierda (pasillo vertical izq.) ── */}
            <rect x={263} y={21} width={40} height={17} fill="#fdf8f3" />
            <text
              x={283} y={34}
              textAnchor="middle" fill="#8b2332"
              fontSize="9" fontWeight="700" fontFamily="Afacad, sans-serif"
            >▼</text>

            {/* ── Entrada superior-derecha (pasillo vertical der.) ── */}
            <rect x={560} y={13} width={40} height={15} fill="#fdf8f3" />
            <text
              x={580} y={26}
              textAnchor="middle" fill="#8b2332"
              fontSize="9" fontWeight="700" fontFamily="Afacad, sans-serif"
            >▼</text>

            {/* ── Entrada lateral izquierda (pasillo horizontal) ── */}
            <rect x={56} y={218} width={18} height={48} fill="#fdf8f3" />
            <text
              x={10} y={246}
              textAnchor="middle" fill="#8b2332"
              fontSize="8" fontWeight="700" fontFamily="Afacad, sans-serif"
              letterSpacing="1.5"
              transform="rotate(-90, 10, 246)"
            >ENTRADA</text>

            {/* ── Entrada lateral derecha (pasillo horizontal) ── */}
            <rect x={755} y={218} width={18} height={48} fill="#fdf8f3" />
            <text
              x={818} y={246}
              textAnchor="middle" fill="#8b2332"
              fontSize="8" fontWeight="700" fontFamily="Afacad, sans-serif"
              letterSpacing="1.5"
              transform="rotate(90, 818, 246)"
            >ENTRADA</text>
          </svg>

          {/* ── Tooltip ── */}
          {hovered && !hoveredCat && (
            <div className="map-tooltip">
              <span className="map-tooltip-dot" style={{ backgroundColor: CAT_COLOR[hovered.cat] }} />
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
            <div
              key={cat}
              className={`map-legend-item${hoveredCat && hoveredCat !== cat ? ' map-legend-item--dim' : ''}${hoveredCat === cat ? ' map-legend-item--active' : ''}`}
              onMouseEnter={() => setHoveredCat(cat)}
              onMouseLeave={() => setHoveredCat(null)}
            >
              <span className="map-legend-dot" style={{ backgroundColor: color }} />
              <span className="map-legend-label">{cat.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default MarketMap;
