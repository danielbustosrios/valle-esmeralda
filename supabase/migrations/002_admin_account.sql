-- Allow the single teacher account to exist outside the student course list.
alter table public.profiles drop constraint if exists profiles_course_check;
alter table public.profiles add constraint profiles_course_check
  check (course in ('11.1','11.2','11.3','10.1','10.2','10.3','10.4','ADMIN'));

-- Dashboard invitations do not include the student metadata sent by the game.
-- They receive an administrative profile, but privileges still require user_roles.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles(id, first_name, last_name, course)
  values (
    new.id,
    trim(coalesce(nullif(new.raw_user_meta_data ->> 'first_name',''), 'Administrador')),
    trim(coalesce(nullif(new.raw_user_meta_data ->> 'last_name',''), 'Valle Esmeralda')),
    coalesce(nullif(new.raw_user_meta_data ->> 'course',''), 'ADMIN')
  );
  insert into public.student_progress(user_id) values (new.id);
  return new;
end;
$$;

