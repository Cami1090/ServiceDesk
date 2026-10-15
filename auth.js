/* ===========================================================
   auth.js · Login con Google usando Supabase Auth
   =========================================================== */

import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './config.js';


const btnLogin = document.getElementById('auth-login');
const btnLogout = document.getElementById('auth-logout');
const usuarioSpan = document.getElementById('auth-usuario');


const protocoloOk = window.location.protocol === 'http:' || window.location.protocol === 'https:';
const noEsIframe = window.top === window.self;
const configOk = !SUPABASE_URL.includes('TU_PROYECTO')
  && !SUPABASE_PUBLISHABLE_KEY.includes('PEGA_AQUI');

let cliente = null;

/* ---------- UI ---------- */

function mostrarUsuario(user) {
  const haySesion = Boolean(user);

  if (usuarioSpan) {
    usuarioSpan.textContent = haySesion ? (user.email || user.id) : '';
    usuarioSpan.hidden = !haySesion;
  }
  if (btnLogin) btnLogin.hidden = haySesion;
  if (btnLogout) btnLogout.hidden = !haySesion;
}

function deshabilitarLogin(mensaje) {
  if (!btnLogin) return;
  btnLogin.disabled = true;
  btnLogin.title = mensaje;
  btnLogin.textContent = 'Login no disponible';
}

/* ---------- Inicialización ---------- */

async function iniciar() {
  if (!protocoloOk || !noEsIframe) {
    console.warn('[auth] Abre la app con Live Server en una pestaña normal.');
    deshabilitarLogin('Usa Live Server en una pestaña normal.');
    return;
  }

  if (!configOk) {
    console.warn('[auth] Configura config.js con tu URL y clave de Supabase.');
    deshabilitarLogin('Configura config.js con tus credenciales.');
    return;
  }

  if (!window.supabase) {
    console.warn('[auth] El SDK de Supabase no se cargó (revisa el CDN).');
    deshabilitarLogin('El SDK de Supabase no se cargó.');
    return;
  }

  /* URL de retorno: debe estar autorizada en Supabase */
  const retorno = window.location.origin + window.location.pathname;

  cliente = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      flowType: 'implicit',
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });

  /* Escucha los cambios de sesión (login, logout, refresh) */
  cliente.auth.onAuthStateChange((evento, sesion) => {
    mostrarUsuario(sesion ? sesion.user : null);

    if (evento === 'SIGNED_IN') console.log('[auth] Sesión iniciada');
    if (evento === 'SIGNED_OUT') console.log('[auth] Sesión cerrada');
  });

  /* ---------- Login ---------- */

  if (btnLogin) {
    btnLogin.addEventListener('click', async () => {
      btnLogin.disabled = true;
      btnLogin.textContent = 'Conectando…';

      try {
        const { error } = await cliente.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: retorno }
        });
        if (error) throw error;
      } catch (error) {
        console.error('[auth] No se pudo iniciar OAuth:', error.message);
        alert('No se pudo iniciar sesión con Google: ' + error.message);
      } finally {
        btnLogin.disabled = false;
        btnLogin.textContent = 'Iniciar sesión con Google';
      }
    });
  }

  /* ---------- Logout ---------- */

  if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
      btnLogout.disabled = true;
      try {
        const { error } = await cliente.auth.signOut({ scope: 'local' });
        if (error) throw error;
        mostrarUsuario(null);
      } catch (error) {
        console.error('[auth] No se pudo cerrar sesión:', error.message);
        alert('No se pudo cerrar sesión: ' + error.message);
      } finally {
        btnLogout.disabled = false;
      }
    });
  }

  /* ---------- Comprobar sesión al cargar ---------- */

  try {
    const { data, error } = await cliente.auth.getUser();
    if (error && error.name !== 'AuthSessionMissingError') throw error;
    mostrarUsuario(data.user || null);
  } catch (error) {
    console.warn('[auth] No se pudo comprobar la sesión:', error.message);
  }
}

iniciar();