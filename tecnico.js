import { perfilActual } from './supabase-client.js';
import { etiqueta, formatearId } from './data.js';
import { cliente } from './supabase-client.js';

document.addEventListener('DOMContentLoaded', async () => {
  const tbody = document.getElementById('tbody-asignadas');
  const perfil = await perfilActual();

  // Si es usuario normal, lo pateamos (no debería estar aquí)
  if (!perfil || perfil.role === 'usuario') {
    window.location.href = 'index.html';
    return;
  }

  // Consulta a Supabase filtrando por el ID del técnico
  const { data: solicitudes, error } = await cliente
    .from('solicitudes')
    .select('*')
    .eq('responsable_id', perfil.id)
    .neq('estado', 'cerrada') // Solo las que no están cerradas
    .order('id', { ascending: false });

  if (error) {
    console.error(error);
    tbody.innerHTML = '<tr><td colspan="6">Error al cargar las tareas.</td></tr>';
    return;
  }

  if (!solicitudes || solicitudes.length === 0) {
    tbody.innerHTML = '<tr class="sin-resultados"><td colspan="6">No tienes solicitudes pendientes asignadas. </td></tr>';
    return;
  }

  tbody.innerHTML = solicitudes.map(s => `
    <tr>
      <td data-label="ID">${formatearId(s.id)}</td>
      <td data-label="Título">${s.titulo}</td>
      <td data-label="Solicitante">${s.solicitante_nombre}</td>
      <td data-label="Prioridad">${etiqueta('prioridad', s.prioridad)}</td>
      <td data-label="Estado">${etiqueta('estado', s.estado)}</td>
      <td data-label="Acción">
        <a href="detalle.html?id=${s.id}" class="btn-link" style="padding: 6px 12px; font-size: 12px;">Gestionar</a>
      </td>
    </tr>
  `).join('');
});