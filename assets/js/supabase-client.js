/* Cliente Supabase compartido por toda la web (pública y admin).
   Requiere que config.js y el script de @supabase/supabase-js se
   carguen antes que este archivo. */

window.supabaseClient = supabase.createClient(
  window.SITE_CONFIG.SUPABASE_URL,
  window.SITE_CONFIG.SUPABASE_ANON_KEY
);

/* Devuelve la URL pública de un archivo guardado en el bucket de medios. */
function publicMediaUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path; // ya es una URL completa
  const { data } = window.supabaseClient
    .storage
    .from(window.SITE_CONFIG.MEDIA_BUCKET)
    .getPublicUrl(path);
  return data.publicUrl;
}
