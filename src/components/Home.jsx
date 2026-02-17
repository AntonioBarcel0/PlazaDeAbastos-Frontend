import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Hero from './Hero';
import Baskets from './Baskets';
import './Home.css';

function Home({ onLoginClick }) {
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
      />

      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={handleSidebarClose}
        onLoginClick={onLoginClick}
      />

      <main className="home-main">
        <Hero />
        <Baskets />
        {/* Aquí irán más secciones futuras */}
      </main>
    </div>
  );
}

export default Home;