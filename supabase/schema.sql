-- Run this in Supabase Dashboard > SQL Editor.
-- Admin email used by the app:
-- murtaza.sanwala@admin.local

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
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

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.categories (name, slug, description)
values
  ('Home and Kitchen', 'home-and-kitchen', 'Useful kitchen tools, dining basics, storage, and home essentials.'),
  ('Electronic Gadgets', 'electronic-gadgets', 'Smart accessories, compact tech, chargers, and everyday gadgets.'),
  ('Baby & Toys', 'baby-toys', 'Baby care items, playful toys, learning products, and gifting picks.'),
  ('Automative', 'automative', 'Car accessories, maintenance helpers, organizers, and travel tools.'),
  ('Health & Beauty', 'health-beauty', 'Self-care, grooming, beauty tools, and wellness essentials.')
on conflict (slug) do nothing;

alter table public.products enable row level security;
alter table public.categories enable row level security;

drop policy if exists "Public can read categories" on public.categories;
create policy "Public can read categories"
on public.categories
for select
using (true);

drop policy if exists "Only admin can insert categories" on public.categories;
create policy "Only admin can insert categories"
on public.categories
for insert
to authenticated
with check ((auth.jwt() ->> 'email') = 'murtaza.sanwala@admin.local');

drop policy if exists "Only admin can update categories" on public.categories;
create policy "Only admin can update categories"
on public.categories
for update
to authenticated
using ((auth.jwt() ->> 'email') = 'murtaza.sanwala@admin.local')
with check ((auth.jwt() ->> 'email') = 'murtaza.sanwala@admin.local');

drop policy if exists "Only admin can delete categories" on public.categories;
create policy "Only admin can delete categories"
on public.categories
for delete
to authenticated
using ((auth.jwt() ->> 'email') = 'murtaza.sanwala@admin.local');

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

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

drop trigger if exists set_categories_updated_at on public.categories;
create trigger set_categories_updated_at
before update on public.categories
for each row
execute function public.set_updated_at();

create table if not exists public.site_settings (
  id text primary key default 'main',
  offer_text text not null default 'Free shipping on orders over Rs. 999 | New season offers are live',
  banner_image_url text not null default 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80',
  new_arrival_slugs text[] not null default '{}',
  best_seller_slugs text[] not null default '{}',
  featured_slugs text[] not null default '{}',
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = 'main')
);

insert into public.site_settings (id)
values ('main')
on conflict (id) do nothing;

alter table public.site_settings enable row level security;

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
on public.site_settings
for select
using (true);

drop policy if exists "Only admin can insert site settings" on public.site_settings;
create policy "Only admin can insert site settings"
on public.site_settings
for insert
to authenticated
with check ((auth.jwt() ->> 'email') = 'murtaza.sanwala@admin.local');

drop policy if exists "Only admin can update site settings" on public.site_settings;
create policy "Only admin can update site settings"
on public.site_settings
for update
to authenticated
using ((auth.jwt() ->> 'email') = 'murtaza.sanwala@admin.local')
with check ((auth.jwt() ->> 'email') = 'murtaza.sanwala@admin.local');

drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
before update on public.site_settings
for each row
execute function public.set_updated_at();

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  full_name text not null,
  email text not null,
  phone text not null,
  address_line_1 text not null,
  address_line_2 text,
  city text not null,
  items jsonb not null,
  total numeric not null default 0,
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

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
before update on public.orders
for each row
execute function public.set_updated_at();

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can read product images" on storage.objects;
create policy "Public can read product images"
on storage.objects
for select
using (bucket_id = 'product-images');

drop policy if exists "Only admin can upload product images" on storage.objects;
create policy "Only admin can upload product images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'product-images'
  and (auth.jwt() ->> 'email') = 'murtaza.sanwala@admin.local'
);
