-- Replace broad public SELECT on storage.objects for tts-cache with a narrow policy
-- that allows reading individual objects (needed for public URL audio playback)
-- but does NOT allow listing the entire bucket contents.
DROP POLICY IF EXISTS "Public read access for tts-cache" ON storage.objects;

-- Note: Direct public-URL access to objects in a public bucket goes through the
-- storage server and does not require a SELECT policy on storage.objects.
-- Removing the broad SELECT policy prevents `storage.from('tts-cache').list()`
-- from anonymous clients while keeping individual cached MP3 URLs accessible.
