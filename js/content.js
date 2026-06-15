/* ============================================================
   CONTENIDO.JS — Fuente de verdad del sitio "Dominar Claude"
   ------------------------------------------------------------
   Toda la web se genera desde esta estructura de datos.
   Para añadir/editar módulos: edita este archivo.
   Los campos marcados con "" (vacío) son los APARTADOS PARA
   RELLENAR. Cuando tengan contenido, se renderizan en la web.
   ============================================================ */

const SITE = {
  titulo: "Dominar Claude",
  subtitulo: "Mapa completo de conocimiento — fundamentos, ingeniería y administración con IA",
  autor: "Daniel Lozano · Stimulo",
};

/* Cada sección agrupa módulos. Cada módulo es una "ficha" navegable
   con apartados para rellenar: intro, fundamentos, ejemplos,
   ejercicios y recursos. */

const SECCIONES = [
  {
    id: "fundamentos",
    titulo: "Fundamentos",
    descripcion: "Los pilares básicos para comunicarte con Claude de forma efectiva.",
    color: "purple",
    modulos: [
      {
        id: "prompt-engineering",
        icono: "✍️",
        titulo: "Prompt Engineering",
        resumen: "La base de todo. Cómo hablarle a Claude para obtener exactamente lo que necesitas.",
        tags: ["Zero-shot", "Few-shot", "Chain-of-thought", "Role prompting"],
        color: "purple",
        // ---- APARTADOS PARA RELLENAR ----
        intro: "",
        fundamentos: "",
        ejemplos: "",
        ejercicios: "",
        recursos: "",
      },
      {
        id: "gestion-contexto",
        icono: "📐",
        titulo: "Gestión del contexto",
        resumen: "Cómo Claude usa la memoria de la conversación y cómo estructurarla a tu favor.",
        tags: ["Ventana de contexto", "System prompt", "Historial"],
        color: "teal",
        intro: "", fundamentos: "", ejemplos: "", ejercicios: "", recursos: "",
      },
      {
        id: "razonamiento",
        icono: "🔍",
        titulo: "Razonamiento y análisis",
        resumen: "Cómo Claude piensa. Cómo activar su capacidad analítica más profunda.",
        tags: ["Think step by step", "Extended thinking", "Razonamiento crítico"],
        color: "blue",
        intro: "", fundamentos: "", ejemplos: "", ejercicios: "", recursos: "",
      },
      {
        id: "creatividad",
        icono: "🎨",
        titulo: "Creatividad y escritura",
        resumen: "Claude como co-creador. Voz, tono, estilo y escritura estratégica.",
        tags: ["Tono y voz", "Iteración creativa", "Copywriting", "Storytelling"],
        color: "coral",
        intro: "", fundamentos: "", ejemplos: "", ejercicios: "", recursos: "",
      },
      {
        id: "codigo",
        icono: "⚙️",
        titulo: "Código y tareas técnicas",
        resumen: "Claude como engineer. Debug, generación, revisión y arquitectura.",
        tags: ["Debug", "Code review", "Arquitectura", "Explicación técnica"],
        color: "amber",
        intro: "", fundamentos: "", ejemplos: "", ejercicios: "", recursos: "",
      },
      {
        id: "investigacion",
        icono: "📊",
        titulo: "Investigación y análisis",
        resumen: "Claude como analista. Síntesis, comparación de fuentes e insights estratégicos.",
        tags: ["Síntesis de docs", "Comparación", "Extracción de insights"],
        color: "pink",
        intro: "", fundamentos: "", ejemplos: "", ejercicios: "", recursos: "",
      },
    ],
  },

  {
    id: "avanzadas",
    titulo: "Técnicas avanzadas",
    descripcion: "Herramientas transversales que separan a quien usa Claude de quien lo domina.",
    color: "teal",
    modulos: [
      {
        id: "meta-prompting",
        icono: "🏗️",
        titulo: "Estructuras y meta-prompting",
        resumen: "System prompts, roles de experto, XML y plantillas reutilizables para outputs consistentes.",
        tags: ["Meta-prompting", "XML estructurado", "Plantillas", "Roles de experto"],
        color: "purple",
        intro: "", fundamentos: "", ejemplos: "", ejercicios: "", recursos: "",
      },
      {
        id: "workflows",
        icono: "🔗",
        titulo: "Workflows y automatización",
        resumen: "Claude en flujos encadenados, API y sistemas agenticos. IA que trabaja sola.",
        tags: ["Flujos en cadena", "API", "Agentes IA", "Automatización"],
        color: "blue",
        intro: "", fundamentos: "", ejemplos: "", ejercicios: "", recursos: "",
      },
    ],
  },

  {
    id: "ingenieria",
    titulo: "Ingeniería mecánica y diseño 3D",
    descripcion: "Claude + Python como co-piloto de tus herramientas de diseño. Automatización agentica.",
    color: "amber",
    flujo: ["Instrucción natural", "Claude razona", "Python ejecuta", "Software actúa", "Feedback a Claude"],
    modulos: [
      {
        id: "blender",
        icono: "🟠",
        titulo: "Claude + Blender",
        resumen: "Agente que opera Blender vía bpy. Geometría paramétrica, materiales y render por instrucción.",
        tags: ["bpy API", "Geometría paramétrica", "Render batch", "Scripting agentico"],
        color: "amber",
        intro: "", fundamentos: "", ejemplos: "", ejercicios: "", recursos: "",
      },
      {
        id: "solidworks",
        icono: "🔵",
        titulo: "Claude + SolidWorks",
        resumen: "Agente que controla SolidWorks vía COM API. Diseño paramétrico y exportación de planos.",
        tags: ["win32com", "Diseño paramétrico", "Configuraciones", "Export DXF/STEP"],
        color: "blue",
        intro: "", fundamentos: "", ejemplos: "", ejercicios: "", recursos: "",
      },
      {
        id: "fusion360",
        icono: "🟣",
        titulo: "Claude + Fusion 360",
        resumen: "Agente que diseña en Fusion 360 vía su Python API. Sketches y variantes paramétricas.",
        tags: ["Fusion API", "Sketches auto", "Variantes paramétricas", "Export STL/STEP"],
        color: "purple",
        intro: "", fundamentos: "", ejemplos: "", ejercicios: "", recursos: "",
      },
      {
        id: "agente-python",
        icono: "🤖",
        titulo: "Agente Python agentico con Claude API",
        resumen: "El bucle completo: Claude planifica, Python ejecuta, el resultado vuelve a Claude.",
        tags: ["anthropic SDK", "Tool use", "Bucle plan→ejecutar→corregir", "Error handling"],
        color: "green",
        intro: "", fundamentos: "", ejemplos: "", ejercicios: "", recursos: "",
      },
      {
        id: "casos-ingenieria",
        icono: "📋",
        titulo: "Casos de uso para ingeniería",
        resumen: "10 automatizaciones reales: variantes, BOM automático, tolerancias, documentación y optimización.",
        tags: ["Variantes de pieza", "BOM automático", "Análisis tolerancias", "Documentación auto"],
        color: "teal",
        intro: "", fundamentos: "", ejemplos: "", ejercicios: "", recursos: "",
      },
    ],
  },

  {
    id: "administracion",
    titulo: "Administración, compras y contabilidad con IA",
    descripcion: "El puente entre ingeniería y empresa. Conecta el output técnico con CRM, compras y contabilidad.",
    color: "green",
    flujo: ["Ingeniería", "Claude procesa", "Compras", "CRM / ERP", "Contabilidad"],
    modulos: [
      {
        id: "compras",
        icono: "🛒",
        titulo: "Automatización de compras",
        resumen: "De la BOM de ingeniería a la orden de compra. Claude compara proveedores y gestiona aprobaciones.",
        tags: ["BOM → orden de compra", "Comparación proveedores", "Aprobaciones auto", "Python + email/Slack"],
        color: "teal",
        intro: "", fundamentos: "", ejemplos: "", ejercicios: "", recursos: "",
      },
      {
        id: "crm",
        icono: "🤝",
        titulo: "Integración con CRM",
        resumen: "Claude conecta el proyecto técnico con el cliente. Presupuestos, oportunidades y seguimiento.",
        tags: ["HubSpot / Salesforce API", "Propuestas auto", "Seguimiento inteligente", "Datos técnicos → oferta"],
        color: "blue",
        intro: "", fundamentos: "", ejemplos: "", ejercicios: "", recursos: "",
      },
      {
        id: "contabilidad",
        icono: "📒",
        titulo: "Fundamentos de contabilidad + IA",
        resumen: "Lo que necesitas saber de contabilidad para automatizarla. Asientos, IVA, cierre mensual.",
        tags: ["Asientos contables", "IVA automatizado", "Cierre mensual", "Clasificación de gastos"],
        color: "amber",
        intro: "", fundamentos: "", ejemplos: "", ejercicios: "", recursos: "",
      },
      {
        id: "facturas",
        icono: "🧾",
        titulo: "Procesador automático de facturas",
        resumen: "OCR + Claude extrae, interpreta y clasifica facturas. Las valida contra órdenes de compra.",
        tags: ["OCR + PyMuPDF", "Claude clasifica", "Validación vs OC", "Export a contabilidad"],
        color: "green",
        intro: "", fundamentos: "", ejemplos: "", ejercicios: "", recursos: "",
      },
      {
        id: "dashboard",
        icono: "📈",
        titulo: "Dashboard de administración con IA",
        resumen: "Claude como analista de negocio. Consolida ingeniería, compras, CRM y contabilidad con alertas.",
        tags: ["Consolidación de datos", "Alertas automáticas", "Análisis de margen", "Dashboard Python"],
        color: "pink",
        intro: "", fundamentos: "", ejemplos: "", ejercicios: "", recursos: "",
      },
      {
        id: "herramientas-propias",
        icono: "🛠️",
        titulo: "Crear herramientas propias de gestión",
        resumen: "Construye tus apps internas: presupuestos, calculadora de proyectos, gestor de OTs. Claude como motor.",
        tags: ["Streamlit / Flask", "Presupuestos técnicos", "Coste de proyecto", "Claude como motor"],
        color: "amber",
        intro: "", fundamentos: "", ejemplos: "", ejercicios: "", recursos: "",
      },
      {
        id: "automatizaciones-empresa",
        icono: "⚡",
        titulo: "8 automatizaciones empresariales",
        resumen: "Casos concretos para empresas técnicas: desde la BOM hasta el cierre contable.",
        tags: ["BOM → factura", "OC automática", "Pipeline CRM", "Cierre mensual"],
        color: "gray",
        intro: "", fundamentos: "", ejemplos: "", ejercicios: "", recursos: "",
      },
    ],
  },
];

/* Ruta de aprendizaje (timeline) */
const RUTA = [
  { nivel: "Nivel 1", nombre: "Conversación efectiva", hint: "Prompts claros, contexto, instrucciones directas" },
  { nivel: "Nivel 2", nombre: "Técnicas avanzadas", hint: "Few-shot, chain-of-thought, roles de experto" },
  { nivel: "Nivel 3", nombre: "Python + API", hint: "SDK de Claude, herramientas, bucles agenticos" },
  { nivel: "Nivel 4", nombre: "Agente de ingeniería", hint: "Claude opera Blender, SolidWorks, Fusion 360" },
  { nivel: "Nivel 5", nombre: "Sistema empresarial", hint: "Compras, CRM y contabilidad integrados" },
];

/* Etiquetas de los apartados rellenables de cada módulo */
const APARTADOS = [
  { key: "intro", label: "Introducción", icono: "📖" },
  { key: "fundamentos", label: "Fundamentos", icono: "🧱" },
  { key: "ejemplos", label: "Ejemplos prácticos", icono: "💡" },
  { key: "ejercicios", label: "Ejercicios", icono: "🎯" },
  { key: "recursos", label: "Recursos", icono: "🔗" },
];
