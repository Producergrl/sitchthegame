import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { safeGetItem, safeSetItem } from '@/lib/safeStorage';
import { supabase } from '@/integrations/supabase/client';

const STORAGE_KEY = 'sitch_unlocked';
const HARDCODED_CODE = 'SITCH2026';

interface UnlockGateProps {
  children: React.ReactNode;
}

const UnlockGate = ({ children }: UnlockGateProps) => {
  const [unlocked, setUnlocked] = useState(() => safeGetItem(STORAGE_KEY) === 'true');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (unlocked) return <>{children}</>;

  const unlock = () => {
    safeSetItem(STORAGE_KEY, 'true');
    setUnlocked(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) return;

    // Check hardcoded passcode first
    if (trimmed.toUpperCase() === HARDCODED_CODE) {
      unlock();
      return;
    }

    // Otherwise verify against Gumroad
    setLoading(true);
    setError('');

    try {
      const { data, error: fnError } = await supabase.functions.invoke('verify-license', {
        body: { license_key: trimmed },
      });

      if (fnError) throw fnError;

      if (data?.valid) {
        unlock();
      } else {
        setError(data?.error || "That code doesn't look right. Please check your Gumroad receipt and try again.");
      }
    } catch {
      setError("Couldn't verify your code right now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4" style={{ background: 'linear-gradient(180deg, #FEF3D0 0%, #FFF8E7 100%)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto w-full max-w-sm rounded-2xl bg-white p-8 text-center"
        style={{
          border: '1px solid hsl(215 50% 30% / 0.12)',
          boxShadow: '0 4px 24px hsl(215 30% 20% / 0.1)',
        }}
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full" style={{ background: 'hsl(215 50% 30% / 0.08)' }}>
          <Shield className="h-8 w-8 text-[#1E3A5F]" />
        </div>

        <h1 className="text-xl font-black text-[#1E3A5F]">Welcome to Sitch</h1>
        <p className="mt-2 text-sm text-[#2D5F8A]">Please enter your unlock code to play</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <Input
            type="text"
            placeholder="Enter unlock code"
            value={code}
            onChange={(e) => { setCode(e.target.value); setError(''); }}
            className="text-center text-lg font-bold tracking-widest uppercase"
            autoFocus
            disabled={loading}
          />
          <Button
            type="submit"
            disabled={loading || !code.trim()}
            className="w-full gap-2 font-bold uppercase tracking-wide rounded-xl py-6"
            style={{
              background: 'linear-gradient(135deg, #1E3A5F, #2D5F8A)',
              color: '#FEF3D0',
            }}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
            {loading ? 'Verifying…' : 'Unlock'}
          </Button>
        </form>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-sm font-medium text-red-600"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default UnlockGate;
