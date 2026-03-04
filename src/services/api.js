// services/api.js
const API_URL = 'http://localhost:3001/api';

// Helper para obtener el token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const api = {
  // ============== AUTH ==============
  
  // Registro de usuario
  register: async (userData) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en el registro');
      }

      // Guardar token
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Login de usuario
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en el login');
      }

      // Guardar token
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Cerrar sesión
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // ============== PRODUCTOS ==============

  // Obtener todos los productos (público)
  getProducts: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`${API_URL}/products?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener productos');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener un producto por ID
  getProduct: async (id) => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener producto');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener productos del vendedor autenticado
  getMyProducts: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/products/my/products`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener tus productos');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Crear producto
  createProduct: async (productData) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      Object.keys(productData).forEach(key => {
        if (productData[key] !== null && productData[key] !== undefined) {
          formData.append(key, productData[key]);
        }
      });

      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al crear producto');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar producto
  updateProduct: async (id, productData) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      Object.keys(productData).forEach(key => {
        if (productData[key] !== null && productData[key] !== undefined) {
          formData.append(key, productData[key]);
        }
      });

      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar producto');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar producto
  deleteProduct: async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al eliminar producto');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // ============== VENDEDORES ==============

  // Obtener todos los vendedores/puestos
  getVendedores: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`${API_URL}/vendedores?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener vendedores');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener un vendedor por ID con sus productos
  getVendedor: async (id) => {
    try {
      const response = await fetch(`${API_URL}/vendedores/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener vendedor');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener categorías disponibles
  getCategorias: async () => {
    try {
      const response = await fetch(`${API_URL}/vendedores/categorias`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener categorías');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // ============== PEDIDOS ==============

  // Obtener todos los pedidos del vendedor
  getMyOrders: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/orders/my-orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener pedidos');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener detalles de un pedido
  getOrderById: async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/orders/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener pedido');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar estado del pedido
  updateOrderStatus: async (id, estado) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/orders/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estado })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar estado');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar notas del vendedor
  updateVendorNotes: async (id, notasVendedor) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/orders/${id}/notes`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ notasVendedor })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar notas');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Crear un pedido (clientes)
  createOrder: async (orderData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al crear pedido');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener estadísticas de pedidos
  getOrderStats: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/orders/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener estadísticas');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }
};

// Funciones para manejar el token
export const auth = {
  setToken: (token) => {
    localStorage.setItem('token', token);
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  removeToken: () => {
    localStorage.removeItem('token');
  },

  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  removeUser: () => {
    localStorage.removeItem('user');
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};