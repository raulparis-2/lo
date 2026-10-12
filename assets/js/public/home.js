(async function () {
  await renderHeaderFooter("inicio");

  // ---- Hero / perfil ----
  const { data: profile } = await window.supabaseClient
    .from("profile")
    .select("name, description, main_image_url")
    .eq("id", 1)
    .single();

  if (profile) {
    document.title = profile.name ? `${profile.name} — Inicio` : "Inicio";
    document.getElementById("hero-name").textContent = profile.name || "Autor & Músico";
    document.getElementById("hero-desc").textContent = profile.description || "";
    if (profile.main_image_url) {
      const img = document.getElementById("hero-image");
      img.src = publicMediaUrl(profile.main_image_url);
      img.alt = profile.name || "";
      img.style.display = "block";
    }
  }

  // ---- Libros (3 más recientes) ----
  const { data: books } = await window.supabaseClient
    .from("books")
    .select("title, subtitle, year, cover_url, slug")
    .eq("visible", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(3);

  const booksEl = document.getElementById("home-books");
  if (!books || books.length === 0) {
    booksEl.innerHTML = `<p class="empty-state">Todavía no hay libros publicados.</p>`;
  } else {
    booksEl.innerHTML = books.map(b => `
      <a class="book-card" href="/libro/index.html?slug=${encodeURIComponent(b.slug)}">
        <div class="book-card__cover">
          ${b.cover_url ? `<img src="${publicMediaUrl(b.cover_url)}" alt="${escapeHtml(b.title)}" loading="lazy">` : ""}
        </div>
        <div class="book-card__title">${escapeHtml(b.title)}</div>
        ${b.subtitle ? `<div class="book-card__subtitle">${escapeHtml(b.subtitle)}</div>` : ""}
        ${b.year ? `<div class="book-card__year">${b.year}</div>` : ""}
      </a>`).join("");
  }

  // ---- Música: categorías (igual que en /musica.html) ----
  const CATEGORIES = ["Discografía propia", "Producción y composición", "B.S.O.", "Sueña cantando"];

  const { data: music } = await window.supabaseClient
    .from("music")
    .select("type")
    .eq("visible", true);

  const counts = {};
  (music || []).forEach(m => {
    const key = m.type && CATEGORIES.includes(m.type.trim()) ? m.type.trim() : null;
    if (key) counts[key] = (counts[key] || 0) + 1;
  });

  const musicEl = document.getElementById("home-music");
  musicEl.innerHTML = CATEGORIES.map(cat => `
    <a class="category-card" href="/musica-categoria/index.html?tipo=${encodeURIComponent(cat)}">
      <div class="category-card__title">${escapeHtml(cat)}</div>
      <div class="category-card__count">${counts[cat] ? `${counts[cat]} trabajo${counts[cat] > 1 ? "s" : ""}` : "Próximamente"}</div>
    </a>`).join("");
})();
