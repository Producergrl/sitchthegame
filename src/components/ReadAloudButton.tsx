import { useEffect, useState } from 'react';
import { Volume2, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Free read-aloud using the device's built-in voice (Web Speech API).
 * No paid services, works offline. Hidden if the device has no voice support.
 */
interface Props {
  text: string;
  resetKey?: string;
}

const ReadAloudButton = ({ text, resetKey }: Props) => {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const [speaking, setSpeaking] = useState(false);

  // Stop when the card changes or the page closes
  useEffect(() => {
    return () => { if (supported) window.speechSynthesis.cancel(); setSpeaking(false); };
  }, [resetKey, supported]);

  if (!supported) return null;

  const toggle = () => {
    const synth = window.speechSynthesis;
    if (speaking) { synth.cancel(); setSpeaking(false); return; }
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.92;
    const voices = synth.getVoices();
    const lang = navigator.language || 'en-US';
    const voice = voices.find(v => v.lang === lang) || voices.find(v => v.lang.startsWith('en'));
    if (voice) u.voice = voice;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    setSpeaking(true);
    synth.speak(u);
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={toggle}
      aria-pressed={speaking}
      aria-label={speaking ? 'Stop reading aloud' : 'Read this card aloud'}
      className="min-h-[44px] gap-2 font-bold"
    >
      {speaking ? <Square className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      {speaking ? 'Stop' : 'Read aloud'}
    </Button>
  );
};

export default ReadAloudButton;
