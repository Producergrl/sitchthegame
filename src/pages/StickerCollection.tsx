import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import SEO from '@/components/SEO';
import { STICKERS, loadStickerProgress, type StickerProgress } from '@/lib/stickers';
import MissionProgress from '@/components/MissionProgress';
import ProfileSwitcher from '@/components/ProfileSwitcher';
import { loadProgress, type PlayerProgress } from '@/lib/progression';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, scale: 0.7 },
  show: { opacity: 1, scale: 1, transition: { type: 'spring' as const, bounce: 0.4 } },
};

const StickerCollection = () => {
  const [progress, setProgress] = useState<StickerProgress>(loadStickerProgress);
  const [playerProgress, setPlayerProgress] = useState<PlayerProgress>(loadProgress);

  useEffect(() => {
    setProgress(loadStickerProgress());
    setPlayerProgress(loadProgress());
  }, []);

  const earned = STICKERS.filter(s => progress.earnedIds.includes(s.id));
  const locked = STICKERS.filter(s => !progress.earnedIds.includes(s.id));

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Profile & Stickers — Sitch"
        description="Track your Sitch progress: Safety Scout level, XP, and earned mission stickers."
        path="/stickers"
      />
      {/* Header */}
      <div className="hero-gradient px-4 py-6 text-primary-foreground">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" aria-label="Back to home">
              <Button variant="ghost" size="icon" aria-label="Back to home" className="text-primary-foreground hover:bg-white/10 active:animate-btn-press">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-black">Profile</h1>
              <p className="text-sm text-white/70">{earned.length} / {STICKERS.length} collected</p>
            </div>
          </div>
          <ThemeToggle className="text-primary-foreground hover:bg-white/10" />
        </div>
      </div>

      <main className="mx-auto max-w-2xl px-4 py-6 space-y-8">
        {/* Multi-child profiles */}
        <ProfileSwitcher
          onChange={() => {
            setProgress(loadStickerProgress());
            setPlayerProgress(loadProgress());
          }}
        />

        {/* Safety Scout — player progress */}
        <section>
          <h2 className="mb-3 text-lg font-black text-foreground flex items-center gap-2">
            🛡️ Safety Scout
          </h2>
          <MissionProgress progress={playerProgress} />
        </section>

        {/* Sticker progress bar */}
        <div>
          <div className="flex justify-between text-xs font-bold text-muted-foreground mb-1.5">
            <span>{earned.length} earned</span>
            <span>{STICKERS.length} total</span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))' }}
              initial={{ width: 0 }}
              animate={{ width: `${(earned.length / STICKERS.length) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Earned stickers */}
        {earned.length > 0 && (
          <section>
            <h2 className="mb-4 text-lg font-black text-foreground flex items-center gap-2">
              ✨ Your Stickers
            </h2>
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 gap-3 sm:grid-cols-3"
            >
              {earned.map(sticker => (
                <motion.div
                  key={sticker.id}
                  variants={item}
                  whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
                  className={`relative rounded-2xl border-2 border-accent/30 bg-card p-4 text-center shadow-md transition-shadow hover:shadow-lg`}
                >
                  <div className={`mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl ${sticker.color} shadow-inner`}>
                    <span className="text-3xl drop-shadow-sm">{sticker.emoji}</span>
                  </div>
                  <p className="text-sm font-black text-card-foreground leading-tight">{sticker.name}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{sticker.description}</p>
                  {/* Sparkle decoration */}
                  <div className="absolute -right-1 -top-1 text-sm animate-pulse">✨</div>
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}

        {/* Locked stickers */}
        {locked.length > 0 && (
          <section>
            <h2 className="mb-4 text-lg font-black text-muted-foreground flex items-center gap-2">
              <Lock className="h-4 w-4" /> Still to Earn
            </h2>
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 gap-3 sm:grid-cols-3"
            >
              {locked.map(sticker => (
                <motion.div
                  key={sticker.id}
                  variants={item}
                  className="rounded-2xl border-2 border-border bg-muted/30 p-4 text-center opacity-50"
                >
                  <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                    <span className="text-3xl grayscale">{sticker.emoji}</span>
                  </div>
                  <p className="text-sm font-bold text-muted-foreground leading-tight">{sticker.name}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{sticker.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}

        {earned.length === 0 && (
          <div className="rounded-2xl bg-card p-8 text-center card-edge-lit">
            <span className="text-5xl">🎯</span>
            <p className="mt-3 text-lg font-bold text-card-foreground">No stickers yet!</p>
            <p className="mt-1 text-sm text-muted-foreground">Start playing missions to earn your first sticker.</p>
            <Link to="/session/setup">
              <Button className="mt-4 gap-2 font-bold">Start a Mission</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default StickerCollection;
