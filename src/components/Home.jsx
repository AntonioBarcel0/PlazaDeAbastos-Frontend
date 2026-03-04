import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Hero from './Hero';
import Baskets from './Baskets';
import './Home.css';

function Home({ onLoginClick, user, onLogout, onDashboardClick, onMarketplaceClick }) {
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
      />

      <main className="home-main">
        <Hero onMarketplaceClick={onMarketplaceClick} />
        <Baskets onMarketplaceClick={onMarketplaceClick} />
        {/* Aquí irán más secciones futuras */}
      </main>
    </div>
  );
}

export default Home;