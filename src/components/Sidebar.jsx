import './Sidebar.css';

function Sidebar({ isOpen, onClose, onSelectPuestoClick, onMapClick, onInstruccionesClick, onPageClick }) {
  const nav = (view) => { onClose(); onPageClick && onPageClick(view); };

  return (
    <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-nav">

        {/* Columna izquierda — enlaces grandes */}
        <div className="sidebar-col sidebar-col--main">
          <ul className="sidebar-list">
            <li><a href="#" className="sidebar-link sidebar-link--main" onClick={(e) => { e.preventDefault(); onClose(); onSelectPuestoClick && onSelectPuestoClick(); }}>Puestos</a></li>
            <li><a href="#" className="sidebar-link sidebar-link--main" onClick={(e) => { e.preventDefault(); onClose(); onMapClick && onMapClick(); }}>Plano del mercado</a></li>
            <li><a href="#" className="sidebar-link sidebar-link--main" onClick={(e) => { e.preventDefault(); nav('elige-tu-cesta'); }}>Elige tu cesta</a></li>
            <li><a href="#" className="sidebar-link sidebar-link--main" onClick={(e) => { e.preventDefault(); onClose(); }}>Mi perfil</a></li>
            <li><a href="#" className="sidebar-link sidebar-link--main" onClick={(e) => { e.preventDefault(); onClose(); onInstruccionesClick && onInstruccionesClick(); }}>Instrucciones</a></li>
          </ul>
        </div>

        {/* Grupo de columnas secundarias */}
        <div className="sidebar-secondary-group">
          <div className="sidebar-col sidebar-col--secondary">
            <ul className="sidebar-list">
              <li><a href="#" className="sidebar-link sidebar-link--secondary" onClick={(e) => { e.preventDefault(); nav('cliente'); }}>Cliente</a></li>
              <li><a href="#" className="sidebar-link sidebar-link--secondary" onClick={(e) => { e.preventDefault(); nav('contacto'); }}>Contacto</a></li>
              <li><a href="#" className="sidebar-link sidebar-link--secondary" onClick={(e) => { e.preventDefault(); nav('faq'); }}>Preguntas frecuentes</a></li>
            </ul>
          </div>

          <div className="sidebar-col sidebar-col--secondary">
            <ul className="sidebar-list">
              <li><a href="#" className="sidebar-link sidebar-link--secondary" onClick={(e) => { e.preventDefault(); nav('privacidad'); }}>Política de privacidad</a></li>
              <li><a href="#" className="sidebar-link sidebar-link--secondary" onClick={(e) => { e.preventDefault(); nav('terminos'); }}>Términos y condiciones</a></li>
              <li><a href="#" className="sidebar-link sidebar-link--secondary" onClick={(e) => { e.preventDefault(); nav('cookies'); }}>Cookies</a></li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Sidebar;
