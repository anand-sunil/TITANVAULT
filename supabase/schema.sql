-- ========================================================
-- TITANVAULT SUPABASE DATABASE SCHEMA
-- Execute this script in the Supabase SQL Editor:
-- Dashboard -> SQL Editor -> New Query -> Run
-- ========================================================

-- 1. Create profiles table linked to Supabase auth.users
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique,
  avatar_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create vault_entries table for movies, anime, and series
create table if not exists public.vault_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  media_type text not null check (media_type in ('movies', 'anime', 'series')),
  status text not null check (status in ('Watched', 'Watching', 'Completed', 'Watchlist', 'Dropped')),
  rating numeric check (rating >= 1 and rating <= 10),
  year integer,
  genres text[] default array[]::text[],
  overview text,
  seasons text,
  poster_hue integer default 0,
  poster_url text,
  is_favorite boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_user_media unique (user_id, title, media_type)
);

-- Migration for existing tables:
alter table public.vault_entries add column if not exists poster_url text;

-- 3. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.vault_entries enable row level security;

-- 4. Profiles RLS Policies
create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update their own profile."
  on public.profiles for update
  using ( auth.uid() = id );

-- 5. Vault Entries RLS Policies (strictly user-isolated)
create policy "Users can view their own vault entries."
  on public.vault_entries for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own vault entries."
  on public.vault_entries for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own vault entries."
  on public.vault_entries for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own vault entries."
  on public.vault_entries for delete
  using ( auth.uid() = user_id );

-- 6. Trigger to automatically create a profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if already exists and recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 7. Trigger to automatically update updated_at timestamp on vault_entries
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_vault_entries_updated_at on public.vault_entries;
create trigger set_vault_entries_updated_at
  before update on public.vault_entries
  for each row execute procedure public.handle_updated_at();

-- 8. Useful indexes for high performance querying
create index if not exists idx_vault_entries_user_id on public.vault_entries(user_id);
create index if not exists idx_vault_entries_type on public.vault_entries(media_type);
create index if not exists idx_vault_entries_status on public.vault_entries(status);
create index if not exists idx_vault_entries_favorite on public.vault_entries(is_favorite);
