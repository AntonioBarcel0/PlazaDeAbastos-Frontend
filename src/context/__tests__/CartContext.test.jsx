import { renderHook, act } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import {
  CartProvider,
  useCart,
  isKg,
  itemSubtotal,
  isCestaItem,
} from '../CartContext';

// ── Funciones puras ───────────────────────────────────────────────────────────

describe('isKg', () => {

  test('devuelve true para unidad "kg"', () => {
    expect(isKg('kg')).toBe(true);
  });

  test('devuelve false para unidades distintas de kg', () => {
    expect(isKg('ud')).toBe(false);
    expect(isKg('100g')).toBe(false);
    expect(isKg('lata')).toBe(false);
    expect(isKg(undefined)).toBe(false);
  });

});

describe('itemSubtotal', () => {

  test('calcula correctamente para producto por peso: cantidad en gramos', () => {
    // 500 g de tomates a 2.50 €/kg → 1.25 €
    expect(itemSubtotal({ unidad: 'kg', cantidad: 500, precio: 2.50 })).toBeCloseTo(1.25);
  });

  test('calcula correctamente para producto por unidad', () => {
    // 3 unidades a 5.00 € → 15.00 €
    expect(itemSubtotal({ unidad: 'ud', cantidad: 3, precio: 5.00 })).toBe(15.00);
  });

  test('1000 g de un producto kg equivale al precio por kg completo', () => {
    expect(itemSubtotal({ unidad: 'kg', cantidad: 1000, precio: 3.00 })).toBeCloseTo(3.00);
  });

});

describe('isCestaItem', () => {

  test('devuelve true si itemType es "cesta"', () => {
    expect(isCestaItem({ itemType: 'cesta' })).toBe(true);
  });

  test('devuelve false para ítems de producto normales', () => {
    expect(isCestaItem({ productId: 'p1' })).toBe(false);
    expect(isCestaItem({})).toBe(false);
  });

});

// ── Hook useCart ──────────────────────────────────────────────────────────────

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

const PRODUCTO = {
  id: 'p1', nombre: 'Tomates Cherry', precio: '2.50',
  unidad: 'ud', imagen: null, stock: 10,
};
const PRODUCTO_KG = {
  id: 'p2', nombre: 'Naranjas', precio: '1.80',
  unidad: 'kg', imagen: null, stock: 5,
};
const VENDEDOR  = { id: 'v1', nombre: 'Juan', apellidos: 'Jurado Ruíz' };
const VENDEDOR2 = { id: 'v2', nombre: 'Ana',  apellidos: 'López García' };
const CESTA = {
  id: 'c1', nombre: 'Cesta Frutas', precio: '15.00',
  descripcion: 'Cesta de temporada', items: [],
};

// ── Estado inicial ────────────────────────────────────────────────────────────

describe('useCart — estado inicial', () => {

  test('el carrito empieza vacío', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.cart).toHaveLength(0);
    expect(result.current.cartCount).toBe(0);
    expect(result.current.cartTotal).toBe(0);
  });

});

// ── addToCart ─────────────────────────────────────────────────────────────────

describe('useCart — addToCart', () => {

  test('añade un producto nuevo al carrito', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => { result.current.addToCart(PRODUCTO, VENDEDOR); });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].productId).toBe('p1');
    expect(result.current.cart[0].cantidad).toBe(1);
  });

  test('incrementa la cantidad si el mismo producto ya está en el carrito', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => { result.current.addToCart(PRODUCTO, VENDEDOR); });
    act(() => { result.current.addToCart(PRODUCTO, VENDEDOR); });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].cantidad).toBe(2);
  });

  test('no supera el stock máximo al añadir el mismo producto repetidamente', () => {
    const productoStockDos = { ...PRODUCTO, stock: 2 };
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => { result.current.addToCart(productoStockDos, VENDEDOR); });
    act(() => { result.current.addToCart(productoStockDos, VENDEDOR); });
    act(() => { result.current.addToCart(productoStockDos, VENDEDOR); }); // debe ignorarse

    expect(result.current.cart[0].cantidad).toBe(2);
  });

  test('añade un producto kg con la cantidad inicial en gramos indicada', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => { result.current.addToCart(PRODUCTO_KG, VENDEDOR, 350); });

    expect(result.current.cart[0].cantidad).toBe(350);
    expect(result.current.cart[0].unidad).toBe('kg');
  });

  test('cartCount cuenta 1 por ítem kg independientemente de los gramos', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(PRODUCTO, VENDEDOR);           // +1
      result.current.addToCart(PRODUCTO_KG, VENDEDOR, 500);  // +1 (no +500)
    });

    expect(result.current.cartCount).toBe(2);
  });

  test('dos productos distintos se añaden como ítems separados', () => {
    const PRODUCTO_B = { ...PRODUCTO, id: 'p99', nombre: 'Peras' };
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(PRODUCTO,   VENDEDOR);
      result.current.addToCart(PRODUCTO_B, VENDEDOR);
    });

    expect(result.current.cart).toHaveLength(2);
  });

});

// ── addCestaToCart ────────────────────────────────────────────────────────────

describe('useCart — addCestaToCart', () => {

  test('añade una cesta al carrito con itemType "cesta"', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => { result.current.addCestaToCart(CESTA, VENDEDOR); });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].cestaId).toBe('c1');
    expect(result.current.cart[0].itemType).toBe('cesta');
    expect(result.current.cart[0].cantidad).toBe(1);
  });

  test('incrementa la cantidad si la misma cesta ya está en el carrito', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => { result.current.addCestaToCart(CESTA, VENDEDOR); });
    act(() => { result.current.addCestaToCart(CESTA, VENDEDOR); });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].cantidad).toBe(2);
  });

});

// ── removeFromCart ────────────────────────────────────────────────────────────

describe('useCart — removeFromCart', () => {

  test('elimina un producto por su productId', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => { result.current.addToCart(PRODUCTO, VENDEDOR); });
    act(() => { result.current.removeFromCart('p1'); });

    expect(result.current.cart).toHaveLength(0);
  });

  test('elimina una cesta por su cestaId', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => { result.current.addCestaToCart(CESTA, VENDEDOR); });
    act(() => { result.current.removeFromCart('c1'); });

    expect(result.current.cart).toHaveLength(0);
  });

  test('no elimina otros ítems al eliminar uno específico', () => {
    const PRODUCTO_B = { ...PRODUCTO, id: 'p99', nombre: 'Peras' };
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(PRODUCTO,   VENDEDOR);
      result.current.addToCart(PRODUCTO_B, VENDEDOR);
    });
    act(() => { result.current.removeFromCart('p1'); });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].productId).toBe('p99');
  });

});

// ── updateQuantity ────────────────────────────────────────────────────────────

describe('useCart — updateQuantity', () => {

  test('elimina el ítem si la nueva cantidad es 0', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => { result.current.addToCart(PRODUCTO, VENDEDOR); });
    act(() => { result.current.updateQuantity('p1', 0); });

    expect(result.current.cart).toHaveLength(0);
  });

  test('actualiza la cantidad de un producto por unidad', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => { result.current.addToCart(PRODUCTO, VENDEDOR); });
    act(() => { result.current.updateQuantity('p1', 5); });

    expect(result.current.cart[0].cantidad).toBe(5);
  });

  test('clamps la cantidad al stock máximo disponible', () => {
    const productoStockTres = { ...PRODUCTO, stock: 3 };
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => { result.current.addToCart(productoStockTres, VENDEDOR); });
    act(() => { result.current.updateQuantity('p1', 99); });

    expect(result.current.cart[0].cantidad).toBe(3);
  });

  test('actualiza la cantidad en gramos de un producto kg', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => { result.current.addToCart(PRODUCTO_KG, VENDEDOR, 250); });
    act(() => { result.current.updateQuantity('p2', 750); });

    expect(result.current.cart[0].cantidad).toBe(750);
  });

  test('kg: clamps la cantidad mínima a 50 g', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => { result.current.addToCart(PRODUCTO_KG, VENDEDOR, 250); });
    act(() => { result.current.updateQuantity('p2', 10); });

    expect(result.current.cart[0].cantidad).toBe(50);
  });

  test('kg: clamps la cantidad máxima al stock en gramos', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => { result.current.addToCart(PRODUCTO_KG, VENDEDOR, 250); }); // stock: 5 kg → max 5000 g
    act(() => { result.current.updateQuantity('p2', 9999); });

    expect(result.current.cart[0].cantidad).toBe(5000);
  });

  test('actualiza la cantidad de una cesta', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => { result.current.addCestaToCart(CESTA, VENDEDOR); });
    act(() => { result.current.updateQuantity('c1', 3); });

    expect(result.current.cart[0].cantidad).toBe(3);
  });

});

// ── clearCart ─────────────────────────────────────────────────────────────────

describe('useCart — clearCart', () => {

  test('vacía el carrito completamente', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(PRODUCTO, VENDEDOR);
      result.current.addCestaToCart(CESTA, VENDEDOR);
    });
    act(() => { result.current.clearCart(); });

    expect(result.current.cart).toHaveLength(0);
    expect(result.current.cartCount).toBe(0);
    expect(result.current.cartTotal).toBe(0);
  });

});

// ── cartTotal ─────────────────────────────────────────────────────────────────

describe('useCart — cartTotal', () => {

  test('calcula el total con productos de distinto tipo', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(PRODUCTO, VENDEDOR);           // 2.50 × 1 = 2.50
      result.current.addToCart(PRODUCTO_KG, VENDEDOR, 1000); // 1000 g × 1.80 €/kg = 1.80
    });

    expect(result.current.cartTotal).toBeCloseTo(4.30);
  });

  test('incluye cestas predefinidas en el total', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(PRODUCTO, VENDEDOR);     // 2.50
      result.current.addCestaToCart(CESTA, VENDEDOR);   // 15.00
    });

    expect(result.current.cartTotal).toBeCloseTo(17.50);
  });

});

// ── cartByVendor ──────────────────────────────────────────────────────────────

describe('useCart — cartByVendor', () => {

  test('agrupa los ítems por vendedor correctamente', () => {
    const PRODUCTO_V2 = { ...PRODUCTO, id: 'p99', nombre: 'Peras' };
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(PRODUCTO,    VENDEDOR);
      result.current.addToCart(PRODUCTO_V2, VENDEDOR2);
    });

    expect(Object.keys(result.current.cartByVendor)).toHaveLength(2);
    expect(result.current.cartByVendor['v1'].items).toHaveLength(1);
    expect(result.current.cartByVendor['v2'].items).toHaveLength(1);
  });

  test('varios productos del mismo vendedor van al mismo grupo', () => {
    const PRODUCTO_B = { ...PRODUCTO, id: 'p99', nombre: 'Peras' };
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(PRODUCTO,   VENDEDOR);
      result.current.addToCart(PRODUCTO_B, VENDEDOR);
    });

    expect(Object.keys(result.current.cartByVendor)).toHaveLength(1);
    expect(result.current.cartByVendor['v1'].items).toHaveLength(2);
  });

});
