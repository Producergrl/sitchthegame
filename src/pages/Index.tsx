import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, BookOpen, Settings, Heart, Shield, Sparkles, Sticker, Zap, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import MissionProgress from '@/components/MissionProgress';
import { loadProgress, getCurrentLevel, type PlayerProgress } from '@/lib/progression';

/* ── floating particle field ── */
const Particle = ({ delay, size, x, y, dur }: { delay: number; size: number; x: number; y: number; dur: number }) => (
  <motion.div
    className="absolute rounded-full"
    style={{
      width: size,
      height: size,
      left: `${x}%`,
      top: `${y}%`,
      background: `radial-gradient(circle, hsl(42 90% 62% / 0.6), hsl(42 90% 62% / 0))`,
    }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 0.8, 0],
      scale: [0, 1, 0.5],
      y: [0, -60, -120],
    }}
    transition={{ duration: dur, delay, repeat: Infinity, ease: 'easeOut' }}
  />
);

const particles = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  delay: i * 0.4 + Math.random() * 2,
  size: 3 + Math.random() * 5,
  x: 5 + Math.random() * 90,
  y: 40 + Math.random() * 55,
  dur: 3 + Math.random() * 3,
}));

/* ── nav items ── */
const navItems = [
  { icon: BookOpen, title: 'Mission Packs', desc: 'Explore all decks', to: '/decks', emoji: '📦' },
  { icon: Sticker, title: 'Sticker Album', desc: 'Your collection', to: '/stickers', emoji: '⭐' },
  { icon: Heart, title: 'Safety Hub', desc: 'Help & resources', to: '/resources', emoji: '💙' },
];

/* ── main ── */
const Index = () => {
  const [progress, setProgress] = useState<PlayerProgress>(loadProgress);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
    const t = setTimeout(() => setShowContent(true), 600);
    return () => clearTimeout(t);
  }, []);

  const level = useMemo(() => getCurrentLevel(progress.totalXP), [progress.totalXP]);

  return (
    <div className="min-h-screen bg-background">
      {/* ═══════════ FULL-SCREEN HERO ═══════════ */}
      <div className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden hero-gradient grain-overlay vignette">
        {/* Theme toggle */}
        <div className="absolute right-3 top-3 z-30">
          <ThemeToggle className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/10" />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
          {particles.map(p => (
            <Particle key={p.id} {...p} />
          ))}
        </div>

        {/* Radial glow behind shield */}
        <div className="absolute z-[2] pointer-events-none" style={{
          width: 400, height: 400,
          background: 'radial-gradient(circle, hsl(42 90% 62% / 0.12) 0%, transparent 70%)',
          top: '50%', left: '50%', transform: 'translate(-50%, -60%)',
        }} />

        {/* ── Shield emblem ── */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12, stiffness: 100, duration: 1.2 }}
          className="relative z-10 mb-6"
        >
          <div className="relative flex h-28 w-28 items-center justify-center rounded-[2rem] gold-glow animate-glow-pulse gold-sweep"
            style={{ background: 'linear-gradient(135deg, hsl(42 78% 50%), hsl(42 90% 62%))' }}
          >
            <Shield className="relative z-10 h-14 w-14 text-white drop-shadow-lg" />
          </div>
          {/* Orbiting ring */}
          <motion.div
            className="absolute inset-[-12px] rounded-[2.5rem] border-2 border-gold/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-[-24px] rounded-[3rem] border border-gold/10"
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>

        {/* ── Title reveal ── */}
        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <h1 className="text-5xl font-black text-primary-foreground tracking-tight md:text-7xl drop-shadow-[0_4px_24px_hsl(0_0%_0%/0.5)]">
              What Would
            </h1>
            <h1 className="text-5xl font-black tracking-tight md:text-7xl drop-shadow-[0_4px_24px_hsl(0_0%_0%/0.5)]"
              style={{ color: 'hsl(42 90% 62%)' }}
            >
              You Do?
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mx-auto mt-4 max-w-sm text-base text-white/70 font-medium"
          >
            The safety card game that makes learning life skills an adventure
          </motion.p>
        </div>

        {/* ── Level badge ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="relative z-10 mt-6 flex items-center gap-2 rounded-full border border-gold/30 bg-black/30 backdrop-blur-md px-4 py-2"
        >
          <span className="text-xl">{level.icon}</span>
          <span className="text-sm font-bold text-gold">{level.title}</span>
          <span className="text-xs text-white/50">•</span>
          <span className="text-sm font-bold text-white/80">{progress.totalXP} XP</span>
        </motion.div>

        {/* ── CTA buttons ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="relative z-10 mt-10 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Link to="/play?decks=__compilation__&age=8-10&mode=quiz">
            <Button
              size="lg"
              className="group gap-2.5 text-lg font-black shadow-2xl cta-glow bg-secondary text-secondary-foreground hover:bg-secondary/90 active:animate-btn-press transition-all duration-300 hover:scale-110 hover:shadow-[0_8px_40px_hsl(24_95%_52%/0.6)] px-8 py-6 rounded-2xl"
            >
              <Zap className="h-5 w-5 transition-transform group-hover:rotate-12" />
              Quick Play
            </Button>
          </Link>
          <Link to="/session/setup">
            <Button
              size="lg"
              variant="outline"
              className="gap-2.5 border-white/20 text-lg font-bold text-white bg-white/5 backdrop-blur-md hover:bg-white/15 hover:border-white/40 active:animate-btn-press transition-all duration-300 hover:scale-105 px-8 py-6 rounded-2xl"
            >
              <Sparkles className="h-5 w-5" />
              Custom Game
            </Button>
          </Link>
        </motion.div>

        {/* ── Scroll indicator ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-6 z-10 flex flex-col items-center gap-1"
        >
          <span className="text-xs text-white/40 font-medium">Explore</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="h-4 w-4 text-white/40" />
          </motion.div>
        </motion.div>
      </div>

      {/* ═══════════ BELOW THE FOLD ═══════════ */}
      <div className="mx-auto max-w-lg px-4 py-8 space-y-6">
        {/* Mission Progress */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <MissionProgress progress={progress} />
        </motion.div>

        {/* Navigation cards */}
        <div className="grid gap-3">
          {navItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <Link to={item.to}>
                <div className="group flex items-center gap-4 rounded-2xl card-edge-lit bg-card p-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 hover:scale-[1.02] active:animate-btn-press">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted text-2xl">
                    {item.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-card-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 -rotate-90 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Safety badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl card-edge-lit bg-gold/5 p-5 text-center gold-glow"
          style={{ boxShadow: '0 0 30px hsl(42 90% 62% / 0.08)' }}
        >
          <Shield className="mx-auto mb-2 h-7 w-7 text-gold" />
          <p className="text-sm font-bold text-foreground">Designed for Safety</p>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            No public profiles · No messaging · No social sharing · Play with a trusted adult
          </p>
        </motion.div>

        {/* Admin */}
        <div className="text-center pb-6">
          <Link to="/admin" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Settings className="h-3.5 w-3.5" />
            Manage Cards
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
