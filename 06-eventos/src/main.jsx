/* ============================================================
   React desde 0 — Proyecto 06: Eventos
   Concepto: onClick, onChange, onSubmit, evento sintético
   ============================================================
   Los eventos en React son como los eventos en HTML... pero
   con diferencias IMPORTANTES. Acá vemos todas las variantes.
   ============================================================ */

import { createRoot } from 'react-dom/client';
import { useState } from 'react';

// =============================================================
// Eventos en React vs HTML
// =============================================================
// En HTML:
//   <button onclick="alert('Hola')">
//
// En React:
//   <button onClick={() => alert('Hola')}>
//
// Diferencias clave:
//   1. CamelCase: onClick, onChange, onKeyDown (no onclick)
//   2. Valor: pasás una FUNCIÓN, no un string
//   3. Evento sintético: React envuelve el evento nativo en
//      un objeto "SyntheticEvent" con la misma API
// =============================================================

// -------------------------------------------------------------
// Componente 1: ClickBasico — onClick de distintas formas
// -------------------------------------------------------------
function ClickBasico() {
  // Forma 1: función definida afuera
  const manejarClick = () => {
    alert('¡Click con función nombrada!');
  };

  return (
    <div>
      <h2>onClick — distintas formas</h2>

      {/* Forma 1: función definida aparte (la más limpia) */}
      <button onClick={manejarClick}>
        Click con función nombrada
      </button>

      {/* Forma 2: función inline (para cosas chicas) */}
      <button onClick={() => alert('Click inline!')}>
        Click con función inline
      </button>

      {/* ❌ Forma INCORRECTA: llamar la función en el onClick.
           Esto EJECUTA la función AL RENDERIZAR, no al clickear.
           Solo usalo si necesitás pasar argumentos (lo vemos
           en el próximo componente). */}
      {/* <button onClick={alert('Esto se ejecuta YA')}>MAL</button> */}
    </div>
  );
}

// -------------------------------------------------------------
// Componente 2: ClickConArgumentos — pasar datos al handler
// -------------------------------------------------------------
function ClickConArgumentos() {
  const [mensaje, setMensaje] = useState('');

  // Esta función RECIBE un parámetro (el texto del botón).
  // No podemos pasarle el argumento directamente en el onClick
  // porque se ejecutaría al renderizar.
  //
  // SOLUCIÓN: envolvemos la llamada en una arrow function:
  //   onClick={() => mostrarMensaje('Hola')}
  //
  // Así la funcion se CREA en el render pero se EJECUTA
  // solo cuando el usuario hace click.
  const mostrarMensaje = (texto) => {
    setMensaje(texto);
  };

  return (
    <div>
      <h2>onClick con argumentos</h2>

      <button onClick={() => mostrarMensaje('Elegiste React')}>
        React
      </button>
      <button onClick={() => mostrarMensaje('Elegiste Vue')}>
        Vue
      </button>
      <button onClick={() => mostrarMensaje('Elegiste Angular')}>
        Angular
      </button>

      {mensaje && <p>🟢 {mensaje}</p>}
    </div>
  );
}

// -------------------------------------------------------------
// Componente 3: ElEvento — el parámetro `e` (evento sintético)
// -------------------------------------------------------------
// Cada event handler recibe UN parámetro: el evento sintético
// de React. Es parecido al evento nativo del navegador, pero
// con algunas diferencias.
//
// El evento `e` tiene propiedades útiles:
//   e.target       → el elemento HTML que disparó el evento
//   e.target.value → el valor del input (para onChange)
//   e.type         → el tipo de evento ('click', 'change', etc.)
//   e.key          → la tecla presionada (para onKeyDown)
//   e.preventDefault() → evita comportamiento default
function ElEvento() {
  const [ultimoEvento, setUltimoEvento] = useState('');

  const capturarEvento = (e) => {
    // e NO es el evento nativo del navegador. Es un objeto
    // "SyntheticEvent" que React crea para normalizar el
    // comportamiento entre navegadores.
    //
    // Pero tiene la misma interfaz: e.target, e.type, etc.
    setUltimoEvento(
      `Tipo: ${e.type} | Etiqueta: ${e.target.tagName} | ` +
      `Texto: "${e.target.textContent?.trim() || e.target.value}"`
    );
  };

  return (
    <div>
      <h2>El evento sintético (e)</h2>

      {/* Todos estos botones usan la MISMA función */}
      <button onClick={capturarEvento}>Botón 1</button>
      <button onClick={capturarEvento}>Botón 2</button>
      <button onClick={capturarEvento}>Botón 3</button>
      <br />
      {/* Los inputs también disparan eventos */}
      <input
        type="text"
        placeholder="Escribí algo..."
        onChange={capturarEvento}
      />

      {ultimoEvento && <p>📋 {ultimoEvento}</p>}
    </div>
  );
}

// -------------------------------------------------------------
// Componente 4: Formulario — onSubmit con preventDefault
// -------------------------------------------------------------
// En HTML, un formulario al hacer submit recarga la página.
// En React, evitamos eso con e.preventDefault() y manejamos
// todo con JavaScript.
function Formulario() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);

  const manejarSubmit = (e) => {
    // e.preventDefault() es CLAVE. Sin esto, el formulario
    // recarga la página y perdemos todo el estado de React.
    e.preventDefault();

    // En este punto, podríamos enviar los datos a un servidor.
    // Por ahora solo mostramos un mensaje de éxito.
    setEnviado(true);
  };

  // Si ya se envió, mostramos otra cosa (renderizado condicional)
  if (enviado) {
    return (
      <div>
        <h2>Formulario enviado ✅</h2>
        <p>Nombre: {nombre}</p>
        <p>Email: {email}</p>
        <button onClick={() => {
          setEnviado(false);
          setNombre('');
          setEmail('');
        }}>
          Volver a empezar
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2>Formulario con onSubmit</h2>

      {/* El onSubmit va en el <form>, no en el botón.
           Así el Enter también dispara el submit. */}
      <form onSubmit={manejarSubmit}>
        <div>
          <label>
            Nombre:{' '}
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Email:{' '}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit">Enviar</button>
      </form>

      <p>Escribí algo y apretá Enter o click en "Enviar"</p>
    </div>
  );
}

// -------------------------------------------------------------
// Componente 5: Teclas — onKeyDown, onKeyUp
// -------------------------------------------------------------
// Los eventos de teclado permiten reaccionar a teclas
// específicas. e.key contiene la tecla presionada.
function Teclas() {
  const [teclas, setTeclas] = useState([]);
  const [ultimaTecla, setUltimaTecla] = useState('');

  const manejarKeyDown = (e) => {
    // e.key tiene el nombre de la tecla: 'Enter', 'Escape',
    // 'a', 'Shift', etc.
    setUltimaTecla(`Presionaste: "${e.key}" (código: ${e.code})`);

    if (e.key === 'Enter') {
      setTeclas([...teclas, '↵ Enter']);
    } else if (e.key === 'Escape') {
      setTeclas([...teclas, '⎋ Escape']);
    } else if (e.key === ' ') {
      setTeclas([...teclas, '␣ Espacio']);
    }

    // e.key vs e.code:
    //   e.key  → el carácter que produce ('a', 'A', '1')
    //   e.code → la posición física de la tecla ('KeyA', 'Digit1')
  };

  return (
    <div>
      <h2>Eventos de teclado</h2>

      <input
        type="text"
        placeholder="Apretá teclas acá..."
        onKeyDown={manejarKeyDown}
      />

      <p>{ultimaTecla || '⏳ Esperando tecla...'}</p>

      <h3>Teclas registradas:</h3>
      {teclas.length === 0 ? (
        <p>Ninguna todavía (probá Enter, Escape, Espacio)</p>
      ) : (
        <ul>
          {teclas.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// Componente 6: MouseEvents — onMouseEnter, onMouseLeave
// -------------------------------------------------------------
// Los eventos de mouse permiten detectar cuándo el cursor
// entra o sale de un elemento.
function MouseEvents() {
  const [adentro, setAdentro] = useState(false);
  const [posicion, setPosicion] = useState({ x: 0, y: 0 });

  return (
    <div>
      <h2>Eventos de mouse</h2>

      <div
        onMouseEnter={() => setAdentro(true)}
        onMouseLeave={() => setAdentro(false)}
        onMouseMove={(e) => setPosicion({ x: e.clientX, y: e.clientY })}
        style={{
          width: '300px',
          height: '200px',
          border: '2px solid #333',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: adentro ? '#d4edda' : '#f8d7da',
          transition: 'background-color 0.3s',
        }}
      >
        {adentro
          ? '🟢 El mouse está DENTRO'
          : '🔴 El mouse está FUERA'}
      </div>

      {adentro && (
        <p>
          📍 Posición: X = {posicion.x}, Y = {posicion.y}
        </p>
      )}
      <p>💡 Mové el mouse sobre el cuadro de arriba</p>
    </div>
  );
}

// -------------------------------------------------------------
// Componente 7: Demo — todos los ejemplos
// -------------------------------------------------------------
function Demo() {
  return (
    <>
      <h1>🎯 Eventos en React</h1>
      <p>
        Todos los componentes abajo usan eventos. Prestá atención
        a las diferencias con HTML.
      </p>

      <hr /><ClickBasico />
      <hr /><ClickConArgumentos />
      <hr /><ElEvento />
      <hr /><Formulario />
      <hr /><Teclas />
      <hr /><MouseEvents />
    </>
  );
}

// =============================================================
const root = createRoot(document.getElementById('root'));
root.render(<Demo />);
