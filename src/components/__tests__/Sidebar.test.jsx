import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, test, expect, afterEach } from 'vitest';
import Sidebar from '../Sidebar';

describe('Sidebar', () => {

  afterEach(() => {
    vi.clearAllMocks();
  });

  // 1 ─────────────────────────────────────────────────────────────────────────
  test('tiene la clase "open" cuando isOpen es true', () => {
    const { container } = render(
      <Sidebar isOpen={true} onClose={vi.fn()} />
    );
    expect(container.querySelector('.sidebar-overlay')).toHaveClass('open');
  });

  // 2 ─────────────────────────────────────────────────────────────────────────
  test('no tiene la clase "open" cuando isOpen es false', () => {
    const { container } = render(
      <Sidebar isOpen={false} onClose={vi.fn()} />
    );
    expect(container.querySelector('.sidebar-overlay')).not.toHaveClass('open');
  });

  // 3 ─────────────────────────────────────────────────────────────────────────
  test('renderiza todos los enlaces principales del menú', () => {
    render(<Sidebar isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('Puestos')).toBeInTheDocument();
    expect(screen.getByText('A domicilio')).toBeInTheDocument();
    expect(screen.getByText('Elige tu cesta')).toBeInTheDocument();
    expect(screen.getByText('Mi perfil')).toBeInTheDocument();
    expect(screen.getByText('Instrucciones')).toBeInTheDocument();
  });

  // 4 ─────────────────────────────────────────────────────────────────────────
  test('"Elige tu cesta" llama a onClose al hacer clic', () => {
    const onClose = vi.fn();
    render(<Sidebar isOpen={true} onClose={onClose} />);

    fireEvent.click(screen.getByText('Elige tu cesta'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // 5 ─────────────────────────────────────────────────────────────────────────
  test('"Elige tu cesta" llama a onSelectPuestoClick al hacer clic', () => {
    const onSelectPuestoClick = vi.fn();
    render(
      <Sidebar isOpen={true} onClose={vi.fn()} onSelectPuestoClick={onSelectPuestoClick} />
    );

    fireEvent.click(screen.getByText('Elige tu cesta'));

    expect(onSelectPuestoClick).toHaveBeenCalledTimes(1);
  });

  // 6 ─────────────────────────────────────────────────────────────────────────
  test('"Elige tu cesta" llama a ambos callbacks a la vez', () => {
    const onClose = vi.fn();
    const onSelectPuestoClick = vi.fn();
    render(
      <Sidebar isOpen={true} onClose={onClose} onSelectPuestoClick={onSelectPuestoClick} />
    );

    fireEvent.click(screen.getByText('Elige tu cesta'));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onSelectPuestoClick).toHaveBeenCalledTimes(1);
  });

  // 7 ─────────────────────────────────────────────────────────────────────────
  test('otros enlaces del menú llaman a onClose pero no a onSelectPuestoClick', () => {
    const onClose = vi.fn();
    const onSelectPuestoClick = vi.fn();
    render(
      <Sidebar isOpen={true} onClose={onClose} onSelectPuestoClick={onSelectPuestoClick} />
    );

    fireEvent.click(screen.getByText('Puestos'));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onSelectPuestoClick).not.toHaveBeenCalled();
  });

  // 8 ─────────────────────────────────────────────────────────────────────────
  test('no lanza error si onSelectPuestoClick no se pasa', () => {
    render(<Sidebar isOpen={true} onClose={vi.fn()} />);
    expect(() => fireEvent.click(screen.getByText('Elige tu cesta'))).not.toThrow();
  });

});
