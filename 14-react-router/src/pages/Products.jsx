/* ============================================================
   Página: Productos (lista)
   Cada producto tiene un link a su detalle.
   ============================================================ */

import { Link } from 'react-router-dom';

const productos = [
  { id: 1, nombre: 'Mate imperial', precio: 3500 },
  { id: 2, nombre: 'Termo Stanley', precio: 12000 },
  { id: 3, nombre: 'Bombilla pico de loro', precio: 2500 },
  { id: 4, nombre: 'Yerba orgánica 1kg', precio: 1800 },
  { id: 5, nombre: 'Mochila matera', precio: 6500 },
];

export default function Products() {
  return (
    <div>
      <h1>🛍️ Productos</h1>
      <p>Hacé click en un producto para ver su detalle.</p>
      <p>La URL cambia a <code>/productos/1</code>, <code>/productos/2</code>, etc.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {productos.map((p) => (
          <Link
            key={p.id}
            to={`/productos/${p.id}`}
            style={{
              display: 'block',
              padding: 12,
              border: '1px solid #ddd',
              borderRadius: 8,
              textDecoration: 'none',
              color: '#333',
              background: '#f9f9f9',
            }}
          >
            <strong>{p.nombre}</strong> — ${p.precio.toLocaleString()}
            <span style={{ float: 'right' }}>→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
