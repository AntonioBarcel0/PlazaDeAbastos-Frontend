import { useState } from 'react';
import './Footer.css';

function Footer() {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: '',
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Conectar con endpoint de contacto
  };

  return (
    <footer className="footer">
      <div className="footer-main">

        {/* Formulario de contacto */}
        <div className="footer-contact">
          <h3 className="footer-contact-title">Contacta con nosotros</h3>
          <form className="footer-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={form.nombre}
              onChange={handleChange}
              className="footer-input"
            />
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={handleChange}
              className="footer-input"
            />
            <input
              type="text"
              name="asunto"
              placeholder="Asunto"
              value={form.asunto}
              onChange={handleChange}
              className="footer-input"
            />
            <textarea
              name="mensaje"
              placeholder="Mensaje"
              value={form.mensaje}
              onChange={handleChange}
              className="footer-input footer-textarea"
              rows={3}
            />
            <button type="submit" className="footer-submit">Enviar</button>
          </form>
        </div>

        {/* Navegación */}
        <nav className="footer-nav">
          <ul className="footer-nav-col">
            <li><a href="#" className="footer-link">Puestos</a></li>
            <li><a href="#" className="footer-link">A domicilio</a></li>
            <li><a href="#" className="footer-link">Elige tu cesta</a></li>
            <li><a href="#" className="footer-link">Blog</a></li>
            <li><a href="#" className="footer-link">Instrucciones</a></li>
          </ul>
          <ul className="footer-nav-col">
            <li><a href="#" className="footer-link">Cliente</a></li>
            <li><a href="#" className="footer-link">Contacto</a></li>
            <li><a href="#" className="footer-link">Preguntas frecuentes</a></li>
          </ul>
          <ul className="footer-nav-col">
            <li><a href="#" className="footer-link">Política de privacidad</a></li>
            <li><a href="#" className="footer-link">Términos y condiciones</a></li>
            <li><a href="#" className="footer-link">Cookies</a></li>
          </ul>
        </nav>
      </div>

      {/* Logo inferior */}
      <div className="footer-brand">
        <span className="footer-brand-text">Plaza de Abastos</span>
      </div>
    </footer>
  );
}

export default Footer;
