import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './InfoPage.css';

function Terminos({
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
          <h1 className="info-title">Términos y Condiciones</h1>
          <p className="info-lead">
            Última actualización: 1 de mayo de 2026. La utilización de esta plataforma implica
            la aceptación íntegra de los presentes términos y condiciones.
          </p>
        </div>

        <div className="info-card">
          <h2 className="info-section-title">1. Objeto y ámbito de aplicación</h2>
          <p className="info-text">
            Los presentes Términos y Condiciones Generales (en adelante, «TCG») regulan el
            acceso, navegación y uso de la plataforma de comercio electrónico Plaza de Abastos
            (en adelante, la «Plataforma»), titularidad de Plaza de Abastos Úbeda S.L.,
            con CIF B-23123456 y domicilio en C/ Fosal, s/n, 23400 Úbeda (Jaén).
          </p>
          <p className="info-text">
            La Plataforma actúa como mercado en línea (<em>marketplace</em>) que pone en
            contacto a los comerciantes del Mercado Municipal de Abastos de Úbeda con
            consumidores finales para la venta y entrega de productos frescos y de alimentación.
          </p>
        </div>

        <div className="info-card">
          <h2 className="info-section-title">2. Acceso y registro de usuarios</h2>
          <p className="info-text">
            El uso de la Plataforma como comprador requiere el registro previo mediante la
            creación de una cuenta personal con dirección de correo electrónico válida y
            contraseña. El usuario garantiza que los datos facilitados son verídicos, actuales
            y completos, y que es mayor de 18 años o cuenta con autorización parental.
          </p>
          <p className="info-text">
            El usuario es responsable de mantener la confidencialidad de sus credenciales y
            de toda la actividad que se produzca bajo su cuenta. Ante cualquier uso no
            autorizado deberá notificárnoslo de inmediato a info@plazadeabastos.es.
          </p>
        </div>

        <div className="info-card">
          <h2 className="info-section-title">3. Proceso de compra y formación del contrato</h2>
          <p className="info-text">
            El proceso de compra comprende las siguientes etapas:
          </p>
          <ul className="info-list">
            <li>Selección de productos y comerciante(s).</li>
            <li>Revisión del carrito y confirmación de la dirección de entrega.</li>
            <li>Selección de la modalidad de entrega (domicilio o recogida en mercado).</li>
            <li>Pago a través de la pasarela segura.</li>
            <li>Confirmación del pedido por correo electrónico.</li>
          </ul>
          <p className="info-text">
            El contrato de compraventa se perfecciona en el momento en que el usuario recibe
            el correo de confirmación del pedido. Hasta ese momento, Plaza de Abastos se
            reserva el derecho a rechazar el pedido si algún producto no está disponible o
            existe un error manifiesto en el precio.
          </p>
        </div>

        <div className="info-card">
          <h2 className="info-section-title">4. Precios, impuestos y gastos de envío</h2>
          <p className="info-text">
            Todos los precios mostrados en la Plataforma incluyen el IVA aplicable y están
            expresados en euros (€). Los gastos de envío, cuando procedan, se calcularán
            en función de la dirección de entrega y se mostrarán antes de confirmar el pedido.
          </p>
          <div className="info-highlight">
            Plaza de Abastos se reserva el derecho de modificar los precios en cualquier
            momento. El precio aplicable será siempre el vigente en el momento de la
            confirmación del pedido.
          </div>
        </div>

        <div className="info-card">
          <h2 className="info-section-title">5. Entrega y modalidades</h2>
          <p className="info-text">
            Ofrecemos dos modalidades de entrega:
          </p>
          <ul className="info-list">
            <li><strong>Entrega a domicilio:</strong> disponible en Úbeda y entorno (radio ≤ 25 km). Pedidos antes de las 11:00 h, entrega en el mismo día en horario de tarde.</li>
            <li><strong>Recogida en mercado:</strong> disponible sin coste adicional en horario de apertura del Mercado Municipal.</li>
          </ul>
          <p className="info-text">
            En caso de ausencia en el domicilio en el momento de la entrega, el repartidor
            dejará aviso para concertar una segunda entrega. Si en la segunda entrega tampoco
            es posible la recepción, el pedido se considerará recogido en mercado y deberá
            retirarse en el plazo de 48 horas.
          </p>
        </div>

        <div className="info-card">
          <h2 className="info-section-title">6. Derecho de desistimiento y devoluciones</h2>
          <p className="info-text">
            Conforme al Real Decreto Legislativo 1/2007 (TRLGCU), el usuario consumidor
            dispone de un plazo de <strong>14 días naturales</strong> desde la recepción del
            pedido para ejercer el derecho de desistimiento en productos no perecederos,
            sin necesidad de justificación y sin penalización.
          </p>
          <p className="info-text">
            Quedan excluidos del derecho de desistimiento los bienes susceptibles de deteriorarse
            o caducar con rapidez (frutas, verduras, carnes, pescados, productos de panadería,
            lácteos, etc.), conforme al art. 103.d) TRLGCU.
          </p>
          <p className="info-text">
            Para devoluciones por producto defectuoso o incorrecto, consulta nuestra sección
            de Atención al Cliente.
          </p>
        </div>

        <div className="info-card">
          <h2 className="info-section-title">7. Obligaciones del usuario</h2>
          <p className="info-text">El usuario se compromete a:</p>
          <ul className="info-list">
            <li>Utilizar la Plataforma únicamente para fines lícitos y conforme a los presentes TCG.</li>
            <li>No reproducir, copiar ni explotar comercialmente ningún contenido de la Plataforma sin autorización escrita.</li>
            <li>No introducir virus, malware ni cualquier código que pueda dañar la Plataforma.</li>
            <li>No realizar pedidos de forma fraudulenta o con datos falsos.</li>
            <li>Tratar con respeto a los comerciantes y al personal del mercado.</li>
          </ul>
        </div>

        <div className="info-card">
          <h2 className="info-section-title">8. Propiedad intelectual e industrial</h2>
          <p className="info-text">
            Todos los contenidos de la Plataforma —diseño, logotipos, textos, imágenes,
            código fuente y elementos gráficos— son propiedad de Plaza de Abastos Úbeda S.L.
            o de sus licenciantes, y están protegidos por la normativa española e internacional
            de propiedad intelectual e industrial. Queda prohibida su reproducción,
            distribución o comunicación pública sin autorización expresa.
          </p>
        </div>

        <div className="info-card">
          <h2 className="info-section-title">9. Limitación de responsabilidad</h2>
          <p className="info-text">
            Plaza de Abastos actúa como intermediario entre el usuario y los comerciantes del
            mercado. La responsabilidad sobre la calidad, cantidad y estado de los productos
            corresponde en última instancia al comerciante correspondiente.
          </p>
          <p className="info-text">
            Plaza de Abastos no será responsable de daños indirectos, pérdida de beneficios
            o daños derivados de interrupciones del servicio, siempre que estas sean debidas
            a causas de fuerza mayor o a hechos ajenos a su control.
          </p>
        </div>

        <div className="info-card">
          <h2 className="info-section-title">10. Legislación aplicable y jurisdicción</h2>
          <p className="info-text">
            Los presentes TCG se rigen por la legislación española. Para la resolución de
            cualquier controversia derivada de su interpretación o aplicación, las partes
            se someten, con renuncia a cualquier otro fuero, a los Juzgados y Tribunales de
            la ciudad de Jaén, salvo que la normativa de consumidores establezca un fuero
            imperativo diferente en favor del usuario.
          </p>
          <p className="info-text">
            La Comisión Europea pone a disposición de los consumidores la plataforma de
            resolución de litigios en línea (ODR) accesible en ec.europa.eu/consumers/odr.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Terminos;
