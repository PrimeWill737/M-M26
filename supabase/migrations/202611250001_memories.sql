-- Run once via DATABASE_URL or the Supabase SQL editor. No anonymous API access.
create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),
  album text not null check (album in ('traditional', 'wedding')),
  guest_name text not null check (char_length(guest_name) <= 80),
  caption text not null default '' check (char_length(caption) <= 280),
  public_id text not null unique,
  resource_type text not null check (resource_type in ('image', 'video')),
  format text not null,
  version bigint not null,
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists memories_album_date on public.memories (album, created_at desc, id desc) where hidden = false;
alter table public.memories enable row level security;
revoke all on public.memories from anon, authenticated;
grant all on public.memories to service_role;

create table if not exists public.gallery_upload_limits (
  bucket text primary key,
  window_start timestamptz not null,
  attempts integer not null default 1
);
alter table public.gallery_upload_limits enable row level security;
revoke all on public.gallery_upload_limits from anon, authenticated;
grant all on public.gallery_upload_limits to service_role;

create or replace function public.claim_gallery_upload(bucket_key text, bucket_limit integer)
returns boolean language plpgsql security definer set search_path = '' as $$
declare hits integer;
begin
  insert into public.gallery_upload_limits as limits (bucket, window_start, attempts)
  values (bucket_key, date_trunc('hour', now()), 1)
  on conflict (bucket) do update set
    attempts = case when limits.window_start = date_trunc('hour', now()) then limits.attempts + 1 else 1 end,
    window_start = date_trunc('hour', now())
  returning attempts into hits;
  return hits <= bucket_limit;
end;
$$;
revoke all on function public.claim_gallery_upload(text, integer) from public, anon, authenticated;
grant execute on function public.claim_gallery_upload(text, integer) to service_role;
