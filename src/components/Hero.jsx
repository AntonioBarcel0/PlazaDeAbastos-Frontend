import './Hero.css';

function Hero() {
  return (
    <section className="hero">
      <div className="hero-overlay">
        <div className="hero-title-wrapper">
          <img 
            src="https://res.cloudinary.com/dlmnchkjg/image/upload/v1770290044/Plaza_de_Abastos_dn46eq.png" 
            alt="Plaza de Abastos"
            className="hero-title-image"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;