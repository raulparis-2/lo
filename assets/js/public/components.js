/* Cabecera y pie de página compartidos por todas las páginas públicas.
   Se insertan en los contenedores #site-header y #site-footer y usan
   la variable global PAGE (definida en cada página) para marcar el
   enlace activo del menú. */

const NAV_LINKS = [
  { href: "/", label: "Inicio", key: "inicio" },
  { href: "/sobre-mi.html", label: "Sobre mí", key: "sobre-mi" },
  { href: "/musica.html", label: "Música", key: "musica" },
  { href: "/libros.html", label: "Literatura", key: "libros" },
  { href: "/la-caja-mom.html", label: "La Caja Mom", key: "caja-mom" },
  { href: "/contacto.html", label: "Contactar", key: "contacto" }
];

function navHtml(activeKey) {
  return NAV_LINKS.map(l =>
    `<a href="${l.href}" class="${l.key === activeKey ? "is-active" : ""}">${l.label}</a>`
  ).join("");
}

async function renderHeaderFooter(activeKey) {
  const header = document.getElementById("site-header");
  const footer = document.getElementById("site-footer");

  let name = "LANGA";
  let email = "";
  let social = {};

  try {
    const { data } = await window.supabaseClient
      .from("profile")
      .select("name, email, social_links")
      .eq("id", 1)
      .single();
    if (data) {
      name = data.name || name;
      email = data.email || "";
      social = data.social_links || {};
    }
  } catch (e) { /* usa valores por defecto si aún no hay datos */ }

  if (header) {
    header.innerHTML = `
      <div class="site-header__bar">
        <a href="/" class="site-header__name">${escapeHtml(name)}</a>
        <button class="nav-toggle" id="nav-toggle" aria-expanded="false">Menú</button>
        <nav class="site-nav" id="site-nav">${navHtml(activeKey)}</nav>
      </div>`;
    const toggle = document.getElementById("nav-toggle");
    const nav = document.getElementById("site-nav");
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  if (footer) {
    const socialLinks = Object.entries(social || {})
      .filter(([, v]) => v)
      .map(([k, v]) => `<a href="${escapeHtml(v)}" target="_blank" rel="noopener">${escapeHtml(k)}</a>`)
      .join("");
    footer.innerHTML = `
      <div class="container site-footer">
        <span>&copy; ${new Date().getFullYear()} ${escapeHtml(name)}</span>
        <div class="social-list">
          ${email ? `<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>` : ""}
          ${socialLinks}
        </div>
      </div>`;
  }
}
