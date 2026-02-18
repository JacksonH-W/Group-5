--Used to update users progress
drop trigger if exists trg_update_user_progress_on_submit on public.practice_sessions;

create trigger trg_update_user_progress_on_submit
after insert or update of submitted_at
on public.practice_sessions
for each row
execute function public.update_user_progress_on_submit();
