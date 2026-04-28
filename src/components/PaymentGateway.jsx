import { useState } from 'react';
import { Lock, ShieldCheck } from 'lucide-react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useCart, itemSubtotal } from '../context/CartContext';
import { api } from '../services/api';
import './PaymentGateway.css';

const formatCardNumber = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
};

const formatExpiry = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
  return digits;
};

const getCardType = (number) => {
  const d = number.replace(/\s/g, '');
  if (/^4/.test(d)) return 'visa';
  if (/^5[1-5]/.test(d) || /^2[2-7]\d{2}/.test(d)) return 'mastercard';
  return null;
};

const maskNumber = (number) => {
  const digits = number.replace(/\s/g, '');
  const padded = digits.padEnd(16, '•');
  return `${padded.slice(0, 4)} ${padded.slice(4, 8)} ${padded.slice(8, 12)} ${padded.slice(12, 16)}`;
};

function PaymentGateway({
  user, onLogout, onDashboardClick, onCartClick, onOrdersClick,
  onBack, onSuccess, onHomeClick, onMarketplaceClick, onSelectPuestoClick, onLoginClick,
  orderData,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { cart, cartByVendor, cartTotal, clearCart } = useCart();
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [flipped, setFlipped] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(null);

  const cardType = getCardType(card.number);

  const handleChange = (field, value) => {
    if (field === 'number') value = formatCardNumber(value);
    if (field === 'expiry') value = formatExpiry(value);
    if (field === 'cvv') value = value.replace(/\D/g, '').slice(0, 4);
    if (field === 'name') value = value.toUpperCase().slice(0, 26);
    setCard(prev => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const digits = card.number.replace(/\s/g, '');
    if (digits.length < 16) return 'Número de tarjeta inválido';
    if (!card.name.trim()) return 'Introduce el nombre del titular';
    const parts = card.expiry.split('/');
    if (parts.length !== 2 || parts[0].length !== 2 || parts[1].length !== 2)
      return 'Fecha de caducidad inválida (MM/AA)';
    const month = parseInt(parts[0]);
    const year = parseInt('20' + parts[1]);
    if (month < 1 || month > 12) return 'Mes inválido';
    if (new Date(year, month - 1, 1) < new Date()) return 'La tarjeta está caducada';
    if (card.cvv.length < 3) return 'CVV inválido';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }

    setError('');
    setProcessing(true);

    await new Promise(resolve => setTimeout(resolve, 2500));

    try {
      const result = await api.createOrder(orderData);
      clearCart();
      setOrderSuccess(result.order || result);
    } catch (err) {
      setError(err.message || 'Error al procesar el pedido. Inténtalo de nuevo.');
      setProcessing(false);
    }
  };

  const headerProps = {
    onMenuClick: () => setSidebarOpen(!sidebarOpen),
    onLoginClick: onLoginClick || (() => {}),
    onLogoClick: onHomeClick,
    user, onLogout, onDashboardClick, onCartClick, onOrdersClick,
  };

  if (orderSuccess) {
    return (
      <div className="pg-container">
        <Header {...headerProps} />
        <main className="pg-main">
          <div className="pg-success">
            <div className="pg-success-ring">
              <span className="pg-success-check">✓</span>
            </div>
            <h2>¡Pago completado!</h2>
            <p className="pg-success-sub">Tu pedido ha sido confirmado y enviado al vendedor.</p>
            {orderSuccess.id && (
              <p className="pg-success-ref">
                Referencia: <strong>{String(orderSuccess.id).substring(0, 8).toUpperCase()}</strong>
              </p>
            )}
            <div className="pg-success-detail">
              <span>Total pagado</span>
              <strong>{cartTotal > 0 ? cartTotal.toFixed(2) : orderData?.totalEstimado?.toFixed(2) ?? '—'}€</strong>
            </div>
            <button className="pg-btn-home" onClick={onSuccess}>
              Volver al inicio
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="pg-container">
      <Header {...headerProps} />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onMarketplaceClick={onMarketplaceClick}
        onSelectPuestoClick={onSelectPuestoClick}
      />

      <main className="pg-main">
        <button className="back-button" onClick={onBack}>← Volver al resumen</button>
        <h1 className="pg-title">Pago seguro</h1>

        <div className="pg-layout">

          {/* ── Columna izquierda: tarjeta + formulario ── */}
          <div className="pg-left">

            {/* Tarjeta visual */}
            <div className="pg-card-scene">
              <div className={`pg-card-inner${flipped ? ' flipped' : ''}`}>

                {/* Cara delantera */}
                <div className="pg-card-front">
                  <div className="pg-card-row-top">
                    <div className="pg-chip">
                      <div className="pg-chip-line" />
                      <div className="pg-chip-line" />
                      <div className="pg-chip-line pg-chip-v" />
                      <div className="pg-chip-line pg-chip-v" />
                    </div>
                    {cardType === 'visa' && (
                      <span className="pg-logo pg-logo-visa">VISA</span>
                    )}
                    {cardType === 'mastercard' && (
                      <div className="pg-logo pg-logo-mc">
                        <span className="pg-mc-left" />
                        <span className="pg-mc-right" />
                      </div>
                    )}
                    {!cardType && <div className="pg-logo-placeholder" />}
                  </div>

                  <div className="pg-card-number">
                    {maskNumber(card.number)}
                  </div>

                  <div className="pg-card-row-bottom">
                    <div className="pg-card-field">
                      <span className="pg-card-label">Titular</span>
                      <span className="pg-card-value">
                        {card.name || 'NOMBRE APELLIDO'}
                      </span>
                    </div>
                    <div className="pg-card-field pg-card-field--right">
                      <span className="pg-card-label">Caduca</span>
                      <span className="pg-card-value">
                        {card.expiry || 'MM/AA'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Cara trasera */}
                <div className="pg-card-back">
                  <div className="pg-card-stripe" />
                  <div className="pg-card-cvv-row">
                    <div className="pg-card-cvv-band">
                      {'•'.repeat(Math.max(0, 13 - card.cvv.length))}
                      {card.cvv}
                    </div>
                    <div className="pg-card-cvv-label">CVV</div>
                  </div>
                  {cardType === 'visa' && (
                    <span className="pg-logo pg-logo-visa pg-logo-back">VISA</span>
                  )}
                  {cardType === 'mastercard' && (
                    <div className="pg-logo pg-logo-mc pg-logo-back">
                      <span className="pg-mc-left" />
                      <span className="pg-mc-right" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Formulario */}
            <form className="pg-form" onSubmit={handleSubmit}>
              {error && <p className="pg-error">{error}</p>}

              <div className="form-group">
                <label>Número de tarjeta</label>
                <div className="pg-input-wrap">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="1234 5678 9012 3456"
                    value={card.number}
                    onChange={e => handleChange('number', e.target.value)}
                    onFocus={() => setFlipped(false)}
                    maxLength={19}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Titular de la tarjeta</label>
                <input
                  type="text"
                  placeholder="NOMBRE APELLIDO"
                  value={card.name}
                  onChange={e => handleChange('name', e.target.value)}
                  onFocus={() => setFlipped(false)}
                />
              </div>

              <div className="pg-form-row">
                <div className="form-group">
                  <label>Fecha de caducidad</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="MM/AA"
                    value={card.expiry}
                    onChange={e => handleChange('expiry', e.target.value)}
                    onFocus={() => setFlipped(false)}
                    maxLength={5}
                  />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input
                    type="password"
                    inputMode="numeric"
                    placeholder="•••"
                    value={card.cvv}
                    onChange={e => handleChange('cvv', e.target.value)}
                    onFocus={() => setFlipped(true)}
                    onBlur={() => setFlipped(false)}
                    maxLength={4}
                  />
                </div>
              </div>

              <button type="submit" className="pg-btn-pay" disabled={processing}>
                {processing ? (
                  <span className="pg-processing">
                    <span className="pg-spinner" />
                    Procesando pago...
                  </span>
                ) : (
                  <>
                    <Lock size={18} strokeWidth={2.5} />
                    Pagar {cartTotal.toFixed(2)}€
                  </>
                )}
              </button>

              <div className="pg-security">
                <ShieldCheck size={16} color="#2c5f2d" strokeWidth={2} />
                <span>Pago 100% simulado — datos no reales</span>
              </div>
            </form>
          </div>

          {/* ── Columna derecha: resumen ── */}
          <div className="pg-summary">
            <h2 className="pg-summary-title">Resumen del pedido</h2>

            {Object.values(cartByVendor).map((group, i) => (
              <div key={i} className="pg-summary-vendor">
                <p className="pg-summary-vendor-name">{group.nombre}</p>
                {group.items.map(item => (
                  <div key={item.productId} className="pg-summary-item">
                    <span className="pg-summary-item-name">
                      {item.nombre}
                      <span className="pg-summary-item-qty"> ×{item.cantidad}</span>
                    </span>
                    <span>{itemSubtotal(item).toFixed(2)}€</span>
                  </div>
                ))}
              </div>
            ))}

            <div className="pg-summary-total">
              <strong>Total</strong>
              <strong>{cartTotal.toFixed(2)}€</strong>
            </div>

            <div className="pg-summary-badges">
              <div className="pg-badge"><Lock size={13} /> Pago seguro</div>
              <div className="pg-badge"><ShieldCheck size={13} /> Datos protegidos</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PaymentGateway;
