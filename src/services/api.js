// services/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// URL base del servidor (sin /api) — para construir rutas de imágenes
export const BASE_URL = API_URL.replace('/api', '');

// Cabeceras JSON con token de autenticación
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Cabecera solo con token (para FormData, sin Content-Type)
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const api = {
  // ============== AUTH ==============

  register: async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error en el registro');
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  login: async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error en el login');
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // ============== PRODUCTOS ==============

  getProducts: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_URL}/products?${params}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener productos');
    return data;
  },

  getProduct: async (id) => {
    const response = await fetch(`${API_URL}/products/${id}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener producto');
    return data;
  },

  getMyProducts: async () => {
    const response = await fetch(`${API_URL}/products/my/products`, {
      headers: getAuthHeader()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener tus productos');
    return data;
  },

  createProduct: async (productData) => {
    const formData = new FormData();
    Object.keys(productData).forEach(key => {
      if (productData[key] !== null && productData[key] !== undefined) {
        formData.append(key, productData[key]);
      }
    });
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: formData
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al crear producto');
    return data;
  },

  updateProduct: async (id, productData) => {
    const formData = new FormData();
    Object.keys(productData).forEach(key => {
      if (productData[key] !== null && productData[key] !== undefined) {
        formData.append(key, productData[key]);
      }
    });
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: formData
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al actualizar producto');
    return data;
  },

  deleteProduct: async (id) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al eliminar producto');
    return data;
  },

  // ============== VENDEDORES ==============

  getVendedores: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_URL}/vendedores?${params}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener vendedores');
    return data;
  },

  getVendedor: async (id) => {
    const response = await fetch(`${API_URL}/vendedores/${id}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener vendedor');
    return data;
  },

  updateVendorProfile: async (formData) => {
    const response = await fetch(`${API_URL}/vendedores/profile`, {
      method: 'PATCH',
      headers: getAuthHeader(),
      body: formData
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al actualizar perfil');
    return data;
  },

  getCategorias: async () => {
    const response = await fetch(`${API_URL}/vendedores/categorias`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener categorías');
    return data;
  },

  // ============== PEDIDOS ==============

  getMyOrders: async () => {
    const response = await fetch(`${API_URL}/orders/my-orders`, {
      headers: getAuthHeader()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener pedidos');
    return data;
  },

  getOrderById: async (id) => {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      headers: getAuthHeader()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener pedido');
    return data;
  },

  updateOrderStatus: async (id, estado) => {
    const response = await fetch(`${API_URL}/orders/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ estado })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al actualizar estado');
    return data;
  },

  updateVendorNotes: async (id, notasVendedor) => {
    const response = await fetch(`${API_URL}/orders/${id}/notes`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ notasVendedor })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al actualizar notas');
    return data;
  },

  getMyPurchases: async () => {
    const response = await fetch(`${API_URL}/orders/my-purchases`, {
      headers: getAuthHeader()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener tus pedidos');
    return data;
  },

  createOrder: async (orderData) => {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al crear pedido');
    return data;
  },

  cancelOrder: async (id) => {
    const response = await fetch(`${API_URL}/orders/${id}/cancel`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'No se pudo cancelar el pedido');
    return data;
  },

  getOrderStats: async () => {
    const response = await fetch(`${API_URL}/orders/stats`, {
      headers: getAuthHeader()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener estadísticas');
    return data;
  },

  // ============== GESTOR ==============

  getAllOrders: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_URL}/orders/all?${params}`, {
      headers: getAuthHeader()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener pedidos');
    return data;
  },

  deliverOrder: async (id) => {
    const response = await fetch(`${API_URL}/orders/${id}/deliver`, {
      method: 'PATCH',
      headers: getAuthHeader()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al marcar como entregado');
    return data;
  },

  getGestorStats: async () => {
    const response = await fetch(`${API_URL}/orders/gestor-stats`, {
      headers: getAuthHeader()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener estadísticas');
    return data;
  },

  // ============== CESTAS PREDEFINIDAS ==============

  getCestas: async (tipo = null) => {
    const params = tipo ? `?tipo=${tipo}` : '';
    const response = await fetch(`${API_URL}/cestas${params}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener cestas');
    return data;
  },

  getMisCestas: async () => {
    const response = await fetch(`${API_URL}/cestas/mis-cestas`, {
      headers: getAuthHeader()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener tus cestas');
    return data;
  },

  createCesta: async (cestaData) => {
    const formData = new FormData();
    formData.append('tipo', cestaData.tipo);
    formData.append('nombre', cestaData.nombre);
    formData.append('precio', cestaData.precio);
    if (cestaData.descripcion) formData.append('descripcion', cestaData.descripcion);
    formData.append('items', JSON.stringify(cestaData.items || []));
    if (cestaData.imagenFile) formData.append('imagen', cestaData.imagenFile);
    const response = await fetch(`${API_URL}/cestas`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: formData
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al crear la cesta');
    return data;
  },

  updateCesta: async (id, cestaData) => {
    const formData = new FormData();
    if (cestaData.tipo !== undefined) formData.append('tipo', cestaData.tipo);
    if (cestaData.nombre !== undefined) formData.append('nombre', cestaData.nombre);
    if (cestaData.precio !== undefined) formData.append('precio', cestaData.precio);
    if (cestaData.descripcion !== undefined) formData.append('descripcion', cestaData.descripcion || '');
    if (cestaData.items !== undefined) formData.append('items', JSON.stringify(cestaData.items || []));
    if (cestaData.activa !== undefined) formData.append('activa', cestaData.activa);
    if (cestaData.imagenFile) formData.append('imagen', cestaData.imagenFile);
    const response = await fetch(`${API_URL}/cestas/${id}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: formData
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al actualizar la cesta');
    return data;
  },

  deleteCesta: async (id) => {
    const response = await fetch(`${API_URL}/cestas/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al eliminar la cesta');
    return data;
  }
};

// Funciones para manejar el token
export const auth = {
  setToken: (token) => localStorage.setItem('token', token),
  getToken: () => localStorage.getItem('token'),
  removeToken: () => localStorage.removeItem('token'),
  setUser: (user) => localStorage.setItem('user', JSON.stringify(user)),
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  removeUser: () => localStorage.removeItem('user'),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  isAuthenticated: () => !!localStorage.getItem('token')
};
