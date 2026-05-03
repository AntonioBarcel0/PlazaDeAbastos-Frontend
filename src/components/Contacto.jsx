import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './InfoPage.css';

const ASUNTOS = [
  'Consulta sobre un pedido',
  'Problema con un producto',
  'Sugerencia o mejora',
  'Colaboración comercial',
  'Otro',
];

function Contacto({
  user, onLogout, onDashboardClick, onCartClick, onOrdersClick,
  onHomeClick, onPageClick, onMarketplaceClick, onSelectPuestoClick,
  onMapClick, onInstruccionesClick, onLoginClick,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [form, setForm] = useState({ nombre: '', email: '', asunto: '', mensaje: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

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
      />

      <main className="info-main">
        <div className="info-hero">
          <span className="info-eyebrow">Contacto</span>
          <h1 className="info-title">Ponte en contacto con nosotros</h1>
          <p className="info-lead">
            Puedes visitarnos en el mercado, llamarnos o enviarnos un mensaje. Estaremos
            encantados de atenderte.
          </p>
        </div>

        {/* Datos de contacto */}
        <div className="info-grid" style={{ marginBottom: '1.25rem' }}>
          <div className="info-grid-card">
            <div className="info-grid-card-icon">📍</div>
            <div className="info-grid-card-label">Dirección</div>
            <div className="info-grid-card-value">Mercado Municipal de Abastos</div>
            <div className="info-grid-card-sub">C/ Fosal, s/n · 23400 Úbeda, Jaén</div>
          </div>
          <div className="info-grid-card">
            <div className="info-grid-card-icon">📞</div>
            <div className="info-grid-card-label">Teléfono</div>
            <div className="info-grid-card-value">+34 953 750 897</div>
            <div className="info-grid-card-sub">Lun – Sáb · 8:00 – 14:30</div>
          </div>
          <div className="info-grid-card">
            <div className="info-grid-card-icon">✉️</div>
            <div className="info-grid-card-label">Correo electrónico</div>
            <div className="info-grid-card-value">info@plazadeabastos.es</div>
            <div className="info-grid-card-sub">Respuesta en menos de 24 h</div>
          </div>
          <div className="info-grid-card">
            <div className="info-grid-card-icon">🕐</div>
            <div className="info-grid-card-label">Horario del mercado</div>
            <div className="info-grid-card-value">Lun – Sáb · 8:00 – 14:30</div>
            <div className="info-grid-card-sub">Sáb tarde 17:00 – 20:00 · Dom cerrado</div>
          </div>
        </div>

        {/* Formulario */}
        <div className="info-card">
          <h2 className="info-section-title">Envíanos un mensaje</h2>

          {sent ? (
            <div className="contact-success">
              <span>✅</span>
              <span>
                ¡Mensaje enviado correctamente! Te responderemos en menos de 24 horas
                hábiles al correo que nos has indicado.
              </span>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-row">
                <div className="contact-field">
                  <label className="contact-label" htmlFor="nombre">Nombre</label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    className="contact-input"
                    placeholder="Tu nombre completo"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="contact-field">
                  <label className="contact-label" htmlFor="email">Correo electrónico</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="contact-input"
                    placeholder="tucorreo@ejemplo.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="contact-field">
                <label className="contact-label" htmlFor="asunto">Asunto</label>
                <select
                  id="asunto"
                  name="asunto"
                  className="contact-select"
                  value={form.asunto}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona un asunto</option>
                  {ASUNTOS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className="contact-field">
                <label className="contact-label" htmlFor="mensaje">Mensaje</label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  className="contact-textarea"
                  placeholder="Cuéntanos en qué podemos ayudarte..."
                  value={form.mensaje}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="contact-submit">Enviar mensaje</button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

export default Contacto;
