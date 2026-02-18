--Update user progress on new lesson
create or replace function public.update_user_progress_on_submit()
returns trigger
language plpgsql
as $$
declare
  v_user_id uuid;
  v_streak int;
begin
  v_user_id := new.user_id;

  -- Only run when submitted_at is set (completion)
  if new.submitted_at is null then
    return new;
  end if;

  -- Compute current streak ending today for this user
  with session_days as (
    select distinct (ps.submitted_at)::date as day
    from public.practice_sessions ps
    where ps.user_id = v_user_id
      and ps.submitted_at is not null
  )
  select
    case
      when not exists (select 1 from session_days where day = current_date) then 0
      else (
        select count(*)
        from (
          select day, row_number() over (order by day desc) as rn
          from session_days
          where day <= current_date
        ) d
        where d.day = current_date - ((d.rn - 1)::int)
      )
    end
  into v_streak;

  -- Upsert progress row
  insert into public.user_progress (user_id, current_streak, updated_at)
  values (v_user_id, v_streak, now())
  on conflict (user_id)
  do update set
    current_streak = excluded.current_streak,
    updated_at = now();

  return new;
end;
$$;


--Main Dashboard function
create or replace function public.get_users_dashboard(
  p_user_id uuid,
  p_recent_limit int default 10
)
returns json
language sql
stable
as $$
with
  completed_sessions as (
    select
      ps.id,
      ps.user_id,
      ps.lesson_id,
      ps.mode,
      ps.status,
      ps.metadata,
      ps.started_at,
      ps.submitted_at
    from public.practice_sessions ps
    where ps.user_id = p_user_id
      and ps.submitted_at is not null
  ),

  sessions_count as(
    select distinct (cs.submitted_at)::date as day
    from completed_sessions cs
  ),
  calculate_streak as(
    select
      case
        when not exists (select 1 from sessions_count where day = current_date) then 0
        else (
          select count(*)
          from (
            select
              day,
              row_number() over (order by day desc) as rn
            from sessions_count
            where day <= current_date
          ) d
          where d.day = current_date - ((d.rn -1)::int)
        )
      end as current_streak
  ),
  progress as (
    select
      up.user_id,
      up.current_streak,
      up.lessons_completed,
      up.average_accuracy,
      up.updated_at
    from public.user_progress up
  where up.user_id = p_user_id
  ),  
  recent_sessions as (
  select
    coalesce(
      json_agg(
        json_build_object(
          'session_id', r.id,
          'lesson', json_build_object(
            'id', r.lesson_id,
            'title', r.title,
            'difficulty', r.difficulty
          ),
          'mode', r.mode,
          'status', r.status,
          'submitted_at', r.submitted_at,
          'started_at', r.started_at,
          'metadata', r.metadata
        )
        order by r.submitted_at desc
      ),
      '[]'::json
    ) as sessions
  from (
    select
      cs.*,
      l.title,
      l.difficulty
    from completed_sessions cs
    left join public.lessons l on l.id = cs.lesson_id
    order by cs.submitted_at desc
    limit p_recent_limit
  ) r
)
  select json_build_object(
    'user_id', p_user_id,

    'summary', json_build_object(
      -- prefer computed streak (truth from sessions)
      'current_streak', (select current_streak from calculate_streak),
      'stored_streak', coalesce((select current_streak from progress), 0),

      -- keep whatever else you want from user_progress
      'lessons_completed', coalesce((select lessons_completed from progress), 0),
      'average_accuracy', coalesce((select average_accuracy from progress), 0),
      'updated_at', (select updated_at from progress)
    ),

    -- past lesson data
    'recent_sessions', (select sessions from recent_sessions)
  );
$$;

--Recalculates users data
create or replace function public.recompute_users_progress(p_user_id uuid)   
returns void 
language plpgsql
as $$ 
declare 
  average_accuracy numeric;
  lessons_completed int;        
begin 
  --Calculation of avg accuracy  
  select coalesce(avg(ps.accuracy), 0)
    into average_accuracy
  from public.practice_sessions ps
  where ps.user_id = p_user_id;

-- Lessons completed
  select coalesce(count(distinct ps.lesson_id), 0)
    into lessons_completed
  from public.practice_sessions ps
  where ps.user_id = p_user_id
    and ps.submitted_at is not null;

-- Into high level data
  insert into public.user_progress(user_id, current_streak, lessons_completed, average_accuracy, updated_at) 
  values (p_user_id, 0, lessons_completed, average_accuracy, now())
  on conflict (user_id) do update
    set lessons_completed = excluded.lessons_completed, average_accuracy = excluded.average_accuracy, updated_at = excluded.updated_at;
end;
$$;
