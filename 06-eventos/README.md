# Proyecto 06: Eventos

> **Concepto**: `onClick`, `onChange`, `onSubmit`, evento sintético

---

## 📖 Nota Académica

### Eventos en React vs HTML

En HTML, los eventos se declaran como **atributos** con un **string**:

```html
<button onclick="alert('Hola')">Click</button>
```

En React, los eventos se declaran como **props** con una **función**:

```jsx
<button onClick={() => alert('Hola')}>Click</button>
```

Las diferencias clave:

| | HTML | React |
|---|---|---|
| **Nombre** | `onclick`, `onchange`, `onsubmit` (minúsculas) | `onClick`, `onChange`, `onSubmit` (camelCase) |
| **Valor** | String `"alert('Hola')"` | Función `{() => alert('Hola')}` |
| **Evento** | Nativo del navegador | "SyntheticEvent" (envuelve al nativo) |
| **return false** | Funciona para prevenir default | ❌ No funciona, usá `e.preventDefault()` |

### El evento sintético (`e`)

Cada event handler en React recibe un **evento sintético** como parámetro:

```jsx
const manejarClick = (e) => {
  console.log(e);
  // e.target       → el elemento que disparó el evento
  // e.type         → 'click', 'change', 'keydown', etc.
  // e.target.value → valor de un input
  // e.key          → tecla presionada (en eventos de teclado)
};

<button onClick={manejarClick}>Click</button>
```

Este objeto `e` es un `SyntheticEvent` de React. Tiene la **misma interfaz** que el evento nativo del navegador, pero funciona igual en todos los navegadores. No tenés que preocuparte por compatibilidad.

### onClick — el evento más usado

Tres formas de usarlo:

```jsx
// Forma 1: función nombrada (RECOMENDADA para lógica compleja)
const manejarClick = () => alert('Hola');
<button onClick={manejarClick}>Click</button>

// Forma 2: función inline (para cosas simples)
<button onClick={() => alert('Hola')}>Click</button>

// ❌ Forma INCORRECTA: llamar la función
<button onClick={alert('Hola')}>Click</button>
// Esto EJECUTA alert('Hola') CUANDO SE RENDERIZA, no al hacer click
```

### Pasar argumentos a los event handlers

Si necesitás pasar un argumento, **no podés llamar la función directamente** porque se ejecutaría en el render. La solución es **envolver en una arrow function**:

```jsx
// ✅ CORRECTO: arrow function que llama a la función con el argumento
<button onClick={() => mostrarMensaje('React')}>React</button>

// ❌ INCORRECTO: la función se ejecuta al renderizar
<button onClick={mostrarMensaje('React')}>React</button>
```

**¿Por qué pasa esto?** Porque `onClick={mostrarMensaje('React')}` ejecuta `mostrarMensaje` en el momento del render, y el **resultado** de esa función (en este caso `undefined`) se asigna a `onClick`. React después ejecuta `undefined()` cuando el usuario hace click y tira error.

### onChange — para inputs controlados

El evento `onChange` se dispara **cada vez que el valor de un input cambia**. Es el evento principal para formularios en React:

```jsx
const [nombre, setNombre] = useState('');

const manejarCambio = (e) => {
  // e.target.value tiene el texto actual del input
  setNombre(e.target.value);
};

<input type="text" value={nombre} onChange={manejarCambio} />
```

A diferencia de HTML, donde `onChange` se dispara cuando perdés el foco, en React se dispara en **cada tecla**. Esto hace que el estado siempre esté sincronizado con el input.

### onSubmit y preventDefault

En HTML, un `<form>` al hacer submit **recarga la página**. En React, evitamos eso con `e.preventDefault()`:

```jsx
const manejarSubmit = (e) => {
  e.preventDefault(); // 🔴 SIN ESTO, LA PÁGINA RECARGA
  // Acá procesamos los datos con JavaScript
  console.log('Formulario enviado');
};

<form onSubmit={manejarSubmit}>
  <input type="text" />
  <button type="submit">Enviar</button>
</form>
```

El `onSubmit` va en el `<form>`, no en el botón. Así tanto el click en "Enviar" como apretar **Enter** disparan el evento.

### Eventos de teclado: onKeyDown, onKeyUp

```jsx
const manejarKeyDown = (e) => {
  console.log(e.key);  // 'Enter', 'Escape', 'a', 'Shift', etc.
  console.log(e.code); // 'Enter', 'Escape', 'KeyA', 'ShiftLeft', etc.

  if (e.key === 'Enter') {
    // Hacer algo cuando aprietan Enter
  }
};

<input onKeyDown={manejarKeyDown} />
```

**Diferencia entre `e.key` y `e.code`:**
- `e.key` → el **carácter** que produce la tecla (`'a'`, `'A'`, `'1'`, `'Enter'`)
- `e.code` → la **posición física** de la tecla (`'KeyA'`, `'ShiftLeft'`, `'Digit1'`)

Si el usuario aprieta Shift+A:
- `e.key` = `'A'` (mayúscula)
- `e.code` = `'KeyA'` (sin importar mayúscula)

### Eventos de mouse: onMouseEnter, onMouseLeave

```jsx
<div
  onMouseEnter={() => console.log('Entró el mouse')}
  onMouseLeave={() => console.log('Salió el mouse')}
  onMouseMove={(e) => console.log(e.clientX, e.clientY)}
>
  Pasá el mouse por acá
</div>
```

Útiles para: hover effects, tooltips, drag & drop, seguimiento de cursor.

### Lista de eventos comunes

| Evento | Cuándo se dispara |
|--------|-------------------|
| `onClick` | Click completo (mousedown + mouseup) |
| `onDoubleClick` | Doble click |
| `onMouseEnter` | El mouse entra al elemento |
| `onMouseLeave` | El mouse sale del elemento |
| `onMouseMove` | El mouse se mueve dentro del elemento |
| `onChange` | El valor de un input cambia |
| `onSubmit` | Se envía un formulario |
| `onKeyDown` | Una tecla se presiona |
| `onKeyUp` | Una tecla se suelta |
| `onFocus` | Un input recibe foco |
| `onBlur` | Un input pierde foco |

---

## 🛠️ Paso a Paso — Creá tu propio proyecto

### 1. Creá el proyecto con Vite

```bash
cd react_desde_0
npm create vite@latest 06-eventos -- --template react
```

### 2. Entrá e instalá

```bash
cd 06-eventos
npm install
```

### 3. Limpiá el boilerplate

```bash
rm -rf src/App.jsx src/App.css src/index.css src/assets public
```

### 4. Escribí `src/main.jsx`

```jsx
import { createRoot } from 'react-dom/client';
import { useState } from 'react';

// =============================================================
// Eventos en React vs HTML
// =============================================================
// En HTML:  <button onclick="alert('Hola')">
// En React: <button onClick={() => alert('Hola')}>
//
// Diferencias clave:
//   1. CamelCase: onClick, onChange, onKeyDown
//   2. Valor: pasás una FUNCIÓN, no un string
//   3. Evento sintético: React envuelve el evento nativo
// =============================================================

// -------------------------------------------------------------
// Componente 1: ClickBasico — onClick de distintas formas
// -------------------------------------------------------------
function ClickBasico() {
  const manejarClick = () => {
    alert('¡Click con función nombrada!');
  };

  return (
    <div>
      <h2>onClick — distintas formas</h2>
      <button onClick={manejarClick}>Función nombrada</button>
      <button onClick={() => alert('Click inline!')}>Función inline</button>
    </div>
  );
}

// -------------------------------------------------------------
// Componente 2: ClickConArgumentos — pasar datos al handler
// -------------------------------------------------------------
function ClickConArgumentos() {
  const [mensaje, setMensaje] = useState('');

  const mostrarMensaje = (texto) => {
    setMensaje(texto);
  };

  return (
    <div>
      <h2>onClick con argumentos</h2>
      <button onClick={() => mostrarMensaje('Elegiste React')}>React</button>
      <button onClick={() => mostrarMensaje('Elegiste Vue')}>Vue</button>
      <button onClick={() => mostrarMensaje('Elegiste Angular')}>Angular</button>
      {mensaje && <p>🟢 {mensaje}</p>}
    </div>
  );
}

// -------------------------------------------------------------
// Componente 3: ElEvento — el parámetro `e` (evento sintético)
// -------------------------------------------------------------
function ElEvento() {
  const [ultimoEvento, setUltimoEvento] = useState('');

  const capturarEvento = (e) => {
    setUltimoEvento(
      `Tipo: ${e.type} | Etiqueta: ${e.target.tagName} | ` +
      `Texto: "${e.target.textContent?.trim() || e.target.value}"`
    );
  };

  return (
    <div>
      <h2>El evento sintético (e)</h2>
      <button onClick={capturarEvento}>Botón 1</button>
      <button onClick={capturarEvento}>Botón 2</button>
      <button onClick={capturarEvento}>Botón 3</button>
      <br />
      <input type="text" placeholder="Escribí algo..." onChange={capturarEvento} />
      {ultimoEvento && <p>📋 {ultimoEvento}</p>}
    </div>
  );
}

// -------------------------------------------------------------
// Componente 4: Formulario — onSubmit con preventDefault
// -------------------------------------------------------------
function Formulario() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);

  const manejarSubmit = (e) => {
    e.preventDefault(); // Sin esto, la página recarga
    setEnviado(true);
  };

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
      <form onSubmit={manejarSubmit}>
        <div>
          <label>
            Nombre:{' '}
            <input type="text" value={nombre}
              onChange={(e) => setNombre(e.target.value)} required />
          </label>
        </div>
        <div>
          <label>
            Email:{' '}
            <input type="email" value={email}
              onChange={(e) => setEmail(e.target.value)} required />
          </label>
        </div>
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

// -------------------------------------------------------------
// Componente 5: Teclas — onKeyDown, onKeyUp
// -------------------------------------------------------------
function Teclas() {
  const [teclas, setTeclas] = useState([]);
  const [ultimaTecla, setUltimaTecla] = useState('');

  const manejarKeyDown = (e) => {
    setUltimaTecla(`Presionaste: "${e.key}" (código: ${e.code})`);

    if (e.key === 'Enter') setTeclas([...teclas, '↵ Enter']);
    else if (e.key === 'Escape') setTeclas([...teclas, '⎋ Escape']);
    else if (e.key === ' ') setTeclas([...teclas, '␣ Espacio']);
  };

  return (
    <div>
      <h2>Eventos de teclado</h2>
      <input type="text" placeholder="Apretá teclas acá..."
        onKeyDown={manejarKeyDown} />
      <p>{ultimaTecla || '⏳ Esperando tecla...'}</p>
      <h3>Teclas registradas:</h3>
      {teclas.length === 0 ? (
        <p>Ninguna todavía (probá Enter, Escape, Espacio)</p>
      ) : (
        <ul>{teclas.map((t, i) => <li key={i}>{t}</li>)}</ul>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// Componente 6: MouseEvents — onMouseEnter, onMouseLeave
// -------------------------------------------------------------
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
          width: '300px', height: '200px',
          border: '2px solid #333', borderRadius: '8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: adentro ? '#d4edda' : '#f8d7da',
          transition: 'background-color 0.3s',
        }}
      >
        {adentro ? '🟢 El mouse está DENTRO' : '🔴 El mouse está FUERA'}
      </div>
      {adentro && <p>📍 Posición: X = {posicion.x}, Y = {posicion.y}</p>}
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
```

### 5. Iniciá el servidor

```bash
npm run dev
```

Abrí `http://localhost:5173`. Vas a ver:

- **Click básico:** dos botones que muestran alertas de distinta forma
- **Click con argumentos:** tres botones que pasan texto distinto al mismo handler
- **El evento sintético:** botones que muestran los datos del evento (`e.type`, `e.target`)
- **Formulario:** onSubmit con preventDefault, validación, y reset
- **Teclas:** detectá Enter, Escape y Espacio en vivo
- **Mouse events:** un cuadro que cambia de color y muestra la posición

### 6. Experimentá

1. Sacá el `e.preventDefault()` del formulario — hacé submit y mirá cómo recarga la página
2. Cambiá `onMouseEnter` por `onMouseOver` — ¿notás la diferencia?
3. En el componente de teclas, agregá detectar `Shift` o `Control`
4. En ElEvento, mostrá `e.clientX` e `e.clientY` cuando hacés click
5. Creá un botón que haga `console.log(e)` — inspeccioná el objeto SyntheticEvent en la consola

---

## 📄 Código Completo

### `package.json`

```json
{
  "name": "06-eventos",
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
    <title>06 — Eventos</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

---

## 🎯 Proyecto para hacer solo

Creá un proyecto NUEVO llamado `06-eventos-practica`.

### Consigna

Construí un **minijuego de teclado**: aparece una letra al azar en la pantalla, y el usuario tiene que apretar esa tecla lo más rápido posible. Se mide el tiempo de reacción y se muestra un ranking.

**Requisitos técnicos:**

1. Usá `npm create vite@latest` para crear el proyecto
2. Usá al menos **3 eventos distintos** (onKeyDown, onClick, y otro)
3. Mostrá una letra aleatoria del abecedario en pantalla (grande)
4. Cuando el usuario aprieta la tecla correcta:
   - Mostrá el tiempo de reacción en milisegundos
   - Mostrá una nueva letra al azar
   - Sumá un punto
5. Cuando el usuario aprieta la tecla incorrecta:
   - Mostrá un mensaje de error temporal
   - No sumes punto
6. Incluí:
   - Un contador de puntos
   - Un contador de intentos totales
   - El promedio de tiempo de reacción
   - Un botón "Reiniciar" que vuelva todo a cero
7. Usá `onKeyDown` en toda la página (ponelo en el evento a nivel documento o en un `div` grande con `tabIndex` y `onKeyDown`)

**Estructura sugerida:**

```jsx
function Juego() {
  const [letraActual, setLetraActual] = useState(generarLetra());
  const [puntos, setPuntos] = useState(0);
  const [totalIntentos, setTotalIntentos] = useState(0);
  const [inicio, setInicio] = useState(null); // timestamp cuando aparece la letra
  const [ultimoTiempo, setUltimoTiempo] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const manejarTecla = (e) => {
    // Tu lógica acá
  };

  return (
    // Tu JSX acá
  );
}
```

**Extras (si querés ir más allá):**
- Mostrá un color verde cuando acierta, rojo cuando se equivoca
- Sonido al acertar/equivocarse (con `Audio` de JavaScript)
- Dificultad progresiva: después de cada 5 aciertos, las letras aparecen más rápido (o usá todo el teclado, no solo una letra)
- Ranking de mejores tiempos guardado en `localStorage`

---

## 🧠 Resumen

| Concepto | Explicación breve |
|----------|-------------------|
| **Eventos en React** | Se escriben en camelCase (`onClick`) y reciben una función como valor. |
| **Evento sintético** | React envuelve el evento nativo en un `SyntheticEvent` con la misma API. |
| **`e.preventDefault()`** | Evita comportamiento default (como recarga de formularios). |
| **Funciones inline** | Usar `() => fn(arg)` para pasar argumentos a los handlers. |
| **`e.target`** | El elemento HTML que disparó el evento. |
| **`e.key`** | La tecla presionada (para eventos de teclado). |
| **`onKeyDown` vs `onKeyUp`** | `onKeyDown` se dispara al presionar, `onKeyUp` al soltar. |
| **`onMouseEnter/Leave`** | Detectan cuándo el mouse entra/sale de un elemento. |

**En el próximo proyecto** vas a ver **renderizado de listas** con `.map()` y la importancia de las `key`.
