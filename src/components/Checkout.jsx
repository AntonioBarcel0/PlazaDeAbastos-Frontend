import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useCart, isKg, itemSubtotal } from '../context/CartContext';
import './Checkout.css';

function Checkout({ user, onLogout, onDashboardClick, onCartClick, onBack, onSuccess, onHomeClick, onMarketplaceClick, onSelectPuestoClick, onLoginClick, onOrdersClick, onPaymentRequest, onMapClick, onInstruccionesClick }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { cart, cartByVendor, cartTotal } = useCart();
  const [form, setForm] = useState({
    modoEntrega: 'recogida',
    direccionEntrega: '',
    telefonoContacto: '',
    notasCliente: '',
    fechaEntrega: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const orderData = {
      items: cart.map(item => ({
        productId: item.productId,
        cantidad: item.cantidad,
      })),
      modoEntrega: form.modoEntrega,
      totalEstimado: cartTotal,
    };

    if (form.direccionEntrega.trim()) orderData.direccionEntrega = form.direccionEntrega.trim();
    if (form.telefonoContacto.trim()) orderData.telefonoContacto = form.telefonoContacto.trim();
    if (form.notasCliente.trim()) orderData.notasCliente = form.notasCliente.trim();
    if (form.fechaEntrega) orderData.fechaEntrega = form.fechaEntrega;

    onPaymentRequest(orderData);
  };

  const headerProps = {
    onMenuClick: () => setSidebarOpen(!sidebarOpen),
    onLoginClick: onLoginClick || (() => {}),
    onLogoClick: onHomeClick,
    user,
    onLogout,
    onDashboardClick,
    onCartClick,
    onOrdersClick,
  };

  if (!user) {
    return (
      <div className="checkout-container">
        <Header {...headerProps} />
        <main className="checkout-main">
          <div className="checkout-success">
            <span className="checkout-success-icon">⚠️</span>
            <h2>Inicia sesión para continuar</h2>
            <p>Necesitas una cuenta para realizar un pedido.</p>
            <button className="btn-submit" onClick={onLoginClick}>
              Iniciar sesión
            </button>
          </div>
        </main>
      </div>
    );
  }

  const vendorIds = Object.keys(cartByVendor);

  return (
    <div className="checkout-container">
      <Header {...headerProps} />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onMarketplaceClick={onMarketplaceClick}
        onSelectPuestoClick={onSelectPuestoClick}
        onMapClick={onMapClick}
        onInstruccionesClick={onInstruccionesClick}
      />

      <main className="checkout-main">
        <button className="back-button" onClick={onBack}>
          ← Volver al carrito
        </button>

        <h1 className="checkout-title">Confirmar pedido</h1>

        <div className="checkout-layout">
          {/* Resumen del pedido */}
          <div className="checkout-summary">
            <h2 className="checkout-summary-title">Resumen</h2>

            {vendorIds.map(vid => {
              const group = cartByVendor[vid];
              const vendorTotal = group.items.reduce((s, i) => s + itemSubtotal(i), 0);
              return (
                <div key={vid} className="checkout-vendor-block">
                  <p className="checkout-vendor">{group.nombre}</p>
                  <div className="checkout-items">
                    {group.items.map(item => (
                      <div key={item.productId} className="checkout-item">
                        <span className="checkout-item-name">
                          {item.nombre}{' '}
                          <span className="checkout-item-qty">
                            ×{' '}
                            {isKg(item.unidad)
                              ? (item.cantidad >= 1000
                                  ? `${(item.cantidad / 1000).toFixed(item.cantidad % 1000 === 0 ? 0 : 1)} kg`
                                  : `${item.cantidad} g`)
                              : item.cantidad}
                          </span>
                        </span>
                        <span className="checkout-item-price">
                          {itemSubtotal(item).toFixed(2)}€
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="checkout-vendor-subtotal">
                    <span>Subtotal</span>
                    <span>{vendorTotal.toFixed(2)}€</span>
                  </div>
                </div>
              );
            })}

            <div className="checkout-total">
              <strong>Total</strong>
              <strong>{cartTotal.toFixed(2)}€</strong>
            </div>
          </div>

          {/* Formulario */}
          <form className="checkout-form" onSubmit={handleSubmit}>
            <h2 className="checkout-form-title">Datos del pedido</h2>
            <p className="checkout-form-subtitle">Selecciona el modo de entrega y completa los datos</p>

            {/* Modo de entrega */}
            <div className="form-group">
              <label>Modo de entrega</label>
              <div className="delivery-mode-selector">
                <button
                  type="button"
                  className={`delivery-mode-btn${form.modoEntrega === 'recogida' ? ' active' : ''}`}
                  onClick={() => setForm(prev => ({ ...prev, modoEntrega: 'recogida' }))}
                >
                  Recogida en el mercado
                </button>
                <button
                  type="button"
                  className={`delivery-mode-btn${form.modoEntrega === 'domicilio' ? ' active' : ''}`}
                  onClick={() => setForm(prev => ({ ...prev, modoEntrega: 'domicilio' }))}
                >
                  Entrega a domicilio
                </button>
              </div>
            </div>

            {form.modoEntrega === 'domicilio' && (
              <div className="form-group">
                <label htmlFor="direccionEntrega">Dirección de entrega *</label>
                <input
                  type="text"
                  id="direccionEntrega"
                  name="direccionEntrega"
                  value={form.direccionEntrega}
                  onChange={handleChange}
                  placeholder="Ej: Calle Mayor 1, 2º A"
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="telefonoContacto">Teléfono de contacto</label>
              <input
                type="tel"
                id="telefonoContacto"
                name="telefonoContacto"
                value={form.telefonoContacto}
                onChange={handleChange}
                placeholder="Ej: 612 345 678"
              />
            </div>

            <div className="form-group">
              <label htmlFor="fechaEntrega">
                {form.modoEntrega === 'recogida' ? 'Fecha de recogida' : 'Fecha de entrega'}
              </label>
              <input
                type="date"
                id="fechaEntrega"
                name="fechaEntrega"
                value={form.fechaEntrega}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-group">
              <label htmlFor="notasCliente">Notas para los vendedores</label>
              <textarea
                id="notasCliente"
                name="notasCliente"
                value={form.notasCliente}
                onChange={handleChange}
                placeholder="Ej: Sin gluten, cortar en filetes..."
                rows={3}
              />
            </div>

            <button type="submit" className="btn-submit">
              Continuar al pago
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Checkout;
