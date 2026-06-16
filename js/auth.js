/* ============================================================
   AUTH.JS — Autenticación del panel interno
   ------------------------------------------------------------
   • Demo:     selector de cuenta del equipo (simula Google).
   • Supabase: inicio de sesión real con Google (OAuth).
   La interfaz pública es la misma en ambos modos. El usuario
   actual se cachea en memoria y se lee de forma sincrónica con
   current(), para no romper el render de la app.
   ============================================================ */

const Auth = (() => {
  let currentUser = null;

  function toUser(u) {
    const meta = u.user_metadata || {};
    const name = meta.full_name || meta.name || u.email;
    return {
      userId: u.id,
      name,
      email: u.email,
      initials: makeInitials(name),
      color: pickColor(u.email || u.id),
      rol: meta.rol || "Equipo",
    };
  }

  async function init() {
    if (USE_SUPABASE) {
      const { data } = await SB.auth.getSession();
      currentUser = data && data.session ? toUser(data.session.user) : null;
      // Si la sesión cambia en otra pestaña, recargamos para re-sincronizar.
      SB.auth.onAuthStateChange((event) => {
        if (event === "SIGNED_OUT") { currentUser = null; }
      });
    } else {
      currentUser = Store.getSession();
    }
  }

  const current = () => currentUser;
  const isAuthed = () => !!currentUser;

  /* --- Modo Supabase --- */
  async function signInWithGoogle() {
    await SB.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.href.split("#")[0] },
    });
  }

  /* --- Modo demo --- */
  function signInAs(memberId) {
    const m = Store.getMember(memberId);
    if (!m) return null;
    currentUser = {
      userId: m.id, name: m.name, email: m.email,
      initials: m.initials, color: m.color, rol: m.rol, at: Date.now(),
    };
    Store.setSession(currentUser);
    return currentUser;
  }

  async function signOut() {
    if (USE_SUPABASE) await SB.auth.signOut();
    else Store.clearSession();
    currentUser = null;
  }

  return { init, current, isAuthed, signInWithGoogle, signInAs, signOut };
})();
