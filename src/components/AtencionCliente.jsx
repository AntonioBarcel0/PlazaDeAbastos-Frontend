import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './InfoPage.css';

function AtencionCliente({
  user, onLogout, onDashboardClick, onCartClick, onOrdersClick,
  onHomeClick, onPageClick, onMarketplaceClick, onSelectPuestoClick,
  onMapClick, onInstruccionesClick, onLoginClick,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="info-container">
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
        onMarketplaceClick={onMarketplaceClick}
        onSelectPuestoClick={onSelectPuestoClick}
        onMapClick={onMapClick}
        onInstruccionesClick={onInstruccionesClick}
        user={user}
        onLoginClick={onLoginClick}
        onOrdersClick={onOrdersClick}
        onDashboardClick={onDashboardClick}
      />

      <main className="info-main">
        <div className="info-hero">
          <span className="info-eyebrow">Atención al cliente</span>
          <h1 className="info-title">Estamos aquí para ayudarte</h1>
          <p className="info-lead">
            En Plaza de Abastos queremos que tu experiencia sea siempre satisfactoria.
            Si tienes cualquier duda, incidencia o sugerencia, no dudes en contactar con nuestro equipo.
          </p>
        </div>

        {/* Canales de contacto */}
        <div className="info-grid">
          <div className="info-grid-card">
            <div className="info-grid-card-icon">📞</div>
            <div className="info-grid-card-label">Teléfono</div>
            <div className="info-grid-card-value">+34 953 750 897</div>
            <div className="info-grid-card-sub">Lun – Sáb · 8:00 – 14:30</div>
          </div>
          <div className="info-grid-card">
            <div className="info-grid-card-icon">✉️</div>
            <div className="info-grid-card-label">Correo electrónico</div>
            <div className="info-grid-card-value">clientes@plazadeabastos.es</div>
            <div className="info-grid-card-sub">Respuesta en menos de 24 h</div>
          </div>
          <div className="info-grid-card">
            <div className="info-grid-card-icon">📍</div>
            <div className="info-grid-card-label">Visítanos</div>
            <div className="info-grid-card-value">Mercado Municipal de Abastos</div>
            <div className="info-grid-card-sub">C/ Fosal, s/n · 23400 Úbeda, Jaén</div>
          </div>
          <div className="info-grid-card">
            <div className="info-grid-card-icon">⏱️</div>
            <div className="info-grid-card-label">Tiempo de respuesta</div>
            <div className="info-grid-card-value">Menos de 24 horas</div>
            <div className="info-grid-card-sub">En días laborables</div>
          </div>
        </div>

        {/* Gestión de pedidos */}
        <div className="info-card">
          <h2 className="info-section-title">Gestión de pedidos</h2>
          <p className="info-text">
            Puedes consultar el estado de tus pedidos en cualquier momento desde la sección
            <strong> Mis Pedidos</strong> de tu cuenta. Si necesitas modificar o cancelar un pedido
            que aún no ha sido preparado, escríbenos lo antes posible a través del formulario de
            <span> Contacto</span> o llámanos directamente.
          </p>
          <div className="info-highlight">
            Una vez que el comerciante marque el pedido como <strong>«listo»</strong>, no podremos
            garantizar la cancelación. Te recomendamos revisar bien tu cesta antes de confirmar.
          </div>
        </div>

        {/* Incidencias */}
        <div className="info-card">
          <h2 className="info-section-title">Incidencias y reclamaciones</h2>
          <p className="info-text">
            Si has recibido un producto en mal estado, con alguna carencia o diferente a lo
            solicitado, tienes un plazo de <strong>48 horas</strong> desde la recepción para
            comunicárnoslo. Necesitaremos:
          </p>
          <ul className="info-list">
            <li>Tu número de pedido.</li>
            <li>Una descripción clara de la incidencia.</li>
            <li>Fotografía del producto si es posible.</li>
          </ul>
          <p className="info-text">
            Estudiaremos tu caso y te daremos respuesta en un plazo máximo de 72 horas hábiles.
          </p>
        </div>

        {/* Devoluciones */}
        <div className="info-card">
          <h2 className="info-section-title">Política de devoluciones</h2>
          <p className="info-text">
            Dado que trabajamos con <strong>productos frescos y perecederos</strong>, no admitimos
            devoluciones salvo en caso de error del comerciante o producto en mal estado al momento
            de la entrega. En esos casos gestionaremos la devolución íntegra del importe abonado
            en un plazo de 3 a 5 días hábiles.
          </p>
          <p className="info-text">
            Para productos no perecederos (conservas, aceites, especias, etc.) se aplica el
            derecho de desistimiento establecido por la legislación española, con un plazo de
            14 días naturales desde la recepción.
          </p>
        </div>

        {/* Mi cuenta */}
        <div className="info-card">
          <h2 className="info-section-title">Gestión de tu cuenta</h2>
          <p className="info-text">
            Desde tu perfil puedes actualizar tus datos personales, cambiar tu contraseña y
            consultar el historial completo de tus pedidos. Si deseas eliminar tu cuenta de
            forma permanente, escríbenos a <strong>privacidad@plazadeabastos.es</strong> y
            procesaremos tu solicitud en un plazo máximo de 30 días, en cumplimiento del RGPD.
          </p>
        </div>
      </main>
    </div>
  );
}

export default AtencionCliente;
