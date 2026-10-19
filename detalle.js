import { obtenerSolicitudPorId, cargarHistorial, agregarAvance, cerrarSolicitud, etiqueta, formatearId } from './data.js';
import { esStaff } from './supabase-client.js';

document.addEventListener('DOMContentLoaded', async () => {
  const id = parseInt(new URLSearchParams(window.location.search).get('id'), 10);
  const h1 = document.getElementById('detalle-titulo');
  const tbody = document.getElementById('tbody-datos');
  const lista = document.getElementById('lista-historial');
  const formAvance = document.getElementById('form-avance');
  const formCierre = document.getElementById('form-cierre');
  const msg = document.getElementById('mensaje-detalle');
  const seccionAvance = document.getElementById('seccion-avance');
  const seccionCierre = document.getElementById('seccion-cierre');

  async function render() {
    const s = await obtenerSolicitudPorId(id);
    if (!s) return h1.textContent = 'No encontrada';
    h1.textContent = `Detalle ${formatearId(s.id)}`;

    tbody.innerHTML = `
      <tr><th>Título</th><td>${s.titulo}</td></tr>
      <tr><th>Solicitante</th><td>${s.solicitante_nombre}</td></tr>
      <tr><th>Categoría</th><td>${etiqueta('categoria', s.categoria)}</td></tr>
      <tr><th>Estado</th><td>${etiqueta('estado', s.estado)}</td></tr>
      <tr><th>Responsable</th><td>${s.responsable_nombre || 'Sin asignar'}</td></tr>
      ${s.cerrado_por_nombre ? `<tr><th>Cerrada por</th><td>${s.cerrado_por_nombre}</td></tr>` : ''}
    `;

    const hist = await cargarHistorial(id);
    lista.innerHTML = hist.map(h => `<li>${h.texto} <small>(${new Date(h.fecha).toLocaleDateString()} - ${h.autor_nombre})</small></li>`).join('');

    const staff = await esStaff();
    if (!staff || s.estado === 'cerrada') {
      seccionAvance.hidden = true;
      seccionCierre.hidden = true;
      msg.hidden = false;
      msg.textContent = s.estado === 'cerrada' ? 'Solicitud cerrada.' : 'Solo lectura.';
    } else {
      seccionAvance.hidden = false;
      seccionCierre.hidden = false;
    }
  }

  formAvance.addEventListener('submit', async e => {
    e.preventDefault();
    await agregarAvance(id, formAvance.comentario.value.trim(), formAvance['nuevo-estado'].value);
    formAvance.reset(); await render();
  });

  formCierre.addEventListener('submit', async e => {
    e.preventDefault();
    await cerrarSolicitud(id, {
      solucion: formCierre.solucion.value.trim(),
      fecha_cierre: formCierre['fecha-cierre'].value,
      satisfaccion: formCierre.satisfaccion.value
    });
    formCierre.reset(); await render();
  });

  render();
});