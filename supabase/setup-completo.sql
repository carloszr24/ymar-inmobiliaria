-- Setup completo para proyecto Supabase (inmobiliaria)
-- Ejecutar en: Supabase Dashboard → SQL Editor → Run
-- Proyecto ref: gddippjiuhsgctagssem

-- ─── 1. Propiedades ─────────────────────────────────────────────────────────

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  price double precision not null,
  location text not null,
  type text not null,
  status text not null default 'disponible',
  description text not null,
  images text not null,
  fotocasa_url text,
  bedrooms integer,
  bathrooms integer,
  sq_meters double precision,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists properties_created_at_idx on public.properties (created_at desc);
create index if not exists properties_featured_idx on public.properties (featured) where featured = true;

alter table public.properties enable row level security;

drop policy if exists "properties_select_public" on public.properties;
create policy "properties_select_public"
  on public.properties for select
  to anon, authenticated
  using (true);

-- Columnas adicionales
alter table public.properties
  add column if not exists availability text,
  add column if not exists hot_water text,
  add column if not exists heating text,
  add column if not exists condition text,
  add column if not exists property_age text,
  add column if not exists garage text,
  add column if not exists elevator text,
  add column if not exists furnished text,
  add column if not exists energy_rating text,
  add column if not exists energy_value double precision,
  add column if not exists emissions_rating text,
  add column if not exists emissions_value double precision;

alter table public.properties
  add column if not exists operation text not null default 'venta';

alter table public.properties
  add column if not exists floor text;

-- ─── 2. Leads ─────────────────────────────────────────────────────────────

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text not null,
  source text not null default 'web_contacto',
  intent text not null default 'comprar',
  status text not null default 'nuevo',
  priority text not null default 'media',
  property_ref text,
  notes text,
  sale_timeline text,
  assigned_to text,
  first_response_at timestamptz,
  last_contact_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);

alter table public.leads enable row level security;

-- Escrituras vía API con SUPABASE_SERVICE_ROLE_KEY (bypass RLS)

-- ─── 3. Storage: fotos de propiedades ───────────────────────────────────────

insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do update set public = true;

-- Lectura pública de imágenes
drop policy if exists "property_images_public_read" on storage.objects;
create policy "property_images_public_read"
  on storage.objects for select
  to public
  using (bucket_id = 'property-images');
