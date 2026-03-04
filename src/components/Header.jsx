import './Header.css';

function Header({ onMenuClick, onLoginClick, onLogoClick, user, onLogout, onDashboardClick }) {
  return (
    <header className="header">
      <button className="menu-btn" onClick={onMenuClick} aria-label="Abrir menú">
        <img 
          src="https://res.cloudinary.com/dlmnchkjg/image/upload/v1770290242/Captura_de_pantalla_2026-02-05_a_las_12.17.18_kenzes.png" 
          alt="Menú"
          className="menu-icon"
        />
      </button>

      <button className="logo" onClick={onLogoClick} aria-label="Ir al inicio">
        <img 
          src="https://res.cloudinary.com/dlmnchkjg/image/upload/v1770289985/Captura_de_pantalla_2026-02-05_a_las_12.12.57_fhymgg.png" 
          alt="logo"
          className="logo-image"
        />
      </button>

      <div className="right-section">
        {user ? (
          <>
            <span className="user-name">{user.nombre}</span>
            {(user.role === 'comerciante' || user.role === 'admin') && onDashboardClick && (
              <button className="dashboard-btn" onClick={onDashboardClick} aria-label="Panel de control">
                📊
              </button>
            )}
            <button className="log-btn" onClick={onLogout} aria-label="Cerrar sesión">
              🚪
            </button>
          </>
        ) : (
          <button className="log-btn" onClick={onLoginClick} aria-label="registro">
            <img 
              src="https://res.cloudinary.com/dlmnchkjg/image/upload/v1770290764/Captura_de_pantalla_2026-02-05_a_las_12.25.59_k694e7.png" 
              alt="registro"
              className="log-icon"
            />
          </button>
        )}

        <button className="cart-btn" aria-label="Carrito de compra">
          <img 
            src="https://res.cloudinary.com/dlmnchkjg/image/upload/v1770290214/Captura_de_pantalla_2026-02-05_a_las_12.16.48_syfomx.png" 
            alt="Carrito compra"
            className="cart-icon"
          />
        </button>
      </div>
    </header>
  );
}

export default Header;