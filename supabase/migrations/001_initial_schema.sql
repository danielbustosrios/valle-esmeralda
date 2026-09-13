-- Valle Esmeralda: cuentas, progreso y seguimiento escolar.
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null check (char_length(first_name) between 1 and 60),
  last_name text not null check (char_length(last_name) between 1 and 60),
  course text not null check (course in ('11.1','11.2','11.3','10.1','10.2','10.3','10.4')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin')),
  created_at timestamptz not null default now()
);

create table public.student_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  completed_levels integer[] not null default '{}',
  stars integer not null default 0 check (stars >= 0),
  crystals integer not null default 0 check (crystals >= 0),
  play_seconds integer not null default 0 check (play_seconds >= 0),
  total_errors integer not null default 0 check (total_errors >= 0),
  updated_at timestamptz not null default now()
);

create table public.level_results (
  user_id uuid not null references auth.users(id) on delete cascade,
  level_id integer not null check (level_id between 1 and 68),
  completed boolean not null default false,
  attempts integer not null default 0 check (attempts >= 0),
  errors integer not null default 0 check (errors >= 0),
  best_time_seconds integer check (best_time_seconds is null or best_time_seconds >= 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, level_id)
);

create table public.play_sessions (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  active_seconds integer not null default 0 check (active_seconds >= 0)
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.user_roles where user_id = auth.uid() and role = 'admin');
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles(id, first_name, last_name, course)
  values (
    new.id,
    trim(coalesce(new.raw_user_meta_data ->> 'first_name','')),
    trim(coalesce(new.raw_user_meta_data ->> 'last_name','')),
    coalesce(new.raw_user_meta_data ->> 'course','')
  );
  insert into public.student_progress(user_id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.student_progress enable row level security;
alter table public.level_results enable row level security;
alter table public.play_sessions enable row level security;

create policy "profile read own or admin" on public.profiles for select to authenticated
using ((select auth.uid()) = id or (select public.is_admin()));
create policy "profile update own or admin" on public.profiles for update to authenticated
using ((select auth.uid()) = id or (select public.is_admin()))
with check ((select auth.uid()) = id or (select public.is_admin()));

create policy "roles admin only" on public.user_roles for all to authenticated
using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "progress read own or admin" on public.student_progress for select to authenticated
using ((select auth.uid()) = user_id or (select public.is_admin()));
create policy "progress update own or admin" on public.student_progress for update to authenticated
using ((select auth.uid()) = user_id or (select public.is_admin()))
with check ((select auth.uid()) = user_id or (select public.is_admin()));

create policy "results read own or admin" on public.level_results for select to authenticated
using ((select auth.uid()) = user_id or (select public.is_admin()));
create policy "results insert own" on public.level_results for insert to authenticated
with check ((select auth.uid()) = user_id);
create policy "results update own or admin" on public.level_results for update to authenticated
using ((select auth.uid()) = user_id or (select public.is_admin()))
with check ((select auth.uid()) = user_id or (select public.is_admin()));

create policy "sessions read own or admin" on public.play_sessions for select to authenticated
using ((select auth.uid()) = user_id or (select public.is_admin()));
create policy "sessions insert own" on public.play_sessions for insert to authenticated
with check ((select auth.uid()) = user_id);
create policy "sessions update own" on public.play_sessions for update to authenticated
using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

grant usage on schema public to authenticated;
grant select, update on public.profiles to authenticated;
grant select on public.user_roles to authenticated;
grant select, update on public.student_progress to authenticated;
grant select, insert, update on public.level_results to authenticated;
grant select, insert, update on public.play_sessions to authenticated;
grant usage, select on sequence public.play_sessions_id_seq to authenticated;

create or replace function public.leaderboard()
returns table(first_name text, last_initial text, course text, completion_percent integer, play_seconds integer, total_errors integer)
language sql stable security definer set search_path = '' as $$
  select p.first_name,
         left(p.last_name, 1) || '.',
         p.course,
         least(100, floor(cardinality(s.completed_levels) * 100.0 / 68)::integer),
         s.play_seconds,
         s.total_errors
  from public.profiles p
  join public.student_progress s on s.user_id = p.id
  order by cardinality(s.completed_levels) desc, s.play_seconds asc, s.total_errors asc;
$$;
grant execute on function public.leaderboard() to authenticated;

