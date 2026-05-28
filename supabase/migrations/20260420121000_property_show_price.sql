alter table public.properties
  add column if not exists show_price boolean not null default false;

