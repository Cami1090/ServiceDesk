import { cargarSolicitudes, etiqueta, formatearId } from './data.js';

document.addEventListener('DOMContentLoaded', async () => {
  const tbody = document.getElementById('tbody-solicitudes');
  const form = document.getElementById('form-filtros');
  const fEstado = document.getElementById('filtro-estado');
  const fCat = document.getElementById('filtro-categoria');
  const fPrior = document.getElementById('filtro-prioridad');
  const fResp = document.getElementById('filtro-responsable');
  const btnLimpiar = document.getElementById('btn-limpiar-filtros');
  const contador = document.getElementById('contador-resultados');

  const solicitudes = await cargarSolicitudes();

  function render() {
    const filtradas = solicitudes.filter(s => {
      if (fEstado.value !== 'todas' && s.estado !== fEstado.value) return false;
      if (fCat.value !== 'todas' && s.categoria !== fCat.value) return false;
      if (fPrior.value !== 'todas' && s.prioridad !== fPrior.value) return false;
      if (fResp.value.trim() && !(s.responsable_nombre || '').toLowerCase().includes(fResp.value.toLowerCase())) return false;
      return true;
    });

    tbody.innerHTML = filtradas.map(s => `
      <tr>
        <td data-label="ID">${formatearId(s.id)}</td>
        <td data-label="Solicitante">${s.solicitante_nombre}</td>
        <td data-label="Categoría">${etiqueta('categoria', s.categoria)}</td>
        <td data-label="Prioridad">${etiqueta('prioridad', s.prioridad)}</td>
        <td data-label="Responsable">${s.responsable_nombre || 'Sin asignar'}</td>
        <td data-label="Estado">${etiqueta('estado', s.estado)}</td>
        <td data-label="Fecha">${s.fecha}</td>
        <td data-label="Detalle"><a href="detalle.html?id=${s.id}">Ver</a></td>
      </tr>
    `).join('');

    contador.textContent = `${filtradas.length} de ${solicitudes.length} solicitudes`;
  }

  form.addEventListener('submit', e => { e.preventDefault(); render(); });
  [fEstado, fCat, fPrior].forEach(el => el.addEventListener('change', render));
  fResp.addEventListener('input', render);
  btnLimpiar.addEventListener('click', () => { form.reset(); render(); });
  render();
});