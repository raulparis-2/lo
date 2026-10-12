/* Funciones de utilidad compartidas. */

function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function slugify(text) {
  return String(text)
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80) || "item";
}

async function uniqueSlug(table, base) {
  let slug = slugify(base);
  let candidate = slug;
  let n = 2;
  while (true) {
    const { data } = await window.supabaseClient
      .from(table)
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();
    if (!data) return candidate;
    candidate = `${slug}-${n}`;
    n++;
  }
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + (dateStr.length === 10 ? "T00:00:00" : ""));
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
}

function qs(param) {
  return new URLSearchParams(window.location.search).get(param);
}

function showToast(msg, isError) {
  document.querySelectorAll(".toast").forEach(t => t.remove());
  const el = document.createElement("div");
  el.className = "toast" + (isError ? " is-error" : "");
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

/* Sube un archivo de imagen al bucket de medios y devuelve su ruta guardable. */
async function uploadImage(file, folder) {
  if (!file) return null;
  const ext = file.name.split(".").pop();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await window.supabaseClient
    .storage
    .from(window.SITE_CONFIG.MEDIA_BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) throw error;
  return path;
}

function linkIfPresent(url, label) {
  if (!url) return "";
  return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener">${label}</a>`;
}
