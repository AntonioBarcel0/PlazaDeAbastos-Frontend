import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './InfoPage.css';

const PREGUNTAS = [
  {
    id: 1,
    q: '¿Cómo puedo hacer un pedido?',
    a: 'Para hacer un pedido, navega hasta la sección «Puestos» o «Elige tu cesta», elige el comerciante que desees, añade productos a tu carrito y confirma el pedido. Si es tu primera compra, deberás registrarte con tu correo electrónico y verificar tu código postal para confirmar que realizamos envíos a tu zona.',
  },
  {
    id: 2,
    q: '¿Cuáles son los métodos de pago aceptados?',
    a: 'Actualmente aceptamos pago con tarjeta de crédito/débito (Visa, Mastercard y American Express) y transferencia bancaria a través de nuestra pasarela de pago segura. Todos los pagos están cifrados mediante protocolo TLS y cumplen con la normativa PSD2.',
  },
  {
    id: 3,
    q: '¿En qué zonas realizáis entregas a domicilio?',
    a: 'Realizamos entregas en Úbeda y localidades del entorno con un radio máximo de 25 km. Puedes comprobar si tu código postal está cubierto durante el proceso de registro o antes de confirmar el carrito. También ofrecemos la opción de recogida en el propio mercado sin coste adicional.',
  },
  {
    id: 4,
    q: '¿Puedo modificar o cancelar mi pedido?',
    a: 'Sí, siempre que el comerciante todavía no haya comenzado a prepararlo. Escríbenos a clientes@plazadeabastos.es o llámanos lo antes posible indicando tu número de pedido. Una vez que el estado cambia a «En preparación» no podemos garantizar la cancelación.',
  },
  {
    id: 5,
    q: '¿Cuándo recibiré mi pedido?',
    a: 'Los pedidos realizados antes de las 11:00 h se entregan en el mismo día en horario de tarde (16:00 – 20:00 h). Los pedidos realizados después de esa hora se entregan al día siguiente por la mañana (9:00 – 14:00 h). Los domingos y festivos no se realizan entregas.',
  },
  {
    id: 6,
    q: '¿Los productos son frescos y de origen local?',
    a: 'Absolutamente. Todos los comerciantes del Mercado Municipal de Abastos de Úbeda se abastecen directamente de productores de la comarca de La Loma y el entorno jiennense. Podrás consultar el origen de cada producto en su ficha, donde indicamos la zona de cultivo o producción.',
  },
  {
    id: 7,
    q: '¿Qué hago si falta algún producto en mi pedido?',
    a: 'Lamentamos las molestias. Si falta algún producto o el artículo recibido no se corresponde con lo pedido, contacta con nosotros en las 48 horas siguientes a la entrega con tu número de pedido y, si es posible, una fotografía del problema. Te reembolsaremos el importe del artículo en un plazo de 3 a 5 días hábiles.',
  },
  {
    id: 8,
    q: '¿Puedo comprar en varios puestos a la vez?',
    a: 'Sí. Nuestra plataforma te permite añadir productos de diferentes comerciantes en un mismo carrito. Se generará un subpedido por cada puesto, pero confirmarás y abonarás todo en un único proceso de pago. Cada comerciante preparará su parte y el gestor del mercado coordinará la entrega conjunta.',
  },
  {
    id: 9,
    q: '¿Necesito registrarme para comprar?',
    a: 'Sí, es necesario crear una cuenta para poder realizar pedidos. El registro es gratuito y solo requiere nombre, correo electrónico y contraseña. Tus datos se tratan conforme a nuestra Política de Privacidad y nunca se ceden a terceros sin tu consentimiento.',
  },
  {
    id: 10,
    q: '¿Cómo puedo ver el estado de mis pedidos?',
    a: 'Desde tu perfil, en la sección «Mis Pedidos», puedes consultar en tiempo real el estado de cada compra: pendiente, en preparación, listo para recoger o entregado. También recibirás notificaciones por correo electrónico con cada cambio de estado.',
  },
];

function FAQ({
  user, onLogout, onDashboardClick, onCartClick, onOrdersClick,
  onHomeClick, onPageClick, onMarketplaceClick, onSelectPuestoClick,
  onMapClick, onInstruccionesClick, onLoginClick,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => setOpenId(prev => (prev === id ? null : id));

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
          <span className="info-eyebrow">Preguntas frecuentes</span>
          <h1 className="info-title">¿En qué podemos ayudarte?</h1>
          <p className="info-lead">
            Aquí encontrarás respuesta a las dudas más habituales sobre pedidos, entregas,
            pagos y el funcionamiento de Plaza de Abastos.
          </p>
        </div>

        <div className="info-card">
          <div className="faq-list">
            {PREGUNTAS.map(item => (
              <div key={item.id} className="faq-item">
                <button
                  className="faq-question"
                  onClick={() => toggle(item.id)}
                  aria-expanded={openId === item.id}
                >
                  {item.q}
                  <span className={`faq-question-icon${openId === item.id ? ' open' : ''}`}>+</span>
                </button>
                <div className={`faq-answer${openId === item.id ? ' open' : ''}`}>
                  <p className="faq-answer-text">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="info-card">
          <h2 className="info-section-title">¿No encuentras lo que buscas?</h2>
          <p className="info-text">
            Si tu pregunta no aparece aquí, puedes ponerte en contacto con nuestro equipo de
            atención al cliente por correo en <strong>clientes@plazadeabastos.es</strong> o
            llamando al <strong>+34 953 750 897</strong> en horario de mercado.
          </p>
        </div>
      </main>
    </div>
  );
}

export default FAQ;
