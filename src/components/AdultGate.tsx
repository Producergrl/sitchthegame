import { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const HOLD_DURATION_MS = 1500;

interface AdultGateProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const AdultGate = ({ children, title = 'Adults Only', description = 'This section is for parents, guardians, and teachers.' }: AdultGateProps) => {
  const [unlocked, setUnlocked] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef(0);

  const startHold = useCallback(() => {
    startRef.current = Date.now();
    // Subtle haptic on supported devices
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try { (navigator as any).vibrate?.(15); } catch { /* noop */ }
    }
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min(elapsed / HOLD_DURATION_MS, 1);
      setProgress(pct);
      if (pct >= 1) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          try { (navigator as any).vibrate?.([20, 40, 60]); } catch { /* noop */ }
        }
        setUnlocked(true);
      }
    }, 30);
  }, []);

  const endHold = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setProgress(0);
  }, []);

  if (unlocked) return <>{children}</>;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto max-w-sm rounded-2xl border bg-card p-8 text-center shadow-sm"
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-xl font-black text-card-foreground">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>

        <div className="mt-6">
          <motion.button
            onMouseDown={startHold}
            onMouseUp={endHold}
            onMouseLeave={endHold}
            onTouchStart={startHold}
            onTouchEnd={endHold}
            onTouchCancel={endHold}
            animate={progress > 0 && progress < 1 ? { scale: [1, 1.02, 1] } : { scale: 1 }}
            transition={{ duration: 0.45, repeat: progress > 0 && progress < 1 ? Infinity : 0 }}
            className="relative w-full select-none overflow-hidden rounded-xl border-2 border-primary bg-primary/5 px-6 py-5 text-sm font-bold text-primary transition-colors active:bg-primary/10 min-h-[68px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 touch-none"
            aria-label={`Press and hold for ${HOLD_DURATION_MS / 1000} seconds to confirm you are an adult`}
            style={{
              boxShadow: progress > 0
                ? `0 0 0 ${Math.round(progress * 12)}px hsl(var(--primary) / ${0.15 + progress * 0.25})`
                : '0 0 0 0 hsl(var(--primary) / 0)',
            }}
          >
            {/* Progress fill */}
            <motion.div
              className="absolute inset-y-0 left-0 bg-primary"
              animate={{ width: `${Math.max(progress * 100, progress > 0 ? 4 : 0)}%` }}
              transition={{ duration: 0.05, ease: 'linear' }}
            />
            {/* Shimmer sweep while holding */}
            {progress > 0 && progress < 1 && (
              <motion.div
                className="absolute inset-y-0 w-12 pointer-events-none"
                style={{ background: 'linear-gradient(90deg, transparent, hsl(0 0% 100% / 0.5), transparent)' }}
                animate={{ x: ['-100%', '400%'] }}
                transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
              />
            )}
            <span
              className="relative z-10 inline-flex items-center justify-center gap-2 w-full"
              style={{ color: progress > 0.5 ? 'white' : undefined }}
            >
              {progress >= 1 ? (
                <>✓ Unlocked!</>
              ) : progress > 0 ? (
                <>
                  <motion.span
                    className="inline-block h-2.5 w-2.5 rounded-full bg-current"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  />
                  Keep holding… {Math.round(progress * 100)}%
                </>
              ) : (
                <>👆 Press &amp; hold to continue</>
              )}
            </span>
          </motion.button>
          {/* Tick marks under the bar */}
          <div className="mt-2 flex justify-between px-1" aria-hidden>
            {[0.25, 0.5, 0.75, 1].map(t => (
              <span
                key={t}
                className={`h-1 w-6 rounded-full transition-colors ${progress >= t ? 'bg-primary' : 'bg-primary/15'}`}
              />
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Hold for {HOLD_DURATION_MS / 1000}s to confirm you're an adult
          </p>
        </div>

        <Link to="/" className="mt-4 inline-block text-sm text-primary underline">
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default AdultGate;
