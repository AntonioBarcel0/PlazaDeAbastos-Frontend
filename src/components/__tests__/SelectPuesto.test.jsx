import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest';
import SelectPuesto from '../SelectPuesto';

// ── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('../../services/api', () => ({
  api: { getVendedores: vi.fn() },
}));

vi.mock('../Header', () => ({ default: () => <div data-testid="header" /> }));
vi.mock('../Sidebar', () => ({ default: () => <div data-testid="sidebar" /> }));

// ── Datos de prueba ──────────────────────────────────────────────────────────

const VENDEDORES_MOCK = [
  { id: '1', nombreCompleto: 'Antonio Martos Muro',    categorias: ['Pescadería', 'mariscos'], imagenPrincipal: null },
  { id: '2', nombreCompleto: 'Dolores Muñoz Guerrero', categorias: ['Panadería'],             imagenPrincipal: null },
  { id: '3', nombreCompleto: 'Felicia García Gómez',  categorias: ['Charcutería', 'comestibles'], imagenPrincipal: null },
  { id: '4', nombreCompleto: 'Gabriel Martínez Cartas', categorias: ['Carnicería'],           imagenPrincipal: null },
  { id: '5', nombreCompleto: 'Juan Jurado Ruíz',       categorias: ['Frutas'],               imagenPrincipal: null },
];

// ── Helper ───────────────────────────────────────────────────────────────────

const defaultProps = {
  user: null,
  onLogout: vi.fn(),
  onDashboardClick: vi.fn(),
  onPuestoSelect: vi.fn(),
  onBack: vi.fn(),
};

async function renderAndWait(props = {}) {
  const { api } = await import('../../services/api');
  api.getVendedores.mockResolvedValue({ vendedores: VENDEDORES_MOCK });
  render(<SelectPuesto {...defaultProps} {...props} />);
  // Espera a que desaparezca el estado de carga
  await screen.findByText('Juan Jurado Ruíz');
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('SelectPuesto', () => {

  afterEach(() => {
    vi.clearAllMocks();
  });

  // 1 ─────────────────────────────────────────────────────────────────────────
  test('muestra el título "Puestos" tras la carga', async () => {
    await renderAndWait();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Puestos');
  });

  // 2 ─────────────────────────────────────────────────────────────────────────
  test('muestra todos los puestos recibidos de la API', async () => {
    await renderAndWait();
    for (const v of VENDEDORES_MOCK) {
      expect(screen.getByText(v.nombreCompleto)).toBeInTheDocument();
    }
  });

  // 3 ─────────────────────────────────────────────────────────────────────────
  test('el buscador filtra puestos por nombre', async () => {
    await renderAndWait();

    fireEvent.change(screen.getByPlaceholderText('Buscar'), {
      target: { value: 'Juan' },
    });

    expect(screen.getByText('Juan Jurado Ruíz')).toBeInTheDocument();
    expect(screen.queryByText('Antonio Martos Muro')).not.toBeInTheDocument();
    expect(screen.queryByText('Gabriel Martínez Cartas')).not.toBeInTheDocument();
  });

  // 4 ─────────────────────────────────────────────────────────────────────────
  test('el filtro "Frutería" solo muestra puestos de frutas', async () => {
    await renderAndWait();

    fireEvent.click(screen.getByRole('button', { name: 'Frutería' }));

    expect(screen.getByText('Juan Jurado Ruíz')).toBeInTheDocument();
    expect(screen.queryByText('Antonio Martos Muro')).not.toBeInTheDocument();
    expect(screen.queryByText('Gabriel Martínez Cartas')).not.toBeInTheDocument();
  });

  // 5 ─────────────────────────────────────────────────────────────────────────
  test('el filtro "Pescadería" solo muestra pescaderías', async () => {
    await renderAndWait();

    fireEvent.click(screen.getByRole('button', { name: 'Pescadería' }));

    expect(screen.getByText('Antonio Martos Muro')).toBeInTheDocument();
    expect(screen.queryByText('Juan Jurado Ruíz')).not.toBeInTheDocument();
    expect(screen.queryByText('Gabriel Martínez Cartas')).not.toBeInTheDocument();
  });

  // 6 ─────────────────────────────────────────────────────────────────────────
  test('el filtro "Carnicería" solo muestra carnicerías', async () => {
    await renderAndWait();

    fireEvent.click(screen.getByRole('button', { name: 'Carnicería' }));

    expect(screen.getByText('Gabriel Martínez Cartas')).toBeInTheDocument();
    expect(screen.queryByText('Juan Jurado Ruíz')).not.toBeInTheDocument();
    expect(screen.queryByText('Antonio Martos Muro')).not.toBeInTheDocument();
  });

  // 7 ─────────────────────────────────────────────────────────────────────────
  test('el filtro "Comestibles" incluye charcutería y comestibles', async () => {
    await renderAndWait();

    fireEvent.click(screen.getByRole('button', { name: 'Comestibles' }));

    expect(screen.getByText('Felicia García Gómez')).toBeInTheDocument();
    expect(screen.queryByText('Juan Jurado Ruíz')).not.toBeInTheDocument();
  });

  // 8 ─────────────────────────────────────────────────────────────────────────
  test('ordenar Z-A invierte el orden de los puestos', async () => {
    await renderAndWait();

    // Abre el dropdown de ordenación
    fireEvent.click(screen.getByRole('button', { name: /nombre \(a/i }));
    // Selecciona Z-A
    fireEvent.click(screen.getByText('Nombre (Z–A)'));

    const nombres = screen.getAllByRole('heading', { level: 3 }).map(h => h.textContent);
    // Juan (J) debe aparecer primero en orden Z-A
    expect(nombres[0]).toBe('Juan Jurado Ruíz');
    // Antonio (A) debe aparecer el último
    expect(nombres[nombres.length - 1]).toBe('Antonio Martos Muro');
  });

  // 9 ─────────────────────────────────────────────────────────────────────────
  test('ordenar por Categoría agrupa correctamente', async () => {
    await renderAndWait();

    fireEvent.click(screen.getByRole('button', { name: /nombre \(a/i }));
    fireEvent.click(screen.getByText('Categoría'));

    // Tras ordenar por categoría, todos los puestos siguen en el DOM
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(VENDEDORES_MOCK.length);
  });

  // 10 ────────────────────────────────────────────────────────────────────────
  test('muestra mensaje vacío cuando la búsqueda no tiene resultados', async () => {
    await renderAndWait();

    fireEvent.change(screen.getByPlaceholderText('Buscar'), {
      target: { value: 'zzzzz' },
    });

    expect(screen.getByText(/no se encontraron puestos/i)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument();
  });

  // 11 ────────────────────────────────────────────────────────────────────────
  test('clicar "Seleccionar" llama a onPuestoSelect con el id correcto', async () => {
    const onPuestoSelect = vi.fn();
    await renderAndWait({ onPuestoSelect });

    // El primer botón "Seleccionar" corresponde al primer vendedor en A-Z: Antonio (id '1')
    const botones = screen.getAllByText('Seleccionar');
    fireEvent.click(botones[0]);

    expect(onPuestoSelect).toHaveBeenCalledTimes(1);
    expect(onPuestoSelect).toHaveBeenCalledWith('1');
  });

  // 12 ────────────────────────────────────────────────────────────────────────
  test('el botón "Filtrar" resetea el filtro de categoría', async () => {
    await renderAndWait();

    // Aplica un filtro
    fireEvent.click(screen.getByRole('button', { name: 'Frutería' }));
    expect(screen.queryByText('Antonio Martos Muro')).not.toBeInTheDocument();

    // Resetea con el botón Filtrar
    fireEvent.click(screen.getByRole('button', { name: 'Filtrar' }));
    expect(screen.getByText('Antonio Martos Muro')).toBeInTheDocument();
  });

  // 13 ────────────────────────────────────────────────────────────────────────
  test('el buscador y el filtro de categoría actúan en conjunto', async () => {
    await renderAndWait();

    // Filtra por Frutas: solo Juan
    fireEvent.click(screen.getByRole('button', { name: 'Frutería' }));
    // Busca algo que no existe en Frutas
    fireEvent.change(screen.getByPlaceholderText('Buscar'), {
      target: { value: 'Antonio' },
    });

    expect(screen.getByText(/no se encontraron puestos/i)).toBeInTheDocument();
  });

});
