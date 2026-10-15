/* ===========================================================
   asignacion.js · Asignar + registrar técnicos (módulo ES)
   =========================================================== */

import {
  cargarSolicitudes,
  obtenerSolicitudPorId,
  actualizarSolicitud,
  cargarTecnicos,
  guardarTecnicos,
  agregarTecnico,
  etiqueta
} from './data.js';

document.addEventListener('DOMContentLoaded', () => {

  const tbodySinAsignar   = document.getElementById('tbody-sin-asignar');
  const selectSolicitud   = document.getElementById('id-solicitud');
  const selectResponsable = document.getElementById('responsable');
  const formAsignar       = document.getElementById('form-asignacion');
  const mensajeAsig       = document.getElementById('mensaje-asignacion');
  const fechaAsig         = document.getElementById('fecha-asignacion');

  const formTecnico   = document.getElementById('form-tecnico');
  const mensajeTec    = document.getElementById('mensaje-tecnico');
  const tbodyTecnicos = document.getElementById('tbody-tecnicos');

  /* ---------- Render: solicitudes sin asignar + select ---------- */

  function renderSinAsignar() {
    const lista = cargarSolicitudes()
      .filter(s => !s.responsable || s.responsable === 'Sin asignar');

    tbodySinAsignar.innerHTML = '';

    if (!lista.length) {
      tbodySinAsignar.innerHTML =
        '<tr class="sin-resultados"><td colspan="5">No hay solicitudes sin asignar 🎉</td></tr>';
    } else {
      lista.forEach(s => {
        tbodySinAsignar.innerHTML +=
          '<tr>' +
            '<td data-label="ID">'        + s.id + '</td>' +
            '<td data-label="Título">'    + s.titulo + '</td>' +
            '<td data-label="Categoría">' + etiqueta('categoria', s.categoria) + '</td>' +
            '<td data-label="Prioridad">' + etiqueta('prioridad', s.prioridad) + '</td>' +
            '<td data-label="Fecha">'     + s.fecha + '</td>' +
          '</tr>';
      });
    }

    selectSolicitud.innerHTML = '<option value="">Selecciona una solicitud</option>';
    lista.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = s.id + ' — ' + s.titulo;
      selectSolicitud.appendChild(opt);
    });
  }

  /* ---------- Render: técnicos + select ---------- */

  function renderTecnicos() {
    const lista = cargarTecnicos();

    tbodyTecnicos.innerHTML = '';

    if (!lista.length) {
      tbodyTecnicos.innerHTML =
        '<tr class="sin-resultados"><td colspan="3">Aún no hay técnicos registrados</td></tr>';
    } else {
      lista.forEach(t => {
        tbodyTecnicos.innerHTML +=
          '<tr>' +
            '<td data-label="Nombre">' + t.nombre + '</td>' +
            '<td data-label="Área">'   + (t.area || '—') + '</td>' +
            '<td data-label="Acciones">' +
              '<button type="button" class="btn-mini btn-eliminar" data-id="' + t.id + '">Eliminar</button>' +
            '</td>' +
          '</tr>';
      });
    }

    selectResponsable.innerHTML = '<option value="">Selecciona un responsable</option>';
    lista.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.nombre;
      opt.textContent = t.nombre;
      selectResponsable.appendChild(opt);
    });
  }

  /* ---------- Enviar formulario de asignación ---------- */

  formAsignar.addEventListener('submit', e => {
    e.preventDefault();

    const id          = selectSolicitud.value;
    const responsable = selectResponsable.value;
    const equipo      = formAsignar.equipo.value.trim();
    const fecha       = formAsignar['fecha-asignacion'].value;
    const prioridad   = formAsignar['prioridad-asignada'].value;
    const notas       = formAsignar['notas-asignacion'].value.trim();

    if (!id || !responsable) return;

    const sol = obtenerSolicitudPorId(id);
    if (!sol) return;

    const historial = sol.historial || [];
    historial.push({
      fecha: fecha,
      texto: 'Asignada a ' + responsable +
             (equipo ? ' · ' + equipo : '') +
             (notas  ? '. ' + notas      : '')
    });

    actualizarSolicitud(id, {
      responsable: responsable,
      equipo: equipo,
      prioridad: prioridad,
      estado: sol.estado === 'abierta' ? 'en-proceso' : sol.estado,
      historial: historial
    });

    mensajeAsig.textContent = '✔ ' + id + ' asignada a ' + responsable;
    mensajeAsig.hidden = false;

    formAsignar.reset();
    if (fechaAsig) fechaAsig.value = new Date().toISOString().split('T')[0];

    renderSinAsignar();
    renderTecnicos();
  });

  /* ---------- Enviar formulario de técnico ---------- */

  formTecnico.addEventListener('submit', e => {
    e.preventDefault();

    const nombre = formTecnico['nombre-tecnico'].value.trim();
    const area   = formTecnico['area-tecnico'].value.trim();

    if (!nombre) return;

    const nuevo = agregarTecnico({
      nombre: nombre,
      area: area || 'Soporte Nivel 1'
    });

    mensajeTec.textContent = '✔ Técnico ' + nuevo.nombre + ' agregado.';
    mensajeTec.hidden = false;

    formTecnico.reset();
    renderTecnicos();
  });

  /* ---------- Eliminar técnico ---------- */

  tbodyTecnicos.addEventListener('click', e => {
    if (!e.target.classList.contains('btn-eliminar')) return;
    const id = e.target.dataset.id;
    if (!confirm('¿Eliminar este técnico?')) return;

    const lista = cargarTecnicos().filter(t => t.id !== id);
    guardarTecnicos(lista);
    renderTecnicos();
  });

  /* ---------- Init ---------- */

  if (fechaAsig && !fechaAsig.value) {
    fechaAsig.value = new Date().toISOString().split('T')[0];
  }

  renderSinAsignar();
  renderTecnicos();
});