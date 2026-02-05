import './Sidebar.css';

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`} 
        onClick={onClose}
      />

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        

        <div className="sidebar-content">
          <div className="sidebar-column">
            <nav className="menu-section">
              <ul className="menu-list">
                <li><a href="#" className="menu-link">Puestos</a></li>
                <li><a href="#" className="menu-link">A domicilio</a></li>
                <li><a href="#" className="menu-link">Elige tu cesta</a></li>
                <li><a href="#" className="menu-link">Mi perfil</a></li>
                <li><a href="#" className="menu-link">Instrucciones</a></li>
              </ul>
            </nav>
          </div>

          <div className="sidebar-column">
            <nav className="menu-section">
              <ul className="menu-list">
                <li><a href="#" className="menu-link">Cliente</a></li>
                <li><a href="#" className="menu-link">Contacto</a></li>
                <li><a href="#" className="menu-link">Preguntas frequentes</a></li>
              </ul>
            </nav>

            <nav className="menu-section">
              <ul className="menu-list">
                <li><a href="#" className="menu-link">Política de privacidad</a></li>
                <li><a href="#" className="menu-link">Términos y condiciones</a></li>
                <li><a href="#" className="menu-link">Cookies</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;