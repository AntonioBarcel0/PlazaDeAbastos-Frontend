import { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Hero from './components/Hero';
import Login from './components/Login';
import LoginOptions from './components/LoginOptions';
import Register from './components/Register';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'login', 'loginOptions', 'register'

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLoginClick = () => {
    setCurrentView('loginOptions');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  const handleSwitchToRegister = () => {
    setCurrentView('register');
  };

  const handleShowLogin = () => {
    setCurrentView('login');
  };

  const handleShowLoginOptions = () => {
    setCurrentView('loginOptions');
  };

  return (
    <div className="App">
      <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {currentView === 'home' && (
        <>
          <Header 
            onMenuClick={toggleMenu} 
            onLoginClick={handleLoginClick}
            onLogoClick={handleBackToHome}
          />
          <Hero />
        </>
      )}

      {currentView === 'login' && (
        <Login 
          onSwitchToRegister={handleShowLoginOptions} 
          onBack={handleBackToHome}
          onMenuClick={toggleMenu}
          onLogoClick={handleBackToHome}
        />
      )}

      {currentView === 'loginOptions' && (
        <LoginOptions 
          onRegisterClick={handleSwitchToRegister} 
          onLoginClick={handleShowLogin}
          onMenuClick={toggleMenu}
          onBack={handleBackToHome}
          onLogoClick={handleBackToHome}
        />
      )}

      {currentView === 'register' && (
        <Register 
          onBack={handleShowLoginOptions} 
          onSwitchToLogin={handleShowLogin}
          onMenuClick={toggleMenu}
          onLogoClick={handleBackToHome}
        />
      )}
    </div>
  );
}

export default App;