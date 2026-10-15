/* ===========================================================
   detalle.js · Detalle, avances y cierre (módulo ES)
   =========================================================== */

import {
  obtenerSolicitudPorId,
  actualizarSolicitud,
  agregarAvance,
  etiqueta
} from './data.js';

document.addEventListener('DOMContentLoaded', () => {

  const params = new URLSearchParams(window.location.search);
  const id     = params.get('id') || '';

  const h1               = document.getElementById('detalle-titulo');
  const tbodyDatos       = document.getElementById('tbody-datos');
  const listaHistorial   = document.getElementById('lista-historial');
  const formAvance       = document.getElementById('form-avance');
  const formCierre       = document.getElementById('form-cierre');
  const mensajeDet       = document.getElementById('mensaje-detalle');
  const fechaCierreInput = document.getElementById('fecha-cierre');
  const seccionAvance    = document.getElementById('seccion-avance');
  const seccionCierre    = document.getElementById('seccion-cierre');

  /* ---------- Render ---------- */

  function render() {
    const s = id ? obtenerSolicitudPorId(id) : null;

    if (!s) {
      h1.textContent = 'Solicitud no encontrada';
      tbodyDatos.innerHTML = '';
      listaHistorial.innerHTML = '';
      seccionAvance.hidden = true;
      seccionCierre.hidden = true;

      const cont = document.querySelector('main');
      const aviso = document.createElement('section');
      aviso.innerHTML =
        '<h2>No hay ninguna solicitud con ese ID</h2>' +
        '<p>Verifica el enlace o vuelve al listado de seguimiento.</p>' +
        '<div class="acciones-form">' +
          '<a href="seguimiento.html" class="btn-link">Volver al seguimiento</a>' +
        '</div>';
      cont.appendChild(aviso);
      return;
    }

    h1.textContent = 'Detalle de la solicitud ' + s.id;

    tbodyDatos.innerHTML =
      '<tr><th scope="row">Título</th><td>'         + s.titulo + '</td></tr>' +
      '<tr><th scope="row">Solicitante</th><td>'    + s.solicitante + '</td></tr>' +
      '<tr><th scope="row">Categoría</th><td>'      + etiqueta('categoria', s.categoria) + '</td></tr>' +
      '<tr><th scope="row">Prioridad</th><td>'      + etiqueta('prioridad', s.prioridad) + '</td></tr>' +
      '<tr><th scope="row">Responsable</th><td>'    + (s.responsable || 'Sin asignar') + '</td></tr>' +
      '<tr><th scope="row">Equipo / Área</th><td>'  + (s.equipo || '—') + '</td></tr>' +
      '<tr><th scope="row">Estado actual</th><td>'  + etiqueta('estado', s.estado) + '</td></tr>' +
      '<tr><th scope="row">Fecha de reporte</th><td>' + s.fecha + '</td></tr>' +
      (s.solucion
        ? '<tr><th scope="row">Solución</th><td>' + s.solucion + '</td></tr>'
        : '') +
      (s.fechaCierre
        ? '<tr><th scope="row">Fecha de cierre</th><td>' + s.fechaCierre + '</td></tr>'
        : '') +
      (s.satisfaccion
        ? '<tr><th scope="row">Satisfacción</th><td>' + etiqueta('satisfaccion', s.satisfaccion) + '</td></tr>'
        : '');

    listaHistorial.innerHTML = '';
    const hist = s.historial || [];
    if (!hist.length) {
      listaHistorial.innerHTML = '<li>Sin eventos registrados</li>';
    } else {
      hist.forEach(h => {
        listaHistorial.innerHTML +=
          '<li>' + h.texto + ' <small>(' + h.fecha + ')</small></li>';
      });
    }

    if (s.estado === 'cerrada') {
      seccionAvance.hidden = true;
      seccionCierre.hidden = true;
      mensajeDet.textContent = 'Esta solicitud está cerrada. Solo lectura.';
      mensajeDet.hidden = false;
    } else {
      seccionAvance.hidden = false;
      seccionCierre.hidden = false;
    }
  }

  /* ---------- Guardar avance ---------- */

  formAvance.addEventListener('submit', e => {
    e.preventDefault();

    const comentario  = formAvance.comentario.value.trim();
    const nuevoEstado = formAvance['nuevo-estado'].value;

    if (!comentario) return;

    agregarAvance(id, comentario, nuevoEstado);

    formAvance.reset();
    mensajeDet.textContent = '✔ Avance guardado.';
    mensajeDet.hidden = false;
    render();
  });

  /* ---------- Cerrar solicitud ---------- */

  formCierre.addEventListener('submit', e => {
    e.preventDefault();

    const solucion     = formCierre.solucion.value.trim();
    const fechaCierre  = formCierre['fecha-cierre'].value;
    const satisfaccion = formCierre.satisfaccion.value;

    if (!solucion) return;

    const s = obtenerSolicitudPorId(id);
    if (!s) return;

    const historial = s.historial || [];
    historial.push({
      fecha: fechaCierre,
      texto: 'Solicitud cerrada. Solución: ' + solucion +
             (satisfaccion ? ' · Satisfacción: ' + etiqueta('satisfaccion', satisfaccion) : '')
    });

    actualizarSolicitud(id, {
      estado: 'cerrada',
      solucion: solucion,
      fechaCierre: fechaCierre,
      satisfaccion: satisfaccion,
      historial: historial
    });

    formCierre.reset();
    mensajeDet.textContent = '✔ Solicitud cerrada correctamente.';
    mensajeDet.hidden = false;
    render();
  });

  /* ---------- Init ---------- */

  if (fechaCierreInput && !fechaCierreInput.value) {
    fechaCierreInput.value = new Date().toISOString().split('T')[0];
  }

  render();
});