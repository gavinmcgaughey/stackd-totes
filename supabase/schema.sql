-- Stack'd Totes — database schema
-- Run this in your Supabase project: SQL Editor → New query → paste → Run.

create extension if not exists "pgcrypto";

-- Customer reservations
create table if not exists public.orders (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  customer_name text not null,
  email         text not null,
  phone         text not null,
  address       text not null,
  city          text,
  package_id    text not null,
  package_name  text not null,
  price         numeric not null,
  delivery_date date not null,
  pickup_date   date not null,
  notes         text,
  status        text not null default 'pending'
                check (status in ('pending','confirmed','completed','cancelled')),
  paid              boolean not null default false,
  stripe_session_id text
);

create index if not exists orders_delivery_idx on public.orders (delivery_date);

-- If you already created the orders table before adding Stripe, these are safe to re-run:
alter table public.orders add column if not exists paid boolean not null default false;
alter table public.orders add column if not exists stripe_session_id text;
alter table public.orders add column if not exists confirmation_code text;

-- Dates the owner has manually blocked off
create table if not exists public.blocked_dates (
  date       date primary key,
  reason     text,
  created_at timestamptz not null default now()
);

-- Lock both tables down. The app talks to them only via the server-side
-- service-role key (which bypasses RLS), so no public policies are needed.
alter table public.orders        enable row level security;
alter table public.blocked_dates enable row level security;
