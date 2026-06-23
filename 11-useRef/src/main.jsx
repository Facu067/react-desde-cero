/* ============================================================
   React desde 0 — Proyecto 11: useRef
   Concepto: referencias al DOM, valores persistentes sin re-render
   ============================================================
   useState es para valores que, al cambiar, RE-RENDERIZAN.
   useRef es para valores que PERSISTEN entre renders pero
   NO causan re-render cuando cambian.

   Usos principales:
   1. Acceder al DOM (focus, medidas, video, scroll)
   2. Guardar valores sin causar re-render (timers, contadores)
   ============================================================ */

import { createRoot } from 'react-dom/client';
import { useState, useEffect, useRef } from 'react';

// =============================================================
// useRef vs useState
// =============================================================
//
// useState:
//   const [valor, setValor] = useState(0);
//   - Cambiar valor → RE-RENDERIZA
//   - Sirve para cosas que se VEN en pantalla
//
// useRef:
//   const ref = useRef(0);
//   - ref.current = nuevoValor → NO re-renderiza
//   - ref.current persiste entre renders
//   - Sirve para "cajas" que necesitás guardar sin que afecten
//     a lo que se muestra (timers, instancias de objetos)
//
// También: ref={ref} → accedés al DOM real
//   <input ref={inputRef} />
//   → inputRef.current es el elemento HTML del input
// =============================================================

// -------------------------------------------------------------
// Componente 1: AutoFocusInput — useRef para DOM
// -------------------------------------------------------------
// El caso más común de useRef: acceder a un elemento del DOM
// para enfocarlo, seleccionar texto, etc.
function AutoFocusInput() {
  // useRef(null) crea un objeto { current: null }
  // Cuando lo pasás como ref a un elemento, React pone el
  // nodo del DOM en current automáticamente.
  const inputRef = useRef(null);

  // Al montar, enfocamos el input automáticamente
  useEffect(() => {
    // inputRef.current es el <input> real del DOM
    inputRef.current.focus();
  }, []);
  // Solo al montar — es el CASO DE USO MÁS COMÚN: auto-focus

  const manejarClick = () => {
    // También podemos enfocar cuando el usuario hace click
    inputRef.current.focus();
    inputRef.current.select(); // selecciona el texto existente
  };

  return (
    <div>
      <h2>🔦 Auto-focus con useRef</h2>
      <input
        ref={inputRef}   // ← así conectamos la ref al elemento
        type="text"
        placeholder="Este input se enfoca solo al montar"
        style={{ width: '100%', boxSizing: 'border-box' }}
      />
      <button onClick={manejarClick}>📌 Enfocar y seleccionar</button>
      <p>💡 La ref NO causa re-render. Solo accede al DOM.</p>
    </div>
  );
}

// -------------------------------------------------------------
// Componente 2: ContadorRenders — useRef para contar renders
// -------------------------------------------------------------
// Acá usamos useRef para guardar un VALOR que NO queremos que
// cause re-render: la cantidad de veces que se renderizó.
function ContadorRenders() {
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');

  // useRef para contar renders: incrementamos en cada render
  // pero NO causamos un re-render extra.
  const rendersRef = useRef(0);
  rendersRef.current += 1;

  // Con useState esto NO funcionaría:
  //   const [renders, setRenders] = useState(0);
  //   renders + 1;  // ❌ No cambia entre renders
  //   setRenders(r + 1);  // ❌ Causa re-render → loop infinito

  // También guardamos el valor ANTERIOR de nombre
  // (útil para comparar "antes vs después")
  const nombreAnteriorRef = useRef('');

  useEffect(() => {
    // Actualizamos después de cada render
    nombreAnteriorRef.current = nombre;
  });

  return (
    <div>
      <h2>🔢 Contar renders (sin causar re-render)</h2>

      <input value={nombre} onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre" />
      <input value={edad} onChange={(e) => setEdad(e.target.value)}
        placeholder="Edad" type="number" />

      <p>🔄 Render #{rendersRef.current}</p>
      <p>📝 Nombre actual: <strong>{nombre || '(vacío)'}</strong></p>
      <p>📝 Nombre anterior: <strong>{nombreAnteriorRef.current || '(vacío)'}</strong></p>
      <p>💡 rendersRef.current se incrementa en CADA render,
        pero NO causa renders nuevos.</p>
    </div>
  );
}

// -------------------------------------------------------------
// Componente 3: TimerRef — useRef para timers sin closures viejos
// -------------------------------------------------------------
// Un problema común con useEffect + setInterval: el closure
// captura el valor viejo. Con useRef guardamos el intervalo
// y lo manejamos sin depender de closures.
//
// Además, useRef nos permite pausar/reanudar desde CUALQUIER
// lado sin tener que re-crear el intervalo.
function TimerRef() {
  const [segundos, setSegundos] = useState(0);
  const [corriendo, setCorriendo] = useState(false);

  // Guardamos el ID del intervalo en una ref
  // Así podemos acceder a él desde cualquier función
  // sin closures viejos
  const intervaloRef = useRef(null);

  const iniciar = () => {
    if (intervaloRef.current) return; // ya está corriendo
    setCorriendo(true);

    intervaloRef.current = setInterval(() => {
      setSegundos((s) => s + 1);
    }, 1000);
  };

  const pausar = () => {
    if (!intervaloRef.current) return;
    clearInterval(intervaloRef.current);
    intervaloRef.current = null;
    setCorriendo(false);
  };

  const resetear = () => {
    pausar();
    setSegundos(0);
  };

  // Cleanup: si el componente se desmonta, limpiamos el intervalo
  useEffect(() => {
    return () => {
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
      }
    };
  }, []);
  // Gracias a useRef, el cleanup NO necesita que el intervalo
  // esté en el estado ni en ninguna dependencia.

  const m = Math.floor(segundos / 60);
  const s = segundos % 60;

  return (
    <div>
      <h2>⏱️ Timer con useRef (sin closures viejos)</h2>
      <p style={{ fontSize: '2em', fontFamily: 'monospace' }}>
        {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
      </p>
      {!corriendo ? (
        <button onClick={iniciar}>▶️ Iniciar</button>
      ) : (
        <button onClick={pausar}>⏸️ Pausar</button>
      )}
      <button onClick={resetear}>⏹️ Reset</button>
      <p>💡 El intervalo se guarda en una ref, no en el estado.
        Así no hay closures viejos ni efectos que se re-ejecuten.</p>
    </div>
  );
}

// -------------------------------------------------------------
// Componente 4: MedirElemento — useRef para medidas del DOM
// -------------------------------------------------------------
// Podemos medir el tamaño y posición de cualquier elemento
// usando ref + getBoundingClientRect()
function MedirElemento() {
  const divRef = useRef(null);
  const [medidas, setMedidas] = useState(null);

  const medir = () => {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      setMedidas({
        ancho: Math.round(rect.width),
        alto: Math.round(rect.height),
        x: Math.round(rect.left),
        y: Math.round(rect.top),
      });
    }
  };

  // También medimos al montar (por si el tamaño inicial importa)
  useEffect(() => {
    medir();
  }, []);

  // Medimos también cuando la ventana cambia de tamaño
  useEffect(() => {
    window.addEventListener('resize', medir);
    return () => window.removeEventListener('resize', medir);
  }, []);

  return (
    <div>
      <h2>📐 Medir elementos del DOM</h2>

      <div
        ref={divRef}
        style={{
          width: '60%',
          padding: 20,
          border: '2px dashed #007bff',
          borderRadius: 8,
          textAlign: 'center',
          backgroundColor: '#f0f8ff',
        }}
      >
        <p>📦 Este es el elemento que medimos</p>
        <p>🔄 Redimensioná la ventana y apretá "Medir"</p>
      </div>

      <button onClick={medir}>📏 Medir</button>

      {medidas && (
        <div>
          <p>📐 Ancho: {medidas.ancho}px</p>
          <p>📐 Alto: {medidas.alto}px</p>
          <p>📍 Posición X: {medidas.x}px, Y: {medidas.y}px</p>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// Componente 5: FormularioRefs — múltiples refs + Enter para navegar
// -------------------------------------------------------------
// Un patrón común en formularios: apretar Enter y que el foco
// pase al siguiente campo. Con useRef tenemos control total.
function FormularioRefs() {
  const nombreRef = useRef(null);
  const emailRef = useRef(null);
  const edadRef = useRef(null);
  const [enviado, setEnviado] = useState(false);

  // Auto-focus al primer campo al montar
  useEffect(() => {
    nombreRef.current.focus();
  }, []);

  const manejarKeyDown = (e, siguienteRef) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      siguienteRef.current.focus();
    }
  };

  const manejarSubmit = (e) => {
    e.preventDefault();
    setEnviado(true);
  };

  if (enviado) {
    return (
      <div>
        <h2>📋 Formulario con navegación por Enter</h2>
        <p>✅ Formulario enviado</p>
        <button onClick={() => setEnviado(false)}>Volver</button>
      </div>
    );
  }

  return (
    <div>
      <h2>📋 Navegación por Enter con refs</h2>
      <p>Apretá Enter en cada campo para ir al siguiente</p>

      <form onSubmit={manejarSubmit}>
        <div>
          <label>Nombre:</label>
          <input ref={nombreRef} type="text" placeholder="Nombre"
            onKeyDown={(e) => manejarKeyDown(e, emailRef)} />
        </div>
        <div>
          <label>Email:</label>
          <input ref={emailRef} type="email" placeholder="Email"
            onKeyDown={(e) => manejarKeyDown(e, edadRef)} />
        </div>
        <div>
          <label>Edad:</label>
          <input ref={edadRef} type="number" placeholder="Edad"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                document.querySelector('button[type="submit"]').focus();
              }
            }} />
        </div>
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

// -------------------------------------------------------------
// Componente 6: Demo — todos los ejemplos
// -------------------------------------------------------------
function Demo() {
  return (
    <>
      <h1>🎯 useRef — Referencias</h1>

      <hr /><AutoFocusInput />
      <hr /><ContadorRenders />
      <hr /><TimerRef />
      <hr /><MedirElemento />
      <hr /><FormularioRefs />
    </>
  );
}

// =============================================================
const root = createRoot(document.getElementById('root'));
root.render(<Demo />);
