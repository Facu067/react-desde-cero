# Proyecto 11: useRef

> **Concepto**: referencias al DOM, valores persistentes sin re-render

---

## 📖 Nota Académica

### ¿Qué es useRef?

`useRef` es un hook que te permite **guardar un valor que persiste entre renders pero NO causa un re-render cuando cambia**.

```js
const ref = useRef(valorInicial);
// ref → { current: valorInicial }
```

| | `useState` | `useRef` |
|---|---|---|
| **¿Causa re-render?** | ✅ Sí, al cambiar | ❌ No |
| **¿Persiste entre renders?** | ✅ Sí | ✅ Sí |
| **¿Para qué sirve?** | Datos que se ven en pantalla | Acceso al DOM, timers, valores "silenciosos" |

### useRef para acceder al DOM

El uso más común: obtener el elemento HTML real para manipularlo directamente.

```jsx
import { useRef, useEffect } from 'react';

function MiComponente() {
  const inputRef = useRef(null);

  useEffect(() => {
    // Se ejecuta DESPUÉS del render, el DOM ya existe
    inputRef.current.focus();
  }, []);

  return <input ref={inputRef} placeholder="Me enfoco solo" />;
}
```

Cuando pasás `ref={inputRef}` a un elemento JSX, React asigna automáticamente el nodo del DOM a `inputRef.current`. No hace falta hacer `document.getElementById()`.

**Cosas que podés hacer con una ref al DOM:**
- `.focus()` / `.select()` — enfocar y seleccionar texto
- `.getBoundingClientRect()` — medir tamaño y posición
- `.scrollIntoView()` — scroll hasta el elemento
- `.play()` / `.pause()` — controlar video/audio
- `.value` — leer/escribir el valor (pero mejor usar estado)

### useRef para valores sin re-render

El segundo uso: guardar valores que **no querés que causen re-render** cuando cambian.

```jsx
function ContadorRenders() {
  const rendersRef = useRef(0);

  // Esto NO causa re-render:
  rendersRef.current += 1;

  return <p>Render #{rendersRef.current}</p>;
}
```

**¿Por qué esto no funciona con useState?**
```jsx
const [renders, setRenders] = useState(0);
renders + 1;              // ❌ Se pierde en el próximo render
setRenders(r + 1);        // ❌ Causa re-render → loop infinito
```

Casos de uso para valores sin re-render:
- **Contar renders** (como arriba)
- **Guardar el ID de un timer** (setInterval/setTimeout)
- **Guardar el valor anterior** de una prop o estado
- **Referencias a instancias** de librerías externas
- **Evitar closures viejos** en callbacks

### useRef + timers: el patrón limpio

Cuando trabajás con `setInterval` o `setTimeout`, el problema de los **closures viejos** es común. Con useRef lo resolvés:

```jsx
function Timer() {
  const intervaloRef = useRef(null);

  const iniciar = () => {
    // Guardamos el ID en la ref
    intervaloRef.current = setInterval(() => {
      console.log('Tick');
    }, 1000);
  };

  const pausar = () => {
    // Accedemos al ID desde cualquier lado, sin closures
    clearInterval(intervaloRef.current);
    intervaloRef.current = null;
  };

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
      }
    };
  }, []);
  // No necesita dependencias gracias a useRef
}
```

### useRef vs document.getElementById()

¿Por qué no usar `document.getElementById()` como en HTML?

```js
// 😬 En React, mejor NO:
document.getElementById('mi-input').focus();

// ✅ En React, mejor SÍ:
const inputRef = useRef(null);
<input ref={inputRef} />
inputRef.current.focus();
```

**Razones:**
1. **React no sabe** que modificaste el DOM con getElementById — podría pisar tus cambios
2. **Las refs son declarativas**: cada elemento tiene su ref, no dependés de IDs globales
3. **Funcionan con componentes**: si tenés varios componentes iguales, cada uno tiene su propia ref

### Múltiples refs

Podés tener todas las refs que necesites. Un patrón común: navegación por Enter en formularios.

```jsx
const input1Ref = useRef(null);
const input2Ref = useRef(null);
const input3Ref = useRef(null);

// Al apretar Enter en input1, pasamos el foco a input2
const handleKeyDown = (e, nextRef) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    nextRef.current.focus();
  }
};

return (
  <>
    <input ref={input1Ref} onKeyDown={(e) => handleKeyDown(e, input2Ref)} />
    <input ref={input2Ref} onKeyDown={(e) => handleKeyDown(e, input3Ref)} />
    <input ref={input3Ref} />
  </>
);
```

---

## 🛠️ Paso a Paso — Creá tu propio proyecto

### 1. Creá el proyecto

```bash
cd react_desde_0
npm create vite@latest 11-useRef -- --template react
cd 11-useRef
npm install
rm -rf src/App.jsx src/App.css src/index.css src/assets public
```

### 2. Escribí `src/main.jsx`

```jsx
import { createRoot } from 'react-dom/client';
import { useState, useEffect, useRef } from 'react';

// =============================================================
// useRef vs useState
// =============================================================
// useState → cambia → RE-RENDERIZA
// useRef → cambia → NO re-renderiza (persiste entre renders)
//
// useRef también da acceso al DOM real:
//   <input ref={miRef} /> → miRef.current es el <input> HTML
// =============================================================

// -------------------------------------------------------------
// Componente 1: AutoFocusInput — ref para acceder al DOM
// -------------------------------------------------------------
function AutoFocusInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div>
      <h2>🔦 Auto-focus</h2>
      <input ref={inputRef} type="text" placeholder="Me enfoco solo" style={{ width: '100%' }} />
      <button onClick={() => { inputRef.current.focus(); inputRef.current.select(); }}>
        📌 Enfocar y seleccionar
      </button>
    </div>
  );
}

// -------------------------------------------------------------
// Componente 2: ContadorRenders — ref para contar sin re-render
// -------------------------------------------------------------
function ContadorRenders() {
  const [nombre, setNombre] = useState('');
  const rendersRef = useRef(0);
  rendersRef.current += 1;

  return (
    <div>
      <h2>🔢 Contar renders</h2>
      <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" />
      <p>🔄 Render #{rendersRef.current}</p>
    </div>
  );
}

// -------------------------------------------------------------
// Componente 3: TimerRef — ref para timers sin closures viejos
// -------------------------------------------------------------
function TimerRef() {
  const [segundos, setSegundos] = useState(0);
  const intervaloRef = useRef(null);

  const iniciar = () => {
    if (intervaloRef.current) return;
    intervaloRef.current = setInterval(() => {
      setSegundos((s) => s + 1);
    }, 1000);
  };

  const pausar = () => {
    clearInterval(intervaloRef.current);
    intervaloRef.current = null;
  };

  const resetear = () => { pausar(); setSegundos(0); };

  useEffect(() => () => clearInterval(intervaloRef.current), []);

  const m = Math.floor(segundos / 60);
  const s = segundos % 60;
  return (
    <div>
      <h2>⏱️ Timer con ref</h2>
      <p style={{ fontSize: '2em', fontFamily: 'monospace' }}>
        {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
      </p>
      <button onClick={iniciar}>▶️</button>
      <button onClick={pausar}>⏸️</button>
      <button onClick={resetear}>⏹️</button>
    </div>
  );
}

// -------------------------------------------------------------
// Componente 4: MedirElemento — ref para medir el DOM
// -------------------------------------------------------------
function MedirElemento() {
  const divRef = useRef(null);
  const [medidas, setMedidas] = useState(null);

  const medir = () => {
    const rect = divRef.current.getBoundingClientRect();
    setMedidas({ ancho: Math.round(rect.width), alto: Math.round(rect.height),
      x: Math.round(rect.left), y: Math.round(rect.top) });
  };

  useEffect(() => { medir(); window.addEventListener('resize', medir);
    return () => window.removeEventListener('resize', medir); }, []);

  return (
    <div>
      <h2>📐 Medir elementos</h2>
      <div ref={divRef} style={{ width: '60%', padding: 20, border: '2px dashed #007bff', textAlign: 'center' }}>
        <p>📦 Elemento medido</p>
      </div>
      <button onClick={medir}>📏 Medir</button>
      {medidas && <p>📐 {medidas.ancho}x{medidas.alto}px en ({medidas.x}, {medidas.y})</p>}
    </div>
  );
}

// -------------------------------------------------------------
// Componente 5: FormularioRefs — navegación por Enter con refs
// -------------------------------------------------------------
function FormularioRefs() {
  const nombreRef = useRef(null);
  const emailRef = useRef(null);
  const edadRef = useRef(null);

  useEffect(() => { nombreRef.current.focus(); }, []);

  const onKeyDown = (e, next) => {
    if (e.key === 'Enter') { e.preventDefault(); next.current.focus(); }
  };

  return (
    <div>
      <h2>📋 Enter → siguiente campo</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <input ref={nombreRef} placeholder="Nombre" onKeyDown={(e) => onKeyDown(e, emailRef)} />
        <input ref={emailRef} placeholder="Email" onKeyDown={(e) => onKeyDown(e, edadRef)} />
        <input ref={edadRef} placeholder="Edad" />
      </form>
    </div>
  );
}

// -------------------------------------------------------------
function Demo() {
  return (
    <>
      <h1>🎯 useRef</h1>
      <hr /><AutoFocusInput />
      <hr /><ContadorRenders />
      <hr /><TimerRef />
      <hr /><MedirElemento />
      <hr /><FormularioRefs />
    </>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<Demo />);
```

### 3. Iniciá el servidor

```bash
npm run dev
```

Abrí `http://localhost:5173`. Vas a ver:

- **Auto-focus:** el input se enfoca solo al cargar la página
- **Contar renders:** cada vez que escribís, el contador aumenta pero no causa renders extra
- **Timer con ref:** intervalo guardado en ref, sin closures viejos
- **Medir elementos:** medí el tamaño del cuadro, incluso al redimensionar la ventana
- **Navegación por Enter:** Enter pasa al siguiente campo automáticamente

### 4. Experimentá

1. En `AutoFocusInput`, poné un `console.log` en el render — fijate que el botón "Enfocar" NO causa re-render
2. En `ContadorRenders`, reemplazá `useRef` por `useState` — fijate el loop infinito
3. En `TimerRef`, sacá la ref y usá `useState` para el ID del intervalo — fijate qué complicado queda
4. En `MedirElemento`, cambiá el ancho del div con un input range y medí de nuevo
5. En `FormularioRefs`, agregá un cuarto campo y conectá la navegación

---

## 📄 Código Completo

### `package.json`

```json
{
  "name": "11-useRef",
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

---

## 🎯 Proyecto para hacer solo

Creá un proyecto NUEVO llamado `11-useRef-practica`.

### Consigna

Construí un **editor de texto minimalista** con las siguientes funcionalidades basadas en useRef:

**Requisitos técnicos:**

1. Un `<textarea>` donde el usuario escribe texto
2. Usá `useRef` para acceder al `<textarea>` y poder:
   - **Enfocar** el textarea al cargar la página
   - **Seleccionar todo** el texto con un botón
   - **Insertar texto** en la posición del cursor (ej: rodear la selección con `**` para negrita)
   - Mostrar la **posición del cursor** (línea, columna) en vivo
3. Un contador de **palabras** y **caracteres** (calculados del estado, no de useRef)
4. Un botón "Limpiar" que borre todo y vuelva a enfocar el textarea
5. Un **historial de cambios** (usá useRef para guardar los últimos 10 estados sin causar re-render)

**Estructura sugerida:**

```jsx
function Editor() {
  const textareaRef = useRef(null);
  const [texto, setTexto] = useState('');
  const historialRef = useRef([]);
  const [stats, setStats] = useState({ palabras: 0, chars: 0 });

  const insertarNegrita = () => {
    const textarea = textareaRef.current;
    const inicio = textarea.selectionStart;
    const fin = textarea.selectionEnd;
    const seleccion = texto.substring(inicio, fin);

    const nuevoTexto = texto.substring(0, inicio) +
      `**${seleccion}**` + texto.substring(fin);

    // Guardar en historial ANTES de cambiar
    historialRef.current = [...historialRef.current.slice(-9), texto];

    setTexto(nuevoTexto);
    // Restaurar selección después de insertar
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(inicio + 2, fin + 2);
    }, 0);
  };

  // ... resto del componente
}
```

**Extras (si querés ir más allá):**
- Atajos de teclado: Ctrl+B para negrita, Ctrl+I para itálica, Ctrl+Z para deshacer (con el historial de ref)
- Botón "Copiar al portapapeles" con `navigator.clipboard.writeText()`
- Modo oscuro / modo claro
- Contador de tiempo de escritura (cuánto tiempo lleva escribiendo)

---

## 🧠 Resumen

| Concepto | Explicación breve |
|----------|-------------------|
| **`useRef(valor)`** | Crea un objeto `{ current: valor }` que persiste entre renders. |
| **`ref={ref}`** | Conecta la ref a un elemento JSX. `ref.current` = nodo del DOM. |
| **useRef vs useState** | useRef NO causa re-render al cambiar. useState SÍ. |
| **DOM** | `.focus()`, `.select()`, `.getBoundingClientRect()`, `.scrollIntoView()`, `.play()/.pause()` |
| **Timers** | Guardar el ID de `setInterval`/`setTimeout` en una ref evita closures viejos. |
| **Múltiples refs** | Cada campo puede tener su propia ref. Útil para navegación por teclado. |
| **No es mágico** | useRef es solo `{ current: valor }`. No tiene nada especial de React más allá de persistir entre renders. |

**En el próximo proyecto** vas a ver **Context API**: cómo evitar pasar props por mil niveles de componentes.
