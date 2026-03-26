import './Sidebar.css';

function Sidebar({ isOpen, onClose, onSelectPuestoClick }) {
  return (
    <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-nav">

        {/* Columna izquierda — enlaces grandes */}
        <div className="sidebar-col sidebar-col--main">
          <ul className="sidebar-list">
            <li><a href="#" className="sidebar-link sidebar-link--main" onClick={onClose}>Puestos</a></li>
            <li><a href="#" className="sidebar-link sidebar-link--main" onClick={onClose}>A domicilio</a></li>
            <li><a href="#" className="sidebar-link sidebar-link--main" onClick={() => { onClose(); onSelectPuestoClick && onSelectPuestoClick(); }}>Elige tu cesta</a></li>
            <li><a href="#" className="sidebar-link sidebar-link--main" onClick={onClose}>Mi perfil</a></li>
            <li><a href="#" className="sidebar-link sidebar-link--main" onClick={onClose}>Instrucciones</a></li>
          </ul>
        </div>

        {/* Grupo de columnas secundarias */}
        <div className="sidebar-secondary-group">
          <div className="sidebar-col sidebar-col--secondary">
            <ul className="sidebar-list">
              <li><a href="#" className="sidebar-link sidebar-link--secondary" onClick={onClose}>Cliente</a></li>
              <li><a href="#" className="sidebar-link sidebar-link--secondary" onClick={onClose}>Contacto</a></li>
              <li><a href="#" className="sidebar-link sidebar-link--secondary" onClick={onClose}>Preguntas frecuentes</a></li>
            </ul>
          </div>

          <div className="sidebar-col sidebar-col--secondary">
            <ul className="sidebar-list">
              <li><a href="#" className="sidebar-link sidebar-link--secondary" onClick={onClose}>Política de privacidad</a></li>
              <li><a href="#" className="sidebar-link sidebar-link--secondary" onClick={onClose}>Términos y condiciones</a></li>
              <li><a href="#" className="sidebar-link sidebar-link--secondary" onClick={onClose}>Cookies</a></li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Sidebar;
