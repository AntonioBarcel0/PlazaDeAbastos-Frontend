import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest';
import SelectPuesto from '../SelectPuesto';

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('../../services/api', () => ({
  api: { getVendedores: vi.fn() },
}));

vi.mock('../Header', () => ({ default: () => <div data-testid="header" /> }));
vi.mock('../Sidebar', () => ({ default: () => <div data-testid="sidebar" /> }));

// ── Datos de prueba ───────────────────────────────────────────────────────────

// Carnicería/pescadería quedan excluidos por EXCLUDED_KEYWORDS en el componente
const VENDEDORES_MOCK = [
  { id: '1', nombreCompleto: 'Antonio Carnicero López', categorias: ['Carnicería'], especialidad: 'Carnicería', imagenPrincipal: null },
  { id: '2', nombreCompleto: 'Dolores Muñoz Guerrero',  categorias: ['Comestibles'], especialidad: 'Comestibles', imagenPrincipal: null },
  { id: '3', nombreCompleto: 'Juan Jurado Ruíz',        categorias: ['Frutas'],      especialidad: 'Frutería',    imagenPrincipal: null },
  { id: '4', nombreCompleto: 'María Josefa Molina',     categorias: ['Comestibles'], especialidad: 'Comestibles', imagenPrincipal: null },
];

// Vendedores visibles (Antonio queda excluido por 'carnicer')
const VISIBLES = VENDEDORES_MOCK.slice(1); // Dolores, Juan, María

// ── Helper ────────────────────────────────────────────────────────────────────

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
  await screen.findByText('Juan Jurado Ruíz');
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('SelectPuesto', () => {

  afterEach(() => vi.clearAllMocks());

  // 1
  test('muestra el título "Puestos" tras la carga', async () => {
    await renderAndWait();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Puestos');
  });

  // 2
  test('muestra los puestos no excluidos y oculta los de carnicería/pescadería', async () => {
    await renderAndWait();
    for (const v of VISIBLES) {
      expect(screen.getByText(v.nombreCompleto)).toBeInTheDocument();
    }
    expect(screen.queryByText('Antonio Carnicero López')).not.toBeInTheDocument();
  });

  // 3
  test('el buscador filtra puestos por nombre', async () => {
    await renderAndWait();

    fireEvent.change(screen.getByPlaceholderText('Buscar'), {
      target: { value: 'Juan' },
    });

    expect(screen.getByText('Juan Jurado Ruíz')).toBeInTheDocument();
    expect(screen.queryByText('Dolores Muñoz Guerrero')).not.toBeInTheDocument();
    expect(screen.queryByText('María Josefa Molina')).not.toBeInTheDocument();
  });

  // 4
  test('el filtro "Frutería" muestra solo puestos de frutas', async () => {
    await renderAndWait();

    fireEvent.click(screen.getByRole('button', { name: 'Frutería' }));

    expect(screen.getByText('Juan Jurado Ruíz')).toBeInTheDocument();
    expect(screen.queryByText('Dolores Muñoz Guerrero')).not.toBeInTheDocument();
    expect(screen.queryByText('María Josefa Molina')).not.toBeInTheDocument();
  });

  // 5
  test('el filtro "Comestibles" muestra puestos con categoría comestibles', async () => {
    await renderAndWait();

    fireEvent.click(screen.getByRole('button', { name: 'Comestibles' }));

    expect(screen.getByText('Dolores Muñoz Guerrero')).toBeInTheDocument();
    expect(screen.getByText('María Josefa Molina')).toBeInTheDocument();
    expect(screen.queryByText('Juan Jurado Ruíz')).not.toBeInTheDocument();
  });

  // 6
  test('el filtro "Todos" muestra todos los puestos no excluidos', async () => {
    await renderAndWait();

    fireEvent.click(screen.getByRole('button', { name: 'Frutería' }));
    fireEvent.click(screen.getByRole('button', { name: 'Todos' }));

    for (const v of VISIBLES) {
      expect(screen.getByText(v.nombreCompleto)).toBeInTheDocument();
    }
  });

  // 7
  test('el orden por defecto (A-Z) muestra los puestos de menor a mayor nombre', async () => {
    await renderAndWait();

    const nombres = screen.getAllByRole('heading', { level: 3 }).map(h => h.textContent);
    // A-Z: Dolores (D) < Juan (J) < María (M)
    expect(nombres[0]).toBe('Dolores Muñoz Guerrero');
    expect(nombres[nombres.length - 1]).toBe('María Josefa Molina');
  });

  // 8
  test('ordenar por Categoría mantiene todos los puestos visibles en el DOM', async () => {
    await renderAndWait();

    fireEvent.click(screen.getByRole('button', { name: /nombre \(a/i }));
    fireEvent.click(screen.getByText('Categoría'));

    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(VISIBLES.length);
  });

  // 9
  test('muestra mensaje vacío cuando la búsqueda no tiene resultados', async () => {
    await renderAndWait();

    fireEvent.change(screen.getByPlaceholderText('Buscar'), {
      target: { value: 'zzzzz' },
    });

    expect(screen.getByText(/no se encontraron puestos/i)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument();
  });

  // 10
  test('clicar "Ir al puesto →" llama a onPuestoSelect con el id correcto', async () => {
    const onPuestoSelect = vi.fn();
    await renderAndWait({ onPuestoSelect });

    // En orden A-Z el primero visible es Dolores (id '2')
    const botones = screen.getAllByText('Ir al puesto →');
    fireEvent.click(botones[0]);

    expect(onPuestoSelect).toHaveBeenCalledTimes(1);
    expect(onPuestoSelect).toHaveBeenCalledWith('2');
  });

  // 11
  test('el botón "Todos" resetea el filtro de categoría', async () => {
    await renderAndWait();

    fireEvent.click(screen.getByRole('button', { name: 'Frutería' }));
    expect(screen.queryByText('Dolores Muñoz Guerrero')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Todos' }));
    expect(screen.getByText('Dolores Muñoz Guerrero')).toBeInTheDocument();
  });

  // 12
  test('el buscador y el filtro de categoría actúan en conjunto', async () => {
    await renderAndWait();

    fireEvent.click(screen.getByRole('button', { name: 'Frutería' }));
    fireEvent.change(screen.getByPlaceholderText('Buscar'), {
      target: { value: 'Dolores' }, // Dolores no es de Frutas
    });

    expect(screen.getByText(/no se encontraron puestos/i)).toBeInTheDocument();
  });

});
