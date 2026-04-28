import './Hero.css';

function Hero({ onMapClick }) {
  return (
    <section className="hero">
      <div className="hero-overlay">
        <div className="hero-title-wrapper">
          <img
            src="https://res.cloudinary.com/dlmnchkjg/image/upload/v1770290044/Plaza_de_Abastos_dn46eq.png"
            alt="Plaza de Abastos"
            className="hero-title-image"
          />
          {onMapClick && (
            <button className="hero-map-btn" onClick={onMapClick}>
              Ver plano del mercado
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default Hero;