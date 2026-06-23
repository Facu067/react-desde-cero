# Proyecto 09: Formularios

> **Concepto**: controlled components, validación, múltiples campos

---

## 📖 Nota Académica

### Componentes controlados

En React, un formulario se maneja con **componentes controlados**. Esto significa que React es **la única fuente de verdad** para el valor del input:

```jsx
// React controla el input:
<input
  value={nombre}                  // ← lo que MUESTRA el input
  onChange={(e) => setNombre(e.target.value)}  // ← lo que ACTUALIZA el estado
/>
```

**Flujo de datos:**
1. El usuario escribe una letra en el input
2. Se dispara `onChange` con el nuevo valor (`e.target.value`)
3. Se ejecuta `setNombre(nuevoValor)`
4. React re-renderiza el componente
5. El input muestra el nuevo valor de `nombre`

**¿Por qué controlado?** Porque React siempre sabe EXACTAMENTE lo que el usuario escribió, en todo momento. No tenés que "leer" el formulario cuando se envía — los datos ya están en el estado.

### Tipos de input en React

Cada tipo de input se controla de forma ligeramente distinta:

| Tipo | Cómo se obtiene el valor | Prop que usás |
|------|--------------------------|---------------|
| `text`, `email`, `password` | `e.target.value` | `value` |
| `textarea` | `e.target.value` | `value` |
| `select` | `e.target.value` | `value` |
| `checkbox` | `e.target.checked` | `checked` |
| `radio` | `e.target.value` | `checked={valor === estado}` |

```jsx
// TEXT / EMAIL / PASSWORD
<input type="text" value={nombre} onChange={e => setNombre(e.target.value)} />

// TEXTAREA (en React, value va como atributo, no entre etiquetas)
<textarea value={comentarios} onChange={e => setComentarios(e.target.value)} />

// SELECT
<select value={pais} onChange={e => setPais(e.target.value)}>
  <option value="ar">Argentina</option>
  <option value="cl">Chile</option>
</select>

// CHECKBOX
<input type="checkbox" checked={acepta} onChange={e => setAcepta(e.target.checked)} />
// NOTA: e.target.checked, NO e.target.value

// RADIO
<input type="radio" value="react" checked={exp === 'react'} onChange={e => setExp(e.target.value)} />
```

### Objeto de estado para múltiples campos

En lugar de un `useState` por campo, usá **un objeto** con una función genérica:

```jsx
const [form, setForm] = useState({
  nombre: '',
  email: '',
  password: '',
});

// Una sola función para todos los campos
const actualizar = (campo, valor) => {
  setForm({ ...form, [campo]: valor });
};

// Uso:
<input value={form.nombre} onChange={(e) => actualizar('nombre', e.target.value)} />
<input value={form.email} onChange={(e) => actualizar('email', e.target.value)} />
```

Esto es más limpio que tener 10 `useState` separados.

### Validación de formularios

Hay tres momentos para validar, cada uno con su uso:

| Momento | Evento | Cuándo usarlo |
|---------|--------|---------------|
| **Mientras escribe** | `onChange` | Feedback inmediato (longitud, formato) |
| **Al perder foco** | `onBlur` | Feedback cuando terminás el campo |
| **Al enviar** | `onSubmit` | Validación final antes de procesar |

```jsx
const [errores, setErrores] = useState({});

const validarCampo = (campo, valor) => {
  switch (campo) {
    case 'email':
      if (!valor.includes('@')) return 'Email inválido';
      return '';
    case 'edad':
      if (Number(valor) < 1) return 'Edad inválida';
      return '';
    default:
      return '';
  }
};

// onChange → valida en vivo
const manejarCambio = (campo, valor) => {
  setForm({ ...form, [campo]: valor });
  setErrores({ ...errores, [campo]: validarCampo(campo, valor) });
};

// onBlur → valida al salir
const manejarBlur = (campo) => {
  setErrores({ ...errores, [campo]: validarCampo(campo, form[campo]) });
};

// onSubmit → valida todo
const manejarSubmit = (e) => {
  e.preventDefault();
  const nuevosErrores = {};
  Object.keys(form).forEach(campo => {
    const error = validarCampo(campo, form[campo]);
    if (error) nuevosErrores[campo] = error;
  });
  setErrores(nuevosErrores);
  if (Object.keys(nuevosErrores).length === 0) {
    // Enviar datos...
  }
};
```

### Campos dinámicos (agregar/eliminar)

Cuando el usuario necesita agregar múltiples valores (teléfonos, direcciones, etc.), usá un **array en el estado**:

```jsx
const [items, setItems] = useState(['']);

// Agregar
const agregar = () => setItems([...items, '']);

// Eliminar (por índice)
const eliminar = (index) => setItems(items.filter((_, i) => i !== index));

// Actualizar (por índice)
const actualizar = (index, valor) => {
  const nuevos = [...items];
  nuevos[index] = valor;
  setItems(nuevos);
};
```

---

## 🛠️ Paso a Paso — Creá tu propio proyecto

### 1. Creá el proyecto

```bash
cd react_desde_0
npm create vite@latest 09-formularios -- --template react
cd 09-formularios
npm install
rm -rf src/App.jsx src/App.css src/index.css src/assets public
```

### 2. Escribí `src/main.jsx`

```jsx
import { createRoot } from 'react-dom/client';
import { useState } from 'react';

// =============================================================
// Componentes controlados
// =============================================================
// React maneja el valor del input. El estado es la fuente de
// verdad. onChange actualiza el estado con cada tecla.
// =============================================================

// -------------------------------------------------------------
// Componente 1: FormularioSimple — un solo campo
// -------------------------------------------------------------
function FormularioSimple() {
  const [nombre, setNombre] = useState('');
  const [enviado, setEnviado] = useState(false);

  const manejarSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    setEnviado(true);
  };

  if (enviado) {
    return (
      <div>
        <h2>Formulario simple</h2>
        <p>✅ Formulario enviado. Nombre: {nombre}</p>
        <button onClick={() => { setEnviado(false); setNombre(''); }}>Reset</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Formulario simple</h2>
      <form onSubmit={manejarSubmit}>
        <label>
          Nombre:{' '}
          <input type="text" value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Escribí tu nombre" />
        </label>
        <button type="submit">Enviar</button>
      </form>
      <p>👁️ Vista previa: <strong>{nombre}</strong></p>
    </div>
  );
}

// -------------------------------------------------------------
// Componente 2: FormularioComplejo — múltiples tipos de input
// -------------------------------------------------------------
function FormularioComplejo() {
  const [datos, setDatos] = useState({
    nombre: '',
    email: '',
    pais: 'ar',
    experiencia: 'js',
    terminos: false,
    comentarios: '',
  });

  const actualizar = (campo, valor) => {
    setDatos({ ...datos, [campo]: valor });
  };

  const manejarSubmit = (e) => {
    e.preventDefault();
    alert(`Formulario enviado:\n${JSON.stringify(datos, null, 2)}`);
  };

  return (
    <div>
      <h2>Múltiples tipos de input</h2>
      <form onSubmit={manejarSubmit}>
        <div>
          <label>Nombre:</label>
          <input type="text" value={datos.nombre}
            onChange={(e) => actualizar('nombre', e.target.value)} />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={datos.email}
            onChange={(e) => actualizar('email', e.target.value)} />
        </div>
        <div>
          <label>País:</label>
          <select value={datos.pais}
            onChange={(e) => actualizar('pais', e.target.value)}>
            <option value="ar">Argentina</option>
            <option value="cl">Chile</option>
            <option value="uy">Uruguay</option>
          </select>
        </div>
        <div>
          <label>Experiencia:</label>
          <div>
            <label>
              <input type="radio" name="exp" value="ninguna"
                checked={datos.experiencia === 'ninguna'}
                onChange={(e) => actualizar('experiencia', e.target.value)} /> Ninguna
            </label>
            <label>
              <input type="radio" name="exp" value="js"
                checked={datos.experiencia === 'js'}
                onChange={(e) => actualizar('experiencia', e.target.value)} /> JS básico
            </label>
            <label>
              <input type="radio" name="exp" value="react"
                checked={datos.experiencia === 'react'}
                onChange={(e) => actualizar('experiencia', e.target.value)} /> Ya uso React
            </label>
          </div>
        </div>
        <div>
          <label>
            <input type="checkbox" checked={datos.terminos}
              onChange={(e) => actualizar('terminos', e.target.checked)} />
            Acepto términos
          </label>
        </div>
        <div>
          <label>Comentarios:</label>
          <textarea value={datos.comentarios}
            onChange={(e) => actualizar('comentarios', e.target.value)} rows={4} />
        </div>
        <button type="submit" disabled={!datos.terminos}>Enviar</button>
      </form>
    </div>
  );
}

// -------------------------------------------------------------
// Componente 3: FormularioValidacion — validación en vivo
// -------------------------------------------------------------
function FormularioValidacion() {
  const [form, setForm] = useState({ usuario: '', email: '', edad: '' });
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  const validarCampo = (campo, valor) => {
    switch (campo) {
      case 'usuario':
        if (!valor) return 'El usuario es obligatorio';
        if (valor.length < 3) return 'Mínimo 3 caracteres';
        return '';
      case 'email':
        if (!valor) return 'El email es obligatorio';
        if (!valor.includes('@')) return 'Email inválido';
        return '';
      case 'edad':
        if (!valor) return 'La edad es obligatoria';
        if (Number(valor) < 1 || Number(valor) > 120) return 'Edad inválida';
        return '';
      default:
        return '';
    }
  };

  const actualizarYValidar = (campo, valor) => {
    setForm({ ...form, [campo]: valor });
    setErrores({ ...errores, [campo]: validarCampo(campo, valor) });
  };

  const manejarSubmit = (e) => {
    e.preventDefault();
    const nuevosErrores = {};
    Object.keys(form).forEach(campo => {
      const error = validarCampo(campo, form[campo]);
      if (error) nuevosErrores[campo] = error;
    });
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length === 0) setEnviado(true);
  };

  if (enviado) {
    return (
      <div>
        <h2>Formulario con validación</h2>
        <p>✅ Formulario válido.</p>
        <button onClick={() => { setEnviado(false); setForm({ usuario: '', email: '', edad: '' }); setErrores({}); }}>
          Reset
        </button>
      </div>
    );
  }

  const renderCampo = (campo, label, type = 'text') => (
    <div>
      <label>{label}:</label>
      <input type={type} value={form[campo]}
        onChange={(e) => actualizarYValidar(campo, e.target.value)}
        style={{ borderColor: errores[campo] ? 'red' : '#ccc', borderWidth: 2 }} />
      {errores[campo] && <p style={{ color: 'red', fontSize: '0.85em' }}>⚠️ {errores[campo]}</p>}
    </div>
  );

  return (
    <div>
      <h2>Formulario con validación</h2>
      <form onSubmit={manejarSubmit}>
        {renderCampo('usuario', 'Usuario')}
        {renderCampo('email', 'Email', 'email')}
        {renderCampo('edad', 'Edad', 'number')}
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

// -------------------------------------------------------------
// Componente 4: FormularioDinamico — agregar/eliminar campos
// -------------------------------------------------------------
function FormularioDinamico() {
  const [telefonos, setTelefonos] = useState(['']);

  const agregar = () => setTelefonos([...telefonos, '']);
  const eliminar = (index) => setTelefonos(telefonos.filter((_, i) => i !== index));
  const actualizar = (index, valor) => {
    const nuevos = [...telefonos];
    nuevos[index] = valor;
    setTelefonos(nuevos);
  };

  const manejarSubmit = (e) => {
    e.preventDefault();
    alert(`Teléfonos: ${telefonos.filter(t => t.trim()).join(', ')}`);
  };

  return (
    <div>
      <h2>Campos dinámicos</h2>
      <form onSubmit={manejarSubmit}>
        {telefonos.map((tel, index) => (
          <div key={index}>
            <input type="tel" value={tel}
              onChange={(e) => actualizar(index, e.target.value)}
              placeholder={`Teléfono ${index + 1}`} />
            {telefonos.length > 1 && (
              <button type="button" onClick={() => eliminar(index)}>❌</button>
            )}
          </div>
        ))}
        <div>
          <button type="button" onClick={agregar}>+ Agregar otro</button>
        </div>
        <button type="submit">Guardar</button>
      </form>
    </div>
  );
}

// -------------------------------------------------------------
function Demo() {
  return (
    <>
      <h1>🎯 Formularios en React</h1>
      <hr /><FormularioSimple />
      <hr /><FormularioComplejo />
      <hr /><FormularioValidacion />
      <hr /><FormularioDinamico />
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

- **Formulario simple:** un input text controlado con preview en vivo
- **Formulario complejo:** text, email, select, radio, checkbox, textarea — todos en un solo objeto de estado
- **Formulario con validación:** validación en vivo con onChange, borde rojo en errores
- **Campos dinámicos:** agregar y eliminar inputs de teléfono

### 4. Experimentá

1. En `FormularioDinamico`, reemplazá `key={index}` por `key={Math.random()}` — fijate qué pasa al eliminar
2. Agregá un campo de confirmación de contraseña en `FormularioValidacion` que valide que coincida
3. En `FormularioComplejo`, cambiá el `disabled` del botón para que también valide email y nombre
4. Agregá un campo de fecha (`type="date"`) en el formulario complejo
5. Hacé que al escribir en mayúsculas se convierta a minúsculas automáticamente (usá `.toLowerCase()` en el onChange)

---

## 📄 Código Completo

### `package.json`

```json
{
  "name": "09-formularios",
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

Creá un proyecto NUEVO llamado `09-formularios-practica`.

### Consigna

Construí un **formulario de registro de usuarios** completo con:

**Campos requeridos:**
- Nombre completo (text)
- Email (email)
- Contraseña (password)
- Confirmar contraseña (password)
- Fecha de nacimiento (date)
- Género (radio: Masculino / Femenino / Otro / Prefiero no decirlo)
- País (select con al menos 5 países)
- Intereses (checkbox: Tecnología, Deportes, Música, Arte, Ciencia)
- Biografía (textarea)
- Aceptar términos (checkbox, obligatorio)

**Validaciones:**
- Todos los campos son obligatorios (excepto biografía)
- Email debe contener `@`
- Contraseña: mínimo 8 caracteres, al menos un número
- Confirmar contraseña debe coincidir con contraseña
- Fecha de nacimiento: debe ser mayor de 13 años
- No se puede enviar sin aceptar términos

**Comportamiento:**
- Validación en VIVO (onChange) — el error aparece mientras el usuario escribe
- Botón de enviar deshabilitado si hay errores
- Al enviar: mostrar un resumen de todos los datos ingresados
- Botón "Limpiar" que resetea todo

**Extras (si querés ir más allá):**
- Mostrar la fortaleza de la contraseña (débil/media/fuerte) en vivo
- Previsualizar la biografía en vivo al lado del textarea
- Guardar datos en `localStorage` para que no se pierdan al recargar
- Campo "Repetir email" que valide que coincida con email

---

## 🧠 Resumen

| Concepto | Explicación breve |
|----------|-------------------|
| **Componente controlado** | React maneja el valor del input. `value` + `onChange`. |
| **Objeto de estado** | Un solo `useState({})` para todos los campos, con una función genérica `actualizar(campo, valor)`. |
| **Checkbox** | Usá `checked` (no `value`) y `e.target.checked`. |
| **Radio** | Usá `checked={valor === estado}`. |
| **Validación en vivo** | `onChange` → validar y mostrar error inmediatamente. |
| **Validación al blur** | `onBlur` → validar cuando el campo pierde foco. |
| **Validación al submit** | `onSubmit` → validar todo antes de procesar. |
| **Campos dinámicos** | Array en el estado, `.map()` para renderizar, `.filter()` para eliminar, spread para agregar. |

**En el próximo proyecto** vas a ver **`useEffect`**: efectos secundarios, fetch de datos, ciclo de vida del componente.
