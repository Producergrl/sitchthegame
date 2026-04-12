import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { safeGetItem, safeSetItem } from '@/lib/safeStorage';
import { primeSoundEffects } from '@/lib/sounds';

const STORAGE_KEY = 'sitch_unlocked';
const VALID_CODE = 'SITCH2026';

interface UnlockGateProps {
  children: React.ReactNode;
}

const UnlockGate = ({ children }: UnlockGateProps) => {
  const [unlocked, setUnlocked] = useState(() => safeGetItem(STORAGE_KEY) === 'true');
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!unlocked) return;

    const primeOnGesture = () => {
      primeSoundEffects();
    };

    window.addEventListener('pointerdown', primeOnGesture, true);
    window.addEventListener('keydown', primeOnGesture, true);

    return () => {
      window.removeEventListener('pointerdown', primeOnGesture, true);
      window.removeEventListener('keydown', primeOnGesture, true);
    };
  }, [unlocked]);

  const handleUnlock = () => {
    if (code.trim().toUpperCase() === VALID_CODE) {
      primeSoundEffects();
      safeSetItem(STORAGE_KEY, 'true');
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (unlocked) return <>{children}</>;

  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{ background: 'radial-gradient(ellipse at 50% 50%, #FDB913 0%, #F7941D 60%, #F58B1F 100%)' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-xl"
        style={{ boxShadow: '0 8px 40px hsl(215 60% 20% / 0.25)' }}
      >
        <div
          className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl"
          style={{
            background: 'linear-gradient(145deg, #1E3A5F, #2D5F8A)',
            boxShadow: '0 4px 20px hsl(215 60% 30% / 0.3)',
          }}
        >
          <Shield className="h-10 w-10 text-amber-100" />
        </div>

        <h1
          className="text-2xl font-black uppercase tracking-tight"
          style={{
            background: 'linear-gradient(170deg, #1E3A5F, #2D5F8A)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Welcome to Sitch
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Please enter your unlock code to play
        </p>

        <form
          onSubmit={(e) => { e.preventDefault(); handleUnlock(); }}
          className="mt-6 space-y-3"
        >
          <Input
            value={code}
            onChange={(e) => { setCode(e.target.value); setError(false); }}
            placeholder="Enter unlock code"
            className="text-center text-lg font-bold tracking-widest uppercase"
            autoFocus
          />
          <Button
            type="submit"
            className="w-full gap-2 py-6 text-base font-bold uppercase tracking-wide rounded-xl border-0"
            style={{
              background: 'linear-gradient(135deg, #1E3A5F, #2D5F8A)',
              color: '#FEF3D0',
            }}
          >
            <Lock className="h-4 w-4" />
            Unlock
          </Button>
        </form>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-sm font-medium text-red-600"
          >
            That code doesn't look right. Please check your Gumroad receipt and try again.
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default UnlockGate;
