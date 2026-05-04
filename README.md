<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=8b2332&height=220&section=header&text=Plaza%20de%20Abastos&fontSize=62&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Marketplace%20digital%20del%20Mercado%20de%20Úbeda&descAlignY=58&descSize=20" width="100%"/>

<br/>

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=white&labelColor=20232a)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2023-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/CSS3-Variables-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/es/docs/Web/CSS)
[![Vitest](https://img.shields.io/badge/Vitest-74%20tests-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev)

[![Estado](https://img.shields.io/badge/Estado-En%20desarrollo-orange?style=for-the-badge)](https://github.com/AntonioBarcel0/PlazaDeAbastos-Frontend)
[![Licencia](https://img.shields.io/badge/Licencia-MIT-green?style=for-the-badge)](LICENSE)
[![TFG](https://img.shields.io/badge/TFG-DAW%202025-8b2332?style=for-the-badge)](https://github.com/AntonioBarcel0)

</div>

---

## Índice

- [Descripción](#descripción)
- [Capturas de pantalla](#capturas-de-pantalla)
- [Tecnologías](#tecnologías)
- [Funcionalidades](#funcionalidades)
- [Arquitectura](#arquitectura)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Testing](#testing)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Variables de entorno](#variables-de-entorno)
- [Scripts](#scripts)
- [Roles de usuario](#roles-de-usuario)
- [Backend](#backend)
- [Autor](#autor)

---

## Descripción

**Plaza de Abastos** es una aplicación web SPA (Single Page Application) desarrollada con **React 18 + Vite 5** como Trabajo de Fin de Grado del ciclo superior de **Desarrollo de Aplicaciones Web (DAW)**.

La aplicación digitaliza el marketplace del **Mercado de Abastos de Úbeda**, permitiendo a los clientes explorar puestos, comprar productos por peso o unidad y realizar pedidos con entrega a domicilio o recogida en el mercado. Los comerciantes gestionan su catálogo y pedidos desde un panel propio.

> **Enfoque de accesibilidad:** el diseño está orientado a usuarios de todas las edades, con especial atención a personas mayores: tipografía amplia, botones generosos y flujos de compra sencillos.

---



## Tecnologías

<div align="center">

| Categoría | Tecnología | Versión |
|---|---|---|
| Framework UI | React | 18.2 |
| Bundler | Vite | 5.0 |
| Estilos | CSS plano con custom properties | — |
| Estado global | React Context API | — |
| Notificaciones | react-hot-toast | 2.x |
| Iconos | lucide-react | 0.563 |
| Testing | Vitest + Testing Library | 4.x |
| Imágenes externas | Cloudinary | — |
| Geocodificación | Nominatim (OpenStreetMap) | — |
| Fuentes | Alfa Slab One + Afacad | Google Fonts |

</div>

---

## Funcionalidades

### 🛒 Para clientes

| Funcionalidad | Descripción |
|---|---|
| Autenticación | Registro e inicio de sesión con JWT |
| Verificación de zona | Código postal + distancia Haversine (20 km de Úbeda) |
| Exploración de puestos | Búsqueda, filtros por categoría y ordenación A-Z / Z-A / categoría |
| Vista de puesto | Hero con imagen, catálogo de productos con grid responsive |
| Detalle de producto | Imagen, descripción, badges de temporada y origen, selector de cantidad |
| Carrito multi-vendedor | Productos por peso (gramos) y por unidad, de múltiples puestos |
| Checkout | Recogida en mercado o entrega a domicilio con validación de zona |
| Historial de pedidos | Estado en tiempo real de cada pedido y subpedido |
| Cestas predefinidas | "Crea tu cesta" (productos sueltos) o "Compra tu cesta" (cestas listas) |

### 🏪 Para comerciantes

| Funcionalidad | Descripción |
|---|---|
| Gestión de productos | Crear, editar, eliminar con imagen Cloudinary o upload local |
| Gestión de pedidos | Ver subpedidos, cambiar estado, añadir notas internas |
| Cestas predefinidas | Crear y gestionar cestas propias (frutas, verduras, mixta, comestibles) |
| Estadísticas | Resumen de ventas por estado del pedido |

### 🗂️ Para gestores

| Funcionalidad | Descripción |
|---|---|
| Panel global | Todos los pedidos del mercado con filtros por modo y estado |
| Estadísticas | Domicilios pendientes, listos para entregar, recogidas activas, entregados hoy |
| Entrega | Marcar pedidos completos como entregados desde el panel |

### ✨ Funcionalidades generales

- **Mapa SVG interactivo** del mercado con leyenda, entradas y puestos numerados
- **Sidebar animado** con efecto persiana y navegación completa
- **Recomendaciones del día** — selección aleatoria por fecha, cacheada en `localStorage` (cambia cada 24 h)
- **Badges de temporada** — productos marcados según el mes actual
- **Badges de origen** — productos locales, ecológicos y DOP identificados automáticamente
- **Marquee** de puestos destacados en la home
- **Páginas informativas** — FAQ, Aviso legal, Privacidad, Cookies, Contacto, Atención al cliente
- **Diseño responsive** — mobile, tablet y desktop

---

## Arquitectura

### Enrutamiento por estado

El proyecto implementa **enrutamiento personalizado basado en estado** (`useState` + `window.history.pushState`) en lugar de React Router, lo que elimina dependencias externas y permite control total del flujo de navegación.

```
App.jsx
├── currentView: string          → determina qué componente se renderiza
├── CartProvider                 → estado global del carrito (Context API)
├── Toaster                      → notificaciones globales (react-hot-toast)
└── navigate(view, params?)      → wrapper sobre history.pushState
```

### Flujo de navegación

```
Home
 ├── Marketplace (grid de puestos)
 │    └── StoreView (puesto individual)
 │         └── ProductDetail (detalle de producto)
 ├── SelectPuesto (lista con filtros avanzados)
 │    └── StoreView → ProductDetail
 ├── Baskets → ComprarCesta → CestaDetalle
 │          → CrearCesta → SelectPuesto → StoreView
 ├── Cart → Checkout → PostalCheck (si es domicilio)
 ├── Orders (historial del cliente)
 ├── MarketMap (mapa SVG)
 ├── AdminDashboard (comerciante)
 └── GestorDashboard (gestor)
```

### Carrito (CartContext)

El carrito soporta dos tipos de ítem con lógica unificada:

```js
// Ítem de producto
{ productId, nombre, precio, unidad, cantidad, stock, vendedorId, vendedorNombre }

// Ítem de cesta predefinida
{ itemType: 'cesta', cestaId, nombre, precio, cantidad, vendedorId, vendedorNombre }
```

- Productos por **peso** (`unidad: 'kg'`): `cantidad` se almacena en **gramos** (mínimo 50 g, step 50 g)
- Productos por **unidad**: `cantidad` es el número de unidades (limitado por `stock`)
- `cartCount` devuelve 1 por cada ítem de tipo kg (independientemente de los gramos)
- `cartTotal` calcula correctamente ambos tipos: `(gramos / 1000) * precio` o `precio * cantidad`

### Capa de API

Todas las peticiones al backend se centralizan en `src/services/api.js`:

```js
export const api = {
  login(credentials),
  register(data),
  getVendedores(),
  getVendedor(id),
  getProductos(filters),
  createOrder(data),
  getMyPurchases(),
  getCestas(tipo),
  // ...
};
```

---

## Estructura del proyecto

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── __tests__/
│   │   │   ├── Baskets.test.jsx
│   │   │   ├── SelectPuesto.test.jsx
│   │   │   └── Sidebar.test.jsx
│   │   ├── AdminDashboard.jsx      # Panel del comerciante
│   │   ├── Baskets.jsx             # Selector de modo de cesta
│   │   ├── Cart.jsx                # Carrito de compra
│   │   ├── CestaDetalle.jsx        # Listado de cestas por tipo
│   │   ├── Checkout.jsx            # Proceso de pago
│   │   ├── ComprarCesta.jsx        # Selector de tipo de cesta
│   │   ├── CrearCesta.jsx          # Flujo crear cesta propia
│   │   ├── EligeTuCesta.jsx        # Landing de cestas
│   │   ├── Footer.jsx
│   │   ├── GestorDashboard.jsx     # Panel del gestor
│   │   ├── Header.jsx              # Cabecera global con carrito
│   │   ├── Hero.jsx                # Hero de la home
│   │   ├── Home.jsx                # Página principal
│   │   ├── LaPlaza.jsx             # Sección mercado + recomendaciones
│   │   ├── Marketplace.jsx         # Grid de puestos
│   │   ├── MarketMap.jsx           # Mapa SVG interactivo
│   │   ├── OriginBadge.jsx         # Badge de origen del producto
│   │   ├── PostalCheck.jsx         # Verificador de código postal
│   │   ├── SeasonBadge.jsx         # Badge de temporada
│   │   ├── SelectPuesto.jsx        # Lista de puestos con filtros
│   │   ├── Sidebar.jsx             # Menú lateral animado
│   │   ├── Spinner.jsx
│   │   ├── StoreView.jsx           # Vista del puesto con productos
│   │   └── Tarjeta.jsx
│   ├── context/
│   │   ├── __tests__/
│   │   │   └── CartContext.test.jsx
│   │   └── CartContext.jsx         # Estado global del carrito
│   ├── pages/
│   │   ├── __tests__/
│   │   │   └── ProductDetail.test.jsx
│   │   └── ProductDetail.jsx       # Vista detallada de producto
│   ├── services/
│   │   └── api.js                  # Cliente HTTP centralizado
│   ├── test/
│   │   └── setup.js                # Configuración global de tests
│   ├── utils/
│   │   ├── seasonality.js          # Lógica de temporada por mes
│   │   └── vendorImages.js         # Mapa UUID → URL Cloudinary
│   ├── App.jsx                     # Enrutador de estado + lógica global
│   ├── App.css                     # Variables CSS y estilos globales
│   └── main.jsx                    # Punto de entrada
├── vite.config.js                  # Config Vite + Vitest
└── package.json
```

---

## Testing

El proyecto cuenta con **5 suites de tests** y **74 tests** que cubren la lógica de negocio crítica y los componentes principales.

```
 ✓  src/components/__tests__/Baskets.test.jsx          (6 tests)
 ✓  src/components/__tests__/SelectPuesto.test.jsx    (12 tests)
 ✓  src/components/__tests__/Sidebar.test.jsx          (9 tests)
 ✓  src/context/__tests__/CartContext.test.jsx        (31 tests)
 ✓  src/pages/__tests__/ProductDetail.test.jsx        (16 tests)

 Test Files  5 passed (5)
      Tests  74 passed (74)
```

### Cobertura por área

| Área | Tests | Qué se verifica |
|---|---|---|
| `CartContext` | 31 | `isKg`, `itemSubtotal`, `isCestaItem`, `addToCart`, `addCestaToCart`, `removeFromCart`, `updateQuantity`, `clearCart`, `cartCount`, `cartTotal`, `cartByVendor` |
| `ProductDetail` | 16 | Renderizado, botón añadir, control de cantidad, selector de gramos, estado agotado, callback onBack |
| `SelectPuesto` | 12 | Búsqueda, filtros por categoría, ordenación, exclusión de carnicerías/pescaderías, combinación de filtros |
| `Sidebar` | 9 | Apertura/cierre, todos los enlaces, callbacks correctos por enlace |
| `Baskets` | 6 | Renderizado y navegación entre los dos modos de cesta |

### Ejecutar los tests

```bash
npm test              # Una sola vez
npm run test:watch    # Modo watch
npm run test:ui       # Interfaz visual (Vitest UI)
```

---

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- [npm](https://www.npmjs.com/) v9 o superior
- Backend de Plaza de Abastos en ejecución → [PlazaDeAbastos-Backend](https://github.com/AntonioBarcel0/PlazaDeAbastos-Backend)

---

## Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/AntonioBarcel0/PlazaDeAbastos-Frontend.git
cd PlazaDeAbastos-Frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con la URL del backend

# 4. Arrancar en modo desarrollo
npm run dev
```

La aplicación estará disponible en **http://localhost:5173**

> El backend debe estar corriendo **antes** de arrancar el frontend.

---

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:5000/api
```

| Variable | Descripción | Por defecto |
|---|---|---|
| `VITE_API_URL` | URL base de la API REST del backend | `http://localhost:5000/api` |

---

## Scripts

```bash
npm run dev          # Servidor de desarrollo con HMR (http://localhost:5173)
npm run build        # Build optimizado de producción → dist/
npm run preview      # Previsualizar el build de producción
npm test             # Ejecutar todos los tests una vez
npm run test:watch   # Tests en modo watch (re-ejecuta al guardar)
npm run test:ui      # Interfaz visual interactiva de Vitest
```

---

## Roles de usuario

| Rol | Acceso |
|---|---|
| `cliente` | Exploración, carrito, checkout, historial de pedidos, cestas |
| `comerciante` | Todo lo anterior + panel de productos, cestas propias y pedidos recibidos |
| `gestor` | Panel global de pedidos, estadísticas del mercado, marcar entregas |
| `admin` | Acceso completo |

---

## Backend

Este frontend requiere el backend REST de Plaza de Abastos:

**[➜ PlazaDeAbastos-Backend](https://github.com/AntonioBarcel0/PlazaDeAbastos-Backend)**

Stack: Node.js · Express · Sequelize · MySQL · JWT

---

## Autor

<div align="center">

**Antonio Barceló Berlanga**

[![GitHub](https://img.shields.io/badge/GitHub-AntonioBarcel0-181717?style=for-the-badge&logo=github)](https://github.com/AntonioBarcel0)
[![Email](https://img.shields.io/badge/Email-antoniogibarber99%40gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:antoniogibarber99@gmail.com)

*Trabajo de Fin de Grado · Ciclo Superior de Desarrollo de Aplicaciones Web (DAW) · 2025*

</div>

<img src="https://capsule-render.vercel.app/api?type=waving&color=8b2332&height=120&section=footer" width="100%"/>
