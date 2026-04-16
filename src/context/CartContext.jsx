import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [vendedorCart, setVendedorCart] = useState(null); // { id, nombre }

  const cartCount = cart.reduce((sum, item) => sum + item.cantidad, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  // Devuelve { success: true } o { success: false, conflict: true, conflictVendorName }
  const addToCart = (producto, vendedor) => {
    if (vendedorCart && vendedorCart.id !== vendedor.id) {
      return { success: false, conflict: true, conflictVendorName: vendedorCart.nombre };
    }

    if (!vendedorCart) {
      setVendedorCart({ id: vendedor.id, nombre: vendedor.nombreCompleto });
    }

    setCart(prev => {
      const existing = prev.find(item => item.productId === producto.id);
      if (existing) {
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
        cantidad: 1,
      }];
    });

    return { success: true };
  };

  // Vacía el carrito y añade el producto (cuando el usuario confirma cambio de vendedor)
  const forceAddToCart = (producto, vendedor) => {
    setVendedorCart({ id: vendedor.id, nombre: vendedor.nombreCompleto });
    setCart([{
      productId: producto.id,
      nombre: producto.nombre,
      precio: parseFloat(producto.precio),
      unidad: producto.unidad,
      imagen: producto.imagen,
      cantidad: 1,
    }]);
  };

  const removeFromCart = (productId) => {
    setCart(prev => {
      const updated = prev.filter(item => item.productId !== productId);
      if (updated.length === 0) setVendedorCart(null);
      return updated;
    });
  };

  const updateQuantity = (productId, cantidad) => {
    if (cantidad <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.productId === productId ? { ...item, cantidad } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setVendedorCart(null);
  };

  return (
    <CartContext.Provider value={{
      cart,
      vendedorCart,
      cartCount,
      cartTotal,
      addToCart,
      forceAddToCart,
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
