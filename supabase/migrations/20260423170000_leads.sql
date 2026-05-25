-- Tabla de leads (contacto, valoración, etc.)

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

-- Lecturas/escrituras: API del servidor con SUPABASE_SERVICE_ROLE_KEY (bypass RLS).
