import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Hero from './Hero';
import Baskets from './Baskets';
import LaPlaza from './LaPlaza';
import HowToOrder from './HowToOrder';
import Footer from './Footer';
import './Home.css';

function Home({ onLoginClick, user, onLogout, onDashboardClick, onMarketplaceClick, onSelectPuestoClick }) {
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
      />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={handleSidebarClose}
        onLoginClick={onLoginClick}
        user={user}
        onLogout={onLogout}
        onDashboardClick={onDashboardClick}
        onSelectPuestoClick={onSelectPuestoClick}
      />

      <main className="home-main">
        <Hero onMarketplaceClick={onMarketplaceClick} />
        <Baskets onMarketplaceClick={onMarketplaceClick} onSelectPuestoClick={onSelectPuestoClick} />
        <LaPlaza onMarketplaceClick={onMarketplaceClick} />
        <HowToOrder />
      </main>
      <Footer />
    </div>
  );
}

export default Home;