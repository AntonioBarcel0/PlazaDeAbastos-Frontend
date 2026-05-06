import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './CrearCesta.css';

function CrearCesta({
  user, onLogout, onDashboardClick, onCartClick, onOrdersClick,
  onHomeClick, onPageClick, onMarketplaceClick, onSelectPuestoClick,
  onMapClick, onInstruccionesClick, onLoginClick,
  onPuestosClick,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="cc-container">
      <Header
        onMenuClick={() => setSidebarOpen(s => !s)}
        onLogoClick={onHomeClick}
        onLoginClick={onLoginClick || (() => {})}
        user={user}
        onLogout={onLogout}
        onDashboardClick={onDashboardClick}
        onCartClick={onCartClick}
        onOrdersClick={onOrdersClick}
      />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onPageClick={onPageClick}
        onSelectPuestoClick={onSelectPuestoClick}
        onMapClick={onMapClick}
        onInstruccionesClick={onInstruccionesClick}
        user={user}
        onLoginClick={onLoginClick}
        onOrdersClick={onOrdersClick}
        onDashboardClick={onDashboardClick}
      />

      <main className="cc-main">
        <div className="cc-split">

          {/* ── Lado izquierdo — texto y CTA ── */}
          <div className="cc-left">
            <div className="cc-content">
              <p className="cc-eyebrow">Plaza de Abastos · Úbeda</p>
              <h1 className="cc-title">Tu Cesta,<br />a tu Gusto</h1>
              <p className="cc-subtitle">
                Elige libremente los productos frescos que más te gusten,
                directo de los puestos del mercado a tu puerta.
              </p>
              <button className="cc-btn" onClick={onPuestosClick}>
                Ver puestos
              </button>
            </div>
          </div>

          {/* ── Lado derecho — imagen ── */}
          <div className="cc-right">
            <img
              src="https://res.cloudinary.com/dlmnchkjg/image/upload/v1771336582/cestallena_sgtve5.png"
              alt="Cesta llena de productos frescos"
              className="cc-image"
            />
          </div>

        </div>
      </main>
    </div>
  );
}

export default CrearCesta;
