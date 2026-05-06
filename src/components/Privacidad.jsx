import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './InfoPage.css';

function Privacidad({
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
          <span className="info-eyebrow">Legal</span>
          <h1 className="info-title">Política de Privacidad</h1>
          <p className="info-lead">
            Última actualización: 1 de mayo de 2026. En cumplimiento del Reglamento (UE) 2016/679
            (RGPD) y la Ley Orgánica 3/2018 de Protección de Datos Personales (LOPDGDD).
          </p>
        </div>

        <div className="info-card">
          <h2 className="info-section-title">1. Responsable del tratamiento</h2>
          <p className="info-text">
            <strong>Razón social:</strong> Plaza de Abastos Úbeda S.L.<br />
            <strong>CIF:</strong> B-23123456<br />
            <strong>Domicilio social:</strong> C/ Fosal, s/n, 23400 Úbeda (Jaén)<br />
            <strong>Correo electrónico:</strong> privacidad@plazadeabastos.es<br />
            <strong>Delegado de Protección de Datos (DPD):</strong> dpd@plazadeabastos.es
          </p>
        </div>

        <div className="info-card">
          <h2 className="info-section-title">2. Datos personales que recogemos</h2>
          <p className="info-text">En el marco de la prestación de nuestros servicios tratamos las siguientes categorías de datos:</p>
          <ul className="info-list">
            <li><strong>Datos identificativos:</strong> nombre y apellidos, dirección de entrega, código postal.</li>
            <li><strong>Datos de contacto:</strong> dirección de correo electrónico y número de teléfono.</li>
            <li><strong>Datos de la cuenta:</strong> nombre de usuario y contraseña cifrada (bcrypt).</li>
            <li><strong>Datos de la transacción:</strong> historial de pedidos, importes abonados y métodos de pago (no almacenamos datos de tarjeta completos).</li>
            <li><strong>Datos de navegación:</strong> dirección IP, tipo de dispositivo, páginas visitadas y tiempo de sesión, recogidos mediante cookies propias y de análisis.</li>
          </ul>
        </div>

        <div className="info-card">
          <h2 className="info-section-title">3. Finalidades y base legal del tratamiento</h2>
          <p className="info-text">Tratamos tus datos para las siguientes finalidades:</p>
          <ul className="info-list">
            <li><strong>Gestión de la cuenta de usuario</strong> — Base legal: ejecución del contrato (art. 6.1.b RGPD).</li>
            <li><strong>Procesamiento de pedidos y logística de entrega</strong> — Base legal: ejecución del contrato.</li>
            <li><strong>Comunicaciones transaccionales</strong> (confirmación de pedido, cambios de estado) — Base legal: ejecución del contrato.</li>
            <li><strong>Comunicaciones comerciales y promocionales</strong> — Base legal: consentimiento expreso (art. 6.1.a RGPD). Puedes revocar tu consentimiento en cualquier momento.</li>
            <li><strong>Cumplimiento de obligaciones legales</strong> (fiscales, contables) — Base legal: cumplimiento de obligación legal (art. 6.1.c RGPD).</li>
            <li><strong>Análisis estadístico y mejora del servicio</strong> — Base legal: interés legítimo (art. 6.1.f RGPD).</li>
          </ul>
        </div>

        <div className="info-card">
          <h2 className="info-section-title">4. Conservación de los datos</h2>
          <p className="info-text">
            Los datos de cuenta se conservarán mientras mantengas tu cuenta activa. Tras la baja,
            los eliminaremos en un plazo máximo de 30 días, salvo que la normativa vigente nos
            obligue a conservarlos por un período mayor (p. ej., datos fiscales: 5 años; datos
            contables: 6 años; comunicaciones comerciales: 3 años).
          </p>
        </div>

        <div className="info-card">
          <h2 className="info-section-title">5. Destinatarios de los datos</h2>
          <p className="info-text">
            No cedemos tus datos personales a terceros salvo en los siguientes casos:
          </p>
          <ul className="info-list">
            <li><strong>Comerciantes del mercado:</strong> únicamente los datos necesarios para preparar y entregar tu pedido (nombre, dirección, teléfono de contacto).</li>
            <li><strong>Pasarela de pago:</strong> datos de transacción tratados por nuestro proveedor de pagos bajo su propia política de privacidad, con certificación PCI-DSS.</li>
            <li><strong>Proveedores de servicios tecnológicos</strong> (hosting, CDN, análisis): actúan como encargados del tratamiento mediante contratos de encargo conforme al art. 28 RGPD.</li>
            <li><strong>Autoridades públicas:</strong> cuando así lo exija la ley.</li>
          </ul>
          <div className="info-highlight">
            Ninguno de nuestros proveedores está ubicado fuera del Espacio Económico Europeo sin
            las garantías adecuadas exigidas por el RGPD.
          </div>
        </div>

        <div className="info-card">
          <h2 className="info-section-title">6. Tus derechos</h2>
          <p className="info-text">
            Conforme al RGPD y la LOPDGDD, puedes ejercer los siguientes derechos enviando
            un correo a <strong>privacidad@plazadeabastos.es</strong> con copia de tu DNI:
          </p>
          <ul className="info-list">
            <li><strong>Acceso:</strong> conocer qué datos tratamos sobre ti.</li>
            <li><strong>Rectificación:</strong> corregir datos inexactos o incompletos.</li>
            <li><strong>Supresión («derecho al olvido»):</strong> solicitar la eliminación de tus datos.</li>
            <li><strong>Limitación:</strong> restringir el tratamiento en determinadas circunstancias.</li>
            <li><strong>Portabilidad:</strong> recibir tus datos en formato estructurado y de uso común.</li>
            <li><strong>Oposición:</strong> oponerte al tratamiento basado en interés legítimo o a comunicaciones comerciales.</li>
          </ul>
          <p className="info-text">
            Atenderemos tu solicitud en un plazo máximo de 30 días. Si consideras que el
            tratamiento no es conforme al RGPD, puedes presentar una reclamación ante la
            <strong> Agencia Española de Protección de Datos (AEPD)</strong> en www.aepd.es.
          </p>
        </div>

        <div className="info-card">
          <h2 className="info-section-title">7. Seguridad</h2>
          <p className="info-text">
            Aplicamos medidas técnicas y organizativas adecuadas para proteger tus datos frente
            a accesos no autorizados, pérdida o destrucción accidental, incluidas: cifrado TLS
            en tránsito, hashing bcrypt de contraseñas, controles de acceso basados en roles
            y copias de seguridad periódicas cifradas.
          </p>
        </div>

        <div className="info-card">
          <h2 className="info-section-title">8. Cambios en esta política</h2>
          <p className="info-text">
            Podemos actualizar esta política para reflejar cambios legales o en nuestros
            servicios. Te notificaremos cualquier cambio significativo por correo electrónico
            o mediante un aviso destacado en la plataforma. La fecha de última modificación
            siempre aparece en la cabecera de este documento.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Privacidad;
