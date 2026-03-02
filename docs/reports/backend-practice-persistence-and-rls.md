# Backend Practice Persistence + Lessons RLS Fix (Mar 2, 2026)

## Summary
We fixed backend practice persistence end-to-end and resolved an issue where `GET /api/lessons` returned an empty list despite rows existing in Supabase.

### End Result
 `GET /api/lessons` returns lessons  
 `POST /api/practice/start` creates a session  
 `POST /api/practice/submit` writes a row to `practice_results` and updates the session summary  
 Duplicate submit is idempotent (`ok: true`) and does NOT insert a second results row

---

## Root Cause: Lessons RLS
`public.lessons` had RLS enabled but policies were misconfigured (policy applied to anon only / misapplied policy name), causing the API to see `[]`.

### Fix (SQL)
Run in Supabase SQL Editor:

```sql
-- Remove misapplied policy (was incorrectly attached to lessons)
DROP POLICY IF EXISTS "dev_all_user_progress" ON public.lessons;

-- Ensure RLS enabled
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Allow both anon and authenticated to read lessons
DROP POLICY IF EXISTS "lessons_read_all" ON public.lessons;

CREATE POLICY "lessons_read_all"
ON public.lessons
FOR SELECT
TO anon, authenticated
USING (true);

-- Ensure privileges
GRANT SELECT ON public.lessons TO anon, authenticated;
