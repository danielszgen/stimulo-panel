# Stimulo · Panel interno

Herramienta interna del estudio: **formación del equipo en IA** + **gestión de tareas**
(diseño, marketing, ingeniería, compras/admin), con login y dashboard de progreso.

Es una web estática (HTML/CSS/JS, sin build) que funciona en dos modos:

| Modo | Cuándo | Datos | Login |
|------|--------|-------|-------|
| **Demo** | `config.js` sin URL/key | localStorage del navegador | Simulado (selector de cuenta) |
| **Supabase** | `config.js` con URL + anon key | Base de datos en la nube | Google real (OAuth) |

---

## 0. Probarlo ya en local (modo demo)

```bash
cd dominar-claude
python3 -m http.server 8090
# abre http://localhost:8090
```

Pulsa **Continuar con Google** → elige una cuenta del equipo → ya estás dentro.
Todo se guarda en tu navegador. No necesitas nada más para ver cómo funciona.

---

## 1. Subirlo a GitHub

> El repositorio **debe tener `index.html` en la raíz** (esta carpeta `dominar-claude`).

```bash
cd dominar-claude
git init
git add .
git commit -m "Panel interno de Stimulo"
git branch -M main
```

Crea el repo y empújalo. Con GitHub CLI:

```bash
gh auth login              # si da error 401, vuelve a autenticarte aquí
gh repo create stimulo-panel --public --source=. --push
```

O manual (crea el repo vacío en github.com primero):

```bash
git remote add origin https://github.com/TU_USUARIO/stimulo-panel.git
git push -u origin main
```

---

## 2. Crear el proyecto Supabase

1. Entra en <https://supabase.com> → **New project** (elige nombre, contraseña de BD y región).
2. Cuando termine, ve a **Settings → API** y copia:
   - **Project URL** → `https://xxxx.supabase.co`
   - **anon public** key → `eyJhbGci...`

## 3. Crear las tablas

En Supabase: **SQL Editor → New query**, pega el contenido de
[`supabase/schema.sql`](supabase/schema.sql) y pulsa **Run**.
Esto crea `profiles`, `tasks`, `module_progress`, los triggers y las políticas de seguridad (RLS).

## 4. Activar el login con Google

**4.1 — En Google Cloud** (<https://console.cloud.google.com>):
1. Crea (o elige) un proyecto → **APIs & Services → Credentials**.
2. **Create credentials → OAuth client ID → Web application**.
3. En **Authorized redirect URIs** añade la URL de callback de Supabase:
   ```
   https://xxxx.supabase.co/auth/v1/callback
   ```
4. Copia el **Client ID** y el **Client secret**.

**4.2 — En Supabase** → **Authentication → Providers → Google**:
1. Actívalo y pega el **Client ID** y **Client secret**.
2. En **Authentication → URL Configuration**:
   - **Site URL**: la URL pública de tu web (ver paso 6), p. ej. `https://TU_USUARIO.github.io/stimulo-panel/`
   - **Redirect URLs**: añade esa misma URL (y `http://localhost:8090` para pruebas locales).

> Sólo podrán entrar las cuentas de Google que autorices según la pantalla de consentimiento
> (puedes restringir al dominio del estudio).

## 5. Conectar la web con Supabase

Abre [`js/config.js`](js/config.js) y rellena:

```js
const CONFIG = {
  SUPABASE_URL: "https://xxxx.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGci...",
  ...
};
```

En cuanto los dos campos tengan valor, la web deja el modo demo y usa Supabase.
> La **anon key es pública** por diseño: es seguro subirla al repo. La seguridad la dan las políticas RLS del paso 3.

```bash
git add js/config.js && git commit -m "Conectar Supabase" && git push
```

---

## 6. Desplegar (GitHub Pages)

1. En el repo de GitHub: **Settings → Pages**.
2. **Build and deployment → Source: Deploy from a branch**.
3. Branch: **main** · carpeta: **/ (root)** → **Save**.
4. En 1-2 min tendrás la web en `https://TU_USUARIO.github.io/stimulo-panel/`.
5. **Vuelve al paso 4.2** y pon esa URL como *Site URL* y *Redirect URL* en Supabase.

> Alternativa: **Vercel** (`vercel deploy`). Da una URL sin subcarpeta, cómoda para OAuth.
> Recuerda añadir también esa URL en las *Redirect URLs* de Supabase.

---

## 7. Comprobar que funciona

- Abre la URL pública → **Continuar con Google** → inicia con tu cuenta del estudio.
- Crea una tarea y muévela de columna → recarga: debe seguir ahí (está en la BD).
- Marca un módulo como completado → el % del dashboard sube.
- Invita a tu equipo: cada uno entra con su Google y aparece como responsable asignable.

---

## Estructura del proyecto

```
dominar-claude/
├── index.html            # estructura de la app
├── css/styles.css        # estilos (panel interno)
├── js/
│   ├── config.js         # ← URL + anon key de Supabase
│   ├── content.js        # contenido de los 20 módulos de formación
│   ├── db.js             # cliente Supabase + helpers
│   ├── store.js          # capa de datos (localStorage o Supabase)
│   ├── auth.js           # login (demo o Google real)
│   └── app.js            # UI: dashboard, formación, tablero
└── supabase/schema.sql   # tablas + RLS (ejecutar en Supabase)
```
