import './HowToOrder.css';

// TODO: Actualizar textos y URLs de imágenes con contenido real
const STEPS = [
  {
    id: 1,
    description: 'Explora los puestos del mercado y elige los productos frescos que necesitas.',
  },
  {
    id: 2,
    description: 'Añade los productos al carrito y confirma tu pedido de forma rápida y segura.',
  },
  {
    id: 3,
    description: 'Recibe tus productos en casa con total frescura y calidad garantizada.',
  },
];

function HowToOrder() {
  const total = STEPS.length;

  return (
    <section className="how-section">
      <h2 className="how-title">Como hacer tu pedido</h2>
      <div className="how-grid">
        {STEPS.map(step => (
          <div key={step.id} className="how-card">
            {/* TODO: Reemplazar div por <img src="cloudinary-url" alt={`Paso ${step.id}`} className="how-img" /> */}
            <div className="how-img" />
            <div className="how-card-body">
              <p className="how-description">{step.description}</p>
              <span className="how-step-number">{step.id}/{total}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowToOrder;
