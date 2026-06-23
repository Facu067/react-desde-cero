/* ============================================================
   React desde 0 — Proyecto 09: Formularios
   Concepto: controlled components, validación, múltiples campos
   ============================================================
   Los formularios son la principal forma de entrada de datos
   del usuario. En React, cada campo se "controla" con estado:
   el input muestra lo que dice el estado, y el estado se
   actualiza con cada tecla que escribe el usuario.
   ============================================================ */

import { createRoot } from 'react-dom/client';
import { useState } from 'react';

// =============================================================
// Componentes controlados vs no controlados
// =============================================================
// CONTROLADO: React maneja el valor del input
//   <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
//   → el INPUT muestra lo que dice el ESTADO
//   → Cuando el usuario escribe, actualiza el ESTADO
//
// NO CONTROLADO: el navegador maneja el valor
//   <input />  ← sin value, sin onChange
//   → React no sabe lo que el usuario escribió
//   → Si necesitás el valor, usás useRef (proyecto 11)
//
// En React, SIEMPRE usamos componentes controlados.
// Así React es siempre la "fuente de verdad".
// =============================================================

// -------------------------------------------------------------
// Componente 1: FormularioSimple — un solo campo
// -------------------------------------------------------------
// El patrón básico de un formulario controlado.
function FormularioSimple() {
  const [nombre, setNombre] = useState('');
  const [enviado, setEnviado] = useState(false);

  const manejarSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) return; // no enviar vacío
    setEnviado(true);
  };

  if (enviado) {
    return (
      <div>
        <h2>Formulario simple</h2>
        <p>✅ Formulario enviado. Nombre: {nombre}</p>
        <button onClick={() => { setEnviado(false); setNombre(''); }}>
          Reset
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2>Formulario simple</h2>

      <form onSubmit={manejarSubmit}>
        <label>
          Nombre:{' '}
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Escribí tu nombre"
          />
        </label>
        <button type="submit">Enviar</button>
      </form>

      <p>👁️ Vista previa: <strong>{nombre}</strong></p>
      {/* Cada tecla actualiza el estado y el preview cambia solo */}
    </div>
  );
}

// -------------------------------------------------------------
// Componente 2: FormularioComplejo — múltiples tipos de input
// -------------------------------------------------------------
// Acá vemos cómo controlar CADA tipo de campo HTML en React.
//
// Truco: en lugar de un useState por campo, usamos UN SOLO
// objeto de estado y una función genérica para actualizar.
function FormularioComplejo() {
  const [datos, setDatos] = useState({
    nombre: '',
    email: '',
    password: '',
    pais: 'ar',          // select → valor pre-seleccionado
    experiencia: 'js',    // radio → valor inicial
    terminos: false,      // checkbox → booleano
    comentarios: '',      // textarea
  });

  // Función genérica: recibe el campo y el nuevo valor
  // Así evitamos tener un onChange distinto para cada campo.
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
        {/* ── TEXT ── */}
        <div>
          <label>Nombre:</label>
          <input
            type="text" value={datos.nombre}
            onChange={(e) => actualizar('nombre', e.target.value)}
          />
        </div>

        {/* ── EMAIL ── */}
        <div>
          <label>Email:</label>
          <input
            type="email" value={datos.email}
            onChange={(e) => actualizar('email', e.target.value)}
          />
        </div>

        {/* ── PASSWORD ── */}
        <div>
          <label>Contraseña:</label>
          <input
            type="password" value={datos.password}
            onChange={(e) => actualizar('password', e.target.value)}
          />
        </div>

        {/* ── SELECT ── */}
        <div>
          <label>País:</label>
          <select
            value={datos.pais}
            onChange={(e) => actualizar('pais', e.target.value)}
          >
            <option value="ar">Argentina</option>
            <option value="cl">Chile</option>
            <option value="uy">Uruguay</option>
            <option value="br">Brasil</option>
          </select>
        </div>

        {/* ── RADIO ── */}
        <div>
          <label>Experiencia en React:</label>
          <div>
            <label>
              <input
                type="radio" name="experiencia" value="ninguna"
                checked={datos.experiencia === 'ninguna'}
                onChange={(e) => actualizar('experiencia', e.target.value)}
              /> Ninguna
            </label>
            <label>
              <input
                type="radio" name="experiencia" value="js"
                checked={datos.experiencia === 'js'}
                onChange={(e) => actualizar('experiencia', e.target.value)}
              /> JS básico
            </label>
            <label>
              <input
                type="radio" name="experiencia" value="react"
                checked={datos.experiencia === 'react'}
                onChange={(e) => actualizar('experiencia', e.target.value)}
              /> Ya uso React
            </label>
          </div>
        </div>

        {/* ── CHECKBOX ── */}
        <div>
          <label>
            <input
              type="checkbox"
              checked={datos.terminos}
              onChange={(e) => actualizar('terminos', e.target.checked)}
              // Para checkbox: e.target.checked (no e.target.value)
            /> Acepto los términos y condiciones
          </label>
        </div>

        {/* ── TEXTAREA ── */}
        <div>
          <label>Comentarios:</label>
          <textarea
            value={datos.comentarios}
            onChange={(e) => actualizar('comentarios', e.target.value)}
            rows={4}
          />
        </div>

        <button type="submit" disabled={!datos.terminos}>
          Enviar formulario
        </button>
      </form>

      <details>
        <summary>📋 Ver datos del formulario</summary>
        <pre>{JSON.stringify(datos, null, 2)}</pre>
      </details>
    </div>
  );
}

// -------------------------------------------------------------
// Componente 3: FormularioValidacion — validación en vivo
// -------------------------------------------------------------
// La validación puede ser:
// - Al escribir (onChange) → feedback inmediato, pero molesto
// - Al perder foco (onBlur) → feedback cuando terminás un campo
// - Al enviar (onSubmit) → feedback después de apretar Enviar
//
// Acá combinamos las tres: validación en vivo + al blur + al submit.
function FormularioValidacion() {
  const [form, setForm] = useState({
    usuario: '',
    email: '',
    edad: '',
  });

  // Estado de errores: mismo formato que form, pero con strings
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  // Función para validar un CAMPO específico
  const validarCampo = (campo, valor) => {
    let error = '';

    switch (campo) {
      case 'usuario':
        if (!valor) error = 'El usuario es obligatorio';
        else if (valor.length < 3) error = 'Mínimo 3 caracteres';
        else if (valor.length > 15) error = 'Máximo 15 caracteres';
        break;
      case 'email':
        if (!valor) error = 'El email es obligatorio';
        else if (!valor.includes('@')) error = 'Email inválido (falta @)';
        break;
      case 'edad':
        if (!valor) error = 'La edad es obligatoria';
        else if (Number(valor) < 1 || Number(valor) > 120) error = 'Edad inválida (1-120)';
        break;
    }

    return error;
  };

  // Actualiza el campo y valida EN VIVO (onChange)
  const actualizarYValidar = (campo, valor) => {
    setForm({ ...form, [campo]: valor });
    const error = validarCampo(campo, valor);
    setErrores({ ...errores, [campo]: error });
  };

  // Valida al perder foco (onBlur)
  const validarAlSalir = (campo) => {
    const error = validarCampo(campo, form[campo]);
    setErrores({ ...errores, [campo]: error });
  };

  // Valida TODO al enviar
  const manejarSubmit = (e) => {
    e.preventDefault();

    const nuevosErrores = {};
    Object.keys(form).forEach((campo) => {
      const error = validarCampo(campo, form[campo]);
      if (error) nuevosErrores[campo] = error;
    });
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length === 0) {
      setEnviado(true);
    }
  };

  if (enviado) {
    return (
      <div>
        <h2>Formulario con validación</h2>
        <p>✅ Formulario válido. Datos recibidos:</p>
        <pre>{JSON.stringify(form, null, 2)}</pre>
        <button onClick={() => {
          setEnviado(false);
          setForm({ usuario: '', email: '', edad: '' });
          setErrores({});
        }}>Reset</button>
      </div>
    );
  }

  // Función helper para renderizar un campo con su label y error
  const renderCampo = (campo, label, type = 'text') => (
    <div>
      <label>{label}:</label>
      <input
        type={type}
        value={form[campo]}
        onChange={(e) => actualizarYValidar(campo, e.target.value)}
        onBlur={() => validarAlSalir(campo)}
        style={{
          borderColor: errores[campo] ? 'red' : '#ccc',
          borderWidth: 2,
        }}
      />
      {errores[campo] && (
        <p style={{ color: 'red', fontSize: '0.85em', margin: 0 }}>
          ⚠️ {errores[campo]}
        </p>
      )}
    </div>
  );

  return (
    <div>
      <h2>Formulario con validación</h2>
      <p>Validación en vivo (onChange) + al perder foco (onBlur) + al enviar</p>

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
// A veces necesitás que el usuario pueda agregar campos
// dinámicamente, como múltiples teléfonos o direcciones.
// La solución es un array en el estado.
function FormularioDinamico() {
  const [telefonos, setTelefonos] = useState(['']);

  const agregarTelefono = () => {
    setTelefonos([...telefonos, '']);
  };

  const eliminarTelefono = (index) => {
    setTelefonos(telefonos.filter((_, i) => i !== index));
  };

  const actualizarTelefono = (index, valor) => {
    const nuevos = [...telefonos];
    nuevos[index] = valor;
    setTelefonos(nuevos);
  };

  const manejarSubmit = (e) => {
    e.preventDefault();
    // Filtramos vacíos antes de mostrar
    const validos = telefonos.filter((t) => t.trim());
    alert(`Teléfonos registrados: ${validos.join(', ')}`);
  };

  return (
    <div>
      <h2>Campos dinámicos (agregar/eliminar)</h2>

      <form onSubmit={manejarSubmit}>
        {telefonos.map((tel, index) => (
          <div key={index}>
            <input
              type="tel"
              value={tel}
              onChange={(e) => actualizarTelefono(index, e.target.value)}
              placeholder={`Teléfono ${index + 1}`}
            />
            {telefonos.length > 1 && (
              <button
                type="button"
                onClick={() => eliminarTelefono(index)}
              >
                ❌
              </button>
            )}
          </div>
        ))}

        <div>
          <button type="button" onClick={agregarTelefono}>
            + Agregar otro teléfono
          </button>
        </div>

        <button type="submit">Guardar teléfonos</button>
      </form>

      <p>📞 Teléfonos: {telefonos.filter(t => t.trim()).length}</p>
    </div>
  );
}

// -------------------------------------------------------------
// Componente 5: Demo — todos los ejemplos
// -------------------------------------------------------------
function Demo() {
  return (
    <>
      <h1>🎯 Formularios en React</h1>
      <p>Todos los inputs son CONTROLADOS: React maneja el valor.</p>

      <hr /><FormularioSimple />
      <hr /><FormularioComplejo />
      <hr /><FormularioValidacion />
      <hr /><FormularioDinamico />
    </>
  );
}

// =============================================================
const root = createRoot(document.getElementById('root'));
root.render(<Demo />);
