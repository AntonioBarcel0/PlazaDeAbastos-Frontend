import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './ComprarCesta.css';

const CESTAS = [
  {
    id: 'frutas',
    title: 'Frutas',
    precio: 'desde 18 €',
    productos: 'Manzana, Naranja, Plátano, Pera, Melocotón, Uva, Kiwi, Fresa, Mandarina...',
  },
  {
    id: 'verduras',
    title: 'Verduras',
    precio: 'desde 18 €',
    productos: 'Zanahoria, Puerro, Patata, Cebolla, Tomate, Calabacín, Pepino, Lechuga, Pimiento...',
  },
  {
    id: 'mixta',
    title: 'Frutas & Verduras',
    precio: 'desde 22 €',
    productos: 'Manzana, Zanahoria, Plátano, Patata, Lechuga, Melocotón, Cebolla, Kiwi, Tomate...',
  },
  {
    id: 'comestibles',
    title: 'Comestibles',
    precio: 'desde 25 €',
    productos: 'Aceite de oliva, Legumbres, Arroz, Conservas, Especias, Frutos secos, Pasta...',
  },
];

function ComprarCesta({
  user, onLogout, onDashboardClick, onCartClick, onOrdersClick,
  onHomeClick, onPageClick, onMarketplaceClick, onSelectPuestoClick,
  onMapClick, onInstruccionesClick, onLoginClick,
  onCestaClick,
  onTipoSelect,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="cb-container">
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

      <main className="cb-main">
        <div className="cb-grid">
          {CESTAS.map((cesta) => (
            <button
              key={cesta.id}
              className="cb-col"
              onClick={() => onTipoSelect ? onTipoSelect(cesta.id) : onCestaClick?.()}
              aria-label={`Cesta de ${cesta.title}`}
            >
              <div className="cb-inner">
                <h2 className="cb-title">{cesta.title}</h2>
                <p className="cb-price">{cesta.precio}</p>
                <p className="cb-products">{cesta.productos}</p>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}

export default ComprarCesta;
