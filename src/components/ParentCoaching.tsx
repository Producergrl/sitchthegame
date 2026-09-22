import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { AgeBand } from '@/types/game';
import { parentCoaching } from '@/data/parentCoaching';

interface ParentCoachingProps {
  ageBand: AgeBand;
  /** True when the child picked the riskiest answer, so the gentle reframe is shown first. */
  showReframe?: boolean;
}

/**
 * Calm, collapsible coaching for the grown-up. Appears only after the child has answered,
 * so it never influences the child's choice and never lands as a warning.
 */
export const ParentCoaching = ({ ageBand, showReframe }: ParentCoachingProps) => {
  const [open, setOpen] = useState(false);
  const guide = parentCoaching[ageBand];
  if (!guide) return null;

  return (
    <div className="rounded-2xl border border-gentle/40 bg-gentle/5 p-5">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-label="Guided conversation tips for grown-ups"
        className="flex min-h-[44px] w-full items-center justify-between gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
      >
        <span className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gentle/20 text-lg">🤝</span>
          <span className="text-sm font-black text-card-foreground">Guided chat for grown-ups</span>
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 pt-4">
              <p className="text-xs italic text-muted-foreground">{guide.toneNote}</p>

              {showReframe && (
                <div className="rounded-xl border border-accent/40 bg-accent/10 p-3">
                  <p className="mb-1 text-xs font-bold text-accent-foreground">If they picked a tempting answer</p>
                  <p className="text-sm text-card-foreground">{guide.ifRiskyChoice}</p>
                </div>
              )}

              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">Start here</p>
                <p className="text-sm text-card-foreground">{guide.opener}</p>
              </div>

              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">Then try</p>
                <ol className="space-y-2">
                  {guide.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-card-foreground">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gentle/25 text-xs font-bold">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {!showReframe && (
                <div>
                  <p className="mb-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">If the answer worries you</p>
                  <p className="text-sm text-card-foreground">{guide.ifRiskyChoice}</p>
                </div>
              )}

              <div className="rounded-xl border border-safe/30 bg-safe/5 p-3">
                <p className="mb-1 text-xs font-bold text-safe">Finish gently</p>
                <p className="text-sm text-card-foreground">{guide.closer}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
