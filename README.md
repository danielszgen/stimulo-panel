# 🧠 Dominar Claude

Web educativa navegable: un mapa de conocimiento para aprender a dominar Claude, enfocado en
ingeniería mecánica, diseño 3D y administración con IA.

Proyecto **starter** dirigido por datos, listo para subir a GitHub y expandir con Claude Code.

## Estructura

```
dominar-claude/
├── index.html              Shell de la página (sidebar + main + detalle)
├── css/
│   └── styles.css          Estética cálida, modo claro/oscuro automático
├── js/
│   ├── content.js          ⭐ FUENTE DE VERDAD — toda la web se genera desde aquí
│   └── app.js              Renderizado y navegación por hash
├── content/
│   └── indice-completo.md  El índice completo en markdown (referencia)
├── CLAUDE_CODE_PROMPT.md   Prompt listo para arrancar con Claude Code
└── README.md               Este archivo
```

## Cómo verlo

Abre `index.html` directamente en el navegador (doble clic). No necesita servidor: todo el
contenido vive en `js/content.js`, así que funciona en `file://`.

## Cómo está organizado el contenido

Cuatro bloques, 20 módulos navegables:

1. **Fundamentos** (6) — prompt engineering, contexto, razonamiento, creatividad, código, análisis
2. **Técnicas avanzadas** (2) — meta-prompting, workflows y automatización
3. **Ingeniería mecánica y diseño 3D** (5) — Blender, SolidWorks, Fusion 360, agente Python, casos de uso
4. **Administración, compras y contabilidad con IA** (7) — compras, CRM, contabilidad, facturas, dashboard, herramientas propias, automatizaciones

Cada módulo tiene 5 apartados para rellenar: **Introducción, Fundamentos, Ejemplos prácticos,
Ejercicios y Recursos.** Mientras están vacíos se muestran como "Por rellenar".

## Cómo rellenar / editar

Todo se hace en `js/content.js`. Para editar un módulo, busca su `id` y rellena los campos de
texto. El contenido admite markdown ligero (párrafos, listas `- `, `código`, **negrita** y
bloques entre triple backtick).

Para añadir un módulo nuevo: copia un objeto de módulo dentro del array `modulos` de su sección.

## Siguiente paso

Lee `CLAUDE_CODE_PROMPT.md` y úsalo para continuar el desarrollo con Claude Code en tu repo.

---

Daniel Lozano · Stimulo
