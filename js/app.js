/* ============================================================
   APP.JS — Dominar Claude · Landing Page
   Genera cards de módulos, FAQ accordion, modal de detalle,
   scroll animations y navegación responsive.
   ============================================================ */

/* --- Markdown-light → HTML --- */
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
          const items = t.split("\n").map((l) => `<li>${inl(l.replace(/^\s*-\s/, ""))}</li>`).join("");
          html += `<ul>${items}</ul>`;
        } else {
          html += `<p>${inl(t.replace(/\n/g, " "))}</p>`;
        }
      });
    }
  });
  return html;
}
function inl(t) {
  return t.replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}
function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* --- Build module index --- */
const MOD_INDEX = {};
SECCIONES.forEach((sec) => sec.modulos.forEach((m) => (MOD_INDEX[m.id] = { ...m, _sec: sec })));

/* --- Module cards grid --- */
function buildModulesGrid() {
  const grid = document.getElementById("modules-grid");
  if (!grid) return;
  grid.innerHTML = "";

  SECCIONES.forEach((sec) => {
    sec.modulos.forEach((m) => {
      const card = document.createElement("div");
      card.className = "module-card";
      card.dataset.color = m.color || "gray";
      card.onclick = () => openModal(m.id);

      let tagsHtml = m.tags.map((t) => `<span class="mc-tag">${t}</span>`).join("");

      card.innerHTML = `
        <div class="mc-icon">${m.icono}</div>
        <div class="mc-section">${sec.titulo}</div>
        <h4>${m.titulo}</h4>
        <div class="mc-desc">${m.resumen}</div>
        <div class="mc-tags">${tagsHtml}</div>
      `;
      grid.appendChild(card);
    });
  });
}

/* --- Modal --- */
function openModal(id) {
  const m = MOD_INDEX[id];
  if (!m) return;

  const overlay = document.getElementById("modal-overlay");
  const content = document.getElementById("modal-content");

  let tagsHtml = m.tags.map((t) => `<span class="mc-tag">${t}</span>`).join("");

  let sectionsHtml = "";
  APARTADOS.forEach((a) => {
    const rendered = renderContenido(m[a.key]);
    if (rendered) {
      sectionsHtml += `
        <div class="modal-section">
          <div class="modal-section-head"><span>${a.icono}</span><h3>${a.label}</h3></div>
          <div class="modal-section-body">${rendered}</div>
        </div>`;
    } else {
      sectionsHtml += `
        <div class="modal-section">
          <div class="modal-section-head"><span>${a.icono}</span><h3>${a.label}</h3></div>
          <div class="modal-placeholder">
            <strong>Apartado por rellenar</strong>
            Edita <code>js/content.js</code> → módulo <code>${m.id}</code> → campo <code>${a.key}</code>
          </div>
        </div>`;
    }
  });

  content.innerHTML = `
    <div class="modal-header">
      <div class="modal-icon">${m.icono}</div>
      <div>
        <div class="section-eyebrow">${m._sec.titulo}</div>
        <h2>${m.titulo}</h2>
        <div class="modal-desc">${m.resumen}</div>
        <div class="modal-tags">${tagsHtml}</div>
      </div>
    </div>
    ${sectionsHtml}
  `;

  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("modal-overlay").classList.remove("active");
  document.body.style.overflow = "";
}

/* --- FAQ Accordion --- */
function initFAQ() {
  document.querySelectorAll(".faq-question").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const wasOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach((i) => i.classList.remove("open"));
      if (!wasOpen) item.classList.add("open");
    });
  });
}

/* --- Sticky header shadow --- */
function initHeader() {
  const header = document.getElementById("header");
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 10);
  }, { passive: true });
}

/* --- Hamburger --- */
function initHamburger() {
  const btn = document.getElementById("hamburger");
  const nav = document.getElementById("header-nav");
  if (!btn || !nav) return;
  btn.addEventListener("click", () => nav.classList.toggle("open"));
  nav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => nav.classList.remove("open"));
  });
}

/* --- Modal close --- */
function initModal() {
  document.getElementById("modal-close").addEventListener("click", closeModal);
  document.getElementById("modal-overlay").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

/* --- Scroll animations (CSS-only, no JS opacity hacks) --- */
function initScrollAnimations() {}

/* --- Init --- */
document.addEventListener("DOMContentLoaded", () => {
  buildModulesGrid();
  initFAQ();
  initHeader();
  initHamburger();
  initModal();
  initScrollAnimations();
});
