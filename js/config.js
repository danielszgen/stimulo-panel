/* ============================================================
   CONFIG.JS — Configuración del panel interno de Stimulo
   ------------------------------------------------------------
   Si dejas SUPABASE_URL y SUPABASE_ANON_KEY vacíos, la app
   funciona en MODO DEMO (datos locales, login simulado).

   Para activar Supabase real (login con Google + base de datos):
     1) Crea un proyecto en https://supabase.com
     2) Ejecuta supabase/schema.sql en el SQL Editor
     3) Activa Auth → Providers → Google
     4) Pega aquí la URL y la anon key (Settings → API)
   En cuanto los dos campos tengan valor, la app usa Supabase.

   ⚠️ La anon key es PÚBLICA por diseño: es seguro publicarla en
   el repo. La seguridad la dan las políticas RLS de schema.sql.
   ============================================================ */

const CONFIG = {
  SUPABASE_URL: "",       // ej. https://abcdxyz.supabase.co
  SUPABASE_ANON_KEY: "",  // ej. eyJhbGciOi... (anon public)
  APP_NAME: "Stimulo",
  APP_SUB: "Panel interno del estudio",
};

/* Áreas de trabajo del estudio */
const AREAS = [
  { id: "diseno",     label: "Diseño",          icono: "🎨", color: "pink" },
  { id: "marketing",  label: "Marketing",       icono: "📣", color: "amber" },
  { id: "ingenieria", label: "Ingeniería",      icono: "⚙️", color: "indigo" },
  { id: "compras",    label: "Compras / Admin", icono: "📦", color: "green" },
];

/* Estados de una tarea (orden = columnas del tablero) */
const ESTADOS = [
  { id: "pendiente", label: "Pendiente",  color: "gray" },
  { id: "curso",     label: "En curso",   color: "blue" },
  { id: "revision",  label: "Revisión",   color: "amber" },
  { id: "hecho",     label: "Hecho",      color: "green" },
];

/* Estados de un módulo de formación */
const MOD_ESTADOS = [
  { id: "pendiente", label: "Pendiente" },
  { id: "curso",     label: "En curso" },
  { id: "hecho",     label: "Completado" },
];
