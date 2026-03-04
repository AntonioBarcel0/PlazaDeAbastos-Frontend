import { useState, useEffect } from 'react';
import { api } from '../services/api';
import './ProductForm.css';

function ProductForm({ product, onClose }) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    unidad: 'kg',
    categoria: '',
    stock: 0,
    disponible: true
  });
  const [imagen, setImagen] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const categorias = [
    'Frutas',
    'Verduras',
    'Pescado',
    'Carne',
    'Embutidos',
    'Lácteos',
    'Pan y Bollería',
    'Conservas',
    'Especias',
    'Otros'
  ];

  const unidades = ['kg', 'unidad', 'litro', 'docena', 'bandeja', 'paquete'];

  useEffect(() => {
    if (product) {
      setFormData({
        nombre: product.nombre,
        descripcion: product.descripcion || '',
        precio: product.precio,
        unidad: product.unidad,
        categoria: product.categoria || '',
        stock: product.stock,
        disponible: product.disponible
      });
      if (product.imagen) {
        setPreviewUrl(`http://localhost:3001${product.imagen}`);
      }
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.precio) {
      alert('Nombre y precio son obligatorios');
      return;
    }

    setLoading(true);

    try {
      const dataToSend = { ...formData };
      if (imagen) {
        dataToSend.imagen = imagen;
      }

      if (product) {
        await api.updateProduct(product.id, dataToSend);
        alert('Producto actualizado correctamente');
      } else {
        await api.createProduct(dataToSend);
        alert('Producto creado correctamente');
      }

      onClose(true);
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => onClose(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{product ? 'Editar Producto' : 'Nuevo Producto'}</h2>
          <button className="close-btn" onClick={() => onClose(false)}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-row">
            <div className="form-group full-width">
              <label>Nombre del producto *</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                placeholder="Ej: Tomates frescos"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Precio *</label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label>Unidad</label>
              <select name="unidad" value={formData.unidad} onChange={handleChange}>
                {unidades.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label>Categoría</label>
              <select name="categoria" value={formData.categoria} onChange={handleChange}>
                <option value="">Seleccionar categoría</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label>Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows="3"
                placeholder="Descripción del producto (opcional)"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label>Imagen del producto</label>
              <div className="image-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  id="imagen-input"
                />
                <label htmlFor="imagen-input" className="upload-label">
                  {previewUrl ? 'Cambiar imagen' : 'Seleccionar imagen'}
                </label>
                {previewUrl && (
                  <div className="image-preview">
                    <img src={previewUrl} alt="Preview" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="disponible"
                  checked={formData.disponible}
                  onChange={handleChange}
                />
                <span>Producto disponible</span>
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-cancel" 
              onClick={() => onClose(false)}
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-save"
              disabled={loading}
            >
              {loading ? 'Guardando...' : product ? 'Actualizar' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;
