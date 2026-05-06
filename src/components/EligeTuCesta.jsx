import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './EligeTuCesta.css';

function EligeTuCesta({
  user, onLogout, onDashboardClick, onCartClick, onOrdersClick,
  onHomeClick, onPageClick, onMarketplaceClick, onSelectPuestoClick,
  onMapClick, onInstruccionesClick, onLoginClick,
  onCrearCesta, onComprarCesta,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="etc-container">
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
        onMarketplaceClick={onMarketplaceClick}
        onSelectPuestoClick={onSelectPuestoClick}
        onMapClick={onMapClick}
        onInstruccionesClick={onInstruccionesClick}
        user={user}
        onLoginClick={onLoginClick}
        onOrdersClick={onOrdersClick}
        onDashboardClick={onDashboardClick}
      />

      <main className="etc-main">
        <div className="etc-grid">

          {/* ── Crea tu cesta ── */}
          <div className="etc-card">
            <h2 className="etc-title">Crea tu cesta</h2>
            <button className="etc-button" onClick={onCrearCesta}>Añadir</button>
            <div className="etc-image-wrap">
              <img
                src="https://res.cloudinary.com/dlmnchkjg/image/upload/v1771336583/cestavacia_m6z1tv.png"
                alt="Cesta vacía"
                className="etc-image"
              />
            </div>
          </div>

          {/* ── Compra tu cesta ── */}
          <div className="etc-card etc-card--right">
            <h2 className="etc-title">Compra tu cesta</h2>
            <button className="etc-button" onClick={onComprarCesta}>Añadir</button>
            <div className="etc-image-wrap">
              <img
                src="https://res.cloudinary.com/dlmnchkjg/image/upload/v1771336582/cestallena_sgtve5.png"
                alt="Cesta con productos"
                className="etc-image"
              />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default EligeTuCesta;
