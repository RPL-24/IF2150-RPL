create table if not exists public.tbl_pemilik_usaha (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null,
  email text not null,
  nama_usaha text,
  no_telp text,
  created_at timestamptz not null default now()
);

create unique index if not exists tbl_pemilik_usaha_username_lower_key
  on public.tbl_pemilik_usaha (lower(username));

create unique index if not exists tbl_pemilik_usaha_email_lower_key
  on public.tbl_pemilik_usaha (lower(email));

alter table public.tbl_pemilik_usaha enable row level security;

drop policy if exists "baca data sendiri" on public.tbl_pemilik_usaha;
create policy "baca data sendiri"
  on public.tbl_pemilik_usaha
  for select to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "ubah data sendiri" on public.tbl_pemilik_usaha;
create policy "ubah data sendiri"
  on public.tbl_pemilik_usaha
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

grant select, update on table public.tbl_pemilik_usaha to authenticated;

grant select on table public.tbl_pemilik_usaha to service_role;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.tbl_pemilik_usaha (id, username, email)
  values (
    new.id,
    lower(new.raw_user_meta_data ->> 'username'),
    lower(new.email)
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.account_exists(
  p_username text,
  p_email text
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.tbl_pemilik_usaha
    where lower(username) = lower(trim(p_username))
       or lower(email) = lower(trim(p_email))
  );
$$;

revoke all on function public.account_exists(text, text) from public;
grant execute on function public.account_exists(text, text) to anon, authenticated;