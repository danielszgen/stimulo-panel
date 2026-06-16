/* ============================================================
   STORE.JS — Capa de datos del panel interno
   ------------------------------------------------------------
   Funciona con DOS backends según la configuración:
     • Demo:     localStorage (sin servidor)
     • Supabase: tablas profiles / tasks / module_progress
   La app mantiene una caché en memoria (sincrónica) que se
   rellena con load() al iniciar sesión. Las mutaciones son
   optimistas: actualizan la caché al instante y persisten en
   segundo plano. Cuando Supabase responde, emite "store:changed".
   ============================================================ */

const Store = (() => {
  const K = {
    team: "stimulo.team.v1",
    tasks: "stimulo.tasks.v1",
    progress: "stimulo.progress.v1",
    session: "stimulo.session.v1",
  };
  const read = (k, def) => {
    try { const v = JSON.parse(localStorage.getItem(k)); return v === null ? def : v; }
    catch { return def; }
  };
  const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  const uid = () => Math.random().toString(36).slice(2, 9);
  const fire = () => document.dispatchEvent(new Event("store:changed"));

  /* ---------- Datos semilla (solo modo demo) ---------- */
  const TEAM_SEED = [
    { id: "u_dani",  name: "Daniel Lozano", email: "daniel@stimulo.com", initials: "DL", color: "indigo", rol: "Dirección · Ingeniería" },
    { id: "u_marta", name: "Marta Ferrer",  email: "marta@stimulo.com",  initials: "MF", color: "pink",   rol: "Diseño" },
    { id: "u_pau",   name: "Pau Riera",     email: "pau@stimulo.com",    initials: "PR", color: "amber",  rol: "Marketing" },
    { id: "u_nuria", name: "Núria Sala",    email: "nuria@stimulo.com",  initials: "NS", color: "green",  rol: "Administración" },
    { id: "u_jordi", name: "Jordi Vidal",   email: "jordi@stimulo.com",  initials: "JV", color: "blue",   rol: "Ingeniería" },
  ];
  const now = Date.now(), day = 86400000;
  const TASKS_SEED = [
    { id: uid(), titulo: "Identidad visual — cliente Müller", desc: "Logotipo, paleta y aplicaciones básicas para la nueva línea industrial.", area: "diseno", estado: "curso", responsable: "u_marta", createdAt: now - 3 * day, updatedAt: now - day },
    { id: uid(), titulo: "Maquetar dossier de producto", desc: "Dossier comercial de 12 páginas con renders e infografías técnicas.", area: "diseno", estado: "revision", responsable: "u_marta", createdAt: now - 6 * day, updatedAt: now - day },
    { id: uid(), titulo: "Campaña LinkedIn Q3", desc: "Plan de 8 publicaciones sobre automatización con IA en ingeniería.", area: "marketing", estado: "pendiente", responsable: "u_pau", createdAt: now - day, updatedAt: now - day },
    { id: uid(), titulo: "Calendario de contenidos de junio", desc: "Definir temas, formatos y fechas para redes y newsletter.", area: "marketing", estado: "curso", responsable: "u_pau", createdAt: now - 4 * day, updatedAt: now - 2 * day },
    { id: uid(), titulo: "Variantes paramétricas soporte en L", desc: "Generar 3 tamaños desde el script de Fusion y exportar a STEP.", area: "ingenieria", estado: "curso", responsable: "u_jordi", createdAt: now - 2 * day, updatedAt: now - day },
    { id: uid(), titulo: "Generar BOM del ensamblaje X", desc: "Extraer lista de materiales a CSV y agrupar piezas comunes.", area: "ingenieria", estado: "pendiente", responsable: "u_dani", createdAt: now - day, updatedAt: now - day },
    { id: uid(), titulo: "Comparar 3 proveedores de chapa", desc: "Precio, plazo y mínimo de pedido. Preparar borrador de orden.", area: "compras", estado: "revision", responsable: "u_nuria", createdAt: now - 5 * day, updatedAt: now - day },
    { id: uid(), titulo: "Cierre de facturas de mayo", desc: "Procesar y clasificar facturas, cuadrar IVA del periodo.", area: "compras", estado: "hecho", responsable: "u_nuria", createdAt: now - 12 * day, updatedAt: now - 7 * day },
  ];

  /* ---------- Caché en memoria ---------- */
  const cache = { team: [], tasks: [], progress: {} };

  const decorate = (m) => ({
    ...m,
    initials: m.initials || makeInitials(m.name),
    color: m.color || pickColor(m.email || m.name || m.id),
  });

  const mapTaskFromDb = (r) => ({
    id: r.id, titulo: r.titulo, desc: r.descripcion || "",
    area: r.area, estado: r.estado, responsable: r.responsable,
    createdAt: r.created_at ? new Date(r.created_at).getTime() : Date.now(),
    updatedAt: r.updated_at ? new Date(r.updated_at).getTime() : Date.now(),
  });

  function seedLocalIfEmpty() {
    if (localStorage.getItem(K.team) === null) write(K.team, TEAM_SEED);
    if (localStorage.getItem(K.tasks) === null) write(K.tasks, TASKS_SEED);
    if (localStorage.getItem(K.progress) === null) write(K.progress, {});
  }
  const persistLocalTasks = () => write(K.tasks, cache.tasks);

  /* ---------- Carga inicial ---------- */
  async function load() {
    if (USE_SUPABASE) {
      const myId = (typeof Auth !== "undefined" && Auth.current()) ? Auth.current().userId : null;
      const [profiles, tasks, progress] = await Promise.all([
        SB.from("profiles").select("*"),
        SB.from("tasks").select("*").order("updated_at", { ascending: false }),
        myId ? SB.from("module_progress").select("*").eq("user_id", myId) : Promise.resolve({ data: [] }),
      ]);
      cache.team = (profiles.data || []).map((p) =>
        decorate({ id: p.id, name: p.full_name || p.email, email: p.email, rol: p.rol || "" }));
      cache.tasks = (tasks.data || []).map(mapTaskFromDb);
      cache.progress = {};
      (progress.data || []).forEach((r) => (cache.progress[r.module_id] = r.estado));
    } else {
      seedLocalIfEmpty();
      cache.team = read(K.team, []).map(decorate);
      cache.tasks = read(K.tasks, []).slice();
      cache.progress = read(K.progress, {});
    }
  }

  /* ---------- Equipo ---------- */
  const getTeam = () => cache.team;
  const getMember = (id) => cache.team.find((m) => m.id === id) || null;

  /* ---------- Tareas ---------- */
  const getTasks = () => cache.tasks.slice().sort((a, b) => b.updatedAt - a.updatedAt);

  function addTask(t) {
    const local = { id: uid(), createdAt: Date.now(), updatedAt: Date.now(), ...t };
    cache.tasks.push(local);
    if (USE_SUPABASE) {
      SB.from("tasks").insert({
        titulo: t.titulo, descripcion: t.desc, area: t.area, estado: t.estado,
        responsable: t.responsable || null,
        created_by: (Auth.current() && Auth.current().userId) || null,
      }).select().single().then(({ data }) => {
        if (data) {
          const i = cache.tasks.findIndex((x) => x.id === local.id);
          if (i >= 0) cache.tasks[i] = mapTaskFromDb(data);
          fire();
        }
      });
    } else { persistLocalTasks(); }
    return local;
  }

  function updateTask(id, patch) {
    const i = cache.tasks.findIndex((t) => t.id === id);
    if (i < 0) return;
    cache.tasks[i] = { ...cache.tasks[i], ...patch, updatedAt: Date.now() };
    if (USE_SUPABASE) {
      const d = {};
      if ("titulo" in patch) d.titulo = patch.titulo;
      if ("desc" in patch) d.descripcion = patch.desc;
      if ("area" in patch) d.area = patch.area;
      if ("estado" in patch) d.estado = patch.estado;
      if ("responsable" in patch) d.responsable = patch.responsable || null;
      SB.from("tasks").update(d).eq("id", id).then(fire);
    } else { persistLocalTasks(); }
  }

  function deleteTask(id) {
    cache.tasks = cache.tasks.filter((t) => t.id !== id);
    if (USE_SUPABASE) SB.from("tasks").delete().eq("id", id).then(fire);
    else persistLocalTasks();
  }

  /* ---------- Progreso de módulos ---------- */
  const getProgress = () => cache.progress;
  const moduleStatus = (modId) => cache.progress[modId] || "pendiente";

  function setModuleStatus(modId, status) {
    if (status === "pendiente") delete cache.progress[modId];
    else cache.progress[modId] = status;
    if (USE_SUPABASE) {
      const myId = (Auth.current() && Auth.current().userId) || null;
      if (!myId) return;
      if (status === "pendiente") {
        SB.from("module_progress").delete().eq("user_id", myId).eq("module_id", modId).then(fire);
      } else {
        SB.from("module_progress").upsert(
          { user_id: myId, module_id: modId, estado: status, updated_at: new Date().toISOString() },
          { onConflict: "user_id,module_id" }
        ).then(fire);
      }
    } else { write(K.progress, cache.progress); }
  }

  /* ---------- Sesión (solo modo demo) ---------- */
  const getSession = () => read(K.session, null);
  const setSession = (s) => write(K.session, s);
  const clearSession = () => localStorage.removeItem(K.session);

  return {
    load,
    getTeam, getMember,
    getTasks, addTask, updateTask, deleteTask,
    getProgress, moduleStatus, setModuleStatus,
    getSession, setSession, clearSession,
  };
})();
