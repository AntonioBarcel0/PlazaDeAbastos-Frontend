import { MapPin, Store, ShoppingBasket, CreditCard, Truck, CheckCircle } from 'lucide-react';
import './HowToOrder.css';

const STEPS = [
  {
    id: 1,
    icon: MapPin,
    title: 'Confirma tu dirección',
    description: 'Antes de empezar, verificamos que tu dirección se encuentre dentro de nuestra zona de reparto. Introduce tu código postal y te indicaremos si podemos llevar el mercado hasta tu puerta.',
  },
  {
    id: 2,
    icon: Store,
    title: 'Explora los puestos',
    description: 'Navega por los distintos puestos del mercado como si estuvieras paseando por sus pasillos. Cada puesto tiene su propia selección de productos frescos: fruterías, panaderías, queserías, encurtidos y mucho más.',
  },
  {
    id: 3,
    icon: ShoppingBasket,
    title: 'Llena tu cesta',
    description: 'Añade los productos que necesites al carrito desde cualquier puesto. Puedes combinar productos de diferentes comerciantes en un mismo pedido. Elige la cantidad exacta que necesitas.',
  },
  {
    id: 4,
    icon: CreditCard,
    title: 'Realiza el pago',
    description: 'Revisa tu carrito, comprueba que todo está correcto y procede al pago de forma segura. Aceptamos las principales tarjetas de crédito y débito para que pagues con total tranquilidad.',
  },
  {
    id: 5,
    icon: Truck,
    title: 'Recibe tu pedido',
    description: 'Cada comerciante prepara tu pedido con el mismo cuidado que si te atendiese en persona. Recibirás tus productos frescos directamente en casa, manteniendo toda su calidad.',
  },
  {
    id: 6,
    icon: CheckCircle,
    title: 'Disfruta de lo fresco',
    description: 'Productos del mercado de toda la vida, con la comodidad de recibirlos sin moverte de casa. Apoyando al comercio local y disfrutando de la mejor calidad.',
  },
];

function HowToOrder() {
  return (
    <section className="how-section" id="how-to-order">
      <div className="how-header">
        <h2 className="how-title">Cómo hacer tu pedido</h2>
        <p className="how-subtitle">
          Comprar en la Plaza de Abastos nunca fue tan fácil. Sigue estos pasos y recibe productos frescos del mercado en tu hogar.
        </p>
      </div>

      <div className="how-timeline">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.id} className="how-step">
              <div className="how-step-indicator">
                <div className="how-step-icon-circle">
                  <Icon size={28} strokeWidth={1.8} />
                </div>
                {index < STEPS.length - 1 && <div className="how-step-line" />}
              </div>
              <div className="how-step-content">
                <div className="how-step-number-badge">{step.id}</div>
                <h3 className="how-step-title">{step.title}</h3>
                <p className="how-step-description">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="how-tip">
        <p className="how-tip-text">
          <strong>Consejo:</strong> También puedes elegir una de nuestras cestas predefinidas con productos ya seleccionados por los propios comerciantes del mercado. Perfectas para cuando no tienes tiempo de elegir producto a producto.
        </p>
      </div>
    </section>
  );
}

export default HowToOrder;
