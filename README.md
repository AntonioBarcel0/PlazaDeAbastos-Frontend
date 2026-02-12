# 🛒 Plaza de Abastos - Frontend

Aplicación web desarrollada con React + Vite para el marketplace Plaza de Abastos. Interfaz moderna y responsive para clientes y comerciantes.

## 🚀 Tecnologías

- **React** 18
- **Vite** 5
- **React Router** (para navegación)
- **CSS Modules** (para estilos)
- **Fetch API** (para peticiones HTTP)

## 📋 Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) v18 o superior
- [Backend API](https://github.com/AntonioBarcel0/PlazaDeAbastos-Backend) ejecutándose en `http://localhost:5001`
- [Git](https://git-scm.com/)

## ⚙️ Instalación

### 1. Clonar el repositorio

git clone https://github.com/AntonioBarcel0/PlazaDeAbastos-Frontend.git
cd PlazaDeAbastos-Frontend

### 2. Instalar dependencias

npm install

### 3. Configurar la URL del backend

El frontend está configurado para conectarse al backend en:

http://localhost:5001/api

Si tu backend usa otro puerto, edita `src/services/api.js`:

const API_URL = 'http://localhost:TU_PUERTO/api';

### 4. Iniciar el servidor de desarrollo

# Desarrollo
npm run dev

# Build para producción
npm run build

La aplicación estará disponible en `http://localhost:5173`

## 📄 Licencia

Este proyecto es complementario del siguiente repositorio: https://github.com/AntonioBarcel0/PlazaDeAbastos-Backend.git

Ambos repositorios son parte de un Trabajo de Fin de Grado (TFG) para el ciclo de Desarrollo de Aplicaciones Web (DAW).

## 🗺️ Roadmap

- ✅ Sistema de autenticación completo
- ✅ Navegación entre vistas
- ✅ Header y sidebar responsivos
- Catálogo de productos con filtros
- Carrito de compra
- Sistema de checkout
- Chat en tiempo real
- Perfil de usuario editable
- Panel de comerciante
- Panel de administración
- Modo oscuro

## 📞 Contacto

**Antonio Barceló Lerlanga**
- GitHub: @AntonioBarcel0
- Email: antoniogibarber99@gmail.com
