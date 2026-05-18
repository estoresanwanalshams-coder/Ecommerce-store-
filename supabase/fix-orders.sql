-- Run in Supabase Dashboard > SQL Editor if order placement fails.

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  full_name text not null,
  email text not null,
  phone text not null,
  address_line_1 text not null,
  address_line_2 text,
  city text not null,
  items jsonb not null default '[]'::jsonb,
  total numeric not null check (total >= 0),
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders enable row level security;

drop policy if exists "Public can create orders" on public.orders;
create policy "Public can create orders"
on public.orders
for insert
with check (true);

drop policy if exists "Only admin can read orders" on public.orders;
create policy "Only admin can read orders"
on public.orders
for select
to authenticated
using ((auth.jwt() ->> 'email') = 'murtaza.sanwala@admin.local');

drop policy if exists "Only admin can update orders" on public.orders;
create policy "Only admin can update orders"
on public.orders
for update
to authenticated
using ((auth.jwt() ->> 'email') = 'murtaza.sanwala@admin.local')
with check ((auth.jwt() ->> 'email') = 'murtaza.sanwala@admin.local');
