import { cliente } from './supabase-client.js';

document.addEventListener('DOMContentLoaded', async () => {
  const btnLogin = document.getElementById('auth-login');
  const mensaje = document.getElementById('mensaje-login');

  // Si ya hay sesión activa, saltamos directo a la app
  const { data: { session } } = await cliente.auth.getSession();
  if (session) {
    window.location.href = 'index.html';
    return;
  }

  btnLogin.addEventListener('click', async () => {
    btnLogin.disabled = true;
    btnLogin.textContent = 'Conectando con Google...';
    
    // Guardamos a dónde quería ir el usuario antes de ser redirigido (opcional)
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get('redirect') || 'index.html';

    try {
      const { error } = await cliente.auth.signInWithOAuth({
        provider: 'google',
        // Supabase lo devolverá aquí después de Google
        options: { redirectTo: window.location.origin + '/login.html' }
      });
      if (error) throw error;
    } catch (error) {
      mensaje.textContent = 'Error al iniciar sesión: ' + error.message;
      mensaje.hidden = false;
      btnLogin.disabled = false;
      btnLogin.textContent = 'Continuar con Google';
    }
  });
});