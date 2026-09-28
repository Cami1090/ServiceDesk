/* ===========================================================
   registro.js · Guarda nuevas solicitudes en el almacén
   =========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const form    = document.getElementById('form-registro');
  const mensaje = document.getElementById('mensaje-registro');
  const fecha   = document.getElementById('fecha');

  /* Fecha por defecto: hoy */
  if (fecha && !fecha.value) {
    fecha.value = new Date().toISOString().split('T')[0];
  }

  form.addEventListener('submit', e => {
    e.preventDefault();

    const datos = {
      titulo:      form.titulo.value.trim(),
      solicitante: form.nombre.value.trim(),
      categoria:   form.categoria.value,
      prioridad:   form.prioridad.value,
      responsable: 'Sin asignar',
      estado:      'abierta',
      fecha:       form.fecha.value
    };

    const nueva = agregarSolicitud(datos);

    mensaje.textContent = '✔ Solicitud ' + nueva.id + ' registrada correctamente.';
    mensaje.hidden = false;

    form.reset();
    if (fecha) fecha.value = new Date().toISOString().split('T')[0];
  });
});