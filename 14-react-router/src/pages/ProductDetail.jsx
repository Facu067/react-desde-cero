/* ============================================================
   Página: Detalle de producto
   Usa useParams para leer el ID de la URL.
   ============================================================ */

import { useParams, Link } from 'react-router-dom';

const productos = [
  { id: 1, nombre: 'Mate imperial', precio: 3500, desc: 'Mate de aluminio con diseño imperial. Incluye virola y base de acero inoxidable.' },
  { id: 2, nombre: 'Termo Stanley', precio: 12000, desc: 'Termo clásico de acero. Mantiene la temperatura por 24 horas.' },
  { id: 3, nombre: 'Bombilla pico de loro', precio: 2500, desc: 'Bombilla de acero inoxidable con filtro. Ideal para mate amargo.' },
  { id: 4, nombre: 'Yerba orgánica 1kg', precio: 1800, desc: 'Yerba mate orgánica, sin palo. Producción sustentable.' },
  { id: 5, nombre: 'Mochila matera', precio: 6500, desc: 'Mochila térmica con compartimento para termo y espacio para mates.' },
];

export default function ProductDetail() {
  // useParams() devuelve un objeto con los parámetros de la URL
  // La ruta es /productos/:id → { id: "1" }
  const { id } = useParams();
  const producto = productos.find((p) => p.id === Number(id));

  // Si el producto no existe, mostramos un mensaje
  if (!producto) {
    return (
      <div>
        <h1>❌ Producto no encontrado</h1>
        <p>No existe un producto con id "{id}"</p>
        <Link to="/productos">← Volver a productos</Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/productos">← Volver a productos</Link>

      <div style={{
        marginTop: 16,
        padding: 20,
        border: '1px solid #ddd',
        borderRadius: 12,
        background: '#f9f9f9',
      }}>
        <h1>{producto.nombre}</h1>
        <p style={{ fontSize: '1.5em', color: '#007bff' }}>
          ${producto.precio.toLocaleString()}
        </p>
        <p>{producto.desc}</p>
      </div>
    </div>
  );
}
