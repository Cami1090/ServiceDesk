import { cliente, usuarioActual, perfilActual } from './supabase-client.js';

const btnLogout = document.getElementById('auth-logout');
const usuarioSpan = document.getElementById('auth-usuario');

function mostrarUsuario(user, perfil) {
  if (usuarioSpan) {
    usuarioSpan.textContent = user ? `${perfil?.nombre || user.email} (${perfil?.role || 'usuario'})` : '';
    usuarioSpan.hidden = !user;
  }
  if (btnLogout) btnLogout.hidden = !user;

  const rol = perfil?.role || 'usuario';
  
  // 1. Ocultamos TODAS las opciones dinámicas primero
  document.querySelectorAll('.nav-admin, .nav-asignacion, .nav-tecnico, .nav-registro, .nav-seguimiento')
    .forEach(el => el.hidden = true);

  // 2. Mostramos según el rol
  if (rol === 'admin') {
    document.querySelectorAll('.nav-admin, .nav-asignacion, .nav-tecnico, .nav-registro, .nav-seguimiento')
      .forEach(el => el.hidden = false);
  } else if (rol === 'tecnico') {
    // El técnico solo ve "Mis Asignaciones"
    document.querySelectorAll('.nav-tecnico').forEach(el => el.hidden = false);
  } else {
    // El usuario normal ve Registrar y Seguimiento (sus propios tickets)
    document.querySelectorAll('.nav-registro, .nav-seguimiento').forEach(el => el.hidden = false);
  }
}

async function iniciar() {
  const user = await usuarioActual();
  const isLoginPage = window.location.pathname.endsWith('login.html');

  if (!user && !isLoginPage) {
    window.location.href = 'login.html';
    return;
  }

  if (user && isLoginPage) {
    window.location.href = 'index.html';
    return;
  }

  if (user) {
    const perfil = await perfilActual();
    mostrarUsuario(user, perfil);
  }

  cliente.auth.onAuthStateChange(async (evento, sesion) => {
    if (evento === 'SIGNED_OUT') {
      window.location.href = 'login.html';
    } else if (evento === 'SIGNED_IN') {
      const p = await perfilActual();
      mostrarUsuario(sesion.user, p);
    }
  });

  if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
      btnLogout.disabled = true;
      await cliente.auth.signOut({ scope: 'local' });
    });
  }
}

iniciar();