import './LaPlaza.css';

// TODO: Conectar con API /api/vendedores para datos dinámicos
const VENDORS = [
  'Carnicería Domínguez',
  'Frutas Jurado',
  'Dulces Higueras',
  'Comestibles García',
  'Pescadería Martínez',
  'Verduras Sánchez',
  'Panadería López',
  'Lácteos Romero',
];

// TODO: Conectar con API /api/products para recomendaciones dinámicas
const RECOMMENDATIONS = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
];

// TODO: Conectar con API /api/products?temporada=true para productos de temporada
const SEASONAL = [
  { id: 1, name: 'Alcachofa', price: '3,99€/Kg' },
  { id: 2, name: 'Alcachofa', price: '3,99€/Kg' },
];

function LaPlaza({ onMarketplaceClick }) {
  return (
    <>
      <section className="laplaza-section">
        <h2 className="laplaza-title">La Plaza</h2>

        {/* Marquee de nombres de vendedores */}
        <div className="vendors-marquee">
          <div className="vendors-track">
            {[...VENDORS, ...VENDORS].map((vendor, i) => (
              <span key={i} className="vendor-item">{vendor}</span>
            ))}
          </div>
        </div>

        {/* Recomendaciones */}
        <div className="recommendations-wrap">
          <h3 className="recommendations-title">Recomendaciones</h3>
          <div className="recommendations-grid">
            {RECOMMENDATIONS.map(r => (
              <div key={r.id} className="rec-card">
                {/* TODO: <img src="cloudinary-url" alt="producto" className="rec-image" /> */}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Productos de temporada */}
      <section className="seasonal-section">
        <div className="seasonal-badge-wrap">
          <span className="seasonal-badge">Productos de temporada</span>
        </div>
        <div className="seasonal-grid">
          {SEASONAL.map(product => (
            <div key={product.id} className="seasonal-card">
              {/* TODO: añadir background-image con URL de Cloudinary en .seasonal-img */}
              <div className="seasonal-img" />
              <div className="seasonal-name-band">
                <h3 className="seasonal-name">{product.name}</h3>
              </div>
              <div className="seasonal-footer">
                <p className="seasonal-price">{product.price}</p>
                <button className="seasonal-btn" onClick={onMarketplaceClick}>
                  Ver producto
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default LaPlaza;
