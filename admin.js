import { cargarPerfiles, actualizarRol } from './data.js';
import { perfilActual } from './supabase-client.js';

document.addEventListener('DOMContentLoaded', async () => {
  const tbody = document.getElementById('tbody-usuarios');
  const yo = await perfilActual();

  if (!yo || yo.role !== 'admin') {
    tbody.innerHTML = '<tr><td colspan="4">Acceso denegado. Solo administradores.</td></tr>';
    return;
  }

  async function render() {
    const perfiles = await cargarPerfiles();
    tbody.innerHTML = perfiles.map(p => `
      <tr>
        <td data-label="Nombre">${p.nombre}</td>
        <td data-label="Correo">${p.email}</td>
        <td data-label="Rol">
          <select class="select-rol" data-id="${p.id}" ${p.id === yo.id ? 'disabled' : ''}>
            <option value="usuario" ${p.role === 'usuario' ? 'selected' : ''}>Usuario</option>
            <option value="tecnico" ${p.role === 'tecnico' ? 'selected' : ''}>Técnico</option>
            <option value="admin" ${p.role === 'admin' ? 'selected' : ''}>Admin</option>
          </select>
        </td>
        <td>${p.id === yo.id ? '(Tú)' : ''}</td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.select-rol').forEach(sel => {
      sel.addEventListener('change', async e => {
        await actualizarRol(e.target.dataset.id, e.target.value);
      });
    });
  }
  render();
});