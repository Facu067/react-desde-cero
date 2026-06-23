# Proyecto 14: React Router

> **Concepto**: SPA, navegación, rutas dinámicas, `useParams`, `useNavigate`

---

## 📖 Nota Académica

### ¿Qué es una SPA?

Hasta ahora, todos los proyectos tenían **una sola "página"** — un solo componente que se renderizaba. Pero las aplicaciones reales tienen **múltiples vistas**: inicio, productos, contacto, etc.

En una web **tradicional** (MPA = Multi Page Application), cada vista es un archivo HTML distinto. Click en un link → el navegador pide el HTML al servidor → recarga la página completa → pierde el estado de React.

En una **SPA** (Single Page Application):
1. El navegador carga **un solo HTML**
2. React Router **intercepta** los clicks en los links
3. Cambia la URL (sin recargar)
4. Renderiza el componente que corresponde
5. **Todo en el cliente, sin recarga, instantáneo**

```text
MPA:  Click → Request HTTP → Response HTML → Render completo
SPA:  Click → Interceptar → Cambiar URL → Render componente
```

### Instalación

```bash
npm install react-router-dom
```

Luego, importás lo que necesites:

```js
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
```

### BrowserRouter

Es el **componente raíz** que habilita el enrutamiento. Todo lo que esté adentro de él puede usar rutas.

```jsx
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

### Routes y Route

`Routes` evalúa la URL actual contra sus hijos `Route`. Cuando encuentra una coincidencia, renderiza el `element` de ese `Route`.

```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="/productos" element={<Products />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

**Tipos de rutas:**

| Ruta | Coincide con |
|------|-------------|
| `path="/"` | Solo `/` (index) |
| `path="about"` | `/about` |
| `path="productos/:id"` | `/productos/1`, `/productos/abc`, etc. |
| `path="*"` | **Cualquier cosa** (catch-all, para 404) |

### Link (vs `<a>` de HTML)

**NUNCA uses `<a href="...">` en una SPA.** Rompe la navegación client-side y recarga la página.

Usá `<Link to="...">` en su lugar:

```jsx
// ❌ Recarga la página — pierde el estado de React
<a href="/productos">Productos</a>

// ✅ Navegación instantánea — sin recarga
<Link to="/productos">Productos</Link>
```

`Link` funciona igual que `<a>` visualmente, pero intercepta el click y navega sin recargar.

### Rutas dinámicas con `:param`

Usá `:` en la ruta para capturar valores variables:

```jsx
<Route path="productos/:id" element={<ProductDetail />} />
```

Después, en el componente, usá `useParams()` para leer el valor:

```jsx
import { useParams } from 'react-router-dom';

function ProductDetail() {
  const { id } = useParams();
  // id = "1" si la URL es /productos/1
  // id = "abc" si la URL es /productos/abc
}
```

### useNavigate (navegación programática)

A veces necesitás navegar **sin que el usuario haga click en un link** (después de un envío de formulario, un timeout, etc.):

```jsx
import { useNavigate } from 'react-router-dom';

function ContactForm() {
  const navigate = useNavigate();

  const handleSubmit = () => {
    // ... enviar datos ...
    navigate('/'); // redirige al inicio
    navigate(-1);  // retrocede (historial)
    navigate('/productos', { replace: true }); // sin agregar al historial
  };
}
```

### Layout con `<Outlet />`

Podés tener un **Layout** común (nav, footer) que envuelva todas las páginas:

```jsx
function Layout() {
  return (
    <div>
      <nav>{/* links */}</nav>
      <Outlet /> {/* ← acá se renderiza la página activa */}
      <footer>{/* pie */}</footer>
    </div>
  );
}

<Route element={<Layout />}>
  <Route index element={<Home />} />
  <Route path="about" element={<About />} />
  <Route path="*" element={<NotFound />} />
</Route>
```

`<Outlet />` es como un "placeholder" donde React Router pone el componente de la ruta activa.

### Ruta index

La ruta `index` es la que coincide con la ruta **exacta** del padre:

```jsx
<Route element={<Layout />}>
  {/* "/" → Home */}
  <Route index element={<Home />} />
  <Route path="about" element={<About />} />
</Route>
```

Sin `index`, la ruta `/` no mostraría nada adentro del Layout.

### Catch-all (404)

```jsx
<Route path="*" element={<NotFound />} />
```

`path="*"` coincide con **cualquier ruta que no coincidió antes**. Siempre va al FINAL de las rutas.

---

## 🛠️ Paso a Paso — Creá tu propio proyecto

### 1. Creá el proyecto e instalá React Router

```bash
cd react_desde_0
npm create vite@latest 14-react-router -- --template react
cd 14-react-router
npm install
npm install react-router-dom
rm -rf src/App.jsx src/App.css src/index.css src/assets public
mkdir src/pages
```

### 2. Creá los componentes de página

**`src/pages/Home.jsx`:**

```jsx
export default function Home() {
  return (
    <div>
      <h1>🏠 Inicio</h1>
      <p>Bienvenido a la app de ejemplo de React Router.</p>
    </div>
  );
}
```

**`src/pages/About.jsx`:**

```jsx
export default function About() {
  return (
    <div>
      <h1>📖 Acerca de</h1>
      <p>14 proyectos, cada uno explicando un concepto de React.</p>
    </div>
  );
}
```

**`src/pages/Products.jsx`:**

```jsx
import { Link } from 'react-router-dom';

const productos = [
  { id: 1, nombre: 'Mate imperial', precio: 3500 },
  { id: 2, nombre: 'Termo Stanley', precio: 12000 },
  { id: 3, nombre: 'Bombilla', precio: 2500 },
  { id: 4, nombre: 'Yerba 1kg', precio: 1800 },
  { id: 5, nombre: 'Mochila matera', precio: 6500 },
];

export default function Products() {
  return (
    <div>
      <h1>🛍️ Productos</h1>
      {productos.map(p => (
        <Link key={p.id} to={`/productos/${p.id}`}
          style={{ display: 'block', padding: 12, border: '1px solid #ddd',
            borderRadius: 8, textDecoration: 'none', color: '#333', margin: 8 }}>
          <strong>{p.nombre}</strong> — ${p.precio}
        </Link>
      ))}
    </div>
  );
}
```

**`src/pages/ProductDetail.jsx`:**

```jsx
import { useParams, Link } from 'react-router-dom';

const productos = [
  { id: 1, nombre: 'Mate imperial', precio: 3500, desc: 'Mate de aluminio.' },
  { id: 2, nombre: 'Termo Stanley', precio: 12000, desc: 'Acero inoxidable.' },
  { id: 3, nombre: 'Bombilla', precio: 2500, desc: 'Acero inoxidable con filtro.' },
  { id: 4, nombre: 'Yerba 1kg', precio: 1800, desc: 'Orgánica, sin palo.' },
  { id: 5, nombre: 'Mochila matera', precio: 6500, desc: 'Térmica.' },
];

export default function ProductDetail() {
  const { id } = useParams();
  const p = productos.find(p => p.id === Number(id));

  if (!p) return <div><h1>❌ No encontrado</h1><Link to="/productos">← Volver</Link></div>;

  return (
    <div>
      <Link to="/productos">← Volver</Link>
      <h1>{p.nombre}</h1>
      <p style={{ fontSize: '1.5em', color: '#007bff' }}>${p.precio}</p>
      <p>{p.desc}</p>
    </div>
  );
}
```

**`src/pages/Contact.jsx`:**

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Contact() {
  const [nombre, setNombre] = useState('');
  const [enviado, setEnviado] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    setEnviado(true);
    setTimeout(() => navigate('/'), 2000);
  };

  if (enviado) return <div><h1>✅ Enviado</h1><p>Redirigiendo...</p></div>;

  return (
    <div>
      <h1>📬 Contacto</h1>
      <form onSubmit={handleSubmit}>
        <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre" />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
```

**`src/pages/NotFound.jsx`:**

```jsx
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', marginTop: 60 }}>
      <h1 style={{ fontSize: '4em' }}>404</h1>
      <p>Esta página no existe.</p>
      <Link to="/">← Volver al inicio</Link>
    </div>
  );
}
```

### 3. Escribí `src/main.jsx`

```jsx
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, Outlet, useLocation } from 'react-router-dom';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Products from './pages/Products.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';

function Layout() {
  const { pathname } = useLocation();

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 800, margin: '0 auto' }}>
      <nav style={{ display: 'flex', gap: 16, padding: '12px 0', borderBottom: '2px solid #eee' }}>
        <Link to="/">🏠 Inicio</Link>
        <Link to="/about">📖 Acerca de</Link>
        <Link to="/productos">🛍️ Productos</Link>
        <Link to="/contacto">📬 Contacto</Link>
      </nav>

      <Outlet />

      <footer style={{ marginTop: 40, padding: '20px 0', borderTop: '1px solid #eee', textAlign: 'center', color: '#888' }}>
        <p>URL actual: <code>{pathname}</code></p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="productos" element={<Products />} />
          <Route path="contacto" element={<Contact />} />
          <Route path="productos/:id" element={<ProductDetail />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

### 4. Iniciá el servidor

```bash
npm run dev
```

Abrí `http://localhost:5173`. Vas a ver:

- **Inicio:** la página principal
- **Acerca de:** resumen del curso completo
- **Productos:** lista con links a cada producto — cada uno tiene su propia URL
- **Contacto:** formulario que al enviar redirige al inicio (useNavigate)
- **404:** cualquier URL que no exista (ej: `/cosas`) muestra la página de error

### 5. Experimentá

1. **Navegá entre páginas** — fijate que NO hay recarga. Abrí la consola de Red y verificá que no hay requests.
2. **Andá a `/productos/99`** — el catch en ProductDetail muestra "No encontrado" sin ir al 404
3. **Andá a `/cualquier-cosa`** — el `path="*"` muestra el 404
4. **Agregá una ruta nueva** (ej: `/faq`) con su componente
5. **Cambiá `Link` por `<a>`** en el navbar — navegá y fijate que recarga la página (pérdida de estado)

---

## 📄 Estructura del proyecto

```
14-react-router/
├── src/
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Products.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Contact.jsx
│   │   └── NotFound.jsx
│   └── main.jsx
├── index.html
└── package.json
```

---

## 🎯 Proyecto para hacer solo

Creá un proyecto NUEVO llamado `14-react-router-practica`.

### Consigna

Construí un **blog personal** con React Router.

**Requisitos técnicos:**

1. Usá `npm create vite@latest` para crear el proyecto + `npm install react-router-dom`
2. Creá al menos estas rutas:

| Ruta | Componente |
|------|-----------|
| `/` | Inicio — lista de los últimos posts |
| `/blog` | Blog — lista completa de posts |
| `/blog/:slug` | Post — detalle del post usando useParams |
| `/acerca` | Acerca de — información del autor |
| `/contacto` | Contacto — formulario con useNavigate |
| `*` | 404 — página no encontrada |

3. Los posts deben estar en un array de objetos con: `slug`, `titulo`, `fecha`, `resumen`, `contenido`, `tags`
4. En la lista del blog, cada post es un `<Link to={'/blog/' + post.slug}>`
5. En el detalle del post, usá `useParams()` para leer el slug y buscar el post correspondiente
6. Si el slug no existe, mostrá "Post no encontrado" con link para volver

**Extras (si querés ir más allá):**
- Agregá un filtro de posts por tag (ej: `/blog?tag=react`)
- Usá `useSearchParams` para leer el query string
- Agregá un layout anidado: `/admin` con subrutas (admin/posts, admin/crear, etc.)
- Animá la transición entre páginas con CSS

---

## 🧠 Resumen

| Concepto | Explicación breve |
|----------|-------------------|
| **SPA** | Single Page Application. Un solo HTML, múltiples vistas sin recargar. |
| **`BrowserRouter`** | Componente raíz que habilita el enrutamiento. |
| **`Routes` / `Route`** | Evalúan la URL contra las rutas definidas y renderizan el componente correspondiente. |
| **`Link`** | Navegación sin recarga. Nunca uses `<a>` en una SPA. |
| **`useParams`** | Lee parámetros de la URL (ej: `:id`, `:slug`). |
| **`useNavigate`** | Navegación programática (después de submit, timeout, etc.). |
| **`<Outlet />`** | Placeholder donde se renderiza la ruta activa dentro de un Layout. |
| **`path="*"`** | Catch-all: cualquier ruta no definida (404). |
| **`index`** | Ruta por defecto del padre (`/`). |

---

## 🏁 Fin del curso

Llegaste al final. **14 proyectos, 14 conceptos.**

Lo que aprendiste:
- JSX, componentes, props, estado
- Eventos, formularios, listas
- useEffect, useRef, Context, custom hooks
- React Router

Ya tenés las bases para construir aplicaciones React reales. El resto es práctica. Ponete las pilas y codeá. 💪
