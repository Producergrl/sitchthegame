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
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min(elapsed / HOLD_DURATION_MS, 1);
      setProgress(pct);
      if (pct >= 1) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
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
          <button
            onMouseDown={startHold}
            onMouseUp={endHold}
            onMouseLeave={endHold}
            onTouchStart={startHold}
            onTouchEnd={endHold}
            onTouchCancel={endHold}
            className="relative w-full select-none overflow-hidden rounded-xl border-2 border-primary bg-primary/5 px-6 py-4 text-sm font-bold text-primary transition-colors active:bg-primary/10 min-h-[56px]"
          >
            {/* Progress fill — bigger and more obvious */}
            <motion.div
              className="absolute inset-0 bg-primary"
              style={{ originX: 0 }}
              animate={{ scaleX: progress }}
              transition={{ duration: 0.03 }}
            />
            <span className="relative z-10" style={{ color: progress > 0.5 ? 'white' : undefined }}>
              {progress >= 1 ? '✓ Unlocked!' : progress > 0 ? `Keep holding… ${Math.round(progress * 100)}%` : 'Press & hold to continue'}
            </span>
          </button>
          <p className="mt-2 text-xs text-muted-foreground">
            Hold the button for {HOLD_DURATION_MS / 1000}s to confirm you're an adult
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
