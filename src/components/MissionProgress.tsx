import { motion } from 'framer-motion';
import {
  getCurrentLevel,
  getNextLevel,
  getXPProgress,
  BADGES,
  type PlayerProgress,
} from '@/lib/progression';

interface MissionProgressProps {
  progress: PlayerProgress;
  compact?: boolean;
}

const MissionProgress = ({ progress, compact = false }: MissionProgressProps) => {
  const level = getCurrentLevel(progress.totalXP);
  const nextLevel = getNextLevel(progress.totalXP);
  const xpProgress = getXPProgress(progress.totalXP);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-lg">{level.icon}</span>
        <span className="text-sm font-bold text-card-foreground">{level.title}</span>
        <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-bold text-primary">
          {progress.totalXP} XP
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-2xl card-edge-lit bg-card p-5 space-y-4">
      {/* Level display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-2xl shadow-md"
          >
            {level.icon}
          </motion.div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Level {level.level}</p>
            <p className="text-lg font-black text-card-foreground">{level.title}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-primary">{progress.totalXP}</p>
          <p className="text-xs font-bold text-muted-foreground">Total XP</p>
        </div>
      </div>

      {/* XP progress bar */}
      {nextLevel && (
        <div>
          <div className="flex justify-between text-xs font-bold text-muted-foreground mb-1.5">
            <span>{level.title}</span>
            <span>{nextLevel.title}</span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))' }}
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress.percent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <p className="mt-1 text-xs text-muted-foreground text-center">
            {xpProgress.current} / {xpProgress.max} XP to next level
          </p>
        </div>
      )}
      {!nextLevel && (
        <div className="text-center">
          <p className="text-sm font-bold text-accent">🏆 Maximum level reached!</p>
        </div>
      )}

      {/* Missions completed */}
      <div className="flex items-center justify-center gap-2 rounded-xl bg-muted/50 py-2">
        <span className="text-lg">🎯</span>
        <span className="text-sm font-bold text-card-foreground">
          {progress.missionsCompleted} mission{progress.missionsCompleted !== 1 ? 's' : ''} completed
        </span>
      </div>

      {/* Badges */}
      <div>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Badges Earned</p>
        <div className="flex flex-wrap gap-2">
          {BADGES.map(badge => {
            const earned = progress.badgesEarned.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-all ${
                  earned
                    ? 'border-accent bg-accent/10 text-accent-foreground'
                    : 'border-border bg-muted/30 text-muted-foreground opacity-40'
                }`}
                title={badge.description}
              >
                <span className="text-sm">{badge.icon}</span>
                <span>{badge.name}</span>
                {!earned && <span className="text-[10px]">({badge.missionsRequired})</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MissionProgress;
