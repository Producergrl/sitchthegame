import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Loader2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { safeGetItem, safeSetItem } from '@/lib/safeStorage';
import { supabase } from '@/integrations/supabase/client';

const STORAGE_KEY = 'sitch_unlocked';

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

    // Beta tester bypass code (case-insensitive)
    if (trimmed.toUpperCase() === 'SITCHBETA2026') {
      unlock();
      return;
    }

    // Verify against Gumroad license server (no client-side bypass)
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

        <div className="mt-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#1E3A5F]/15" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#2D5F8A]">
            No code yet?
          </span>
          <div className="h-px flex-1 bg-[#1E3A5F]/15" />
        </div>

        <a
          href="https://sitchthegame.gumroad.com/l/sitch"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            // Force open in top-level window to avoid iframe X-Frame-Options blocks
            e.preventDefault();
            window.open('https://sitchthegame.gumroad.com/l/sitch', '_blank', 'noopener,noreferrer');
            try { window.top!.location.href = 'https://sitchthegame.gumroad.com/l/sitch'; } catch { /* cross-origin top — ignore */ }
          }}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#1E3A5F] bg-white py-4 px-4 font-bold uppercase tracking-wide text-[#1E3A5F] transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A5F] focus-visible:ring-offset-2"
          aria-label="Buy Sitch on Gumroad to get an unlock code"
        >
          <ShoppingBag className="h-4 w-4" />
          Buy Sitch on Gumroad
        </a>

        <p className="mt-3 text-xs text-[#2D5F8A]/80">
          You'll receive an unlock code instantly with your Gumroad receipt.
        </p>
      </motion.div>
    </div>
  );
};

export default UnlockGate;
