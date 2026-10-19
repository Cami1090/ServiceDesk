import { agregarSolicitud, formatearId } from './data.js';
import { usuarioActual } from './supabase-client.js';

document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('form-registro');
  const mensaje = document.getElementById('mensaje-registro');
  const fecha = document.getElementById('fecha');

  // Si no encuentra el form, detenemos la ejecución para que no falle
  if (!form) {
    console.error("No se encontró el formulario con id 'form-registro'");
    return;
  }

  if (fecha && !fecha.value) fecha.value = new Date().toISOString().split('T')[0];

  // 1. Bloqueamos el envío tradicional inmediatamente
  form.addEventListener('submit', (e) => {
    e.preventDefault(); 
  });

  // 2. Llenar datos del usuario
  try {
    const user = await usuarioActual();
    if (user) {
      const correo = user.email || '';
      const nombre = user.user_metadata?.full_name || user.user_metadata?.name || correo.split('@')[0];
      
      if (form.nombre) { form.nombre.value = nombre; form.nombre.readOnly = true; }
      if (form.correo) { form.correo.value = correo; form.correo.readOnly = true; }
    } else {
      form.innerHTML = '<p class="mensaje mensaje-error">Debes iniciar sesión. <a href="login.html">Ir al Login</a></p>';
      return;
    }
  } catch (err) {
    console.error("Error al cargar usuario:", err);
  }

  // 3. Manejar el envío con JS
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!form.nombre.value) {
      alert("Espera un momento, validando tu cuenta...");
      return;
    }

    const datos = {
      titulo: form.titulo.value.trim(),
      descripcion: form.descripcion.value.trim(),
      categoria: form.categoria.value,
      prioridad: form.prioridad.value,
      fecha: form.fecha.value
    };

    try {
      const nueva = await agregarSolicitud(datos);
      mensaje.textContent = `✔ Solicitud ${formatearId(nueva.id)} registrada con éxito.`;
      mensaje.hidden = false;
      
      // Limpiar el formulario excepto los campos de usuario
      form.titulo.value = '';
      form.descripcion.value = '';
      form.categoria.value = '';
      form.prioridad.value = '';
      if (fecha) fecha.value = new Date().toISOString().split('T')[0];
      
    } catch (err) {
      console.error(err);
      alert('Error al registrar: ' + err.message);
    }
  });
});