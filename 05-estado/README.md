# Proyecto 05: Estado (useState)

> **Concepto**: `useState`, inmutabilidad, re-render

---

## 📖 Nota Académica

### El problema que resuelve useState

Hasta ahora todo era **estático**:
- En el proyecto 01 pintábamos un `<h1>` fijo
- En el proyecto 02 metíamos variables, pero no cambiaban
- En el proyecto 03 creábamos componentes, pero siempre mostraban lo mismo
- En el proyecto 04 pasábamos props, pero las props no cambian

Una interfaz de usuario necesita **cambiar**. Un contador que sube, un input que se escribe, un modal que se abre y se cierra. Eso es **estado**.

**Sin estado:** el componente se renderiza UNA VEZ y chau.
**Con estado:** el componente "vive", reacciona, se actualiza solo.

### ¿Qué es useState?

`useState` es una **función** que viene con React. Recibe un **valor inicial** y devuelve un **array con dos elementos**:

```js
const [valor, setValor] = useState(valorInicial);
```

| Pieza | Qué es |
|-------|--------|
| `valor` | El valor ACTUAL del estado (puede ser cualquier tipo JS) |
| `setValor` | Una función que **cambia** el valor y **re-renderiza** el componente |
| `valorInicial` | El valor con el arranca (solo se usa la primera vez) |

El nombre de las variables lo elegís vos. La convención es `[algo, setAlgo]`:

```js
const [count, setCount] = useState(0);
const [nombre, setNombre] = useState('');
const [activo, setActivo] = useState(false);
const [perfil, setPerfil] = useState({ nombre: '', edad: 0 });
const [items, setItems] = useState([]);
```

Cada `useState` crea una **variable independiente**. Podés tener cuantos quieras.

### ¿Cómo funciona el re-render?

Este es el concepto más importante de todo React.

Cuando se ejecuta `setValor(nuevoValor)`:

1. React **guarda** el nuevo valor internamente
2. React **vuelve a llamar** a la función del componente
3. El nuevo valor está disponible en `valor`
4. React **compara** el JSX nuevo con el anterior
5. React **actualiza SOLO lo que cambió** en el DOM real

**No tocás el DOM manualmente.** No hay `document.getElementById`, no hay `innerHTML`. React hace todo el trabajo de sincronización.

```jsx
function Contador() {
  const [count, setCount] = useState(0);

  const sumar = () => setCount(count + 1);
  //           ↑ esto RE-RENDERIZA el componente

  return (
    <div>
      <p>Count: {count}</p>
      {/* count se actualiza SOLO cuando setCount cambia el valor */}
      <button onClick={sumar}>+1</button>
    </div>
  );
}
```

Cada vez que clickeás "+1", React:
1. Ejecuta `setCount(count + 1)` → count pasa de 0 a 1
2. Vuelve a llamar a `Contador()`
3. `count` ahora vale 1
4. El `<p>` se actualiza en la pantalla

**Sin recargar la página, sin tocar el DOM vos.**

### La REGLA DE ORO: inmutabilidad

NUNCA modifiques el estado directamente. Siempre creá un **nuevo valor**.

```jsx
// ❌ MAL — esto NO funciona
const [items, setItems] = useState([1, 2, 3]);
items.push(4);          // mutás el array
setItems(items);        // React no detecta el cambio

// ✅ BIEN — creás un nuevo array
const [items, setItems] = useState([1, 2, 3]);
setItems([...items, 4]); // nuevo array con spread
```

¿Por qué? React detecta cambios comparando el valor anterior con el nuevo. Si mutás el objeto, las dos referencias apuntan al mismo lugar, React no ve diferencia, y **no hay re-render**.

### Estado vs Props

| | Props | Estado |
|---|---|---|
| **Origen** | Vienen del padre | Es interno del componente |
| **¿Quién las cambia?** | El padre (el hijo no puede) | El propio componente con `setValor` |
| **¿Son de solo lectura?** | Sí | No |
| **¿Provoca re-render?** | Sí, si el padre cambia las props | Sí, cuando se ejecuta `setValor` |
| **¿Para qué sirve?** | Configurar un componente | Darle vida a un componente |

### useState con objetos y arrays

Cuando el estado es un objeto o array, recordá **siempre crear uno nuevo**:

**Objetos — spread para mantener lo que no cambia:**
```js
const [perfil, setPerfil] = useState({ nombre: '', edad: 0 });

// Actualizar SOLO el nombre, mantener el resto:
setPerfil({ ...perfil, nombre: 'Martina' });
```

**Arrays — `.map()` para modificar, `.filter()` para eliminar:**
```js
const [items, setItems] = useState([{ id: 1, texto: 'Aprender React' }]);

// Agregar: spread
setItems([...items, { id: 2, texto: 'Nuevo' }]);

// Modificar: .map() crea nuevo array
setItems(items.map(i => i.id === 1 ? { ...i, texto: 'Cambiado' } : i));

// Eliminar: .filter()
setItems(items.filter(i => i.id !== 1));
```

### Estado derivado

No todo necesita un `useState`. Si un valor se puede **calcular** a partir del estado existente, no necesitás otro `useState`:

```js
const [tareas, setTareas] = useState([...]);
const total = tareas.length;                     // ✅ derivado
const pendientes = tareas.filter(t => !t.completa).length; // ✅ derivado
```

Esto se calcula en CADA render, siempre actualizado, sin estado adicional.

---

## 🛠️ Paso a Paso — Creá tu propio proyecto

### 1. Creá el proyecto con Vite

```bash
# Te parás en la carpeta raíz del curso
cd react_desde_0

# Scaffolding con Vite
npm create vite@latest 05-estado -- --template react
```

### 2. Entrá al proyecto e instalá

```bash
cd 05-estado
npm install
```

### 3. Limpiá el boilerplate

Vite genera archivos de ejemplo que no necesitamos:

```bash
rm -rf src/App.jsx src/App.css src/index.css src/assets public
```

### 4. Escribí `src/main.jsx`

Creá `src/main.jsx` con el siguiente contenido. **LEÉ CADA COMENTARIO** — este proyecto tiene conceptos nuevos que cambian todo:

```jsx
import { createRoot } from 'react-dom/client';
import { useState } from 'react';

// =============================================================
// ¿Qué es el estado?
// =============================================================
// Estado = datos que CAMBIAN con el tiempo y, cuando cambian,
// React RE-RENDERIZA el componente automáticamente.
//
// useState es una función que recibe el VALOR INICIAL y
// devuelve un ARRAY con dos elementos:
//
//   const [valor, setValor] = useState(valorInicial);
//
//   - valor:     el valor actual del estado
//   - setValor:  función que actualiza el valor y RE-RENDERIZA
// =============================================================

// -------------------------------------------------------------
// Componente 1: Contador — useState con números
// -------------------------------------------------------------
function Contador() {
  const [count, setCount] = useState(0);

  const sumar = () => setCount(count + 1);
  const restar = () => setCount(count - 1);
  const resetear = () => setCount(0);

  return (
    <div>
      <h2>Contador: {count}</h2>
      <button onClick={sumar}>+1</button>
      <button onClick={restar}>-1</button>
      <button onClick={resetear}>Reset</button>
    </div>
  );
}

// -------------------------------------------------------------
// Componente 2: Interruptor — useState con booleanos
// -------------------------------------------------------------
function Interruptor() {
  const [prendido, setPrendido] = useState(false);

  const toggle = () => setPrendido(!prendido);

  return (
    <div>
      <h2>Interruptor</h2>
      <p>El interruptor está: {prendido ? '🟢 PRENDIDO' : '🔴 APAGADO'}</p>
      <button onClick={toggle}>
        {prendido ? 'Apagar' : 'Prender'}
      </button>
    </div>
  );
}

// -------------------------------------------------------------
// Componente 3: SaludoPersonalizado — useState con strings
// -------------------------------------------------------------
function SaludoPersonalizado() {
  const [nombre, setNombre] = useState('');

  const manejarCambio = (e) => setNombre(e.target.value);

  return (
    <div>
      <h2>Saludo personalizado</h2>
      <input
        type="text"
        placeholder="Escribí tu nombre..."
        value={nombre}
        onChange={manejarCambio}
      />
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
function PerfilEditor() {
  const [perfil, setPerfil] = useState({
    nombre: '',
    edad: '',
    profesion: '',
  });

  const actualizarCampo = (campo, valor) => {
    setPerfil({
      ...perfil,           // copia TODO lo que ya tenía
      [campo]: valor,      // sobreescribe SOLO este campo
    });
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
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Componente 5: ListaDeTareas — useState con arrays
// -------------------------------------------------------------
function ListaDeTareas() {
  const [tareas, setTareas] = useState([
    { id: 1, texto: 'Aprender React', completa: false },
    { id: 2, texto: 'Hacer los ejercicios', completa: false },
  ]);
  const [nuevaTarea, setNuevaTarea] = useState('');

  const agregarTarea = () => {
    if (nuevaTarea.trim() === '') return;
    setTareas([
      ...tareas,
      {
        id: Date.now(),
        texto: nuevaTarea,
        completa: false,
      },
    ]);
    setNuevaTarea('');
  };

  const toggleTarea = (id) => {
    setTareas(
      tareas.map((t) =>
        t.id === id ? { ...t, completa: !t.completa } : t
      )
    );
  };

  const eliminarTarea = (id) => {
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
      <p>
        Total: {tareas.length} |
        Pendientes: {tareas.filter(t => !t.completa).length}
      </p>
    </div>
  );
}

// -------------------------------------------------------------
// Componente 6: Demo — todos los ejemplos juntos
// -------------------------------------------------------------
function Demo() {
  return (
    <>
      <h1>🎯 useState — Estado en React</h1>
      <p>Cada componente tiene su PROPIO estado.</p>

      <hr /><Contador />
      <hr /><Interruptor />
      <hr /><SaludoPersonalizado />
      <hr /><PerfilEditor />
      <hr /><ListaDeTareas />
    </>
  );
}

// =============================================================
const root = createRoot(document.getElementById('root'));
root.render(<Demo />);
```

### 5. Iniciá el servidor

```bash
npm run dev
```

Abrí `http://localhost:5173`. Vas a ver:

- **Contador:** números que suben y bajan — el estado cambia con cada click
- **Interruptor:** un booleano que alterna entre prendido/apagado
- **Saludo personalizado:** cada letra que escribís actualiza el saludo en vivo
- **Editor de perfil:** tres campos que actualizan un objeto de estado
- **Lista de tareas:** CRUD completo con arrays — agregar, marcar, eliminar

### 6. Experimentá

Probá estas modificaciones para entender los límites del estado:

1. **Contador:** ¿Qué pasa si hacés `setCount(count + 1)` TRES veces seguidas? (Pista: no suma 3)
2. **Interruptor:** agregá un tercer estado usando otro `useState`
3. **Saludo:** probá `setNombre('')` — el input se limpia y el saludo desaparece
4. **PerfilEditor:** agregá un botón "Reset" que vuelva todo a valores vacíos
5. **ListaDeTareas:** sacale el `...tareas` en `agregarTarea` — ¿qué pasa?

### 7. Build para producción

```bash
npm run build
npm run preview
```

---

## 📄 Código Completo

### `package.json`

```json
{
  "name": "05-estado",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.2.7",
    "react-dom": "^19.2.7"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^6.0.2",
    "vite": "^8.1.0"
  }
}
```

### `vite.config.js`

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

### `index.html`

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>05 — Estado (useState)</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### `src/main.jsx`

El código completo está en el Paso 4 arriba.

---

## 🎯 Proyecto para hacer solo

> Esto no es opcional. Hacelo. El estado es EL concepto fundamental de React.

Creá un proyecto NUEVO llamado `05-estado-practica`.

### Consigna

Construí una **aplicación de encuesta interactiva**. El usuario responde preguntas de sí/no y al final ve un resumen con sus respuestas.

**Requisitos técnicos:**

1. Usá `npm create vite@latest` para crear el proyecto
2. Cada pregunta debe tener su propio estado (un booleano por pregunta o un array de respuestas)
3. Usá al menos un **objeto** como estado (para las respuestas)
4. Usá **renderizado condicional** para mostrar preguntas o resultados
5. Mostrá un **resumen** al final con todas las respuestas
6. Incluí un botón "Reiniciar" que vuelva todo al inicio

**Estructura sugerida:**

```jsx
function Encuesta() {
  const [paso, setPaso] = useState(0); // qué pregunta estamos viendo
  const [respuestas, setRespuestas] = useState({});
  // respuestas = { 0: true, 1: false, 2: true, ... }

  // Tu código acá
}
```

**Preguntas de ejemplo:**
1. "¿Te gusta programar?"
2. "¿Usaste React antes?"
3. "¿Entendiste cómo funciona useState?"
4. "¿Hiciste los ejercicios anteriores?"
5. "¿Te parece útil este curso?"

**Comportamiento:**
- Mostrar UNA pregunta por vez
- Botones "Sí" y "No" para responder
- Al responder, pasar automáticamente a la siguiente pregunta
- Después de la última pregunta, mostrar el resumen con todas las respuestas
- Botón "Reiniciar" en el resumen

**Extras (si querés ir más allá):**
- Mostrar una barra de progreso (pregunta actual / total)
- Permitir volver a la pregunta anterior
- Guardar el progreso aunque el usuario cierre el navegador (investigá `localStorage`)

---

## 🧠 Resumen

| Concepto | Explicación breve |
|----------|-------------------|
| **`useState`** | Función que agrega estado a un componente funcional. |
| **`[valor, setValor]`** | `useState` devuelve un array: el valor actual y una función para cambiarlo. |
| **Re-render** | Cuando se ejecuta `setValor`, React vuelve a ejecutar el componente y actualiza el DOM donde haga falta. |
| **Inmutabilidad** | Nunca modifiques el estado directamente. Siempre creá un nuevo valor. |
| **Objetos** | Usá `{ ...objeto, campo: nuevoValor }` para actualizar una propiedad. |
| **Arrays** | Usá `[...arr, elem]` para agregar, `.map()` para modificar, `.filter()` para eliminar. |
| **Estado derivado** | No necesitás `useState` para valores que se calculan del estado existente. |

**En el próximo proyecto** vas a ver **eventos** a fondo: `onClick`, `onChange`, `onSubmit`, y cómo pasar argumentos a los manejadores de eventos.
