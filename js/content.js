/* ============================================================
   CONTENIDO.JS — Fuente de verdad del sitio "Dominar Claude"
   ------------------------------------------------------------
   Toda la web se genera desde esta estructura de datos.
   Para añadir/editar módulos: edita este archivo.
   Cada módulo tiene 5 apartados: intro, fundamentos, ejemplos,
   ejercicios y recursos. Formato de texto admitido:
     - Párrafos separados por línea en blanco
     - Listas: líneas que empiezan por "- "
     - Bloques de código entre triple backtick
     - Inline: `código` y **negrita**
   ============================================================ */

const SITE = {
  titulo: "Dominar Claude",
  subtitulo: "Mapa completo de conocimiento — fundamentos, ingeniería y administración con IA",
  autor: "Daniel Lozano · Stimulo",
};

/* Cada sección agrupa módulos. Cada módulo es una "ficha" navegable
   con apartados: intro, fundamentos, ejemplos, ejercicios y recursos. */

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
        intro: `El **prompt** es el lenguaje con el que diriges a Claude. La diferencia entre un resultado mediocre y uno excelente casi nunca está en el modelo: está en cómo formulas la petición.

En esta clase aprendes el principio que lo gobierna todo: **claridad + contexto + formato**. Un buen prompt le dice a Claude *qué* quieres, *para quién* es, y *cómo* debe entregarlo. Todo lo demás son variaciones sobre esa idea.`,
        fundamentos: `Los cuatro patrones que cubren el 90% de los casos:

- **Zero-shot:** pides la tarea directamente, sin ejemplos. Funciona cuando la tarea es común y clara.
- **Few-shot:** das 2-3 ejemplos de entrada→salida antes de tu petición real. Es la forma más fiable de fijar formato y estilo.
- **Chain-of-thought:** pides que razone paso a paso antes de responder. Mejora drásticamente la precisión en tareas con lógica.
- **Role prompting:** asignas un rol (\`Actúa como auditor financiero senior\`). Cambia el vocabulario, el nivel de detalle y los criterios.

Regla de oro: **sé específico**. \`Resume esto\` es ambiguo. \`Resume esto en 5 viñetas para un director no técnico, máximo 15 palabras por viñeta\` es accionable.`,
        ejemplos: `**Vago vs. específico**

\`\`\`
❌ Escríbeme un email para un cliente.

✅ Eres responsable de cuentas de una ingeniería industrial.
Escribe un email al cliente Müller GmbH avisando de un
retraso de 5 días en la entrega del lote por un problema
de proveedor. Tono: profesional, honesto, sin excusas.
Ofrece una fecha nueva y una compensación. Máx. 120 palabras.
\`\`\`

**Few-shot para fijar formato**

\`\`\`
Clasifica el sentimiento. Ejemplos:
"Llegó tarde pero el producto es bueno" → Mixto
"Justo lo que necesitaba" → Positivo

Ahora clasifica: "Funciona, aunque el soporte tardó"
\`\`\``,
        ejercicios: `**Práctica (~2,5 min):**

- Coge un prompt tuyo reciente que diera un resultado pobre.
- Reescríbelo añadiendo las 3 capas: **rol** (quién es Claude), **contexto** (para quién/para qué) y **formato** (longitud, estructura, tono).
- Lánzalo y compara con el original.

**Reto extra:** añade un ejemplo (few-shot) y observa cómo se estabiliza la salida.`,
        recursos: `- Guía oficial de prompt engineering: https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview
- Biblioteca de prompts de Anthropic: https://docs.anthropic.com/en/resources/prompt-library/library
- **Truco:** pídele a Claude que mejore tu propio prompt antes de usarlo.`,
      },
      {
        id: "gestion-contexto",
        icono: "📐",
        titulo: "Gestión del contexto",
        resumen: "Cómo Claude usa la memoria de la conversación y cómo estructurarla a tu favor.",
        tags: ["Ventana de contexto", "System prompt", "Historial"],
        color: "teal",
        intro: `Claude no tiene memoria entre conversaciones: **todo lo que sabe en un momento dado está en la ventana de contexto**. Entender qué cabe ahí y cómo organizarlo es lo que separa una sesión productiva de una que se pierde en idas y venidas.

Piensa en el contexto como la mesa de trabajo de Claude: si está ordenada y solo tiene lo relevante, trabaja rápido y bien. Si está saturada de información irrelevante, se distrae.`,
        fundamentos: `- **Ventana de contexto:** el total de texto (entrada + salida) que el modelo procesa a la vez. Claude maneja cientos de miles de tokens, pero más no siempre es mejor: lo importante debe destacar.
- **System prompt:** instrucciones de alto nivel que fijan rol y reglas para toda la conversación. Es lo más "pegajoso".
- **Historial:** los mensajes previos. Claude los relee cada turno, así que las contradicciones acumuladas confunden.
- **Posición importa:** lo que pones al **principio** (instrucciones) y al **final** (la pregunta concreta) pesa más. Mete los documentos largos en el medio.`,
        ejemplos: `**Estructura recomendada para tareas con documentos**

\`\`\`
[Instrucción: qué quiero que hagas]

<documento>
... texto largo aquí ...
</documento>

[Repite la pregunta concreta al final]
\`\`\`

**Reiniciar en vez de corregir**

Si una conversación se ha llenado de intentos fallidos, no sigas peleando: abre una nueva, pega solo el contexto bueno y la instrucción depurada. Sale más limpio y más barato.`,
        ejercicios: `**Práctica (~2,5 min):**

- Toma un texto largo (un PDF, un acta, un hilo de email).
- Pégalo a Claude usando etiquetas \`<documento>...</documento>\` y pon la instrucción **antes** y la pregunta concreta **después** del bloque.
- Compara la calidad frente a pegarlo sin estructura.

**Reto extra:** pídele un resumen y luego "responde solo con lo que esté en el documento, di *no aparece* si falta".`,
        recursos: `- Long context tips: https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/long-context-tips
- Uso de etiquetas XML: https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-xml-tags`,
      },
      {
        id: "razonamiento",
        icono: "🔍",
        titulo: "Razonamiento y análisis",
        resumen: "Cómo Claude piensa. Cómo activar su capacidad analítica más profunda.",
        tags: ["Think step by step", "Extended thinking", "Razonamiento crítico"],
        color: "blue",
        intro: `Para tareas con lógica, cálculo o decisiones, la calidad de Claude se dispara cuando le **das espacio para pensar antes de responder**. Una respuesta inmediata suele ser una intuición; una respuesta razonada es un análisis.

Esta clase trata sobre cómo provocar ese razonamiento explícito y cómo usarlo para detectar errores antes de que lleguen a tu output final.`,
        fundamentos: `- **Pensar antes de concluir:** pide \`razona paso a paso y da la conclusión al final\`. El propio acto de escribir el razonamiento mejora la respuesta.
- **Extended thinking:** en los modelos recientes puedes activar un modo de razonamiento extendido para problemas difíciles (matemáticas, lógica multi-paso, planificación).
- **Razonamiento crítico:** pídele que **argumente en contra** de su propia respuesta. Encuentra fallos que una sola pasada no ve.
- **Separar análisis de conclusión:** usa etiquetas \`<analisis>\` y \`<respuesta>\` para que puedas leer solo la conclusión cuando la necesites.`,
        ejemplos: `**Forzar el razonamiento estructurado**

\`\`\`
Tengo 3 proveedores con estos precios y plazos [datos].
Antes de recomendar, piensa paso a paso:
1) coste total con transporte
2) riesgo de plazo
3) impacto en mi fecha de entrega
Escribe el análisis en <analisis> y la recomendación
final en <respuesta>.
\`\`\`

**Autocrítica**

\`\`\`
Esta es tu recomendación. Ahora actúa como revisor escéptico:
¿qué supuesto podría estar equivocado? ¿qué dato falta?
\`\`\``,
        ejercicios: `**Práctica (~2,5 min):**

- Plantéale una decisión real con 2-3 opciones (un proveedor, una herramienta, un enfoque).
- Pídele que **razone paso a paso** los criterios y dé la conclusión al final.
- Luego pídele que critique su propia recomendación buscando el punto débil.

**Reto extra:** dale un problema con un número y comprueba si el razonamiento paso a paso evita un error que la respuesta directa cometía.`,
        recursos: `- Extended thinking: https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking
- Let Claude think (chain of thought): https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/chain-of-thought`,
      },
      {
        id: "creatividad",
        icono: "🎨",
        titulo: "Creatividad y escritura",
        resumen: "Claude como co-creador. Voz, tono, estilo y escritura estratégica.",
        tags: ["Tono y voz", "Iteración creativa", "Copywriting", "Storytelling"],
        color: "coral",
        intro: `Claude escribe bien por defecto, pero escribe **como tú** solo si se lo enseñas. La escritura de calidad con IA no es pedir "un texto bonito": es definir voz, audiencia e intención, y luego iterar.

En esta clase pasas de "genérico que suena a IA" a textos con personalidad propia y propósito claro.`,
        fundamentos: `- **Define la voz con ejemplos, no con adjetivos:** en vez de "tono cercano", pega un párrafo tuyo y di \`escribe con esta voz\`.
- **Audiencia + objetivo:** "para LinkedIn, lectores técnicos, objetivo: que pidan una demo" cambia todo el texto.
- **Itera por capas:** primero estructura, luego contenido, luego pulido. No pidas la versión final de una vez.
- **Pide variantes:** \`dame 3 titulares con ángulos distintos\` rinde más que pedir uno "perfecto".
- **Edita en voz alta:** \`márcame las frases que suenan a IA y reescríbelas más humanas\`.`,
        ejemplos: `**Clonar tu estilo**

\`\`\`
Aquí tienes 2 textos míos [pega]. Analiza mi estilo:
ritmo, longitud de frase, vocabulario, uso de ejemplos.
Luego escribe un post sobre [tema] imitando esa voz.
\`\`\`

**Copywriting con ángulos**

\`\`\`
Producto: software de gestión de OTs para talleres.
Dame 3 ganchos de apertura: uno por dolor, uno por
aspiración, uno por dato sorprendente. Máx. 2 frases cada uno.
\`\`\``,
        ejercicios: `**Práctica (~2,5 min):**

- Pega 1-2 textos tuyos y pídele que describa tu estilo en 5 rasgos.
- Pídele que escriba un texto nuevo corto (un email o un post) imitando esa voz.
- Marca lo que no suena a ti y pídele una segunda pasada.

**Reto extra:** pídele la misma idea en 3 tonos (formal, cercano, provocador) y quédate con la mezcla.`,
        recursos: `- Prompt library (escritura y marketing): https://docs.anthropic.com/en/resources/prompt-library/library
- **Truco:** guarda tu "perfil de voz" (los 5 rasgos) para reutilizarlo en cada sesión.`,
      },
      {
        id: "codigo",
        icono: "⚙️",
        titulo: "Código y tareas técnicas",
        resumen: "Claude como engineer. Debug, generación, revisión y arquitectura.",
        tags: ["Debug", "Code review", "Arquitectura", "Explicación técnica"],
        color: "amber",
        intro: `Claude es un par de programación excelente, pero rinde según cómo le pases el problema. Darle el error completo, el código relevante y lo que esperabas convierte un "no funciona" en una solución en un turno.

Esta clase te enseña a usar Claude para los cuatro trabajos técnicos clave: **generar, depurar, revisar y explicar** código.`,
        fundamentos: `- **Debug eficaz:** pega el **error completo**, el fragmento que falla y *qué esperabas que pasara*. El stack trace vale oro.
- **Generación:** especifica lenguaje, versión, librerías permitidas y estilo. \`Python 3.11, solo stdlib, con type hints\`.
- **Code review:** \`revisa este código buscando bugs, casos límite y problemas de rendimiento; ordena por gravedad\`.
- **Explicación:** \`explícame esta función como si liderara el equipo pero no conociera esta librería\`.
- **Pide pruebas:** que acompañe el código con casos de test es la mejor red de seguridad.`,
        ejemplos: `**Debug con contexto**

\`\`\`
Python 3.11. Esta función debería devolver el total con IVA
pero da None. Error y código:

[stack trace completo]
[función]

¿Causa raíz y fix mínimo?
\`\`\`

**Revisión priorizada**

\`\`\`
Revisa este endpoint. Lista problemas como:
[GRAVEDAD] descripción → fix sugerido.
Empieza por seguridad y datos, luego estilo.
\`\`\``,
        ejercicios: `**Práctica (~2,5 min):**

- Coge una función tuya y pídele a Claude que la revise listando problemas por gravedad.
- Elige el problema más grave y pídele el fix mínimo **con un test** que lo demuestre.

**Reto extra:** pídele que reescriba la función explicando cada decisión en comentarios, y compárala con la tuya.`,
        recursos: `- Claude Code (CLI para programar en la terminal): https://docs.anthropic.com/en/docs/claude-code/overview
- Anthropic cookbook (ejemplos de código): https://github.com/anthropics/anthropic-cookbook`,
      },
      {
        id: "investigacion",
        icono: "📊",
        titulo: "Investigación y análisis",
        resumen: "Claude como analista. Síntesis, comparación de fuentes e insights estratégicos.",
        tags: ["Síntesis de docs", "Comparación", "Extracción de insights"],
        color: "pink",
        intro: `Cuando tienes más información de la que puedes leer, Claude es tu analista: sintetiza, compara y extrae lo que importa. Pero un buen análisis exige una buena pregunta y exigir **trazabilidad** a las fuentes.

Esta clase te enseña a pasar de "léete esto" a "dime qué decisión tomar y por qué, citando de dónde sale cada dato".`,
        fundamentos: `- **Síntesis con anclaje:** pide que cada afirmación cite la fuente (\`[doc 2]\`). Reduce la invención.
- **Comparación estructurada:** pide una **tabla** con criterios en filas y opciones en columnas.
- **Insights, no resúmenes:** "¿qué patrón no obvio ves?", "¿qué contradice lo que esperaríamos?".
- **Gestiona la incertidumbre:** \`marca con (?) lo que no esté respaldado por las fuentes\`.
- **De análisis a decisión:** termina siempre con "recomendación y siguiente paso".`,
        ejemplos: `**Comparar fuentes**

\`\`\`
Te paso 3 informes de proveedores. Crea una tabla:
filas = precio, plazo, garantía, riesgo.
Cita el informe de cada dato. Al final, recomienda uno
y di qué dato te haría cambiar de opinión.
\`\`\`

**Extraer insights**

\`\`\`
Aquí hay 20 respuestas de clientes. Dame los 3 temas
recurrentes, una cita textual por tema, y el problema
que ninguno menciona pero está implícito.
\`\`\``,
        ejercicios: `**Práctica (~2,5 min):**

- Reúne 2-3 documentos sobre un mismo tema (ofertas, artículos, actas).
- Pídele una tabla comparativa con 3-4 criterios y que **cite la fuente** de cada celda.
- Pídele una recomendación final y "qué dato te haría cambiarla".

**Reto extra:** pídele que señale las contradicciones entre las fuentes.`,
        recursos: `- Summarization (guía): https://docs.anthropic.com/en/docs/about-claude/use-case-guides/legal-summarization
- **Truco:** combínalo con "Gestión del contexto" para meter los documentos con etiquetas y posición óptima.`,
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
        intro: `Cuando una tarea se repite, dejas de improvisar prompts y construyes **plantillas**: estructuras reutilizables que garantizan el mismo formato de salida una y otra vez. Y cuando no sabes cómo formular un prompt, usas **meta-prompting**: que Claude escriba el prompt por ti.

Esta clase es el salto de "usuario que pregunta" a "ingeniero de prompts" con activos reutilizables.`,
        fundamentos: `- **System prompt como contrato:** define rol, reglas inviolables y formato de salida una vez, y aplica a toda la sesión.
- **XML para estructurar:** \`<contexto>\`, \`<tarea>\`, \`<formato>\` separan las partes y reducen la ambigüedad.
- **Plantillas con variables:** deja huecos \`{{cliente}}\`, \`{{datos}}\` que rellenas en cada uso.
- **Meta-prompting:** \`Eres ingeniero de prompts. Escribe el mejor prompt para [objetivo], explicando cada decisión\`.
- **Salida en JSON:** cuando otro sistema va a consumir la respuesta, pide \`responde solo con JSON válido con este esquema\`.`,
        ejemplos: `**Plantilla con XML**

\`\`\`
<rol>Auditor de calidad de fabricación</rol>
<tarea>Revisa este informe de no conformidad</tarea>
<entrada>{{informe}}</entrada>
<formato>
- causa_raiz
- riesgo (alto/medio/bajo)
- accion_correctiva
Responde solo en JSON.
</formato>
\`\`\`

**Meta-prompting**

\`\`\`
Eres experto en prompting. Necesito un prompt que clasifique
emails de clientes en {queja, consulta, pedido}. Escríbelo,
con few-shot incluido, y dime por qué funciona.
\`\`\``,
        ejercicios: `**Práctica (~2,5 min):**

- Elige una tarea que repites cada semana.
- Pídele a Claude (meta-prompting) que te escriba una **plantilla reutilizable** con variables \`{{...}}\` y formato de salida fijo.
- Pruébala con un caso real rellenando las variables.

**Reto extra:** pide la salida en JSON y comprueba que es válido para automatizarlo después.`,
        recursos: `- System prompts: https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/system-prompts
- Salida estructurada / JSON: https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/increase-consistency`,
      },
      {
        id: "workflows",
        icono: "🔗",
        titulo: "Workflows y automatización",
        resumen: "Claude en flujos encadenados, API y sistemas agenticos. IA que trabaja sola.",
        tags: ["Flujos en cadena", "API", "Agentes IA", "Automatización"],
        color: "blue",
        intro: `Una cosa es chatear con Claude y otra es ponerlo a **trabajar solo** dentro de un flujo. Aquí Claude deja de ser una ventana de chat y pasa a ser un componente: recibe datos, los procesa y entrega un resultado que otro paso consume.

Esta clase introduce el encadenamiento (prompt chaining), la API y la idea de **agente**: un Claude que decide qué herramienta usar para cumplir un objetivo.`,
        fundamentos: `- **Prompt chaining:** divide una tarea grande en pasos. La salida de uno alimenta al siguiente. Más fiable que pedir todo de golpe.
- **API:** llamas a Claude desde código (Python, JS) y recibes la respuesta como dato, no como chat.
- **Tool use (function calling):** le das herramientas (funciones) y Claude decide cuándo llamarlas. La base de los agentes.
- **Bucle agentico:** Claude planifica → ejecuta una acción → observa el resultado → corrige. Repite hasta cumplir el objetivo.
- **Idempotencia y límites:** pon topes de iteraciones y valida salidas; un agente sin frenos es peligroso.`,
        ejemplos: `**Llamada básica a la API (Python)**

\`\`\`python
from anthropic import Anthropic
client = Anthropic()
msg = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=500,
    messages=[{"role": "user", "content": "Resume en 3 puntos: ..."}],
)
print(msg.content[0].text)
\`\`\`

**Cadena de 2 pasos**

\`\`\`
Paso 1: extrae los datos clave de esta factura → JSON.
Paso 2 (otra llamada): valida ese JSON contra la orden de compra
y marca discrepancias.
\`\`\``,
        ejercicios: `**Práctica (~2,5 min):**

- Diseña sobre papel un flujo de 3 pasos para una tarea tuya (p. ej.: leer email → extraer pedido → redactar confirmación).
- Para cada paso, escribe el prompt que recibiría y qué entrega al siguiente.

**Reto extra:** si tienes Python instalado, haz la llamada básica a la API de arriba con tu propia pregunta.`,
        recursos: `- Tool use (function calling): https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview
- Building effective agents: https://www.anthropic.com/research/building-effective-agents
- SDK de Python: https://github.com/anthropics/anthropic-sdk-python`,
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
        intro: `Blender trae un intérprete de Python completo (\`bpy\`), lo que lo convierte en el candidato perfecto para que Claude lo controle. Tú describes en lenguaje natural lo que quieres modelar o renderizar; Claude genera el script \`bpy\`; Blender lo ejecuta.

Esta clase te enseña el puente: cómo pasar de "quiero un soporte en L parametrizable" a geometría real generada por código.`,
        fundamentos: `- **\`bpy\` es la API:** todo lo que haces con clics tiene su equivalente en \`bpy.ops\` y \`bpy.data\`.
- **Ejecutar scripts:** desde la pestaña *Scripting* o por línea de comandos con \`blender --background --python script.py\`.
- **Paramétrico de verdad:** define variables al inicio (largo, ancho, grosor) y que la geometría se construya a partir de ellas.
- **Pídele a Claude el contexto correcto:** dile la versión de Blender; la API cambia entre versiones (sobre todo 3.x → 4.x).
- **Render batch:** un script puede variar parámetros, renderizar y guardar cada variante con nombre distinto.`,
        ejemplos: `**Cubo paramétrico con bpy**

\`\`\`python
import bpy
L, W, H = 2.0, 1.0, 0.5  # parámetros
bpy.ops.mesh.primitive_cube_add(size=1)
obj = bpy.context.active_object
obj.scale = (L/2, W/2, H/2)
obj.name = "Soporte"
\`\`\`

**Prompt para generar el script**

\`\`\`
Blender 4.2, Python bpy. Genera un script que cree un
soporte en L parametrizado por (largo, alto, grosor, radio_fillet).
Comenta cada bloque. No uses add-ons externos.
\`\`\``,
        ejercicios: `**Práctica (~2,5 min):**

- Abre Blender, pestaña *Scripting*.
- Pídele a Claude un script \`bpy\` que cree una primitiva con 2-3 parámetros al inicio (p. ej. un cilindro con radio y altura variables).
- Pégalo, ejecútalo y cambia un parámetro para ver la geometría actualizarse.

**Reto extra:** pídele que añada un bucle que genere 3 variantes con tamaños distintos.`,
        recursos: `- API de Blender Python (bpy): https://docs.blender.org/api/current/
- **Truco:** activa "Python Tooltips" en Preferencias para ver el comando bpy de cada botón.`,
      },
      {
        id: "solidworks",
        icono: "🔵",
        titulo: "Claude + SolidWorks",
        resumen: "Agente que controla SolidWorks vía COM API. Diseño paramétrico y exportación de planos.",
        tags: ["win32com", "Diseño paramétrico", "Configuraciones", "Export DXF/STEP"],
        color: "blue",
        intro: `SolidWorks expone una API COM muy completa que se puede controlar desde Python con \`pywin32\`. Eso permite que Claude genere scripts que abren modelos, cambian cotas, crean configuraciones y exportan planos sin tocar el ratón.

Esta clase muestra el patrón para automatizar lo repetitivo del diseño mecánico profesional.`,
        fundamentos: `- **COM + win32com:** \`win32com.client.Dispatch("SldWorks.Application")\` te da el objeto raíz.
- **Jerarquía de objetos:** App → Document → Feature/Dimension. Casi todo se navega por esa cadena.
- **Cotas con nombre:** referencia parámetros como \`"D1@Croquis1"\` para cambiarlos por código.
- **Configuraciones:** ideales para familias de piezas (mismo modelo, distintas medidas).
- **Exportación:** STEP/IGES para fabricación, DXF para corte láser/chapa, PDF para planos.`,
        ejemplos: `**Conectar y cambiar una cota**

\`\`\`python
import win32com.client as win32
sw = win32.Dispatch("SldWorks.Application")
sw.Visible = True
model = sw.ActiveDoc
model.Parameter("D1@Croquis1").SystemValue = 0.050  # 50 mm
model.EditRebuild3()
\`\`\`

**Prompt para generar el automatismo**

\`\`\`
SolidWorks API por COM (pywin32). Script que abra una pieza,
recorra una lista de anchos [40, 50, 60] mm, cambie la cota
"D1@Croquis1", reconstruya y exporte cada variante a STEP.
\`\`\``,
        ejercicios: `**Práctica (~2,5 min):**

- Abre una pieza sencilla en SolidWorks y anota el nombre de una cota (botón derecho → propiedades).
- Pídele a Claude un script Python (win32com) que cambie esa cota a un valor concreto y reconstruya.
- Si no tienes el entorno a mano, repasa el script y verifica que entiendes cada línea.

**Reto extra:** pide que el script exporte el resultado a STEP automáticamente.`,
        recursos: `- SolidWorks API Help: https://help.solidworks.com/ (sección API)
- pywin32: https://github.com/mhammond/pywin32
- **Truco:** graba una macro en SolidWorks y pídele a Claude que la traduzca de VBA a Python.`,
      },
      {
        id: "fusion360",
        icono: "🟣",
        titulo: "Claude + Fusion 360",
        resumen: "Agente que diseña en Fusion 360 vía su Python API. Sketches y variantes paramétricas.",
        tags: ["Fusion API", "Sketches auto", "Variantes paramétricas", "Export STL/STEP"],
        color: "purple",
        intro: `Fusion 360 tiene una API de Python nativa y un editor de scripts integrado. Es probablemente el CAD más cómodo para empezar a automatizar con Claude porque no necesitas configurar COM ni librerías externas.

Esta clase cubre cómo Claude genera *scripts* y *add-ins* que crean sketches, extrusiones y variantes paramétricas dentro de Fusion.`,
        fundamentos: `- **API nativa:** \`adsk.core\` y \`adsk.fusion\` son los módulos base; el script arranca desde \`run(context)\`.
- **Scripts vs add-ins:** los *scripts* se ejecutan una vez; los *add-ins* se quedan cargados con UI propia.
- **User Parameters:** define parámetros de usuario y cámbialos por código para variantes instantáneas.
- **Flujo típico:** crear sketch → dibujar perfil → extruir → aplicar operaciones.
- **Export:** STL para impresión 3D, STEP para fabricación, vía el \`ExportManager\`.`,
        ejemplos: `**Esqueleto de script de Fusion**

\`\`\`python
import adsk.core, adsk.fusion, traceback
def run(context):
    app = adsk.core.Application.get()
    design = app.activeProduct
    root = design.rootComponent
    sketches = root.sketches
    xy = root.xYConstructionPlane
    sk = sketches.add(xy)
    sk.sketchCurves.sketchCircles.addByCenterRadius(
        adsk.core.Point3D.create(0,0,0), 2.0)
\`\`\`

**Prompt**

\`\`\`
Fusion 360 Python API. Script que cree un disco de radio R
y lo extruya altura H, con R y H como User Parameters editables.
\`\`\``,
        ejercicios: `**Práctica (~2,5 min):**

- En Fusion 360: Utilities → Scripts and Add-Ins → crea un script Python nuevo.
- Pídele a Claude un script que dibuje un círculo y lo extruya, con radio y altura como parámetros.
- Ejecútalo y comprueba el sólido resultante.

**Reto extra:** pídele que defina R y H como *User Parameters* para poder cambiarlos desde la tabla de parámetros.`,
        recursos: `- Fusion 360 API & Scripts: https://help.autodesk.com/view/fusion360/ENU/?guid=GUID-A92A4B10-3781-4925-94C6-47DA85A4F65A
- **Truco:** en el editor de scripts de Fusion tienes ejemplos oficiales listos para abrir.`,
      },
      {
        id: "agente-python",
        icono: "🤖",
        titulo: "Agente Python agentico con Claude API",
        resumen: "El bucle completo: Claude planifica, Python ejecuta, el resultado vuelve a Claude.",
        tags: ["anthropic SDK", "Tool use", "Bucle plan→ejecutar→corregir", "Error handling"],
        color: "green",
        intro: `Este es el corazón de toda la sección de ingeniería: el **bucle agentico**. En vez de generar un script y copiarlo a mano, montas un programa Python donde Claude decide qué hacer, lo ejecuta como herramienta, ve el resultado (o el error) y corrige solo.

Esta clase une todo: API, tool use y manejo de errores en un patrón que puedes reutilizar para Blender, SolidWorks o lo que quieras.`,
        fundamentos: `- **Tool use:** defines herramientas (p. ej. \`ejecutar_python\`) con su esquema; Claude pide llamarlas cuando las necesita.
- **El bucle:** envías el objetivo → Claude responde con un \`tool_use\` → ejecutas la herramienta → devuelves el \`tool_result\` → repites.
- **Manejo de errores:** si la herramienta falla, devuelves el error como resultado; Claude lee la traza y corrige el script.
- **Frenos de seguridad:** límite de iteraciones, sandbox para el código, y validación de lo que se ejecuta.
- **Observabilidad:** registra cada paso (qué decidió, qué ejecutó, qué salió) para depurar.`,
        ejemplos: `**Esqueleto del bucle agentico**

\`\`\`python
from anthropic import Anthropic
client = Anthropic()
tools = [{
  "name": "ejecutar_python",
  "description": "Ejecuta código Python y devuelve stdout/errores",
  "input_schema": {"type":"object",
    "properties":{"code":{"type":"string"}},
    "required":["code"]},
}]
messages = [{"role":"user","content":"Crea un cubo en Blender de 3cm"}]
for _ in range(5):  # tope de iteraciones
    r = client.messages.create(model="claude-opus-4-8",
        max_tokens=1024, tools=tools, messages=messages)
    if r.stop_reason != "tool_use":
        break
    # ... ejecutar la herramienta y añadir tool_result a messages
\`\`\``,
        ejercicios: `**Práctica (~2,5 min):**

- Sobre papel, define la **herramienta** que tu agente necesitaría (nombre, descripción, parámetros).
- Escribe el objetivo en lenguaje natural y describe qué haría Claude en cada vuelta del bucle (planificar → ejecutar → corregir).

**Reto extra:** pídele a Claude que te complete el esqueleto de arriba con la parte de ejecutar la herramienta y devolver el \`tool_result\`.`,
        recursos: `- Tool use: https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview
- Building effective agents: https://www.anthropic.com/research/building-effective-agents
- Cookbook (agents): https://github.com/anthropics/anthropic-cookbook`,
      },
      {
        id: "casos-ingenieria",
        icono: "📋",
        titulo: "Casos de uso para ingeniería",
        resumen: "10 automatizaciones reales: variantes, BOM automático, tolerancias, documentación y optimización.",
        tags: ["Variantes de pieza", "BOM automático", "Análisis tolerancias", "Documentación auto"],
        color: "teal",
        intro: `Ya tienes las piezas (CAD + Python + agente). Esta clase es el catálogo de qué construir primero: automatizaciones con retorno inmediato en un departamento de ingeniería.

Elige una, mide cuánto tiempo te ahorra, y úsala como prueba de concepto para el resto.`,
        fundamentos: `Diez casos ordenados de menor a mayor complejidad:

- **Variantes de pieza:** una tabla de medidas → N modelos exportados.
- **BOM automático:** extraer la lista de materiales del ensamblaje a Excel/CSV.
- **Renombrado y orden:** normalizar nombres de archivos y propiedades.
- **Análisis de tolerancias:** comprobar que las cotas están dentro de rango.
- **Documentación auto:** generar la hoja de pieza (medidas, material, notas).
- **Comparar revisiones:** qué cambió entre la v1 y la v2.
- **Export multi-formato:** STEP + STL + DXF + PDF de un golpe.
- **Cálculos de diseño:** peso, coste de material, momento de inercia.
- **Generación de planos:** vistas y cotas básicas automáticas.
- **Informe de proyecto:** consolidar todo lo anterior en un PDF.`,
        ejemplos: `**Caso: BOM → CSV con Claude**

\`\`\`
Tengo el árbol del ensamblaje exportado [pego texto].
Genera un CSV con columnas: ref, descripción, cantidad,
material. Agrupa piezas idénticas y suma cantidades.
\`\`\`

**Caso: hoja de pieza automática**

\`\`\`
Con estos parámetros del modelo [datos], redacta la ficha
técnica: dimensiones, material, peso estimado, tolerancias
generales y 3 notas de fabricación.
\`\`\``,
        ejercicios: `**Práctica (~2,5 min):**

- Elige **un** caso de la lista que te quitaría más tiempo manual esta semana.
- Escribe en 3 líneas: qué entra (input), qué hace Claude, qué sale (output).
- Pídele a Claude que te proponga el primer paso para automatizarlo.

**Reto extra:** estima los minutos/semana que ahorrarías y ordena los 10 casos por ROI.`,
        recursos: `- Use case guides: https://docs.anthropic.com/en/docs/about-claude/use-case-guides/overview
- **Truco:** empieza por el caso más simple que de valor visible; gánate la confianza del equipo antes del agente completo.`,
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
        intro: `Compras es el primer eslabón donde la ingeniería se convierte en dinero. La BOM (lista de materiales) que sale del CAD puede transformarse, casi sola, en órdenes de compra optimizadas: Claude agrupa, compara proveedores y prepara las solicitudes.

Esta clase conecta el output técnico del bloque anterior con el flujo real de aprovisionamiento.`,
        fundamentos: `- **BOM como entrada:** un CSV con ref, cantidad y material es el punto de partida.
- **Agrupación inteligente:** Claude consolida piezas comunes y detecta lo que ya tienes en stock.
- **Comparación de proveedores:** precio + plazo + mínimo de pedido + histórico de fiabilidad.
- **Reglas de aprobación:** por debajo de X€ automático, por encima requiere visto bueno humano.
- **Salida accionable:** borrador de email/orden listo para enviar, nunca el envío automático sin revisión.`,
        ejemplos: `**De BOM a solicitud**

\`\`\`
Aquí la BOM (CSV) y la lista de 3 proveedores con sus tarifas.
Para cada material elige el proveedor óptimo (precio+plazo),
respeta pedidos mínimos, y genera un borrador de orden por
proveedor. Marca lo que supere 1.000€ para aprobación.
\`\`\`

**Aviso (requiere tu OK antes de enviar)**

> Recuerda: enviar la orden o el email al proveedor es una acción externa. Genera el borrador y revísalo tú antes de mandarlo.`,
        ejercicios: `**Práctica (~2,5 min):**

- Coge una BOM o lista de compra real (aunque sea de 5 líneas).
- Pásasela a Claude con 2 proveedores ficticios y pídele que elija el óptimo por línea y prepare el borrador de pedido.
- Revisa la lógica de su elección.

**Reto extra:** añade una regla de aprobación ("> 500€ marca para revisión") y comprueba que la respeta.`,
        recursos: `- Tool use para conectar email/Slack: https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview
- **Truco:** mantén SIEMPRE un humano en el envío final; automatiza la preparación, no el gatillo.`,
      },
      {
        id: "crm",
        icono: "🤝",
        titulo: "Integración con CRM",
        resumen: "Claude conecta el proyecto técnico con el cliente. Presupuestos, oportunidades y seguimiento.",
        tags: ["HubSpot / Salesforce API", "Propuestas auto", "Seguimiento inteligente", "Datos técnicos → oferta"],
        color: "blue",
        intro: `El CRM es donde vive la relación con el cliente. Claude puede traducir datos técnicos (un diseño, un cálculo de coste) en propuestas comerciales, mantener las oportunidades actualizadas y sugerir el siguiente contacto en el momento oportuno.

Esta clase cierra el círculo: del taller a la oferta que el cliente recibe.`,
        fundamentos: `- **API del CRM:** HubSpot y Salesforce exponen API REST; desde Python lees/escribes contactos, deals y notas.
- **Datos técnicos → oferta:** Claude convierte coste de material + horas en un presupuesto con la estructura comercial habitual.
- **Seguimiento inteligente:** detecta oportunidades estancadas y propone el próximo paso y el texto del mensaje.
- **Resumen de cuenta:** ante una reunión, Claude sintetiza todo el histórico del cliente en 5 puntos.
- **Privacidad:** trata los datos de cliente con cuidado; no los expongas en URLs ni servicios externos no autorizados.`,
        ejemplos: `**De coste técnico a propuesta**

\`\`\`
Proyecto: 12h ingeniería (60€/h) + 340€ material + 15% margen.
Cliente: Müller GmbH, sector automoción.
Redacta una propuesta comercial profesional con resumen,
desglose, plazo (3 semanas) y condiciones. Tono formal.
\`\`\`

**Preparar una reunión**

\`\`\`
Aquí el histórico del cliente [notas del CRM]. Dame un
briefing de 5 puntos: estado, último contacto, objeciones
abiertas, oportunidad activa y siguiente paso recomendado.
\`\`\``,
        ejercicios: `**Práctica (~2,5 min):**

- Toma un proyecto real con sus costes básicos.
- Pídele a Claude que genere una propuesta comercial completa a partir de esos números.
- Pídele también un "briefing de reunión" de 5 puntos como si fuera para el comercial.

**Reto extra:** dale 3 oportunidades con fechas de último contacto y pídele cuál perseguir primero y por qué.`,
        recursos: `- HubSpot API: https://developers.hubspot.com/docs/api/overview
- Salesforce REST API: https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/
- **Truco:** guarda una plantilla de propuesta como "estilo de empresa" para que todas salgan consistentes.`,
      },
      {
        id: "contabilidad",
        icono: "📒",
        titulo: "Fundamentos de contabilidad + IA",
        resumen: "Lo que necesitas saber de contabilidad para automatizarla. Asientos, IVA, cierre mensual.",
        tags: ["Asientos contables", "IVA automatizado", "Cierre mensual", "Clasificación de gastos"],
        color: "amber",
        intro: `No necesitas ser contable para automatizar contabilidad, pero sí entender el lenguaje: qué es un asiento, cómo funciona el IVA y qué pasa en un cierre. Esta clase te da ese mínimo imprescindible para que Claude trabaje con criterio y tú detectes si se equivoca.

La IA acelera la contabilidad, pero la responsabilidad legal y fiscal sigue siendo humana.`,
        fundamentos: `- **Partida doble:** todo asiento tiene Debe = Haber. Si no cuadra, está mal.
- **Plan contable:** cada gasto/ingreso va a una cuenta (p. ej. 600 compras, 700 ventas). Clasificar bien es el 80% del trabajo.
- **IVA:** repercutido (ventas) menos soportado (compras) = a liquidar. Tipos en España: 21%, 10%, 4%.
- **Cierre mensual:** conciliar banco, revisar pendientes, cuadrar IVA, sacar resultado del periodo.
- **No es asesoramiento fiscal:** Claude ayuda a organizar y proponer; un profesional valida lo que va a Hacienda.`,
        ejemplos: `**Clasificar un gasto**

\`\`\`
Gasto: factura de 121€ (100€ + 21% IVA) de material de
oficina. Proponme el asiento en partida doble con cuentas
del PGC español y separa la base del IVA soportado.
\`\`\`

**Explicar un concepto**

\`\`\`
Explícame, con un ejemplo numérico simple, cómo se calcula
el IVA a liquidar de un trimestre si vendí 10.000€ y compré
4.000€ (ambos +21%).
\`\`\``,
        ejercicios: `**Práctica (~2,5 min):**

- Dale a Claude 3 gastos reales (importe + concepto) y pídele el asiento de cada uno separando base e IVA.
- Comprueba que Debe = Haber en cada asiento.

**Reto extra:** pídele que calcule el IVA a liquidar del conjunto y que te explique el resultado en una frase.`,
        recursos: `- Agencia Tributaria (IVA): https://sede.agenciatributaria.gob.es/
- Plan General Contable (referencia): https://www.boe.es/buscar/act.php?id=BOE-A-2007-19884
- **Aviso:** Claude no sustituye a tu asesor fiscal; valida siempre lo que se presenta oficialmente.`,
      },
      {
        id: "facturas",
        icono: "🧾",
        titulo: "Procesador automático de facturas",
        resumen: "OCR + Claude extrae, interpreta y clasifica facturas. Las valida contra órdenes de compra.",
        tags: ["OCR + PyMuPDF", "Claude clasifica", "Validación vs OC", "Export a contabilidad"],
        color: "green",
        intro: `Procesar facturas a mano es de las tareas administrativas más tediosas y con más errores. Con OCR + Claude puedes extraer los datos de cualquier factura (PDF o foto), clasificarla y validarla contra la orden de compra automáticamente.

Esta clase es el caso de automatización con ROI más rápido y visible de todo el bloque administrativo.`,
        fundamentos: `- **Capa OCR/extracción:** PDFs nativos con PyMuPDF/\`pdfplumber\`; imágenes/escaneos con OCR (Tesseract) o modelos de visión.
- **Claude estructura:** convierte el texto crudo en JSON con proveedor, NIF, fecha, base, IVA, total, líneas.
- **Validación:** cruza con la orden de compra (cantidades y precios) y marca discrepancias.
- **Clasificación contable:** asigna la cuenta de gasto según el concepto.
- **Export:** genera el asiento o el CSV para importar al programa contable.`,
        ejemplos: `**Extraer factura a JSON**

\`\`\`
Texto OCR de la factura [pego]. Devuélveme SOLO JSON:
{proveedor, nif, fecha, base, tipo_iva, cuota_iva, total,
lineas:[{concepto, cantidad, precio_unit, importe}]}.
Si un campo no aparece, ponlo como null.
\`\`\`

**Validar contra OC**

\`\`\`
Factura (JSON) vs Orden de Compra (JSON). Marca diferencias
en cantidad o precio por línea y di si se puede aprobar el pago.
\`\`\``,
        ejercicios: `**Práctica (~2,5 min):**

- Coge una factura real (cópiala como texto o descríbela).
- Pídele a Claude que la convierta al JSON estructurado de arriba.
- Verifica que base + IVA = total; si no cuadra, pídele que lo señale.

**Reto extra:** dale una "orden de compra" ficticia y pídele que detecte una diferencia de precio que introduzcas a propósito.`,
        recursos: `- PyMuPDF: https://pymupdf.readthedocs.io/
- Vision (analizar imágenes con Claude): https://docs.anthropic.com/en/docs/build-with-claude/vision
- **Truco:** pide siempre \`null\` en campos ausentes para no provocar invenciones.`,
      },
      {
        id: "dashboard",
        icono: "📈",
        titulo: "Dashboard de administración con IA",
        resumen: "Claude como analista de negocio. Consolida ingeniería, compras, CRM y contabilidad con alertas.",
        tags: ["Consolidación de datos", "Alertas automáticas", "Análisis de margen", "Dashboard Python"],
        color: "pink",
        intro: `Cuando todos los flujos anteriores generan datos, necesitas un sitio donde verlos juntos y que alguien te avise de lo que importa. Claude actúa como analista: consolida fuentes, calcula márgenes, detecta anomalías y redacta el resumen ejecutivo.

Esta clase convierte datos dispersos en decisiones.`,
        fundamentos: `- **Consolidación:** une datos de compras, ventas (CRM) y contabilidad en una sola tabla (pandas).
- **KPIs clave:** margen por proyecto, gasto vs presupuesto, días de cobro, facturas pendientes.
- **Alertas:** Claude define umbrales y avisa ("margen del proyecto X cayó del 18% al 9%").
- **Narrativa automática:** además del gráfico, un párrafo que explica *por qué* y *qué hacer*.
- **Visualización:** Streamlit o Plotly para un panel que el equipo abre en el navegador.`,
        ejemplos: `**Análisis de margen**

\`\`\`
Datos de 5 proyectos [tabla: ingresos, coste material,
horas, coste/h]. Calcula margen €/% de cada uno, ordénalos,
señala los 2 peores y dime la causa probable en una frase.
\`\`\`

**Resumen ejecutivo automático**

\`\`\`
Con estos KPIs del mes [datos], redacta un resumen de 4 líneas
para dirección: lo bueno, lo preocupante, y la acción prioritaria.
\`\`\``,
        ejercicios: `**Práctica (~2,5 min):**

- Reúne datos de 3-4 proyectos (ingresos y costes, aunque sean aproximados).
- Pídele a Claude que calcule el margen de cada uno y los ordene.
- Pídele un resumen ejecutivo de 4 líneas con la acción prioritaria.

**Reto extra:** define un umbral de alerta ("margen < 10%") y pídele que marque qué proyectos lo incumplen.`,
        recursos: `- Streamlit: https://docs.streamlit.io/
- pandas: https://pandas.pydata.org/docs/
- **Truco:** separa "calcular" (Python) de "interpretar" (Claude); cada uno hace lo que mejor sabe.`,
      },
      {
        id: "herramientas-propias",
        icono: "🛠️",
        titulo: "Crear herramientas propias de gestión",
        resumen: "Construye tus apps internas: presupuestos, calculadora de proyectos, gestor de OTs. Claude como motor.",
        tags: ["Streamlit / Flask", "Presupuestos técnicos", "Coste de proyecto", "Claude como motor"],
        color: "amber",
        intro: `El último salto: dejar de usar herramientas genéricas y **construir las tuyas**, a medida de tu empresa. Con Claude generando el código y actuando como motor de inteligencia, una app interna que antes costaba semanas se monta en horas.

Esta clase te enseña a pensar en producto: identificar el proceso doloroso y envolverlo en una mini-app.`,
        fundamentos: `- **Streamlit para empezar:** UI en Python puro, sin frontend; ideal para herramientas internas.
- **Flask/FastAPI para crecer:** cuando necesitas API, usuarios o integraciones.
- **Claude como motor:** la app llama a la API de Claude para la parte "inteligente" (redactar, clasificar, decidir).
- **Estado y datos:** empieza con CSV/SQLite; no sobre-ingenierices el v1.
- **Itera con Claude Code:** describe la app y deja que genere el esqueleto; tú revisas y ajustas.`,
        ejemplos: `**Calculadora de presupuestos (Streamlit)**

\`\`\`python
import streamlit as st
st.title("Presupuesto rápido")
horas = st.number_input("Horas ingeniería", 0.0)
material = st.number_input("Coste material €", 0.0)
margen = st.slider("Margen %", 0, 50, 15)
total = (horas*60 + material) * (1 + margen/100)
st.metric("Total", f"{total:,.2f} €")
\`\`\`

**Prompt para arrancar una app**

\`\`\`
Quiero una app Streamlit que registre Órdenes de Trabajo
(cliente, descripción, horas, estado) en un CSV y muestre
una tabla filtrable. Genérame el código completo del v1.
\`\`\``,
        ejercicios: `**Práctica (~2,5 min):**

- Identifica un proceso interno que hoy haces en Excel a mano.
- Descríbeselo a Claude y pídele el v1 de una app Streamlit que lo cubra.
- Lee el código y localiza dónde meterías la llamada a Claude para la parte "inteligente".

**Reto extra:** si tienes Python, instala Streamlit (\`pip install streamlit\`) y ejecuta la calculadora de arriba.`,
        recursos: `- Streamlit: https://docs.streamlit.io/
- Claude Code: https://docs.anthropic.com/en/docs/claude-code/overview
- **Truco:** v1 feo pero funcional > v3 perfecto que nunca lanzas.`,
      },
      {
        id: "automatizaciones-empresa",
        icono: "⚡",
        titulo: "8 automatizaciones empresariales",
        resumen: "Casos concretos para empresas técnicas: desde la BOM hasta el cierre contable.",
        tags: ["BOM → factura", "OC automática", "Pipeline CRM", "Cierre mensual"],
        color: "gray",
        intro: `Cierre de la formación: el catálogo de automatizaciones de extremo a extremo que conectan ingeniería, compras, CRM y contabilidad. Cada una une varios módulos del curso en un flujo que funciona solo.

Úsalo como hoja de ruta: implementa una, mídela, y encadena la siguiente.`,
        fundamentos: `Las ocho, en orden de implementación recomendado:

- **Factura → asiento contable:** OCR + clasificación + export. (Módulo Facturas)
- **BOM → orden de compra:** del CAD al pedido optimizado. (Compras)
- **Email de cliente → oportunidad en CRM:** clasificar y crear el deal. (CRM)
- **Proyecto técnico → propuesta comercial:** coste a oferta. (CRM)
- **Pipeline CRM con seguimiento:** avisos de oportunidades frías. (CRM)
- **Conciliación bancaria asistida:** cruzar extracto con facturas. (Contabilidad)
- **Cierre mensual semiautomático:** checklist + cuadres + resumen. (Dashboard)
- **Informe de dirección automático:** KPIs + narrativa cada mes. (Dashboard)`,
        ejemplos: `**Flujo extremo a extremo (diseño)**

\`\`\`
Disparador: llega una factura por email.
1) OCR extrae texto
2) Claude → JSON estructurado
3) valida contra la OC
4) si cuadra, genera asiento y lo deja en borrador
5) avisa por Slack para aprobación humana
\`\`\`

Cada paso es un módulo que ya has visto: aquí solo los encadenas.`,
        ejercicios: `**Práctica (~2,5 min):**

- Elige **una** de las 8 automatizaciones que más impacto tendría en tu empresa.
- Dibuja su flujo en 4-5 pasos indicando qué módulo del curso cubre cada uno.
- Marca dónde debe intervenir un humano (aprobaciones, envíos).

**Reto extra:** ordena las 8 por esfuerzo vs impacto y define cuál sería tu proyecto piloto.`,
        recursos: `- Building effective agents: https://www.anthropic.com/research/building-effective-agents
- Use case guides: https://docs.anthropic.com/en/docs/about-claude/use-case-guides/overview
- **Cierre:** cada automatización combina módulos previos. Empieza pequeño, mantén al humano en las decisiones críticas, y escala con datos que demuestren el ahorro.`,
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
