/* ============================================================
   build-clases.js — Genera js/clases.js y copia los assets
   ------------------------------------------------------------
   Lee la carpeta de salida del maquetador pro (PDFs + previews
   PNG por página) y produce:
     - clases/<archivo>.pdf            (PDF descargable)
     - clases/<slug>/page-N.png        (páginas renderizadas)
     - js/clases.js                    (manifiesto CLASES)

   Uso:  node scripts/build-clases.js "<carpeta_outputs>"
   Si no se pasa carpeta, usa OUTPUTS_DEFAULT.
   ============================================================ */
const fs = require("fs");
const path = require("path");

const OUTPUTS_DEFAULT =
  "C:\\Users\\dloza\\AppData\\Local\\Packages\\Claude_pzs8sxrjxfjjc\\LocalCache\\Roaming\\Claude\\local-agent-mode-sessions\\9e350c31-7285-4d33-9e33-aec0d0b25de4\\9acf7347-9b20-46f4-ad64-75bbd431d619\\agent\\local_ditto_9acf7347-9b20-46f4-ad64-75bbd431d619\\outputs";

const OUTPUTS = process.argv[2] || OUTPUTS_DEFAULT;
const REPO = path.resolve(__dirname, "..");
const CLASES_DIR = path.join(REPO, "clases");

/* Número de módulo → id de módulo en content.js */
const MODULOS = { 1: "prompt-engineering", 2: "gestion-contexto" };
/* Número de apartado → clave de apartado */
const APARTADOS = { 1: "intro", 2: "fundamentos", 3: "ejemplos", 4: "ejercicios", 5: "recursos" };

/* Títulos exactos del temario (índice = subtema − 1) */
const TITULOS = {
  "prompt-engineering": {
    intro: [
      "Qué es un prompt y por qué el resultado depende de él, no del modelo",
      "La fórmula base: claridad + contexto + formato",
      "Diferencia entre pedir y dirigir (orden suelta vs. instrucción completa)",
      "El coste de la ambigüedad: prompts vagos que fallan",
      "Cómo interpreta Claude un prompt (predicción guiada por instrucciones)",
      "Mitos: \"la IA me lee la mente\" y por qué no",
      "Cuándo basta un prompt simple y cuándo hace falta estructura",
      "El prompt como activo reutilizable, no algo a improvisar cada vez",
      "Aplicación por área: diseño, marketing, ingeniería, compras/admin",
      "Qué mejora el prompting con los modelos recientes (Opus 4.x)",
    ],
    fundamentos: [
      "Zero-shot: cuándo funciona y sus límites",
      "Few-shot: cómo elegir 2-3 ejemplos representativos",
      "Chain-of-thought: forzar razonamiento paso a paso",
      "Role prompting: asignar rol de experto y su efecto en el output",
      "Especificidad: longitud, tono, formato y audiencia",
      "Delimitadores y estructura (comillas, etiquetas)",
      "Instrucciones positivas vs. negativas (\"haz\" mejor que \"no hagas\")",
      "Orden de la información dentro del prompt",
      "Iteración: refinar el prompt a partir del resultado",
      "Plantillas de prompt para tareas recurrentes",
    ],
    ejemplos: [
      "Email a cliente: versión vaga vs. específica (caso Müller)",
      "Few-shot para clasificar feedback de clientes",
      "Chain-of-thought para decidir entre 3 proveedores",
      "Role prompting: \"actúa como director de arte\"",
      "Resumen de reunión con formato fijo",
      "Reescritura de un texto en 3 tonos distintos",
      "Generación de nombres de campaña con restricciones",
      "Briefing de diseño a partir de notas sueltas",
      "Checklist de QA de un entregable",
      "Prompt que se autocorrige (\"revisa tu respuesta antes de darla\")",
    ],
  },
  "gestion-contexto": {
    intro: [
      "Qué es la ventana de contexto y por qué todo vive ahí",
      "Claude no recuerda entre conversaciones: implicaciones prácticas",
      "La metáfora de la mesa de trabajo: orden = mejor rendimiento",
      "Más contexto no siempre es mejor (el ruido distrae)",
      "Coste y tiempo según el tamaño del contexto",
      "Cuándo reiniciar una conversación vs. seguir en ella",
      "El system prompt como reglas permanentes de la sesión",
      "Riesgo de contradicciones acumuladas en el historial",
      "Aplicación: trabajar con documentos largos del estudio",
      "Qué permiten las ventanas grandes de los modelos actuales",
    ],
    fundamentos: [
      "Tokens: qué son y cómo se cuentan",
      "Estructura óptima: instrucción → datos → pregunta",
      "Posición: lo del principio y el final pesa más",
      "Etiquetas para encapsular documentos (<documento>)",
      "System prompt vs. mensaje de usuario",
      "Gestión del historial largo (resumir, podar)",
      "Anclar respuestas a las fuentes del contexto",
      "Evitar fugas y contradicciones de contexto",
      "Prompt caching para contenido repetido",
      "Estrategias cuando la ventana se llena",
    ],
  },
};

function humanize(slug) {
  const s = slug.replace(/-/g, " ").trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true });
}

if (!fs.existsSync(OUTPUTS)) {
  console.error("No existe la carpeta de outputs:\n  " + OUTPUTS);
  process.exit(1);
}

fs.rmSync(CLASES_DIR, { recursive: true, force: true });
fs.mkdirSync(CLASES_DIR, { recursive: true });

const files = fs.readdirSync(OUTPUTS).filter((f) => /^\d+\.\d+\.\d+-.+\.pdf$/i.test(f));
files.sort(naturalSort);

const CLASES = {};
let copiados = 0,
  paginas = 0;

for (const file of files) {
  const m = file.match(/^(\d+)\.(\d+)\.(\d+)-(.+)\.pdf$/i);
  const [, modNum, apaNum, subNum, rest] = m;
  const moduloId = MODULOS[modNum];
  const apartadoKey = APARTADOS[apaNum];
  if (!moduloId || !apartadoKey) {
    console.warn("Saltado (módulo/apartado sin mapear): " + file);
    continue;
  }
  const base = file.replace(/\.pdf$/i, ""); // p.ej. 1.1.1-que-es-un-prompt
  const slug = `${modNum}.${apaNum}.${subNum}-${rest}`;
  const num = `${modNum}.${apaNum}.${subNum}`;

  // Copiar PDF
  fs.copyFileSync(path.join(OUTPUTS, file), path.join(CLASES_DIR, file));
  copiados++;

  // Copiar páginas del preview
  const previewDir = path.join(OUTPUTS, base + "_preview");
  const pages = [];
  if (fs.existsSync(previewDir)) {
    const pngs = fs.readdirSync(previewDir).filter((p) => /\.png$/i.test(p)).sort(naturalSort);
    if (pngs.length) {
      const destDir = path.join(CLASES_DIR, base);
      fs.mkdirSync(destDir, { recursive: true });
      for (const png of pngs) {
        fs.copyFileSync(path.join(previewDir, png), path.join(destDir, png));
        pages.push(`clases/${base}/${png}`);
        paginas++;
      }
    }
  }

  const titulos = (TITULOS[moduloId] && TITULOS[moduloId][apartadoKey]) || [];
  const titulo = titulos[Number(subNum) - 1] || humanize(rest);

  CLASES[moduloId] = CLASES[moduloId] || {};
  CLASES[moduloId][apartadoKey] = CLASES[moduloId][apartadoKey] || [];
  CLASES[moduloId][apartadoKey].push({
    num,
    n: Number(subNum),
    titulo,
    slug: base,
    pdf: `clases/${file}`,
    pages,
  });
}

// Ordenar cada apartado por número de subtema
for (const mod of Object.keys(CLASES))
  for (const apa of Object.keys(CLASES[mod])) CLASES[mod][apa].sort((a, b) => a.n - b.n);

const out =
  `/* ============================================================
   CLASES.JS — Manifiesto de clases (sub-apartados) por módulo
   ------------------------------------------------------------
   GENERADO automáticamente por scripts/build-clases.js — NO editar a mano.
   Estructura: CLASES[moduloId][apartadoKey] = [ { num, titulo, pdf, pages[] } ]
   Cada clase = un PDF descargable + sus páginas renderizadas (PNG).
   ============================================================ */\n` +
  "const CLASES = " +
  JSON.stringify(CLASES, null, 2) +
  ";\n";

fs.writeFileSync(path.join(REPO, "js", "clases.js"), out, "utf8");

console.log(`OK · ${copiados} PDFs, ${paginas} páginas copiadas → clases/`);
console.log("Manifiesto escrito en js/clases.js");
for (const mod of Object.keys(CLASES))
  for (const apa of Object.keys(CLASES[mod]))
    console.log(`  ${mod} · ${apa}: ${CLASES[mod][apa].length} clases`);
