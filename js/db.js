/* ============================================================
   DB.JS — Cliente Supabase + helpers de visualización
   ------------------------------------------------------------
   Si CONFIG.SUPABASE_URL y SUPABASE_ANON_KEY están rellenos,
   la app usa Supabase real. Si no, funciona en modo demo
   (localStorage). No hace falta tocar nada más.
   ============================================================ */

const USE_SUPABASE = !!(CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY && window.supabase);

const SB = USE_SUPABASE
  ? window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY)
  : null;

/* Paleta de avatares (debe coincidir con las clases .avatar-* del CSS) */
const AVATAR_PALETTE = ["indigo", "pink", "amber", "green", "blue", "coral", "purple", "teal"];

/* Iniciales a partir del nombre: "Marta Ferrer" → "MF" */
function makeInitials(name) {
  const parts = String(name || "?").trim().split(/\s+/);
  const a = parts[0] ? parts[0][0] : "?";
  const b = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (a + b).toUpperCase();
}

/* Color determinista a partir de una semilla (email o nombre) */
function pickColor(seed) {
  const s = String(seed || "");
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return AVATAR_PALETTE[h % AVATAR_PALETTE.length];
}
