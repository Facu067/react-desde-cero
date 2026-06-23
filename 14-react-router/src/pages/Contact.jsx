/* ============================================================
   Página: Contacto
   ============================================================ */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Contact() {
  const [nombre, setNombre] = useState('');
  const [enviado, setEnviado] = useState(false);

  // useNavigate permite navegar PROGRAMÁTICAMENTE
  // (sin que el usuario haga click en un Link)
  const navigate = useNavigate();

  const manejarSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    setEnviado(true);

    // Después de 2 segundos, redirigimos al inicio
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  if (enviado) {
    return (
      <div>
        <h1>✅ Mensaje enviado</h1>
        <p>Gracias, {nombre}. Te vamos a redirigir al inicio...</p>
      </div>
    );
  }

  return (
    <div>
      <h1>📬 Contacto</h1>
      <p>Completá el formulario y te redirigimos al inicio después de enviar.</p>

      <form onSubmit={manejarSubmit}>
        <div>
          <label>Nombre:</label>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </div>
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
