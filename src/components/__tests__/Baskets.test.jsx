import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, test, expect, afterEach } from 'vitest';
import Baskets from '../Baskets';

describe('Baskets', () => {

  afterEach(() => {
    vi.clearAllMocks();
  });

  // 1 ─────────────────────────────────────────────────────────────────────────
  test('renderiza los dos títulos de cesta', () => {
    render(<Baskets />);
    expect(screen.getByText('Crea tu cesta')).toBeInTheDocument();
    expect(screen.getByText('Compra tu cesta')).toBeInTheDocument();
  });

  // 2 ─────────────────────────────────────────────────────────────────────────
  test('renderiza dos botones "Añadir"', () => {
    render(<Baskets />);
    expect(screen.getAllByRole('button', { name: 'Añadir' })).toHaveLength(2);
  });

  // 3 ─────────────────────────────────────────────────────────────────────────
  test('"Añadir" en "Crea tu cesta" llama a onSelectPuestoClick', () => {
    const onSelectPuestoClick = vi.fn();
    render(<Baskets onSelectPuestoClick={onSelectPuestoClick} />);

    const [botonCrear] = screen.getAllByRole('button', { name: 'Añadir' });
    fireEvent.click(botonCrear);

    expect(onSelectPuestoClick).toHaveBeenCalledTimes(1);
  });

  // 4 ─────────────────────────────────────────────────────────────────────────
  test('"Añadir" en "Compra tu cesta" llama a onEligeTuCestaClick', () => {
    const onEligeTuCestaClick = vi.fn();
    render(<Baskets onEligeTuCestaClick={onEligeTuCestaClick} />);

    const botones = screen.getAllByRole('button', { name: 'Añadir' });
    fireEvent.click(botones[1]);

    expect(onEligeTuCestaClick).toHaveBeenCalledTimes(1);
  });

  // 5 ─────────────────────────────────────────────────────────────────────────
  test('"Añadir" en "Crea tu cesta" no llama a onEligeTuCestaClick', () => {
    const onEligeTuCestaClick = vi.fn();
    const onSelectPuestoClick = vi.fn();
    render(
      <Baskets
        onEligeTuCestaClick={onEligeTuCestaClick}
        onSelectPuestoClick={onSelectPuestoClick}
      />
    );

    const [botonCrear] = screen.getAllByRole('button', { name: 'Añadir' });
    fireEvent.click(botonCrear);

    expect(onEligeTuCestaClick).not.toHaveBeenCalled();
    expect(onSelectPuestoClick).toHaveBeenCalledTimes(1);
  });

  // 6 ─────────────────────────────────────────────────────────────────────────
  test('no lanza error si los callbacks no se pasan como prop', () => {
    render(<Baskets />);
    const botones = screen.getAllByRole('button', { name: 'Añadir' });
    expect(() => fireEvent.click(botones[0])).not.toThrow();
    expect(() => fireEvent.click(botones[1])).not.toThrow();
  });

});
