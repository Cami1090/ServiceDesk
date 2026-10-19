import { cargarSolicitudes, cargarTecnicos, asignarSolicitud, etiqueta, formatearId } from './data.js';
import { esStaff } from './supabase-client.js';

document.addEventListener('DOMContentLoaded', async () => {
  const tbodySin = document.getElementById('tbody-sin-asignar');
  const selectSol = document.getElementById('id-solicitud');
  const selectResp = document.getElementById('responsable');
  const form = document.getElementById('form-asignacion');
  const msg = document.getElementById('mensaje-asignacion');

  const staff = await esStaff();
  if (!staff) {
    form.innerHTML = '<p class="mensaje mensaje-error">Solo técnicos y admins pueden asignar.</p>';
    return;
  }

  async function render() {
    const sols = await cargarSolicitudes();
    const tecs = await cargarTecnicos();
    const sinAsignar = sols.filter(s => !s.responsable_nombre);

    tbodySin.innerHTML = sinAsignar.map(s => `
      <tr>
        <td data-label="ID">${formatearId(s.id)}</td>
        <td data-label="Título">${s.titulo}</td>
        <td data-label="Prioridad">${etiqueta('prioridad', s.prioridad)}</td>
      </tr>
    `).join('');

    selectSol.innerHTML = '<option value="">Selecciona solicitud</option>' + 
      sinAsignar.map(s => `<option value="${s.id}">${formatearId(s.id)} — ${s.titulo}</option>`).join('');
      
    selectResp.innerHTML = '<option value="">Selecciona técnico</option>' + 
      tecs.map(t => `<option value="${t.id}">${t.nombre}</option>`).join('');
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const id = parseInt(selectSol.value);
    const respId = selectResp.value;
    const tec = (await cargarTecnicos()).find(t => t.id === respId);
    
    if (!id || !tec) return;

    await asignarSolicitud(id, {
      responsable_id: tec.id,
      responsable_nombre: tec.nombre,
      equipo: form.equipo.value.trim(),
      prioridad: form['prioridad-asignada'].value,
      notas: form['notas-asignacion'].value.trim()
    });

    msg.textContent = `✔ Asignada a ${tec.nombre}`;
    msg.hidden = false;
    form.reset();
    await render();
  });

  render();
});