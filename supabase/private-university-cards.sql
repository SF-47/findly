-- Make student university ID cards private.
--
-- Run this in the Supabase SQL editor only AFTER:
--   1. the API with GET /students/{id}/university-card is deployed, and
--   2. Supabase__Url and Supabase__ServiceRoleKey are set on the API host.
-- Otherwise the admin panel cannot show cards anymore.
--
-- Uploads keep working: making a bucket private only affects reads, so the
-- existing upload policy used by the registration screen is unchanged.

-- 1. Public links (/object/public/universities-cards/...) stop working.
update storage.buckets
set public = false
where id = 'universities-cards';

-- 2. List the policies that mention this bucket.
select policyname, cmd, roles, qual, with_check
from pg_policies
where schemaname = 'storage'
  and tablename = 'objects'
  and (qual ilike '%universities-cards%' or with_check ilike '%universities-cards%');

-- 3. For every row above with cmd = 'SELECT' (or 'ALL') whose roles include anon,
--    authenticated or public, drop it. Policy names differ per project, so copy them
--    from step 2. Keep the INSERT policy.
-- drop policy "<policy name from step 2>" on storage.objects;

-- 4. Check: this should now return HTTP 400/404, not the image.
--    curl -I "https://<project>.supabase.co/storage/v1/object/public/universities-cards/<a real path>"
