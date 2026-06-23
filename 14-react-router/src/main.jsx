/* ============================================================
   React desde 0 — Proyecto 14: React Router
   Concepto: SPA, navegación, rutas dinámicas
   ============================================================
   Hasta ahora: UNA página, UN componente.
   React Router: MÚLTIPLES "páginas" sin recargar el navegador.

   El navegador carga UNA SOLA VEZ el HTML. Después, React
   Router intercepta los clicks en los links, cambia la URL
   y renderiza el componente que corresponde. Todo sin recargar.
   ============================================================ */

import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';

// Importamos las páginas
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Products from './pages/Products.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';

// =============================================================
// Layout: componente que envuelve todas las páginas
// =============================================================
// El Layout contiene el nav y el footer. Las páginas se
// renderizan DENTRO, donde está <Outlet />.
//
// En React Router v6+, usamos <Outlet /> para indicar dónde
// se renderiza el contenido de la ruta activa.

import { Outlet } from 'react-router-dom';

function Layout() {
  const { pathname } = useLocation();

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 800, margin: '0 auto' }}>
      {/* ── NAVBAR ── */}
      <nav style={{
        display: 'flex',
        gap: 16,
        padding: '12px 0',
        borderBottom: '2px solid #eee',
        marginBottom: 20,
      }}>
        <Link to="/" style={linkStyle(pathname, '/')}>🏠 Inicio</Link>
        <Link to="/about" style={linkStyle(pathname, '/about')}>📖 Acerca de</Link>
        <Link to="/productos" style={linkStyle(pathname, '/productos')}>🛍️ Productos</Link>
        <Link to="/contacto" style={linkStyle(pathname, '/contacto')}>📬 Contacto</Link>
      </nav>

      {/* ── CONTENIDO DE LA RUTA ACTIVA ── */}
      {/* <Outlet /> es REEMPLAZADO por el componente de la ruta activa */}
      <Outlet />

      {/* ── FOOTER ── */}
      <footer style={{
        marginTop: 40,
        padding: '20px 0',
        borderTop: '1px solid #eee',
        textAlign: 'center',
        color: '#888',
        fontSize: '0.85em',
      }}>
        <p>React desde 0 — Proyecto 14: React Router</p>
        <p>URL actual: <code>{pathname}</code></p>
      </footer>
    </div>
  );
}

// Helper para estilos de link activo
function linkStyle(pathname, ruta) {
  const activo = pathname === ruta || (ruta !== '/' && pathname.startsWith(ruta));
  return {
    textDecoration: 'none',
    padding: '4px 8px',
    borderRadius: 4,
    fontWeight: activo ? 'bold' : 'normal',
    color: activo ? '#007bff' : '#333',
    borderBottom: activo ? '2px solid #007bff' : '2px solid transparent',
  };
}

// =============================================================
// App: las rutas de la aplicación
// =============================================================
// La estructura es:
//
// <BrowserRouter>        → activa el enrutamiento del lado del cliente
//   <Routes>             → evalúa la URL contra las rutas
//     <Route element={Layout}>  → el Layout envuelve todo
//       <Route index element={Home} />      → "/"
//       <Route path="about" element={About} />  → "/about"
//       ...
//       <Route path="*" element={NotFound} />  → cualquier otra cosa (404)
//     </Route>
//   </Routes>
// </BrowserRouter>
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* index → ruta raíz "/" */}
          <Route index element={<Home />} />

          {/* Rutas estáticas */}
          <Route path="about" element={<About />} />
          <Route path="productos" element={<Products />} />
          <Route path="contacto" element={<Contact />} />

          {/* Ruta DINÁMICA: ":id" captura cualquier valor */}
          <Route path="productos/:id" element={<ProductDetail />} />

          {/* Catch-all: cualquier ruta no definida arriba → 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

// =============================================================
const root = createRoot(document.getElementById('root'));
root.render(<App />);
