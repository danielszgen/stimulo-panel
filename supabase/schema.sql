-- ============================================================
-- Stimulo · Panel interno — Esquema de base de datos (Supabase)
-- ------------------------------------------------------------
-- Cómo ejecutarlo:
--   Supabase → tu proyecto → SQL Editor → New query
--   Pega TODO este archivo y pulsa "Run".
-- Es idempotente: puedes volver a ejecutarlo sin romper nada.
-- ============================================================

-- 1) PERFILES (uno por usuario que entra con Google) ----------
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text,
  full_name  text,
  rol        text default 'Equipo',
  created_at timestamptz default now()
);

-- Crear el perfil automáticamente cuando alguien se registra
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', new.email)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Backfill: crea perfiles para usuarios que ya existieran
insert into public.profiles (id, email, full_name)
select id, email, coalesce(raw_user_meta_data->>'full_name', email)
from auth.users
on conflict (id) do nothing;

-- 2) TAREAS ---------------------------------------------------
create table if not exists public.tasks (
  id          uuid primary key default gen_random_uuid(),
  titulo      text not null,
  descripcion text default '',
  area        text not null  check (area  in ('diseno','marketing','ingenieria','compras')),
  estado      text not null default 'pendiente'
                            check (estado in ('pendiente','curso','revision','hecho')),
  responsable uuid references public.profiles(id) on delete set null,
  created_by  uuid references public.profiles(id) on delete set null,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- updated_at automático al actualizar una tarea
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists tasks_touch on public.tasks;
create trigger tasks_touch
  before update on public.tasks
  for each row execute procedure public.touch_updated_at();

-- 3) PROGRESO DE FORMACIÓN (por usuario y módulo) -------------
create table if not exists public.module_progress (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  module_id  text not null,
  estado     text not null check (estado in ('curso','hecho')),
  updated_at timestamptz default now(),
  unique (user_id, module_id)
);

-- 4) ROW LEVEL SECURITY ---------------------------------------
alter table public.profiles        enable row level security;
alter table public.tasks           enable row level security;
alter table public.module_progress enable row level security;

-- Perfiles: el equipo se ve entre sí; cada uno edita solo el suyo
drop policy if exists "perfiles: leer"   on public.profiles;
drop policy if exists "perfiles: editar" on public.profiles;
create policy "perfiles: leer"   on public.profiles for select to authenticated using (true);
create policy "perfiles: editar" on public.profiles for update to authenticated using (auth.uid() = id);

-- Tareas: herramienta de equipo → cualquiera autenticado gestiona
drop policy if exists "tareas: leer"       on public.tasks;
drop policy if exists "tareas: crear"      on public.tasks;
drop policy if exists "tareas: actualizar" on public.tasks;
drop policy if exists "tareas: borrar"     on public.tasks;
create policy "tareas: leer"       on public.tasks for select to authenticated using (true);
create policy "tareas: crear"      on public.tasks for insert to authenticated with check (true);
create policy "tareas: actualizar" on public.tasks for update to authenticated using (true);
create policy "tareas: borrar"     on public.tasks for delete to authenticated using (true);

-- Progreso: cada usuario solo el suyo
drop policy if exists "progreso: leer"       on public.module_progress;
drop policy if exists "progreso: crear"      on public.module_progress;
drop policy if exists "progreso: actualizar" on public.module_progress;
drop policy if exists "progreso: borrar"     on public.module_progress;
create policy "progreso: leer"       on public.module_progress for select to authenticated using (auth.uid() = user_id);
create policy "progreso: crear"      on public.module_progress for insert to authenticated with check (auth.uid() = user_id);
create policy "progreso: actualizar" on public.module_progress for update to authenticated using (auth.uid() = user_id);
create policy "progreso: borrar"     on public.module_progress for delete to authenticated using (auth.uid() = user_id);

-- ============================================================
-- (Opcional) Tareas de ejemplo. Descomenta y ejecuta SÓLO
-- después de haber entrado al menos una vez con Google, y
-- sustituye 'TU_UUID' por tu id (lo ves en Authentication → Users).
-- ============================================================
-- insert into public.tasks (titulo, descripcion, area, estado, responsable, created_by) values
--   ('Identidad visual — cliente Müller', 'Logo, paleta y aplicaciones.', 'diseno', 'curso', 'TU_UUID', 'TU_UUID'),
--   ('Campaña LinkedIn Q3', 'Plan de 8 publicaciones.', 'marketing', 'pendiente', 'TU_UUID', 'TU_UUID');
