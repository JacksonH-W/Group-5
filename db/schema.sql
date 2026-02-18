create table public.users (
  id uuid not null default gen_random_uuid (),
  username text not null,
  email text not null,
  password_hash text not null,
  created_at timestamp with time zone null default now(),
  constraint users_pkey primary key (id),
  constraint users_email_key unique (email),
  constraint users_username_key unique (username)
) TABLESPACE pg_default;

create table public.lessons (
  id uuid not null default gen_random_uuid (),
  title character varying(200) not null,
  description character varying(500) null,
  content text not null,
  prerequisites uuid[] null default '{}'::uuid[],
  difficulty integer not null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint lessons_pkey primary key (id),
  constraint lessons_difficulty_check check (
    (
      (difficulty >= 1)
      and (difficulty <= 5)
    )
  )
) TABLESPACE pg_default;

create table public.practice_sessions (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  lesson_id uuid null,
  mode text not null,
  status text not null default 'active'::text,
  metadata jsonb null,
  started_at timestamp with time zone not null default now(),
  submitted_at timestamp with time zone null,
  constraint practice_sessions_pkey primary key (id),
  constraint practice_sessions_lesson_id_fkey foreign KEY (lesson_id) references lessons (id),
  constraint practice_sessions_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE
) TABLESPACE pg_default;

create table public.user_progress (
  user_id uuid not null,
  current_streak integer not null default 0,
  lessons_completed integer not null default 0,
  average_accuracy numeric not null default 0,
  updated_at timestamp with time zone not null default now(),
  constraint user_progress_pkey primary key (user_id),
  constraint user_progress_average_accuracy_check check (
    (
      (average_accuracy >= (0)::numeric)
      and (average_accuracy <= (100)::numeric)
    )
  ),
  constraint user_progress_current_streak_check check ((current_streak >= 0)),
  constraint user_progress_lessons_completed_check check ((lessons_completed >= 0))
) TABLESPACE pg_default;


