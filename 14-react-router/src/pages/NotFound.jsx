/* ============================================================
   Página: 404 — No encontrada
   Se muestra cuando ninguna ruta coincide.
   ============================================================ */

import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', marginTop: 60 }}>
      <h1 style={{ fontSize: '4em', margin: 0 }}>404</h1>
      <p style={{ fontSize: '1.2em' }}>Esta página no existe.</p>
      <Link to="/">← Volver al inicio</Link>
    </div>
  );
}
