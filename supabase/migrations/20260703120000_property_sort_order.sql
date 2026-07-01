alter table public.properties
  add column if not exists sort_order integer not null default 0;

with ranked as (
  select id, (row_number() over (order by created_at desc) - 1)::integer as rn
  from public.properties
)
update public.properties p
set sort_order = ranked.rn
from ranked
where p.id = ranked.id;

create index if not exists properties_sort_order_idx on public.properties (sort_order);
