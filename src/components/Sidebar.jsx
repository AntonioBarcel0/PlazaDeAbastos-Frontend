import './Sidebar.css';

function Sidebar({ isOpen, onClose, onSelectPuestoClick, onMarketplaceClick }) {
  return (
    <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-nav">

        {/* Columna izquierda — enlaces grandes */}
        <div className="sidebar-col sidebar-col--main">
          <ul className="sidebar-list">
            <li><a href="#" className="sidebar-link sidebar-link--main" onClick={(e) => { e.preventDefault(); onClose(); onMarketplaceClick && onMarketplaceClick(); }}>Puestos</a></li>
            <li><a href="#" className="sidebar-link sidebar-link--main" onClick={(e) => { e.preventDefault(); onClose(); }}>A domicilio</a></li>
            <li><a href="#" className="sidebar-link sidebar-link--main" onClick={(e) => { e.preventDefault(); onClose(); onSelectPuestoClick && onSelectPuestoClick(); }}>Elige tu cesta</a></li>
            <li><a href="#" className="sidebar-link sidebar-link--main" onClick={(e) => { e.preventDefault(); onClose(); }}>Mi perfil</a></li>
            <li><a href="#" className="sidebar-link sidebar-link--main" onClick={(e) => { e.preventDefault(); onClose(); }}>Instrucciones</a></li>
          </ul>
        </div>

        {/* Grupo de columnas secundarias */}
        <div className="sidebar-secondary-group">
          <div className="sidebar-col sidebar-col--secondary">
            <ul className="sidebar-list">
              <li><a href="#" className="sidebar-link sidebar-link--secondary" onClick={(e) => { e.preventDefault(); onClose(); }}>Cliente</a></li>
              <li><a href="#" className="sidebar-link sidebar-link--secondary" onClick={(e) => { e.preventDefault(); onClose(); }}>Contacto</a></li>
              <li><a href="#" className="sidebar-link sidebar-link--secondary" onClick={(e) => { e.preventDefault(); onClose(); }}>Preguntas frecuentes</a></li>
            </ul>
          </div>

          <div className="sidebar-col sidebar-col--secondary">
            <ul className="sidebar-list">
              <li><a href="#" className="sidebar-link sidebar-link--secondary" onClick={(e) => { e.preventDefault(); onClose(); }}>Política de privacidad</a></li>
              <li><a href="#" className="sidebar-link sidebar-link--secondary" onClick={(e) => { e.preventDefault(); onClose(); }}>Términos y condiciones</a></li>
              <li><a href="#" className="sidebar-link sidebar-link--secondary" onClick={(e) => { e.preventDefault(); onClose(); }}>Cookies</a></li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Sidebar;
