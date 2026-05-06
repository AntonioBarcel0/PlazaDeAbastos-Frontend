import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Hero from './Hero';
import Baskets from './Baskets';
import LaPlaza from './LaPlaza';
import HowToOrder from './HowToOrder';
import Footer from './Footer';
import './Home.css';

function Home({ onLoginClick, user, onLogout, onDashboardClick, onMarketplaceClick, onSelectPuestoClick, onCartClick, onOrdersClick, onMapClick, onInstruccionesClick, onPageClick, onStoreClick }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleLogoClick = () => {
    // Scroll suave al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="home-container">
      <Header
        onMenuClick={handleMenuClick}
        onLoginClick={onLoginClick}
        onLogoClick={handleLogoClick}
        user={user}
        onLogout={onLogout}
        onDashboardClick={onDashboardClick}
        onCartClick={onCartClick}
        onOrdersClick={onOrdersClick}
      />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={handleSidebarClose}
        onSelectPuestoClick={onSelectPuestoClick}
        onMapClick={onMapClick}
        onInstruccionesClick={onInstruccionesClick}
        onPageClick={onPageClick}
        user={user}
        onLoginClick={onLoginClick}
        onOrdersClick={onOrdersClick}
        onDashboardClick={onDashboardClick}
      />

      <main className="home-main">
        <Hero onMarketplaceClick={onMarketplaceClick} onMapClick={onMapClick} />
        <Baskets onSelectPuestoClick={onSelectPuestoClick} onEligeTuCestaClick={onPageClick ? () => onPageClick('elige-tu-cesta') : undefined} />
        <LaPlaza onMarketplaceClick={onMarketplaceClick} onStoreClick={onStoreClick} />
        <HowToOrder />
      </main>
      <Footer />
    </div>
  );
}

export default Home;