import { useState } from 'react';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import LoginOptions from './components/LoginOptions';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('home');

  const renderView = () => {
    switch(currentView) {
      case 'home':
        return <Home onLoginClick={() => setCurrentView('loginOptions')} />;

      case 'loginOptions':
        return (
          <LoginOptions 
            onLoginClick={() => setCurrentView('login')}
            onRegisterClick={() => setCurrentView('register')}
            onBack={() => setCurrentView('home')}
            onLogoClick={() => setCurrentView('home')}
          />
        );

      case 'login':
        return (
          <Login 
            onSwitchToRegister={() => setCurrentView('register')}
            onBack={() => setCurrentView('loginOptions')}
            onMenuClick={() => {}}
            onLogoClick={() => setCurrentView('home')}
          />
        );

      case 'register':
        return (
          <Register 
            onSwitchToLogin={() => setCurrentView('login')}
            onBack={() => setCurrentView('loginOptions')}
            onMenuClick={() => {}}
            onLogoClick={() => setCurrentView('home')}
          />
        );

      default:
        return <Home onLoginClick={() => setCurrentView('loginOptions')} />;
    }
  };

  return (
    <div className="app">
      {renderView()}
    </div>
  );
}

export default App;