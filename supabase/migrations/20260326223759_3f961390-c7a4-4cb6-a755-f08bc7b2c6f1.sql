
-- Create a public storage bucket for cached TTS audio
INSERT INTO storage.buckets (id, name, public)
VALUES ('tts-cache', 'tts-cache', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read cached audio files (public bucket)
CREATE POLICY "Public read access for tts-cache"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'tts-cache');

-- Allow the service role (edge functions) to insert cached audio
CREATE POLICY "Service role insert for tts-cache"
ON storage.objects FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'tts-cache');
