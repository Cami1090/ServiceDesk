/* ===========================================================
   seguimiento.js · Render + filtros dinámicos
   =========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const tbody             = document.getElementById('tbody-solicitudes');
  const formFiltros       = document.getElementById('form-filtros');
  const filtroEstado      = document.getElementById('filtro-estado');
  const filtroCategoria   = document.getElementById('filtro-categoria');
  const filtroPrioridad   = document.getElementById('filtro-prioridad');
  const filtroResponsable = document.getElementById('filtro-responsable');
  const btnLimpiar        = document.getElementById('btn-limpiar-filtros');
  const contador          = document.getElementById('contador-resultados');

  const solicitudes = cargarSolicitudes();

  function renderizar() {
    const estado      = filtroEstado.value;
    const categoria   = filtroCategoria.value;
    const prioridad   = filtroPrioridad.value;
    const responsable = filtroResponsable.value.trim().toLowerCase();

    const filtradas = solicitudes.filter(s => {
      if (estado !== 'todas' && s.estado !== estado) return false;
      if (categoria !== 'todas' && s.categoria !== categoria) return false;
      if (prioridad !== 'todas' && s.prioridad !== prioridad) return false;
      if (responsable && !String(s.responsable).toLowerCase().includes(responsable)) return false;
      return true;
    });

    tbody.innerHTML = '';

    if (!filtradas.length) {
      const tr = document.createElement('tr');
      tr.className = 'sin-resultados';
      const td = document.createElement('td');
      td.colSpan = 8;
      td.textContent = 'No hay solicitudes que coincidan con los filtros.';
      tr.appendChild(td);
      tbody.appendChild(tr);
    } else {
      filtradas.forEach(s => {
        const tr = document.createElement('tr');
        tr.innerHTML =
          '<td data-label="ID">' + s.id + '</td>' +
          '<td data-label="Solicitante">' + s.solicitante + '</td>' +
          '<td data-label="Categoría">' + etiqueta('categoria', s.categoria) + '</td>' +
          '<td data-label="Prioridad">' + etiqueta('prioridad', s.prioridad) + '</td>' +
          '<td data-label="Responsable">' + s.responsable + '</td>' +
          '<td data-label="Estado">' + etiqueta('estado', s.estado) + '</td>' +
          '<td data-label="Última actualización">' + s.fecha + '</td>' +
          '<td data-label="Detalle"><a href="detalle.html?id=' + encodeURIComponent(s.id) + '">Ver</a></td>';
        tbody.appendChild(tr);
      });
    }

    contador.textContent = filtradas.length + ' de ' + solicitudes.length + ' solicitudes';
  }

  /* Submit (botón Filtrar) */
  formFiltros.addEventListener('submit', e => {
    e.preventDefault();
    renderizar();
  });

  /* Filtrado en vivo */
  [filtroEstado, filtroCategoria, filtroPrioridad].forEach(el => {
    el.addEventListener('change', renderizar);
  });
  filtroResponsable.addEventListener('input', renderizar);

  /* Limpiar */
  btnLimpiar.addEventListener('click', () => {
    formFiltros.reset();
    renderizar();
  });

  renderizar();
});