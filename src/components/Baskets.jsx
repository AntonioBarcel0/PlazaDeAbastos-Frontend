import './Baskets.css';

function Baskets({ onMarketplaceClick }) {
  const handleComprarClick = () => {
    if (onMarketplaceClick) {
      onMarketplaceClick();
    }
  };

  return (
    <section className="baskets-section" id="baskets">
      <div className="baskets-container">
        {/* Cesta 1 - Crea tu cesta */}
        <div className="basket-card">
          <h2 className="basket-title">Crea tu cesta</h2>
          <button className="basket-button" onClick={handleComprarClick}>Comprar</button>
          <div className="basket-image-container">
            <img 
              src="https://res.cloudinary.com/dlmnchkjg/image/upload/v1771336583/cestavacia_m6z1tv.png" 
              alt="Cesta vacía"
              className="basket-image"
            />
          </div>
        </div>

        {/* Cesta 2 - Compra tu cesta */}
        <div className="basket-card">
          <h2 className="basket-title">Compra tu cesta</h2>
          <button className="basket-button" onClick={handleComprarClick}>Comprar</button>
          <div className="basket-image-container">
            <img 
              src="https://res.cloudinary.com/dlmnchkjg/image/upload/v1771336582/cestallena_sgtve5.png" 
              alt="Cesta con productos"
              className="basket-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Baskets;