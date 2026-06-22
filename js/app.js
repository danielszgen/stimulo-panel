/* ============================================================
   APP.JS — Panel interno de Stimulo
   Login simulado · Dashboard · Formación con progreso ·
   Tablero de tareas de equipo (drag & drop).
   ============================================================ */

/* ---------- Utilidades ---------- */
function esc(s) {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function inl(t) {
  return t.replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}
function renderContenido(texto) {
  if (!texto || !texto.trim()) return null;
  const bloques = texto.split(/```/);
  let html = "";
  bloques.forEach((b, i) => {
    if (i % 2 === 1) {
      html += `<pre><code>${esc(b.trim())}</code></pre>`;
    } else {
      b.split(/\n\s*\n/).forEach((par) => {
        const t = par.trim();
        if (!t) return;
        if (t.split("\n").every((l) => l.trim().startsWith("- "))) {
          const items = t.split("\n").map((l) => `<li>${inl(esc(l.replace(/^\s*-\s/, "")))}</li>`).join("");
          html += `<ul>${items}</ul>`;
        } else if (t.startsWith("> ")) {
          html += `<blockquote>${inl(esc(t.replace(/^>\s?/gm, "")))}</blockquote>`;
        } else {
          html += `<p>${inl(esc(t.replace(/\n/g, " ")))}</p>`;
        }
      });
    }
  });
  return html;
}
const $ = (sel) => document.querySelector(sel);
const areaById = (id) => AREAS.find((a) => a.id === id) || AREAS[0];
const estadoById = (id) => ESTADOS.find((e) => e.id === id) || ESTADOS[0];

/* Índice de módulos */
const MOD_INDEX = {};
SECCIONES.forEach((sec) => sec.modulos.forEach((m) => (MOD_INDEX[m.id] = { ...m, _sec: sec })));

/* Índice de apartados por clave (label + icono) */
const APARTADO_INDEX = {};
(typeof APARTADOS !== "undefined" ? APARTADOS : []).forEach((a) => (APARTADO_INDEX[a.key] = a));

/* Índice de clases por número (p. ej. "1.1.1"), si existe el manifiesto */
const CLASE_INDEX = {};
if (typeof CLASES !== "undefined") {
  Object.keys(CLASES).forEach((modId) =>
    Object.keys(CLASES[modId]).forEach((apaKey) =>
      CLASES[modId][apaKey].forEach((c) => {
        CLASE_INDEX[c.num] = { ...c, moduloId: modId, apartadoKey: apaKey };
      })
    )
  );
}
function clasesDe(moduloId, apartadoKey) {
  return (typeof CLASES !== "undefined" && CLASES[moduloId] && CLASES[moduloId][apartadoKey]) || [];
}

/* ---------- Componentes reutilizables ---------- */
function avatar(member, cls = "") {
  if (!member) return `<span class="avatar avatar-gray ${cls}">·</span>`;
  return `<span class="avatar avatar-${member.color} ${cls}" title="${esc(member.name)}">${esc(member.initials)}</span>`;
}
function areaChip(areaId) {
  const a = areaById(areaId);
  return `<span class="chip-tag chip-${a.color}">${a.icono} ${a.label}</span>`;
}
function estadoBadge(estadoId) {
  const e = estadoById(estadoId);
  return `<span class="state-badge state-${e.id}"><span class="dot status-${e.id}"></span>${e.label}</span>`;
}

/* ---------- Estadísticas ---------- */
function moduleStats() {
  let total = 0, hecho = 0, curso = 0;
  SECCIONES.forEach((s) => s.modulos.forEach((m) => {
    total++;
    const st = Store.moduleStatus(m.id);
    if (st === "hecho") hecho++; else if (st === "curso") curso++;
  }));
  return { total, hecho, curso, pct: total ? Math.round((hecho / total) * 100) : 0 };
}
function sectionStats(sec) {
  const total = sec.modulos.length;
  const hecho = sec.modulos.filter((m) => Store.moduleStatus(m.id) === "hecho").length;
  return { total, hecho, pct: total ? Math.round((hecho / total) * 100) : 0 };
}
function taskStats() {
  const ts = Store.getTasks();
  return {
    total: ts.length,
    pendiente: ts.filter((t) => t.estado === "pendiente").length,
    curso: ts.filter((t) => t.estado === "curso").length,
    revision: ts.filter((t) => t.estado === "revision").length,
    hecho: ts.filter((t) => t.estado === "hecho").length,
    activas: ts.filter((t) => t.estado !== "hecho").length,
  };
}

/* ============================================================
   AUTENTICACIÓN (flujo de pantallas)
   ============================================================ */
async function boot() {
  await Auth.init();
  if (Auth.isAuthed()) {
    await Store.load();
    enterApp();
  } else {
    if (!USE_SUPABASE) await Store.load(); // para que el selector tenga el equipo
    showLogin();
  }
}
function showLogin() {
  $("#login").classList.remove("hidden");
  $("#app").classList.add("hidden");
}
function enterApp() {
  $("#login").classList.add("hidden");
  $("#app").classList.remove("hidden");
  renderUser();
  setView(currentView);
}
function renderUser() {
  const u = Auth.current();
  if (!u) return;
  $("#user-chip").innerHTML = `${avatar(u)}<span class="user-chip-name">${esc(u.name)}</span>`;
  $("#side-user").innerHTML = `${avatar(u)}<span class="side-user-info"><strong>${esc(u.name)}</strong><small>${esc(u.rol)}</small></span>`;
}

/* Selector de cuenta (simulación de Google) */
function openPicker() {
  const list = $("#picker-list");
  list.innerHTML = Store.getTeam().map((m) => `
    <button class="picker-item" data-id="${m.id}">
      ${avatar(m, "avatar-lg")}
      <span class="picker-info"><strong>${esc(m.name)}</strong><small>${esc(m.email)}</small></span>
      <span class="picker-rol">${esc(m.rol)}</span>
    </button>`).join("");
  list.querySelectorAll(".picker-item").forEach((b) => {
    b.onclick = async () => { Auth.signInAs(b.dataset.id); await Store.load(); closePicker(); enterApp(); };
  });
  $("#picker-overlay").classList.add("active");
}
function closePicker() { $("#picker-overlay").classList.remove("active"); }

/* ============================================================
   ROUTING DE VISTAS
   ============================================================ */
let currentView = "inicio";
const TITLES = {
  inicio: ["Inicio", "Resumen del estudio"],
  modulos: ["Formación", "Programa interno de IA"],
  tareas: ["Tareas", "Trabajo del equipo"],
};
function setView(name) {
  currentView = name;
  document.querySelectorAll(".view").forEach((v) => v.classList.add("hidden"));
  $("#view-" + name).classList.remove("hidden");
  document.querySelectorAll(".nav-item").forEach((n) => n.classList.toggle("active", n.dataset.view === name));
  $("#view-title").textContent = TITLES[name][0];
  $("#view-sub").textContent = TITLES[name][1];
  $("#new-task-top").classList.toggle("hidden", name !== "tareas");
  if (name === "inicio") renderInicio();
  if (name === "modulos") renderModulos();
  if (name === "tareas") renderTareas();
}

/* ============================================================
   VISTA: INICIO (dashboard)
   ============================================================ */
function statCard(label, big, sub, color) {
  return `<div class="stat-card stat-${color}">
    <div class="stat-label">${label}</div>
    <div class="stat-big">${big}</div>
    <div class="stat-sub">${sub}</div>
  </div>`;
}
function taskMini(t) {
  const m = Store.getMember(t.responsable);
  return `<div class="task-mini" data-edit="${t.id}">
    ${areaChip(t.area)}
    <div class="task-mini-title">${esc(t.titulo)}</div>
    <div class="task-mini-foot">${avatar(m)}${estadoBadge(t.estado)}</div>
  </div>`;
}
function emptyMini(msg) {
  return `<div class="empty-mini">${msg}</div>`;
}
function sectionProgressRow(sec) {
  const s = sectionStats(sec);
  return `<div class="prog-row">
    <div class="prog-row-head">
      <span class="prog-row-name">${esc(sec.titulo)}</span>
      <span class="prog-row-count">${s.hecho}/${s.total}</span>
    </div>
    <div class="bar"><div class="bar-fill" style="width:${s.pct}%"></div></div>
  </div>`;
}
function renderInicio() {
  const u = Auth.current();
  const ms = moduleStats();
  const tx = taskStats();
  const enCurso = Store.getTasks().filter((t) => t.estado === "curso");
  const enRevision = Store.getTasks().filter((t) => t.estado === "revision");
  const nombre = u ? u.name.split(" ")[0] : "equipo";

  $("#view-inicio").innerHTML = `
    <div class="hello">
      <h2>Hola, ${esc(nombre)} 👋</h2>
      <p class="muted">Esto es lo que se cuece hoy en el estudio.</p>
    </div>

    <div class="stat-grid">
      ${statCard("Formación", ms.pct + "%", `${ms.hecho}/${ms.total} módulos completados`, "indigo")}
      ${statCard("Tareas activas", tx.activas, `${tx.curso} en curso · ${tx.pendiente} pendientes`, "blue")}
      ${statCard("En revisión", tx.revision, "esperando visto bueno", "amber")}
      ${statCard("Completadas", tx.hecho, "tareas cerradas", "green")}
    </div>

    <div class="dash-cols">
      <div class="panel">
        <div class="panel-head"><h3>Progreso de formación</h3><button class="link" data-go="modulos">Ver módulos →</button></div>
        ${SECCIONES.map(sectionProgressRow).join("")}
      </div>
      <div class="panel">
        <div class="panel-head"><h3>En revisión</h3><button class="link" data-go="tareas">Ver tareas →</button></div>
        ${enRevision.length ? enRevision.map(taskMini).join("") : emptyMini("Nada en revisión ahora mismo.")}
      </div>
    </div>

    <div class="panel">
      <div class="panel-head"><h3>Trabajo en paralelo</h3><span class="muted">${enCurso.length} tarea(s) en curso</span></div>
      <div class="parallel">
        ${enCurso.length ? enCurso.map(taskMini).join("") : emptyMini("No hay tareas en curso.")}
      </div>
    </div>
  `;

  $("#view-inicio").querySelectorAll("[data-go]").forEach((b) => (b.onclick = () => setView(b.dataset.go)));
  $("#view-inicio").querySelectorAll("[data-edit]").forEach((c) => (c.onclick = () => openTaskForm(c.dataset.edit)));
}

/* ============================================================
   VISTA: FORMACIÓN (módulos con progreso)
   ============================================================ */
function moduleCard(m) {
  const st = Store.moduleStatus(m.id);
  return `<div class="mcard" data-color="${m.color}">
    <div class="mcard-bar"></div>
    <div class="mcard-top">
      <span class="mcard-icon" data-open="${m.id}">${m.icono}</span>
      <span class="status-dot status-${st}" title="${esc(st)}"></span>
    </div>
    <h4 data-open="${m.id}">${esc(m.titulo)}</h4>
    <p class="mcard-desc" data-open="${m.id}">${esc(m.resumen)}</p>
    <div class="mcard-foot">
      <select class="mod-status" data-mod="${m.id}" aria-label="Estado del módulo">
        ${MOD_ESTADOS.map((e) => `<option value="${e.id}" ${e.id === st ? "selected" : ""}>${e.label}</option>`).join("")}
      </select>
    </div>
  </div>`;
}
function moduleSection(sec) {
  const s = sectionStats(sec);
  return `<div class="mod-section">
    <div class="mod-section-head">
      <div>
        <h3>${esc(sec.titulo)}</h3>
        <p class="muted">${esc(sec.descripcion)}</p>
      </div>
      <span class="mod-section-count">${s.hecho}/${s.total}</span>
    </div>
    <div class="mod-grid">${sec.modulos.map(moduleCard).join("")}</div>
  </div>`;
}
function renderModulos() {
  const ms = moduleStats();
  $("#view-modulos").innerHTML = `
    <div class="prog-banner">
      <div>
        <strong>Programa interno de IA</strong>
        <p class="muted">Marca cada módulo según vayas avanzando. Tu progreso se guarda automáticamente.</p>
      </div>
      <div class="prog-banner-right">
        <div class="big-pct">${ms.pct}%</div>
        <div class="bar"><div class="bar-fill" style="width:${ms.pct}%"></div></div>
        <small class="muted">${ms.hecho} de ${ms.total} completados</small>
      </div>
    </div>
    ${SECCIONES.map(moduleSection).join("")}
  `;
  $("#view-modulos").querySelectorAll("[data-open]").forEach((el) => (el.onclick = () => openModal(el.dataset.open)));
  $("#view-modulos").querySelectorAll(".mod-status").forEach((sel) => {
    sel.onchange = () => { Store.setModuleStatus(sel.dataset.mod, sel.value); renderModulos(); };
  });
}

/* ---------- Modal de detalle de módulo ---------- */
function openModal(id) {
  const m = MOD_INDEX[id];
  if (!m) return;
  const st = Store.moduleStatus(id);
  const tags = m.tags.map((t) => `<span class="chip-tag chip-gray">${esc(t)}</span>`).join("");

  let sections = "";
  APARTADOS.forEach((a) => {
    const rendered = renderContenido(m[a.key]);
    const clases = clasesDe(m.id, a.key);
    let clasesHtml = "";
    if (clases.length) {
      const items = clases
        .map(
          (c) => `<button class="clase-item" data-clase="${c.num}">
            <span class="clase-num">${esc(c.num)}</span>
            <span class="clase-text"><span class="clase-titulo">${esc(c.titulo)}</span>
              <span class="clase-meta">📄 PDF · ${c.pages.length} pág.</span></span>
            <span class="clase-go">›</span>
          </button>`
        )
        .join("");
      clasesHtml = `<div class="clase-list">
        <div class="clase-list-head">Clases de este apartado (${clases.length})</div>
        ${items}
      </div>`;
    }
    const body = rendered || (clases.length ? "" : '<p class="muted">Apartado por completar.</p>');
    sections += `<div class="modal-section">
      <div class="modal-section-head"><span>${a.icono}</span><h3>${a.label}</h3></div>
      <div class="modal-section-body">${body}</div>
      ${clasesHtml}
    </div>`;
  });

  $("#modal-content").innerHTML = `
    <div class="modal-header">
      <div class="modal-icon" data-color="${m.color}">${m.icono}</div>
      <div class="modal-head-text">
        <div class="eyebrow">${esc(m._sec.titulo)}</div>
        <h2>${esc(m.titulo)}</h2>
        <p class="modal-desc">${esc(m.resumen)}</p>
        <div class="modal-tags">${tags}</div>
      </div>
      <div class="modal-status">
        <label>Estado</label>
        <select id="modal-mod-status">
          ${MOD_ESTADOS.map((e) => `<option value="${e.id}" ${e.id === st ? "selected" : ""}>${e.label}</option>`).join("")}
        </select>
      </div>
    </div>
    ${sections}
  `;
  $("#modal-mod-status").onchange = (e) => { Store.setModuleStatus(id, e.target.value); };
  $("#modal-content").querySelectorAll("[data-clase]").forEach((el) => (el.onclick = () => openClase(el.dataset.clase)));
  $("#modal-overlay").classList.add("active");
  document.body.style.overflow = "hidden";
}
function closeModal() {
  $("#modal-overlay").classList.remove("active");
  document.body.style.overflow = "";
  if (currentView === "modulos") renderModulos();
}

/* ---------- Página de una clase (sub-apartado) ---------- */
function openClase(num) {
  const c = CLASE_INDEX[num];
  if (!c) return;
  const m = MOD_INDEX[c.moduloId];
  const apa = APARTADO_INDEX[c.apartadoKey] || { label: "", icono: "" };
  const eyebrow = `${m ? esc(m.titulo) : ""} · ${apa.icono} ${esc(apa.label)} · Clase ${esc(c.num)}`;

  const paginas = c.pages.length
    ? c.pages.map((p, i) => `<img class="clase-page" src="${p}" alt="${esc(c.titulo)} — página ${i + 1}" loading="lazy" />`).join("")
    : '<p class="muted">Esta clase aún no tiene contenido renderizado.</p>';

  $("#clase-content").innerHTML = `
    <div class="clase-header">
      <div class="clase-head-text">
        <div class="eyebrow">${eyebrow}</div>
        <h2>${esc(c.titulo)}</h2>
      </div>
      <a class="btn btn-primary clase-dl" href="${c.pdf}" download>⬇ Descargar PDF</a>
    </div>
    <div class="clase-doc">${paginas}</div>
    <div class="clase-foot">
      <a class="btn btn-ghost" href="${c.pdf}" target="_blank" rel="noopener">Abrir PDF en pestaña nueva</a>
    </div>
  `;
  $("#clase-overlay").classList.add("active");
  document.body.style.overflow = "hidden";
  $("#clase-content").scrollTop = 0;
}
function closeClase() {
  $("#clase-overlay").classList.remove("active");
  // El modal de módulo puede seguir abierto debajo; solo restauramos scroll si no hay overlays activos.
  if (!$("#modal-overlay").classList.contains("active")) document.body.style.overflow = "";
}

/* ============================================================
   VISTA: TAREAS (tablero de equipo con drag & drop)
   ============================================================ */
let taskFilter = "all";
let dragId = null;

function filteredTasks() {
  const ts = Store.getTasks();
  return taskFilter === "all" ? ts : ts.filter((t) => t.area === taskFilter);
}
function taskCard(t) {
  const m = Store.getMember(t.responsable);
  return `<article class="tcard" draggable="true" data-id="${t.id}">
    <div class="tcard-top">${areaChip(t.area)}</div>
    <h4 class="tcard-title">${esc(t.titulo)}</h4>
    ${t.desc ? `<p class="tcard-desc">${esc(t.desc)}</p>` : ""}
    <div class="tcard-foot">
      <span class="tcard-assignee">${avatar(m)}<small>${m ? esc(m.name.split(" ")[0]) : "Sin asignar"}</small></span>
      <button class="tcard-edit" data-edit="${t.id}">Editar</button>
    </div>
  </article>`;
}
function boardColumn(e) {
  const tasks = filteredTasks().filter((t) => t.estado === e.id);
  return `<div class="col">
    <div class="col-head"><span class="dot status-${e.id}"></span> ${e.label} <span class="count">${tasks.length}</span></div>
    <div class="col-body" data-drop="${e.id}">
      ${tasks.map(taskCard).join("") || '<div class="col-empty">Suelta aquí</div>'}
    </div>
  </div>`;
}
function renderTareas() {
  $("#view-tareas").innerHTML = `
    <div class="board-toolbar">
      <div class="filters">
        <button class="filter ${taskFilter === "all" ? "active" : ""}" data-area="all">Todas</button>
        ${AREAS.map((a) => `<button class="filter filter-${a.color} ${taskFilter === a.id ? "active" : ""}" data-area="${a.id}">${a.icono} ${a.label}</button>`).join("")}
      </div>
    </div>
    <div class="board">${ESTADOS.map(boardColumn).join("")}</div>
  `;

  const root = $("#view-tareas");
  root.querySelectorAll(".filter").forEach((b) => (b.onclick = () => { taskFilter = b.dataset.area; renderTareas(); }));
  root.querySelectorAll("[data-edit]").forEach((b) => (b.onclick = (ev) => { ev.stopPropagation(); openTaskForm(b.dataset.edit); }));

  // Drag & drop
  root.querySelectorAll(".tcard").forEach((c) => {
    c.addEventListener("dragstart", () => { dragId = c.dataset.id; c.classList.add("dragging"); });
    c.addEventListener("dragend", () => c.classList.remove("dragging"));
  });
  root.querySelectorAll(".col-body").forEach((col) => {
    col.addEventListener("dragover", (e) => { e.preventDefault(); col.classList.add("drop-hover"); });
    col.addEventListener("dragleave", () => col.classList.remove("drop-hover"));
    col.addEventListener("drop", (e) => {
      e.preventDefault();
      col.classList.remove("drop-hover");
      if (dragId) { Store.updateTask(dragId, { estado: col.dataset.drop }); dragId = null; renderTareas(); }
    });
  });
}

/* ---------- Formulario de tarea (crear / editar) ---------- */
function openTaskForm(id) {
  const editing = !!id;
  const defaultResp = (Auth.current() && Auth.current().userId) || (Store.getTeam()[0] && Store.getTeam()[0].id) || "";
  const t = editing ? Store.getTasks().find((x) => x.id === id) : { titulo: "", desc: "", area: "diseno", estado: "pendiente", responsable: defaultResp };
  if (!t) return;

  $("#task-form").innerHTML = `
    <h2 class="form-title">${editing ? "Editar tarea" : "Nueva tarea"}</h2>
    <label class="field"><span>Título</span>
      <input id="f-titulo" type="text" value="${esc(t.titulo)}" placeholder="¿Qué hay que hacer?" />
    </label>
    <label class="field"><span>Descripción</span>
      <textarea id="f-desc" rows="3" placeholder="Detalles, contexto, entregable...">${esc(t.desc || "")}</textarea>
    </label>
    <div class="field-row">
      <label class="field"><span>Área</span>
        <select id="f-area">${AREAS.map((a) => `<option value="${a.id}" ${a.id === t.area ? "selected" : ""}>${a.icono} ${a.label}</option>`).join("")}</select>
      </label>
      <label class="field"><span>Estado</span>
        <select id="f-estado">${ESTADOS.map((e) => `<option value="${e.id}" ${e.id === t.estado ? "selected" : ""}>${e.label}</option>`).join("")}</select>
      </label>
    </div>
    <label class="field"><span>Responsable</span>
      <select id="f-resp">${Store.getTeam().map((m) => `<option value="${m.id}" ${m.id === t.responsable ? "selected" : ""}>${esc(m.name)} · ${esc(m.rol)}</option>`).join("")}</select>
    </label>
    <div class="form-actions">
      ${editing ? '<button class="btn btn-danger" id="f-delete">Eliminar</button>' : "<span></span>"}
      <div class="form-actions-right">
        <button class="btn btn-ghost" id="f-cancel">Cancelar</button>
        <button class="btn btn-primary" id="f-save">${editing ? "Guardar" : "Crear tarea"}</button>
      </div>
    </div>
  `;

  $("#f-save").onclick = () => {
    const data = {
      titulo: $("#f-titulo").value.trim(),
      desc: $("#f-desc").value.trim(),
      area: $("#f-area").value,
      estado: $("#f-estado").value,
      responsable: $("#f-resp").value,
    };
    if (!data.titulo) { $("#f-titulo").focus(); $("#f-titulo").classList.add("invalid"); return; }
    if (editing) Store.updateTask(id, data); else Store.addTask(data);
    closeTaskForm();
    refreshCurrent();
  };
  $("#f-cancel").onclick = closeTaskForm;
  if (editing) $("#f-delete").onclick = () => { Store.deleteTask(id); closeTaskForm(); refreshCurrent(); };

  $("#task-overlay").classList.add("active");
  setTimeout(() => $("#f-titulo").focus(), 50);
}
function closeTaskForm() { $("#task-overlay").classList.remove("active"); }
function refreshCurrent() {
  if (currentView === "tareas") renderTareas();
  if (currentView === "inicio") renderInicio();
}

/* ============================================================
   INICIALIZACIÓN
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  // Login: en modo Supabase lanza Google OAuth; en demo abre el selector
  $("#google-btn").onclick = () => { if (USE_SUPABASE) Auth.signInWithGoogle(); else openPicker(); };
  $("#picker-overlay").onclick = (e) => { if (e.target === e.currentTarget) closePicker(); };
  $("#picker-close").onclick = closePicker;

  // Navegación
  document.querySelectorAll(".nav-item").forEach((n) => (n.onclick = () => setView(n.dataset.view)));
  $("#logout-btn").onclick = async () => { await Auth.signOut(); showLogin(); };
  $("#new-task-top").onclick = () => openTaskForm();

  // Reconciliación tras respuestas de Supabase (mutaciones en segundo plano)
  document.addEventListener("store:changed", () => { renderUser(); refreshCurrent(); });

  // Modales
  $("#modal-close").onclick = closeModal;
  $("#modal-overlay").onclick = (e) => { if (e.target === e.currentTarget) closeModal(); };
  $("#clase-close").onclick = closeClase;
  $("#clase-overlay").onclick = (e) => { if (e.target === e.currentTarget) closeClase(); };
  $("#task-close").onclick = closeTaskForm;
  $("#task-overlay").onclick = (e) => { if (e.target === e.currentTarget) closeTaskForm(); };
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    // Si la clase está abierta, Escape solo la cierra (el módulo sigue debajo).
    if ($("#clase-overlay").classList.contains("active")) { closeClase(); return; }
    closeModal(); closeTaskForm(); closePicker();
  });

  boot();
});
