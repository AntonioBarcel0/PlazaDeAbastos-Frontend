import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './InfoPage.css';

function Cookies({
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
      />

      <main className="info-main">
        <div className="info-hero">
          <span className="info-eyebrow">Legal</span>
          <h1 className="info-title">Política de Cookies</h1>
          <p className="info-lead">
            Última actualización: 1 de mayo de 2026. En cumplimiento del art. 22.2 de la
            Ley 34/2002, de Servicios de la Sociedad de la Información (LSSI), te informamos
            sobre el uso de cookies en esta plataforma.
          </p>
        </div>

        <div className="info-card">
          <h2 className="info-section-title">¿Qué son las cookies?</h2>
          <p className="info-text">
            Las cookies son pequeños archivos de texto que los sitios web almacenan en tu
            dispositivo (ordenador, móvil o tablet) cuando los visitas. Permiten que la web
            recuerde tus acciones y preferencias durante un período de tiempo, para que no
            tengas que volver a introducirlas cada vez que regreses.
          </p>
          <p className="info-text">
            Las cookies no son virus ni software malicioso: no pueden acceder a información
            de tu dispositivo ni ejecutar código. Únicamente almacenan y recuperan información
            sobre tu navegación.
          </p>
        </div>

        <div className="info-card">
          <h2 className="info-section-title">Tipos de cookies que utilizamos</h2>

          <h3 style={{ fontFamily: 'Afacad, sans-serif', fontSize: '1rem', fontWeight: 700, color: '#333', margin: '0 0 0.75rem' }}>
            Cookies técnicas (necesarias)
          </h3>
          <p className="info-text">
            Son imprescindibles para el funcionamiento de la Plataforma. Sin ellas, los
            servicios que hayas solicitado no pueden prestarse. No requieren tu consentimiento
            ya que su uso se basa en el interés legítimo para garantizar la seguridad y
            funcionalidad de la web.
          </p>

          <hr className="info-divider" />

          <h3 style={{ fontFamily: 'Afacad, sans-serif', fontSize: '1rem', fontWeight: 700, color: '#333', margin: '0 0 0.75rem' }}>
            Cookies analíticas
          </h3>
          <p className="info-text">
            Nos permiten conocer cómo interactúan los visitantes con la Plataforma (páginas
            vistas, tiempo en el sitio, rutas de navegación) de forma agregada y anónima,
            con el fin de mejorar nuestros servicios. Requieren tu consentimiento.
          </p>

          <hr className="info-divider" />

          <h3 style={{ fontFamily: 'Afacad, sans-serif', fontSize: '1rem', fontWeight: 700, color: '#333', margin: '0 0 0.75rem' }}>
            Cookies de preferencias
          </h3>
          <p className="info-text">
            Recuerdan tus configuraciones y preferencias (código postal de entrega, idioma,
            última selección de puestos) para ofrecerte una experiencia personalizada en
            visitas futuras.
          </p>
        </div>

        <div className="info-card">
          <h2 className="info-section-title">Detalle de las cookies utilizadas</h2>
          <div style={{ overflowX: 'auto' }}>
            <table className="cookies-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Duración</th>
                  <th>Finalidad</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>pda_session</code></td>
                  <td>Técnica</td>
                  <td>Sesión</td>
                  <td>Mantiene la sesión autenticada del usuario.</td>
                </tr>
                <tr>
                  <td><code>pda_postal</code></td>
                  <td>Preferencia</td>
                  <td>7 días</td>
                  <td>Recuerda el código postal de entrega confirmado.</td>
                </tr>
                <tr>
                  <td><code>pda_cart</code></td>
                  <td>Técnica</td>
                  <td>Sesión</td>
                  <td>Almacena el contenido del carrito de compra.</td>
                </tr>
                <tr>
                  <td><code>pda_csrf</code></td>
                  <td>Técnica</td>
                  <td>Sesión</td>
                  <td>Token de seguridad anti-CSRF para formularios.</td>
                </tr>
                <tr>
                  <td><code>_ga</code></td>
                  <td>Analítica</td>
                  <td>2 años</td>
                  <td>Google Analytics: distingue sesiones únicas de usuario.</td>
                </tr>
                <tr>
                  <td><code>_gid</code></td>
                  <td>Analítica</td>
                  <td>24 horas</td>
                  <td>Google Analytics: distingue usuarios.</td>
                </tr>
                <tr>
                  <td><code>_gat</code></td>
                  <td>Analítica</td>
                  <td>1 minuto</td>
                  <td>Google Analytics: limita la tasa de solicitudes.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="info-card">
          <h2 className="info-section-title">Cookies de terceros</h2>
          <p className="info-text">
            Esta Plataforma puede cargar contenido o funcionalidades de terceros que, a su
            vez, pueden instalar sus propias cookies. Los principales terceros presentes son:
          </p>
          <ul className="info-list">
            <li>
              <strong>Google Analytics</strong> (Google LLC) — análisis de tráfico web.
              Política de privacidad: policies.google.com/privacy
            </li>
            <li>
              <strong>Cloudinary</strong> (Cloudinary Ltd.) — servicio CDN de imágenes.
              No instala cookies de seguimiento propias.
            </li>
            <li>
              <strong>Proveedor de pasarela de pago</strong> — gestión segura de transacciones.
              Las cookies de este proveedor son de carácter técnico y estrictamente necesarias.
            </li>
          </ul>
          <div className="info-highlight">
            Plaza de Abastos no tiene control sobre las cookies instaladas por terceros.
            Te recomendamos revisar sus políticas de privacidad para más información.
          </div>
        </div>

        <div className="info-card">
          <h2 className="info-section-title">Cómo gestionar o deshabilitar las cookies</h2>
          <p className="info-text">
            Puedes configurar tu navegador para aceptar, rechazar o eliminar cookies en
            cualquier momento. A continuación te indicamos cómo hacerlo en los navegadores
            más habituales:
          </p>
          <ul className="info-list">
            <li><strong>Google Chrome:</strong> Configuración › Privacidad y seguridad › Cookies y otros datos de sitios.</li>
            <li><strong>Mozilla Firefox:</strong> Opciones › Privacidad y seguridad › Cookies y datos del sitio.</li>
            <li><strong>Safari (macOS / iOS):</strong> Preferencias › Privacidad › Gestionar datos de sitios web.</li>
            <li><strong>Microsoft Edge:</strong> Configuración › Privacidad, búsqueda y servicios › Cookies.</li>
          </ul>
          <p className="info-text">
            Ten en cuenta que deshabilitar las cookies técnicas puede impedir el correcto
            funcionamiento de la Plataforma, incluyendo el inicio de sesión y el carrito.
          </p>
        </div>

        <div className="info-card">
          <h2 className="info-section-title">Actualizaciones de esta política</h2>
          <p className="info-text">
            Podemos revisar esta Política de Cookies cuando lo consideremos necesario,
            por ejemplo, si introducimos nuevas funcionalidades o cambian los servicios de
            terceros. Cualquier cambio sustancial será comunicado mediante un aviso en la
            Plataforma. La fecha de última modificación siempre aparece en la cabecera
            de este documento.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Cookies;
