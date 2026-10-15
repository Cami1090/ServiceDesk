/* ===========================================================
   index.js · Resumen dinámico del inicio (módulo ES)
   =========================================================== */

import { cargarSolicitudes, etiqueta } from './data.js';

document.addEventListener('DOMContentLoaded', () => {

  const statsCards     = document.getElementById('stats-cards');
  const tbodyRecientes = document.getElementById('tbody-recientes');
  const contadorIndex  = document.getElementById('contador-index');

  const solicitudes = cargarSolicitudes();

  /* ---------- Tarjetas de resumen ---------- */

  function contarPorEstado(estado) {
    return solicitudes.filter(s => s.estado === estado).length;
  }

  function contarSinAsignar() {
    return solicitudes.filter(s => !s.responsable || s.responsable === 'Sin asignar').length;
  }

  const stats = [
    { label: 'Total de solicitudes', valor: solicitudes.length,            clase: 'stat-total' },
    { label: 'Abiertas',             valor: contarPorEstado('abierta'),    clase: 'stat-abierta' },
    { label: 'En proceso',           valor: contarPorEstado('en-proceso'), clase: 'stat-proceso' },
    { label: 'Cerradas',             valor: contarPorEstado('cerrada'),    clase: 'stat-cerrada' },
    { label: 'Sin asignar',          valor: contarSinAsignar(),            clase: 'stat-sin-asignar' }
  ];

  statsCards.innerHTML = stats.map(s =>
    '<li class="stat-card ' + s.clase + '">' +
      '<span class="stat-valor">' + s.valor + '</span>' +
      '<span class="stat-label">' + s.label + '</span>' +
    '</li>'
  ).join('');

  /* ---------- Tabla de solicitudes recientes ---------- */

  const recientes = [...solicitudes]
    .sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''))
    .slice(0, 5);

  tbodyRecientes.innerHTML = '';

  if (!recientes.length) {
    tbodyRecientes.innerHTML =
      '<tr class="sin-resultados"><td colspan="7">Aún no hay solicitudes registradas.</td></tr>';
  } else {
    recientes.forEach(s => {
      tbodyRecientes.innerHTML +=
        '<tr>' +
          '<td data-label="ID">'          + s.id + '</td>' +
          '<td data-label="Solicitante">' + s.solicitante + '</td>' +
          '<td data-label="Categoría">'   + etiqueta('categoria', s.categoria) + '</td>' +
          '<td data-label="Prioridad">'   + etiqueta('prioridad', s.prioridad) + '</td>' +
          '<td data-label="Estado">'      + etiqueta('estado', s.estado) + '</td>' +
          '<td data-label="Responsable">' + (s.responsable || 'Sin asignar') + '</td>' +
          '<td data-label="Detalle"><a href="detalle.html?id=' + encodeURIComponent(s.id) + '">Ver</a></td>' +
        '</tr>';
    });
  }

  contadorIndex.textContent = 'Mostrando ' + recientes.length + ' de ' + solicitudes.length + ' solicitudes';
});