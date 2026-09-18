create or replace function public.leaderboard()
returns table(first_name text, last_initial text, course text, completion_percent integer, play_seconds integer, total_errors integer)
language sql
security definer
set search_path = public
as $$
  select p.first_name,
         left(p.last_name, 1) || '.',
         p.course,
         least(100, floor((select count(*) from unnest(coalesce(s.completed_levels, array[]::integer[])) as completed(level_id) where completed.level_id not between 47 and 51) * 100.0 / 63)::integer),
         coalesce(s.play_seconds, 0),
         coalesce(s.total_errors, 0)
  from public.profiles p
  left join public.student_progress s on s.user_id = p.id
  where p.course <> 'ADMIN'
  order by 4 desc, p.first_name, p.last_name;
$$;

grant execute on function public.leaderboard() to authenticated;
