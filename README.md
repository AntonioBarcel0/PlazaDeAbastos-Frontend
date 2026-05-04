# Plaza de Abastos — Frontend

Aplicación web SPA desarrollada con **React 18 + Vite 5** para el marketplace digital del mercado Plaza de Abastos de Úbeda. Permite a clientes explorar puestos, añadir productos al carrito y realizar pedidos, y a comerciantes gestionar su catálogo y pedidos.

> Trabajo de Fin de Grado (TFG) · Ciclo Superior de Desarrollo de Aplicaciones Web (DAW)

---

## Índice

- [Tecnologías](#tecnologías)
- [Funcionalidades](#funcionalidades)
- [Arquitectura](#arquitectura)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Instalación y puesta en marcha](#instalación-y-puesta-en-marcha)
- [Variables de entorno](#variables-de-entorno)
- [Scripts disponibles](#scripts-disponibles)
- [Roles de usuario](#roles-de-usuario)
- [Repositorio backend](#repositorio-backend)
- [Contacto](#contacto)

---

## Tecnologías

| Categoría       | Tecnología                           |
| --------------- | ------------------------------------ |
| Framework UI    | React 18                             |
| Bundler         | Vite 5                               |
| Estilos         | CSS plano con variables CSS          |
| Notificaciones  | react-hot-toast                      |
| Iconos          | lucide-react                         |
| Testing         | Vitest + Testing Library             |
| Imágenes        | Cloudinary                      |
| Geocodificación | Nominatim (OpenStreetMap)            |
| Fuentes         | Alfa Slab One, Afacad (Google Fonts) |

---

## Funcionalidades

### Clientes

- Registro e inicio de sesión con JWT
- Verificación de código postal (reparto limitado a 20 km de Úbeda mediante Haversine + Nominatim)
- Exploración de puestos con búsqueda, filtrado por categoría y ordenación
- Vista detallada de cada puesto con su catálogo de productos
- Carrito de compra con soporte para productos por peso (gramos) y por unidad
- Proceso de pago (checkout + pasarela de pago)
- Historial de pedidos
- Cestas predefinidas ("Crea tu cesta" / "Compra tu cesta")
- Detalle de producto con badges de temporada y origen

### Comerciantes

- Panel de gestión de productos (crear, editar, eliminar, imagen)
- Gestión de pedidos recibidos con cambio de estado
- Gestión de cestas predefinidas propias

### Gestores / Administración

- Panel global con estadísticas del mercado
- Gestión de todos los pedidos
- Marcado de pedidos como entregados

### General

- Mapa SVG interactivo del mercado con entradas y leyenda
- Sidebar animado (efecto persiana)
- Recomendaciones del día con selección aleatoria basada en fecha (cambia cada 24 h, cacheadas en `localStorage`)
- Marquee de puestos, sección "Productos de temporada"
- Páginas informativas: FAQ, Aviso Legal, Política de Privacidad, Cookies, Atención al cliente, Contacto
- Diseño responsive (mobile + desktop)

---

## Arquitectura

El proyecto usa **enrutamiento personalizado basado en estado** (`useState` + `window.history.pushState`) en lugar de React Router, lo que permite un control total del flujo de navegación sin dependencias adicionales.

```text
App.jsx
 ├── currentView (estado) → determina qué componente renderizar
 ├── CartProvider (contexto global del carrito)
 └── Toaster (notificaciones globales)
```

Las peticiones a la API se centralizan en `src/services/api.js`, que expone métodos tipados para cada endpoint del backend.

---

## Estructura del proyecto

```text
src/
├── components/          # Componentes de vistas y UI
│   ├── Home.jsx         # Página principal
│   ├── Marketplace.jsx  # Listado de puestos (grid)
│   ├── SelectPuesto.jsx # Listado de puestos (lista con filtros avanzados)
│   ├── StoreView.jsx    # Vista de un puesto con productos
│   ├── Cart.jsx         # Carrito de compra
│   ├── Checkout.jsx     # Proceso de pago
│   ├── PostalCheck.jsx  # Verificación de código postal
│   ├── MarketMap.jsx    # Mapa SVG del mercado
│   ├── LaPlaza.jsx      # Sección La Plaza + Recomendaciones
│   ├── Hero.jsx         # Hero de la home
│   ├── Header.jsx       # Cabecera global
│   ├── Sidebar.jsx      # Menú lateral animado
│   ├── Footer.jsx       # Pie de página
│   ├── AdminDashboard.jsx
│   ├── GestorDashboard.jsx
│   ├── EligeTuCesta.jsx
│   ├── CrearCesta.jsx
│   ├── ComprarCesta.jsx
│   └── ...              # Resto de vistas y componentes
├── context/
│   └── CartContext.jsx  # Estado global del carrito
├── pages/
│   └── ProductDetail.jsx
├── services/
│   └── api.js           # Capa de comunicación con el backend
├── utils/
│   └── vendorImages.js  # Mapa UUID vendedor → URL imagen Cloudinary
├── App.jsx              # Enrutador de estado + lógica global
├── App.css              # Estilos globales y variables CSS
└── main.jsx             # Punto de entrada
```

---

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- [npm](https://www.npmjs.com/) v9 o superior
- Backend de Plaza de Abastos ejecutándose (ver [repositorio backend](https://github.com/AntonioBarcel0/PlazaDeAbastos-Backend))

---

## Instalación y puesta en marcha

### 1. Clonar el repositorio

```bash
git clone https://github.com/AntonioBarcel0/PlazaDeAbastos-Frontend.git
cd PlazaDeAbastos-Frontend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` con la URL de tu backend (ver sección [Variables de entorno](#variables-de-entorno)).

### 4. Arrancar en modo desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

> **Nota:** El backend debe estar en ejecución antes de arrancar el frontend.

---

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:5000/api
```

| Variable         | Descripción                        | Valor por defecto              |
| ---------------- | ---------------------------------- | ------------------------------ |
| `VITE_API_URL`   | URL base de la API del backend     | `http://localhost:5000/api`    |

---

## Scripts disponibles

```bash
npm run dev          # Servidor de desarrollo con HMR
npm run build        # Build de producción (dist/)
npm run preview      # Previsualización del build de producción
npm run test         # Ejecutar tests una vez
npm run test:watch   # Tests en modo watch
npm run test:ui      # Tests con interfaz visual (Vitest UI)
```

---

## Roles de usuario

| Rol           | Acceso                                                            |
| ------------- | ----------------------------------------------------------------- |
| `cliente`     | Navegación, carrito, pedidos, cestas                              |
| `comerciante` | Todo lo anterior + gestión de productos, cestas y pedidos propios |
| `admin`       | Todo lo anterior + panel de administración global                 |
| `gestor`      | Panel de gestión de pedidos y estadísticas del mercado            |

---

## Repositorio backend

Este frontend requiere el backend de Plaza de Abastos:

**[PlazaDeAbastos-Backend](https://github.com/AntonioBarcel0/PlazaDeAbastos-Backend)**

---

## Contacto

### Antonio Barceló Lerlanga

GitHub: [@AntonioBarcel0](https://github.com/AntonioBarcel0)

Email: antoniogibarber99@gmail.com
