-- Run in Supabase Dashboard > SQL Editor if product save fails.

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  category_slug text not null,
  price numeric not null check (price >= 0),
  summary text not null,
  details text not null,
  image_url text not null,
  image_urls text[] not null default '{}',
  video_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products
add column if not exists image_urls text[] not null default '{}';

alter table public.products
add column if not exists video_url text;

alter table public.products
add column if not exists created_at timestamptz not null default now();

alter table public.products
add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'products_slug_key'
      and conrelid = 'public.products'::regclass
  ) then
    alter table public.products add constraint products_slug_key unique (slug);
  end if;
end $$;

alter table public.products enable row level security;

drop policy if exists "Public can read products" on public.products;
create policy "Public can read products"
on public.products
for select
using (true);

drop policy if exists "Only admin can insert products" on public.products;
create policy "Only admin can insert products"
on public.products
for insert
to authenticated
with check ((auth.jwt() ->> 'email') = 'murtaza.sanwala@admin.local');

drop policy if exists "Only admin can update products" on public.products;
create policy "Only admin can update products"
on public.products
for update
to authenticated
using ((auth.jwt() ->> 'email') = 'murtaza.sanwala@admin.local')
with check ((auth.jwt() ->> 'email') = 'murtaza.sanwala@admin.local');

drop policy if exists "Only admin can delete products" on public.products;
create policy "Only admin can delete products"
on public.products
for delete
to authenticated
using ((auth.jwt() ->> 'email') = 'murtaza.sanwala@admin.local');
