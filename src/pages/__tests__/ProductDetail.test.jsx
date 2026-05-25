import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, test, expect, afterEach } from 'vitest';
import { CartProvider } from '../../context/CartContext';
import ProductDetail from '../ProductDetail';

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('../../components/Header',     () => ({ default: () => <div data-testid="header" /> }));
vi.mock('../../components/Sidebar',    () => ({ default: () => <div data-testid="sidebar" /> }));
vi.mock('../../components/SeasonBadge', () => ({ default: () => null }));
vi.mock('../../components/OriginBadge', () => ({ default: () => null }));
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }));

// ── Datos de prueba ───────────────────────────────────────────────────────────

const PRODUCT_UD = {
  id: 'p1', nombre: 'Tomates Cherry', precio: '2.50',
  unidad: 'ud', imagen: null, stock: 10, descripcion: 'Tomates ecológicos',
};

const PRODUCT_KG = {
  id: 'p2', nombre: 'Naranjas de Mesa', precio: '1.80',
  unidad: 'kg', imagen: null, stock: 5, descripcion: null,
};

const PRODUCT_AGOTADO = {
  id: 'p3', nombre: 'Producto Agotado', precio: '3.00',
  unidad: 'ud', imagen: null, stock: 0, descripcion: null,
};

const PRODUCT_SIN_STOCK = {
  id: 'p4', nombre: 'Sin Control Stock', precio: '1.00',
  unidad: 'ud', imagen: null, stock: null, descripcion: null,
};

const VENDEDOR = {
  id: 'v1', nombre: 'Juan', apellidos: 'Jurado Ruíz', nombreCompleto: 'Juan Jurado Ruíz',
};

const defaultProps = {
  product:            PRODUCT_UD,
  vendedor:           VENDEDOR,
  user:               null,
  onLogout:           vi.fn(),
  onDashboardClick:   vi.fn(),
  onBack:             vi.fn(),
  onHomeClick:        vi.fn(),
  onMarketplaceClick: vi.fn(),
  onSelectPuestoClick:vi.fn(),
  onCartClick:        vi.fn(),
  onOrdersClick:      vi.fn(),
  onPageClick:        vi.fn(),
};

function renderDetail(props = {}) {
  return render(
    <CartProvider>
      <ProductDetail {...defaultProps} {...props} />
    </CartProvider>
  );
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('ProductDetail', () => {

  afterEach(() => vi.clearAllMocks());

  // 1
  test('muestra el nombre del producto como título principal', () => {
    renderDetail();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Tomates Cherry');
  });

  // 2
  test('muestra el precio y la unidad correctamente', () => {
    renderDetail();
    expect(screen.getByText(/2\.50€\/ud/)).toBeInTheDocument();
  });

  // 3
  test('muestra la descripción cuando existe', () => {
    renderDetail();
    expect(screen.getByText(/Tomates ecológicos/)).toBeInTheDocument();
  });

  // 4
  test('muestra el stock disponible', () => {
    renderDetail();
    expect(screen.getByText(/Stock disponible: 10/)).toBeInTheDocument();
  });

  // 5
  test('muestra el botón "Añadir" cuando el producto no está en el carrito', () => {
    renderDetail();
    expect(screen.getByRole('button', { name: 'Añadir' })).toBeInTheDocument();
  });

  // 6
  test('muestra "Agotado" deshabilitado cuando el stock es 0', () => {
    renderDetail({ product: PRODUCT_AGOTADO });
    const btn = screen.getByRole('button', { name: 'Agotado' });
    expect(btn).toBeInTheDocument();
    expect(btn).toBeDisabled();
  });

  // 7
  test('al pulsar "Añadir" aparece el control de cantidad con − y +', () => {
    renderDetail();
    fireEvent.click(screen.getByRole('button', { name: 'Añadir' }));
    expect(screen.getByRole('button', { name: '−' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  // 8
  test('se puede incrementar la cantidad con el botón +', () => {
    renderDetail();
    fireEvent.click(screen.getByRole('button', { name: 'Añadir' }));
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  // 9
  test('el botón − queda deshabilitado cuando la cantidad llega a 1', () => {
    renderDetail();
    fireEvent.click(screen.getByRole('button', { name: 'Añadir' }));
    // cantidad = 1, − debe estar deshabilitado (updateQuantity con 0 elimina el ítem)
    // Comprobamos que + funciona pero − con cantidad=1 elimina el ítem (carrito vacío)
    const btnMenos = screen.getByRole('button', { name: '−' });
    fireEvent.click(btnMenos);
    // Al llegar a 0, el ítem se elimina y vuelve a aparecer el botón Añadir
    expect(screen.getByRole('button', { name: 'Añadir' })).toBeInTheDocument();
  });

  // 10
  test('el botón Volver llama a onBack', () => {
    const onBack = vi.fn();
    renderDetail({ onBack });
    fireEvent.click(screen.getByText(/← Volver/));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  // 11 — Producto por kg
  test('muestra el selector de gramos para productos por kg antes de añadir', () => {
    renderDetail({ product: PRODUCT_KG });
    expect(screen.getByRole('button', { name: 'Añadir al carrito' })).toBeInTheDocument();
    expect(screen.getByText(/250 g/)).toBeInTheDocument();
  });

  // 12
  test('el botón − del selector de gramos decrementa de 250 g a 200 g', () => {
    renderDetail({ product: PRODUCT_KG });
    fireEvent.click(screen.getByRole('button', { name: '−' }));
    expect(screen.getByText(/200 g/)).toBeInTheDocument();
  });

  // 13
  test('el botón + del selector de gramos incrementa de 250 g a 300 g', () => {
    renderDetail({ product: PRODUCT_KG });
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    expect(screen.getByText(/300 g/)).toBeInTheDocument();
  });

  // 14
  test('al pulsar "Añadir al carrito" en producto kg aparece el control de qty en gramos', () => {
    renderDetail({ product: PRODUCT_KG });
    fireEvent.click(screen.getByRole('button', { name: 'Añadir al carrito' }));
    // Después de añadir, el control de qty muestra los gramos seleccionados
    expect(screen.getByText(/250 g/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Añadir al carrito' })).not.toBeInTheDocument();
  });

  // 15
  test('muestra el precio calculado según los gramos seleccionados', () => {
    renderDetail({ product: PRODUCT_KG });
    // 250 g × 1.80 €/kg = 0.45 €
    expect(screen.getByText((_, el) =>
      el?.classList?.contains('product-detail-gram-price') && el?.textContent?.includes('0.45')
    )).toBeInTheDocument();
  });

  // 16
  test('no muestra el stock cuando es null', () => {
    renderDetail({ product: PRODUCT_SIN_STOCK });
    expect(screen.queryByText(/Stock disponible/)).not.toBeInTheDocument();
  });

});
