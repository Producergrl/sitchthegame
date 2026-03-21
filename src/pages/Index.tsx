import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Settings, Heart, Shield, Sparkles, Sticker, Zap, ChevronDown, ChevronRight } from 'lucide-react';
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
      background: `radial-gradient(circle, hsl(45 90% 55% / 0.5), hsl(45 90% 55% / 0))`,
    }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 0.7, 0],
      scale: [0, 1.2, 0.3],
      y: [0, -80, -160],
    }}
    transition={{ duration: dur, delay, repeat: Infinity, ease: 'easeOut' }}
  />
);

const particles = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  delay: i * 0.35 + Math.random() * 2,
  size: 2 + Math.random() * 4,
  x: 5 + Math.random() * 90,
  y: 50 + Math.random() * 45,
  dur: 3.5 + Math.random() * 3,
}));

/* ── nav items ── */
const navItems = [
  { title: 'Mission Packs', desc: 'Explore all decks', to: '/decks', emoji: '📦' },
  { title: 'Sticker Album', desc: 'Your collection', to: '/stickers', emoji: '⭐' },
  { title: 'Safety Hub', desc: 'Help & resources', to: '/resources', emoji: '💙' },
];

/* ── main ── */
const Index = () => {
  const [progress, setProgress] = useState<PlayerProgress>(loadProgress);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const level = useMemo(() => getCurrentLevel(progress.totalXP), [progress.totalXP]);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: 'linear-gradient(180deg, hsl(225 45% 8%) 0%, hsl(225 35% 4%) 100%)' }}>
      {/* ═══════════ FULL-SCREEN HERO ═══════════ */}
      <div className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden">
        {/* Deep cinematic background layers */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, hsl(225 45% 20% / 0.6) 0%, transparent 70%)',
        }} />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 45%, hsl(45 80% 45% / 0.06) 0%, transparent 60%)',
        }} />

        {/* Grain overlay */}
        <div className="absolute inset-0 grain-overlay pointer-events-none" />

        {/* Heavy vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, hsl(225 30% 3% / 0.7) 100%)',
        }} />

        {/* Theme toggle */}
        <div className="absolute right-3 top-3 z-30">
          <ThemeToggle className="text-white/40 hover:text-white/80 hover:bg-white/5" />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
          {particles.map(p => <Particle key={p.id} {...p} />)}
        </div>

        {/* ── Animated glow aura behind title ── */}
        <motion.div
          className="absolute z-[1] pointer-events-none"
          style={{
            width: 500, height: 500,
            top: '50%', left: '50%', transform: 'translate(-50%, -55%)',
          }}
            animate={{
            background: [
              'radial-gradient(circle, hsl(45 85% 50% / 0.12) 0%, hsl(225 40% 20% / 0.05) 40%, transparent 70%)',
              'radial-gradient(circle, hsl(45 85% 50% / 0.20) 0%, hsl(225 40% 20% / 0.08) 40%, transparent 70%)',
              'radial-gradient(circle, hsl(45 85% 50% / 0.12) 0%, hsl(225 40% 20% / 0.05) 40%, transparent 70%)',
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* ── Shield emblem ── */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 14, stiffness: 80, delay: 0.2 }}
          className="relative z-10 mb-8"
        >
          <div
            className="relative flex h-24 w-24 items-center justify-center rounded-[1.75rem] gold-sweep"
            style={{
              background: 'linear-gradient(145deg, hsl(42 75% 38%), hsl(45 90% 50%), hsl(38 80% 42%))',
              boxShadow: '0 0 40px hsl(45 90% 50% / 0.35), 0 0 80px hsl(45 90% 50% / 0.12), inset 0 1px 1px hsl(48 95% 75% / 0.4)',
            }}
          >
            <Shield className="relative z-10 h-12 w-12 text-white drop-shadow-[0_2px_4px_hsl(0_0%_0%/0.5)]" />
          </div>
          {/* Orbiting rings */}
          <motion.div
            className="absolute inset-[-10px] rounded-[2.25rem] border border-gold/15"
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-[-22px] rounded-[2.75rem] border border-gold/8"
            animate={{ rotate: -360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>

        {/* ── CINEMATIC TITLE ── */}
        <div className="relative z-10 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-[2.4rem] leading-[1.1] font-black tracking-[-0.02em] md:text-[4.5rem] uppercase"
            style={{
              background: 'linear-gradient(170deg, hsl(48 80% 75%) 0%, hsl(45 95% 55%) 30%, hsl(40 100% 50%) 50%, hsl(45 90% 52%) 70%, hsl(35 70% 38%) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 4px 12px hsl(45 90% 50% / 0.35)) drop-shadow(0 1px 0 hsl(35 80% 25% / 0.5))',
            }}
          >
            Sitch
          </motion.h1>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="mt-2 block text-[0.7rem] font-bold uppercase tracking-[0.35em] md:text-xs"
            style={{ color: 'hsl(45 70% 60% / 0.7)' }}
          >
            Founders Edition
          </motion.span>

          {/* Metallic underline accent */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-3 h-[2px] w-32 origin-center"
            style={{
              background: 'linear-gradient(90deg, transparent, hsl(45 90% 55% / 0.8), transparent)',
            }}
          />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.6 }}
            className="mx-auto mt-5 max-w-xs text-sm text-white/50 font-medium tracking-wide uppercase"
            style={{ letterSpacing: '0.15em' }}
          >
            A game of choices & consequences
          </motion.p>
        </div>

        {/* ── Level badge ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.8, duration: 0.5 }}
          className="relative z-10 mt-8 flex items-center gap-2.5 rounded-full px-5 py-2.5"
          style={{
            background: 'hsl(0 0% 100% / 0.04)',
            border: '1px solid hsl(45 80% 50% / 0.25)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <span className="text-lg">{level.icon}</span>
          <span className="text-sm font-bold" style={{ color: 'hsl(45 85% 55%)' }}>{level.title}</span>
          <span className="h-3 w-px bg-white/15" />
          <span className="text-sm font-bold text-white/70">{progress.totalXP} XP</span>
        </motion.div>

        {/* ── CTA buttons ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.6 }}
          className="relative z-10 mt-10 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Link to="/play?decks=__compilation__&age=7-9&mode=quiz">
            <Button
              size="lg"
              className="group gap-2.5 text-base font-black tracking-wide uppercase shadow-2xl active:animate-btn-press transition-all duration-300 hover:scale-110 px-10 py-7 rounded-2xl border-0"
              style={{
                background: 'linear-gradient(135deg, hsl(42 85% 45%), hsl(45 90% 52%))',
                boxShadow: '0 4px 30px hsl(45 90% 50% / 0.5), 0 0 60px hsl(45 90% 50% / 0.15), inset 0 1px 1px hsl(48 95% 75% / 0.3)',
                color: 'hsl(225 40% 8%)',
              }}
            >
              <Zap className="h-5 w-5 transition-transform group-hover:rotate-12 group-hover:scale-110" />
              Quick Play
            </Button>
          </Link>
          <Link to="/session/setup">
            <Button
              size="lg"
              variant="outline"
              className="gap-2.5 text-base font-bold uppercase tracking-wide active:animate-btn-press transition-all duration-300 hover:scale-105 px-10 py-7 rounded-2xl"
              style={{
                background: 'hsl(0 0% 100% / 0.03)',
                border: '1px solid hsl(0 0% 100% / 0.12)',
                color: 'hsl(0 0% 100% / 0.8)',
                backdropFilter: 'blur(8px)',
              }}
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
          transition={{ delay: 2.8 }}
          className="absolute bottom-8 z-10 flex flex-col items-center gap-1.5"
        >
          <span className="text-[10px] text-white/25 font-medium uppercase tracking-[0.2em]">Explore</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="h-4 w-4 text-white/25" />
          </motion.div>
        </motion.div>
      </div>

      {/* ═══════════ BELOW THE FOLD ═══════════ */}
      <div className="mx-auto max-w-lg px-4 py-10 space-y-5">
        {/* Mission Progress */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <MissionProgress progress={progress} />
        </motion.div>

        {/* Navigation cards — premium tactile feel */}
        <div className="grid gap-3">
          {navItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <Link to={item.to}>
                <motion.div
                  className="group flex items-center gap-4 rounded-2xl bg-card p-4 cursor-pointer"
                  style={{
                    border: '1px solid hsl(45 85% 50% / 0.12)',
                    boxShadow: '0 2px 8px hsl(225 30% 5% / 0.2), 0 8px 32px hsl(225 30% 5% / 0.15), inset 0 1px 0 hsl(0 0% 100% / 0.03)',
                  }}
                  whileHover={{
                    y: -4,
                    boxShadow: '0 8px 24px hsl(225 30% 5% / 0.3), 0 16px 48px hsl(225 30% 5% / 0.2), 0 0 20px hsl(45 90% 50% / 0.08), inset 0 1px 0 hsl(0 0% 100% / 0.05)',
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted text-2xl">
                    {item.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-card-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1 group-hover:text-gold" />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Safety badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl p-5 text-center"
          style={{
            background: 'hsl(45 80% 50% / 0.05)',
            border: '1px solid hsl(45 80% 50% / 0.14)',
            boxShadow: '0 0 40px hsl(45 90% 50% / 0.06)',
          }}
        >
          <Shield className="mx-auto mb-2 h-6 w-6 text-gold" />
          <p className="text-sm font-bold text-foreground">Designed for Safety</p>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            No public profiles · No messaging · No social sharing · Play with a trusted adult
          </p>
        </motion.div>

        {/* Admin */}
        <div className="text-center pb-8">
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