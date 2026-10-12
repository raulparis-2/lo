/* Protege las páginas del panel: si no hay sesión iniciada, redirige
   al login. Debe cargarse en TODAS las páginas de /admin/ excepto
   login.html. Expone window.currentUser cuando la comprobación acaba. */

window.requireAuth = async function () {
  const { data: { session } } = await window.supabaseClient.auth.getSession();
  if (!session) {
    window.location.href = "/admin/login.html";
    return null;
  }
  window.currentUser = session.user;
  return session.user;
};

window.supabaseClient?.auth.onAuthStateChange((event) => {
  if (event === "SIGNED_OUT") {
    window.location.href = "/admin/login.html";
  }
});

async function logout() {
  await window.supabaseClient.auth.signOut();
  window.location.href = "/admin/login.html";
}
