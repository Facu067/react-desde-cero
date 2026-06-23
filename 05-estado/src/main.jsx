/* ============================================================
   React desde 0 — Proyecto 05: Estado (useState)
   Concepto: useState, inmutabilidad, re-render
   ============================================================
   Hasta ahora todo era ESTÁTICO. Las props llegan de afuera
   y no cambian. Pero una interfaz de usuario necesita
   CAMBIAR: un contador que sube, un input que se escribe,
   un modal que se abre y se cierra.

   useState es la herramienta para eso.
   ============================================================ */

import { createRoot } from 'react-dom/client';

// -------------------------------------------------------------
// IMPORTANTE: useState se importa de React
// -------------------------------------------------------------
// Notá que lo importamos con { } porque es un "named export".
// No importamos todo React, solo lo que necesitamos.
import { useState } from 'react';

// =============================================================
// ¿Qué es el estado?
// =============================================================
// Estado = datos que CAMBIAN con el tiempo y, cuando cambian,
//           React RE-RENDERIZA el componente automáticamente.
//
// Sin estado: el componente se renderiza UNA VEZ y chau.
// Con estado: el componente "vive", "respira", reacciona.
//
// useState es una función que recibe el VALOR INICIAL y
// devuelve un ARRAY con dos elementos:
//
//   const [valor, setValor] = useState(valorInicial);
//
//   - valor:     el valor actual del estado (lo que sea)
//   - setValor:  función que actualiza el valor y RE-RENDERIZA
//
// El nombre de las variables puede ser cualquiera. La
// convención es [algo, setAlgo].
// =============================================================

// -------------------------------------------------------------
// Componente 1: Contador — useState con números
// -------------------------------------------------------------
// El ejemplo más simple: un número que sube y baja.
function Contador() {
  // useState(0) → el estado empieza en 0
  // count → vale 0 ahora, pero va a cambiar
  // setCount → función para cambiar count
  const [count, setCount] = useState(0);

  // Estas funciones usan setCount para CAMBIAR el estado.
  // Cuando se ejecutan, React RE-RENDERIZA este componente
  // y count tiene el NUEVO valor.
  const sumar = () => setCount(count + 1);
  const restar = () => setCount(count - 1);
  const resetear = () => setCount(0);

  return (
    <div>
      <h2>Contador: {count}</h2>
      {/* Fijate que {count} se actualiza SOLO cuando
           setCount cambia el valor. No tocamos el DOM
           manualmente, React lo hace por nosotros. */}
      <button onClick={sumar}>+1</button>
      <button onClick={restar}>-1</button>
      <button onClick={resetear}>Reset</button>
    </div>
  );
  // CADA VEZ que se ejecuta setCount, React llama a
  // esta función OTRA VEZ, y el nuevo valor de count
  // se muestra en pantalla. Eso es el re-render.
}

// -------------------------------------------------------------
// Componente 2: Interruptor — useState con booleanos
// -------------------------------------------------------------
// Los booleanos son ideales para prender/apagar cosas.
function Interruptor() {
  // useState(false) → arranca apagado
  const [prendido, setPrendido] = useState(false);

  // Función que alterna el valor actual
  const toggle = () => setPrendido(!prendido);
  // !prendido → si es true, pasa a false; si es false, pasa a true

  return (
    <div>
      <h2>Interruptor</h2>
      {/* Usamos el estado para decidir QUÉ mostrar */}
      <p>El interruptor está: {prendido ? '🟢 PRENDIDO' : '🔴 APAGADO'}</p>
      <button onClick={toggle}>
        {prendido ? 'Apagar' : 'Prender'}
      </button>
      {/* El texto del botón CAMBIA según el estado.
           No hay if/else, usamos un ternario directo. */}
    </div>
  );
}

// -------------------------------------------------------------
// Componente 3: SaludoPersonalizado — useState con strings
// -------------------------------------------------------------
// Acá el estado es un string que se actualiza con CADA
// tecla que el usuario escribe en el input.
function SaludoPersonalizado() {
  const [nombre, setNombre] = useState('');

  // IMPORTANTE: onChange recibe un EVENTO (e). El valor
  // actual del input está en e.target.value.
  //
  // Cada vez que el usuario tipea UNA letra, se ejecuta
  // setNombre con el nuevo valor del input. React
  // re-renderiza y el nombre se actualiza.
  const manejarCambio = (e) => setNombre(e.target.value);

  return (
    <div>
      <h2>Saludo personalizado</h2>
      <input
        type="text"
        placeholder="Escribí tu nombre..."
        value={nombre}        // ← value CONTROLADO por React
        onChange={manejarCambio}  // ← cada tecla actualiza el estado
      />
      {/* El input muestra nombre porque value={nombre}.
           Cuando setNombre cambia nombre, el input se
           actualiza. Esto se llama "componente controlado". */}
      <p>
        {nombre
          ? `¡Hola, ${nombre}!`
          : 'Escribí algo arriba ☝️'}
      </p>
    </div>
  );
}

// -------------------------------------------------------------
// Componente 4: PerfilEditor — useState con objetos
// -------------------------------------------------------------
// El estado también puede ser un objeto. Pero OJO:
// NUNCA modifiques el objeto directamente. Siempre creá
// uno NUEVO.
function PerfilEditor() {
  // Estado inicial como objeto con varias propiedades
  const [perfil, setPerfil] = useState({
    nombre: '',
    edad: '',
    profesion: '',
  });

  // Función genérica para actualizar cualquier campo.
  // Recibe el nombre del campo y el nuevo valor.
  //
  // IMPORTANTE: usamos el OPERADOR SPREAD (...perfil)
  // para copiar TODAS las propiedades existentes, y
  // después sobreescribimos SOLO la que cambió.
  //
  // Sin el spread, perderíamos las otras propiedades.
  const actualizarCampo = (campo, valor) => {
    setPerfil({
      ...perfil,              // copia: { nombre, edad, profesion }
      [campo]: valor,         // sobreescribe SOLO este campo
    });
    // [campo]: valor es una "propiedad computada" de JS.
    // Si campo = "edad", es como hacer { ...perfil, edad: valor }
  };

  return (
    <div>
      <h2>Editor de perfil</h2>

      <input
        type="text"
        placeholder="Nombre"
        value={perfil.nombre}
        onChange={(e) => actualizarCampo('nombre', e.target.value)}
      />
      <input
        type="number"
        placeholder="Edad"
        value={perfil.edad}
        onChange={(e) => actualizarCampo('edad', e.target.value)}
      />
      <input
        type="text"
        placeholder="Profesión"
        value={perfil.profesion}
        onChange={(e) => actualizarCampo('profesion', e.target.value)}
      />

      <div>
        <h3>Vista previa:</h3>
        {perfil.nombre && <p><strong>Nombre:</strong> {perfil.nombre}</p>}
        {perfil.edad && <p><strong>Edad:</strong> {perfil.edad}</p>}
        {perfil.profesion && <p><strong>Profesión:</strong> {perfil.profesion}</p>}
        {!perfil.nombre && !perfil.edad && !perfil.profesion && (
          <p>Completá el formulario de arriba ☝️</p>
        )}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Componente 5: ListaDeTareas — useState con arrays
// -------------------------------------------------------------
// Los arrays también son objetos en JS, así que aplica
// la misma regla: NUNCA mutar, siempre crear uno nuevo.
function ListaDeTareas() {
  const [tareas, setTareas] = useState([
    { id: 1, texto: 'Aprender React', completa: false },
    { id: 2, texto: 'Hacer los ejercicios', completa: false },
  ]);
  const [nuevaTarea, setNuevaTarea] = useState('');

  const agregarTarea = () => {
    if (nuevaTarea.trim() === '') return; // no agregar vacías

    // Para agregar a un array: creamos uno NUEVO con
    // el spread del existente + el nuevo elemento.
    //
    // NUNCA hagas: tareas.push({...}) — eso MUTA el array
    // y React NO detecta el cambio (no hay re-render).
    setTareas([
      ...tareas,
      {
        id: Date.now(), // ID único basado en timestamp
        texto: nuevaTarea,
        completa: false,
      },
    ]);
    setNuevaTarea(''); // limpiamos el input
  };

  const toggleTarea = (id) => {
    // Para modificar un elemento del array: usamos .map()
    // que crea un NUEVO array.
    setTareas(
      tareas.map((t) =>
        t.id === id ? { ...t, completa: !t.completa } : t
      )
    );
  };

  const eliminarTarea = (id) => {
    // Para eliminar: .filter() crea un NUEVO array
    // sin el elemento que queremos sacar.
    setTareas(tareas.filter((t) => t.id !== id));
  };

  return (
    <div>
      <h2>Lista de tareas</h2>

      <div>
        <input
          type="text"
          placeholder="Nueva tarea..."
          value={nuevaTarea}
          onChange={(e) => setNuevaTarea(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') agregarTarea();
          }}
        />
        <button onClick={agregarTarea}>Agregar</button>
      </div>

      <ul>
        {tareas.map((t) => (
          <li key={t.id}>
            <span
              onClick={() => toggleTarea(t.id)}
              style={{
                textDecoration: t.completa ? 'line-through' : 'none',
                cursor: 'pointer',
              }}
            >
              {t.completa ? '✅' : '⬜'} {t.texto}
            </span>
            <button onClick={() => eliminarTarea(t.id)}>❌</button>
          </li>
        ))}
      </ul>

      <p>Total: {tareas.length} | Pendientes: {tareas.filter(t => !t.completa).length}</p>
      {/* Estado derivado: no necesitamos otro useState para
           el total o los pendientes. Lo calculamos a partir
           del estado existente usando .filter() y .length.
           Eso es estado DERIVADO y se calcula en cada render. */}
    </div>
  );
}

// -------------------------------------------------------------
// Componente 6: Demo — todos los ejemplos juntos
// -------------------------------------------------------------
// Cada componente tiene su PROPIO estado. Son independientes.
// El estado del Contador no afecta al Interruptor, ni viceversa.
// Cada uno vive su propia vida.
function Demo() {
  return (
    <>
      <h1>🎯 useState — Estado en React</h1>
      <p>
        Cada componente abajo tiene su PROPIO estado.
        Son independientes entre sí.
      </p>

      <hr />
      <Contador />

      <hr />
      <Interruptor />

      <hr />
      <SaludoPersonalizado />

      <hr />
      <PerfilEditor />

      <hr />
      <ListaDeTareas />
    </>
  );
}

// =============================================================
// Renderizado
// =============================================================
const root = createRoot(document.getElementById('root'));
root.render(<Demo />);
