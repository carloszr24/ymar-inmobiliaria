-- Ejecutar en Supabase → SQL Editor (proyecto de tu .env)
-- Crea tabla properties, políticas RLS y bucket de imágenes

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
  add column if not exists emissions_value double precision,
  add column if not exists operation text not null default 'venta',
  add column if not exists floor text,
  add column if not exists show_price boolean not null default false;

create index if not exists properties_created_at_idx on public.properties (created_at desc);
create index if not exists properties_featured_idx on public.properties (featured) where featured = true;

alter table public.properties enable row level security;

drop policy if exists "properties_select_public" on public.properties;
create policy "properties_select_public"
  on public.properties for select
  to anon, authenticated
  using (true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'property-images',
  'property-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update set public = true;

drop policy if exists "property_images_public_read" on storage.objects;
create policy "property_images_public_read"
on storage.objects for select to public
using (bucket_id = 'property-images');
