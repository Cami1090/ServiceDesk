/* ===========================================================
   supabase-client.js · Cliente único + helpers de sesión
   =========================================================== */

import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './config.js';

export const cliente = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      flowType: 'implicit',
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

export async function usuarioActual() {
  const { data, error } = await cliente.auth.getUser();
  if (error && error.name !== 'AuthSessionMissingError') return null;
  return data.user || null;
}

export async function perfilActual() {
  const user = await usuarioActual();
  if (!user) return null;
  const { data, error } = await cliente.from('profiles').select('*').eq('id', user.id).maybeSingle();
  if (error) return null;
  return data;
}

export async function esAdmin() {
  const p = await perfilActual();
  return p?.role === 'admin';
}

export async function esStaff() {
  const p = await perfilActual();
  return p?.role === 'admin' || p?.role === 'tecnico';
}