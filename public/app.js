const tituloModulo = document.getElementById('titulo-modulo');
const vistaModulo = document.getElementById('vista-modulo');
const botones = document.querySelectorAll('.menu-btn');

const modulos = {
  conceptos: {
    titulo: 'Catálogo de Conceptos',
    api: '/api/conceptos',
    campos: [
      { name: 'clave', label: 'Clave', type: 'text', placeholder: 'Ej. CON001' },
      { name: 'descripcion', label: 'Descripción', type: 'text', placeholder: 'Ej. Material de oficina' }
    ],
    columnas: [
      { key: 'id', label: 'ID' },
      { key: 'clave', label: 'Clave' },
      { key: 'descripcion', label: 'Descripción' }
    ]
  },
  destinos: {
    titulo: 'Catálogo de Destinos',
    api: '/api/destinos',
    campos: [
      { name: 'clave', label: 'Clave', type: 'text', placeholder: 'Ej. DES001' },
      { name: 'nombre', label: 'Nombre del destino', type: 'text', placeholder: 'Ej. Bodega principal' }
    ],
    columnas: [
      { key: 'id', label: 'ID' },
      { key: 'clave', label: 'Clave' },
      { key: 'nombre', label: 'Destino' }
    ]
  },
  productos: {
    titulo: 'Catálogo de Productos',
    api: '/api/productos',
    campos: [
      { name: 'clave', label: 'Clave', type: 'text', placeholder: 'Ej. PRO001' },
      { name: 'nombre', label: 'Nombre del producto', type: 'text', placeholder: 'Ej. Laptop' },
      { name: 'precio', label: 'Precio', type: 'number', placeholder: 'Ej. 12000' }
    ],
    columnas: [
      { key: 'id', label: 'ID' },
      { key: 'clave', label: 'Clave' },
      { key: 'nombre', label: 'Producto' },
      { key: 'precio', label: 'Precio' }
    ]
  },
  unidades: {
    titulo: 'Catálogo de Unidades de Medida',
    api: '/api/unidades',
    campos: [
      { name: 'clave', label: 'Clave', type: 'text', placeholder: 'Ej. UNI001' },
      { name: 'nombre', label: 'Nombre de la unidad', type: 'text', placeholder: 'Ej. Pieza' }
    ],
    columnas: [
      { key: 'id', label: 'ID' },
      { key: 'clave', label: 'Clave' },
      { key: 'nombre', label: 'Unidad' }
    ]
  },
  entradas: {
    titulo: 'Documento de Entradas',
    soloInterfaz: true
  },
  salidas: {
    titulo: 'Documento de Salidas',
    soloInterfaz: true
  }
};

function cambiarVista(modulo) {
  const config = modulos[modulo];
  tituloModulo.textContent = config.titulo;

  botones.forEach(boton => boton.classList.remove('active'));
  document.querySelector(`[data-modulo="${modulo}"]`).classList.add('active');

  if (config.soloInterfaz) {
    vistaModulo.innerHTML = `
      <div class="card">
        <h3>${config.titulo}</h3>
        <div class="aviso">Este apartado es solo interfaz por ahora.</div>
      </div>
    `;
    return;
  }

  vistaModulo.innerHTML = `
    <div class="card">
      <form id="form-modulo">
        <div class="form-grid">
          ${config.campos.map(campo => `
            <div class="form-group">
              <label>${campo.label}</label>
              <input type="${campo.type}" name="${campo.name}" placeholder="${campo.placeholder}" required>
            </div>
          `).join('')}
        </div>
        <div class="acciones">
          <button type="submit">Guardar</button>
        </div>
      </form>

      <div id="mensaje"></div>

      <table class="tabla">
        <thead>
          <tr>
            ${config.columnas.map(col => `<th>${col.label}</th>`).join('')}
          </tr>
        </thead>
        <tbody id="tabla-registros">
          <tr>
            <td colspan="${config.columnas.length}">Cargando registros...</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

  const form = document.getElementById('form-modulo');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const datos = Object.fromEntries(new FormData(form).entries());
    const mensaje = document.getElementById('mensaje');

    try {
      const respuesta = await fetch(config.api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
      });

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        mensaje.innerHTML = `<div class="aviso">${resultado.error || 'Error al guardar.'}</div>`;
        return;
      }

      mensaje.innerHTML = `<div class="aviso" style="background:#dcfce7;color:#166534;">Registro guardado correctamente.</div>`;
      form.reset();
      cargarRegistros(modulo);
    } catch (error) {
      mensaje.innerHTML = `<div class="aviso">Error de conexión con el servidor.</div>`;
    }
  });

  cargarRegistros(modulo);
}

async function cargarRegistros(modulo) {
  const config = modulos[modulo];
  const tbody = document.getElementById('tabla-registros');

  try {
    const respuesta = await fetch(config.api);
    const registros = await respuesta.json();

    if (!Array.isArray(registros) || registros.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="${config.columnas.length}">No hay registros todavía.</td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = registros.map(registro => `
      <tr>
        ${config.columnas.map(col => `<td>${registro[col.key]}</td>`).join('')}
      </tr>
    `).join('');
  } catch (error) {
    tbody.innerHTML = `
      <tr>
        <td colspan="${config.columnas.length}">Error al cargar los registros.</td>
      </tr>
    `;
  }
}

botones.forEach(boton => {
  boton.addEventListener('click', () => {
    cambiarVista(boton.dataset.modulo);
  });
});

cambiarVista('conceptos');