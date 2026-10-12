// Vercel Cron llama a esta función una vez al día (ver vercel.json).
// Hace una consulta REAL a la API REST de Supabase para que el proyecto
// gratuito no se pause por inactividad (~7 días sin peticiones a su API).

const SUPABASE_URL =
  process.env.SUPABASE_URL || "https://yzlaqlyrchnlndjasivu.supabase.co";
// Clave "publishable" (pública, la misma que ya está en assets/js/config.js)
const SUPABASE_KEY =
  process.env.SUPABASE_ANON_KEY || "sb_publishable_8iBB3feqZzTwpWiL_Shc_Q_65Z4NZdn";

module.exports = async (req, res) => {
  // Si defines CRON_SECRET en Vercel, solo responde a su cron.
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.authorization !== `Bearer ${secret}`) {
    return res.status(401).json({ ok: false, error: "No autorizado" });
  }

  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/profile?select=id&limit=1`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    const ok = r.status === 200;
    console.log(`Supabase respondió ${r.status}`);
    return res.status(ok ? 200 : 502).json({ ok, supabaseStatus: r.status });
  } catch (e) {
    console.error("Error al consultar Supabase:", e);
    return res.status(500).json({ ok: false, error: String(e) });
  }
};
