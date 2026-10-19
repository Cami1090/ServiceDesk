import { cargarSolicitudes, etiqueta, formatearId } from './data.js';
import { perfilActual } from './supabase-client.js';

document.addEventListener('DOMContentLoaded', async () => {
  const statsCards = document.getElementById('stats-cards');
  const tbody = document.getElementById('tbody-recientes');
  const contador = document.getElementById('contador-index');

  const perfil = await perfilActual();
  const todasLasSolicitudes = await cargarSolicitudes();
  const rol = perfil?.role || 'usuario';

  // Referencias al H2 y al botón inferior para adaptarlos
  const seccionTabla = tbody.closest('section');
  const h2Tabla = seccionTabla.querySelector('h2');
  const btnVerTodas = seccionTabla.querySelector('.btn-link');

  let solicitudesVisibles = [];
  let tituloTabla = '';

  // Adaptar lógica y título según el rol
  if (rol === 'tecnico') {
    solicitudesVisibles = todasLasSolicitudes.filter(s => s.responsable_id === perfil.id);
    tituloTabla = 'Mis asignaciones recientes';
    if (btnVerTodas) {
      btnVerTodas.textContent = 'Ir a Mis Asignaciones';
      btnVerTodas.href = 'tecnico.html';
    }
  } else if (rol === 'usuario') {
    solicitudesVisibles = todasLasSolicitudes.filter(s => s.solicitante_id === perfil.id);
    tituloTabla = 'Mis solicitudes recientes';
    if (btnVerTodas) {
      btnVerTodas.textContent = 'Ver mi historial completo';
      btnVerTodas.href = 'seguimiento.html';
    }
  } else {
    // Admin
    solicitudesVisibles = todasLasSolicitudes;
    tituloTabla = 'Todas las solicitudes recientes';
    if (btnVerTodas) {
      btnVerTodas.textContent = 'Ver todas las solicitudes';
      btnVerTodas.href = 'seguimiento.html';
    }
  }

  // Actualizar el título de la sección
  if (h2Tabla) h2Tabla.textContent = tituloTabla;

  // Renderizar las tarjetas de resumen (adaptadas al rol)
  let stats = [];
  if (rol === 'tecnico') {
    stats = [
      { label: 'Mis Asignadas', valor: solicitudesVisibles.length, clase: 'stat-total' },
      { label: 'En Proceso', valor: solicitudesVisibles.filter(s => s.estado === 'en-proceso').length, clase: 'stat-proceso' },
      { label: 'Cerradas', valor: solicitudesVisibles.filter(s => s.estado === 'cerrada').length, clase: 'stat-cerrada' }
    ];
  } else {
    stats = [
      { label: 'Total', valor: solicitudesVisibles.length, clase: 'stat-total' },
      { label: 'Abiertas', valor: solicitudesVisibles.filter(s => s.estado === 'abierta').length, clase: 'stat-abierta' },
      { label: 'En proceso', valor: solicitudesVisibles.filter(s => s.estado === 'en-proceso').length, clase: 'stat-proceso' },
      { label: 'Cerradas', valor: solicitudesVisibles.filter(s => s.estado === 'cerrada').length, clase: 'stat-cerrada' },
      { label: 'Sin asignar', valor: solicitudesVisibles.filter(s => !s.responsable_nombre && s.estado === 'abierta').length, clase: 'stat-sin-asignar' }
    ];
  }

  statsCards.innerHTML = stats.map(s => `
    <li class="stat-card ${s.clase}">
      <span class="stat-valor">${s.valor}</span>
      <span class="stat-label">${s.label}</span>
    </li>
  `).join('');

  // Renderizar la tabla (máximo 5 registros)
  const recientes = solicitudesVisibles.slice(0, 5);

  if (recientes.length === 0) {
    tbody.innerHTML = '<tr class="sin-resultados"><td colspan="7">No hay solicitudes para mostrar.</td></tr>';
  } else {
    tbody.innerHTML = recientes.map(s => `
      <tr>
        <td data-label="ID">${formatearId(s.id)}</td>
        <td data-label="Solicitante">${s.solicitante_nombre || '—'}</td>
        <td data-label="Categoría">${etiqueta('categoria', s.categoria)}</td>
        <td data-label="Prioridad">${etiqueta('prioridad', s.prioridad)}</td>
        <td data-label="Estado">${etiqueta('estado', s.estado)}</td>
        <td data-label="Responsable">${s.responsable_nombre || 'Sin asignar'}</td>
        <td data-label="Detalle"><a href="detalle.html?id=${s.id}">Ver</a></td>
      </tr>
    `).join('');
  }

  // Actualizar el contador inferior
  contador.textContent = `Mostrando las últimas ${recientes.length} de ${solicitudesVisibles.length} solicitudes`;
});