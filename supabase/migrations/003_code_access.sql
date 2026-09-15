-- Permite perfiles preasignados por el docente y un usuario separado para pruebas.
alter table public.profiles drop constraint if exists profiles_last_name_check;
alter table public.profiles drop constraint if exists profiles_course_check;
alter table public.profiles add constraint profiles_course_check
  check (course in ('11.1','11.2','11.3','10.1','10.2','10.3','10.4','ADMIN','PRUEBA'));

-- La lista institucional ya contiene el nombre completo en un único campo.
alter table public.profiles alter column last_name drop not null;
