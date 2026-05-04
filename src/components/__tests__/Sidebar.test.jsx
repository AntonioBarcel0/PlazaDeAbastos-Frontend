import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, test, expect, afterEach } from 'vitest';
import Sidebar from '../Sidebar';

describe('Sidebar', () => {

  afterEach(() => vi.clearAllMocks());

  // 1
  test('tiene la clase "open" cuando isOpen es true', () => {
    const { container } = render(<Sidebar isOpen={true} onClose={vi.fn()} />);
    expect(container.querySelector('.sidebar-overlay')).toHaveClass('open');
  });

  // 2
  test('no tiene la clase "open" cuando isOpen es false', () => {
    const { container } = render(<Sidebar isOpen={false} onClose={vi.fn()} />);
    expect(container.querySelector('.sidebar-overlay')).not.toHaveClass('open');
  });

  // 3
  test('renderiza todos los enlaces principales del menú', () => {
    render(<Sidebar isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('Puestos')).toBeInTheDocument();
    expect(screen.getByText('Plano del mercado')).toBeInTheDocument();
    expect(screen.getByText('Elige tu cesta')).toBeInTheDocument();
    expect(screen.getByText('Mi perfil')).toBeInTheDocument();
    expect(screen.getByText('Instrucciones')).toBeInTheDocument();
  });

  // 4
  test('"Puestos" llama a onClose y a onSelectPuestoClick', () => {
    const onClose = vi.fn();
    const onSelectPuestoClick = vi.fn();
    render(<Sidebar isOpen={true} onClose={onClose} onSelectPuestoClick={onSelectPuestoClick} />);

    fireEvent.click(screen.getByText('Puestos'));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onSelectPuestoClick).toHaveBeenCalledTimes(1);
  });

  // 5
  test('"Elige tu cesta" llama a onClose y a onPageClick con "elige-tu-cesta"', () => {
    const onClose = vi.fn();
    const onPageClick = vi.fn();
    render(<Sidebar isOpen={true} onClose={onClose} onPageClick={onPageClick} />);

    fireEvent.click(screen.getByText('Elige tu cesta'));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onPageClick).toHaveBeenCalledWith('elige-tu-cesta');
  });

  // 6
  test('"Elige tu cesta" NO llama a onSelectPuestoClick', () => {
    const onSelectPuestoClick = vi.fn();
    render(<Sidebar isOpen={true} onClose={vi.fn()} onSelectPuestoClick={onSelectPuestoClick} />);

    fireEvent.click(screen.getByText('Elige tu cesta'));

    expect(onSelectPuestoClick).not.toHaveBeenCalled();
  });

  // 7
  test('"Instrucciones" llama a onClose y a onInstruccionesClick', () => {
    const onClose = vi.fn();
    const onInstruccionesClick = vi.fn();
    render(
      <Sidebar isOpen={true} onClose={onClose} onInstruccionesClick={onInstruccionesClick} />
    );

    fireEvent.click(screen.getByText('Instrucciones'));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onInstruccionesClick).toHaveBeenCalledTimes(1);
  });

  // 8
  test('"Mi perfil" llama a onClose pero no a otros callbacks', () => {
    const onClose = vi.fn();
    const onSelectPuestoClick = vi.fn();
    render(<Sidebar isOpen={true} onClose={onClose} onSelectPuestoClick={onSelectPuestoClick} />);

    fireEvent.click(screen.getByText('Mi perfil'));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onSelectPuestoClick).not.toHaveBeenCalled();
  });

  // 9
  test('no lanza error si los callbacks opcionales no se pasan', () => {
    render(<Sidebar isOpen={true} onClose={vi.fn()} />);
    expect(() => fireEvent.click(screen.getByText('Puestos'))).not.toThrow();
    expect(() => fireEvent.click(screen.getByText('Elige tu cesta'))).not.toThrow();
    expect(() => fireEvent.click(screen.getByText('Instrucciones'))).not.toThrow();
  });

});
