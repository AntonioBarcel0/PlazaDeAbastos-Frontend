import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

// Unidades que se venden por peso y cuya cantidad se almacena en gramos
export const isKg = (unidad) => unidad === 'kg';

// Precio real de un ítem del carrito
export const itemSubtotal = (item) =>
  isKg(item.unidad)
    ? (item.cantidad / 1000) * item.precio   // item.cantidad = gramos
    : item.precio * item.cantidad;

// Comprueba si un ítem del carrito es una cesta predefinida
export const isCestaItem = (item) => item.itemType === 'cesta';

export function CartProvider({ children }) {
  // Cada item almacena: productId, nombre, precio, unidad, imagen, cantidad, stock,
  //                      vendedorId, vendedorNombre
  const [cart, setCart] = useState([]);

  // Los productos por peso cuentan como 1 en el badge, no como sus gramos
  const cartCount = cart.reduce(
    (sum, item) => sum + (isKg(item.unidad) ? 1 : item.cantidad),
    0
  );
  const cartTotal = cart.reduce((sum, item) => sum + itemSubtotal(item), 0);

  // Agrupar ítems del carrito por vendedor: { vendedorId: { nombre, items: [...] } }
  const cartByVendor = cart.reduce((acc, item) => {
    if (!acc[item.vendedorId]) {
      acc[item.vendedorId] = { nombre: item.vendedorNombre, items: [] };
    }
    acc[item.vendedorId].items.push(item);
    return acc;
  }, {});

  // Añadir producto al carrito (multi-vendedor, sin restricción)
  // Para productos por kg: `gramos` es la cantidad inicial (e.g. 250)
  const addToCart = (producto, vendedor, gramos = null) => {
    const porPeso = isKg(producto.unidad);
    const cantidadInicial = porPeso ? (gramos ?? 250) : 1;

    setCart(prev => {
      const existing = prev.find(item => item.productId === producto.id);
      if (existing) {
        if (porPeso) {
          return prev.map(item =>
            item.productId === producto.id
              ? { ...item, cantidad: gramos ?? item.cantidad }
              : item
          );
        }
        const maxStock = existing.stock;
        if (maxStock !== null && maxStock !== undefined && existing.cantidad >= maxStock) {
          return prev;
        }
        return prev.map(item =>
          item.productId === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prev, {
        productId: producto.id,
        nombre: producto.nombre,
        precio: parseFloat(producto.precio),
        unidad: producto.unidad,
        imagen: producto.imagen,
        cantidad: cantidadInicial,
        stock: producto.stock ?? null,
        vendedorId: vendedor.id,
        vendedorNombre: vendedor.nombreCompleto || `${vendedor.nombre} ${vendedor.apellidos}`,
      }];
    });

    return { success: true };
  };

  // Añadir cesta predefinida al carrito
  const addCestaToCart = (cesta, vendedor) => {
    setCart(prev => {
      const existing = prev.find(item => item.cestaId === cesta.id);
      if (existing) {
        return prev.map(item =>
          item.cestaId === cesta.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prev, {
        itemType: 'cesta',
        cestaId: cesta.id,
        nombre: cesta.nombre,
        precio: parseFloat(cesta.precio),
        descripcion: cesta.descripcion || '',
        items: cesta.items || [],
        unidad: 'ud',
        cantidad: 1,
        stock: null,
        vendedorId: vendedor.id,
        vendedorNombre: vendedor.nombreCompleto || `${vendedor.nombre} ${vendedor.apellidos}`,
      }];
    });
    return { success: true };
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item =>
      item.itemType === 'cesta' ? item.cestaId !== id : item.productId !== id
    ));
  };

  // Para kg: `cantidad` son gramos (mínimo 50g, máximo stock*1000 g)
  // `id` puede ser productId o cestaId según el tipo de ítem
  const updateQuantity = (id, cantidad) => {
    if (cantidad <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        const matches = item.itemType === 'cesta'
          ? item.cestaId === id
          : item.productId === id;
        if (!matches) return item;
        if (item.itemType === 'cesta') {
          return { ...item, cantidad: Math.max(1, cantidad) };
        }
        if (isKg(item.unidad)) {
          const maxGramos = item.stock !== null && item.stock !== undefined
            ? item.stock * 1000
            : Infinity;
          const newCantidad = Math.min(Math.max(50, cantidad), maxGramos);
          return { ...item, cantidad: newCantidad };
        }
        const maxStock = item.stock;
        const newCantidad = (maxStock !== null && maxStock !== undefined)
          ? Math.min(cantidad, maxStock)
          : cantidad;
        return { ...item, cantidad: newCantidad };
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{
      cart,
      cartCount,
      cartTotal,
      cartByVendor,
      addToCart,
      addCestaToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe usarse dentro de CartProvider');
  return context;
}
