import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Settings, Heart, Shield, Sparkles, Sticker, Zap, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import MissionProgress from '@/components/MissionProgress';
import { loadProgress, getCurrentLevel, type PlayerProgress } from '@/lib/progression';
import sitchLogoV2 from '@/assets/sitch-logo-v2.png';

/* ── floating particle field ── */
const Particle = ({ delay, size, x, y, dur }: { delay: number; size: number; x: number; y: number; dur: number }) => (
  <motion.div
    className="absolute rounded-full"
    style={{
      width: size,
      height: size,
      left: `${x}%`,
      top: `${y}%`,
      background: `radial-gradient(circle, hsl(215 60% 30% / 0.35), hsl(215 60% 30% / 0))`,
    }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 0.5, 0],
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
    <div className="min-h-screen overflow-x-hidden" style={{ background: 'linear-gradient(180deg, #FEF3D0 0%, #FFF8E7 100%)' }}>
      {/* ═══════════ FULL-SCREEN HERO ═══════════ */}
      <div className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden">
        {/* Deep cinematic background layers */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, hsl(43 90% 70% / 0.5) 0%, transparent 70%)',
        }} />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 50% 50%, #FDB913 0%, #F7941D 60%, #F58B1F 100%)',
        }} />

        {/* Grain overlay */}
        <div className="absolute inset-0 grain-overlay pointer-events-none" />

        {/* Heavy vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, hsl(43 70% 70% / 0.3) 100%)',
        }} />

        {/* Theme toggle */}
        <div className="absolute right-3 top-3 z-30">
          <ThemeToggle className="text-[#1E3A5F]/40 hover:text-[#1E3A5F]/80 hover:bg-[#1E3A5F]/5" />
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
              'radial-gradient(circle, hsl(215 60% 30% / 0.08) 0%, hsl(43 80% 70% / 0.04) 40%, transparent 70%)',
              'radial-gradient(circle, hsl(215 60% 30% / 0.14) 0%, hsl(43 80% 70% / 0.06) 40%, transparent 70%)',
              'radial-gradient(circle, hsl(215 60% 30% / 0.08) 0%, hsl(43 80% 70% / 0.04) 40%, transparent 70%)',
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* ── Logo (v2) ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="relative z-10 px-4"
        >
          <img
            src={sitchLogoV2}
            alt="Sitch — Family Edition"
            className="mx-auto w-[min(520px,85vw)] drop-shadow-[0_10px_30px_hsl(15_70%_30%/0.35)]"
          />
        </motion.div>

        {/* ── Tagline ── */}
        <div className="relative z-10 text-center px-4">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            className="mt-1 block text-[0.6rem] font-bold uppercase tracking-[0.25em] text-primary-foreground font-sans md:text-sm"
          >
            Are You Smart Under Pressure?
          </motion.span>

          {/* Metallic underline accent */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-3 h-[2px] w-32 origin-center"
            style={{
              background: 'linear-gradient(90deg, transparent, #1E3A5F80, transparent)',
            }}
          />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.6 }}
            className="mx-auto mt-5 max-w-xs text-sm font-medium tracking-wide uppercase text-[#2D5F8A]"
            style={{ letterSpacing: '0.15em' }}
          >
            A Game of Choice & Consequence
          </motion.p>
        </div>

        {/* ── Level badge ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.8, duration: 0.5 }}
          className="relative z-10 mt-8 flex items-center gap-2.5 rounded-full px-5 py-2.5"
          style={{
            background: 'hsl(215 50% 30% / 0.06)',
            border: '1px solid hsl(215 50% 30% / 0.15)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <span className="text-lg">{level.icon}</span>
          <span className="text-sm font-bold text-[#1E3A5F]">{level.title}</span>
          <span className="h-3 w-px bg-[#1E3A5F]/15" />
          <span className="text-sm font-bold text-[#1E3A5F]">{progress.totalXP} XP</span>
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
                background: 'linear-gradient(135deg, #1E3A5F, #2D5F8A)',
                boxShadow: '0 4px 30px hsl(215 60% 30% / 0.35), 0 0 60px hsl(215 60% 30% / 0.1), inset 0 1px 1px hsl(215 60% 50% / 0.3)',
                color: '#FEF3D0',
              }}
            >
              <Zap className="h-5 w-5 transition-transform group-hover:rotate-12 group-hover:scale-110" />
              Quick Play
            </Button>
          </Link>
          <Link to="/session/setup">
            <Button
              size="lg"
              className="gap-2.5 text-base font-bold uppercase tracking-wide active:animate-btn-press transition-all duration-300 hover:scale-105 px-10 py-7 rounded-2xl"
              style={{
                background: 'white',
                color: '#1E3A5F',
                border: '2px solid #1E3A5F',
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
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#1E3A5F]/35">Explore</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="h-4 w-4 text-[#1E3A5F]/35" />
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

        {/* Navigation cards */}
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
                  className="group flex items-center gap-4 rounded-2xl bg-white p-4 cursor-pointer"
                  style={{
                    border: '1px solid hsl(215 50% 30% / 0.12)',
                    boxShadow: '0 2px 8px hsl(215 30% 20% / 0.08), 0 8px 32px hsl(215 30% 20% / 0.06), inset 0 1px 0 hsl(0 0% 100% / 0.5)',
                  }}
                  whileHover={{
                    y: -4,
                    boxShadow: '0 8px 24px hsl(215 30% 20% / 0.12), 0 16px 48px hsl(215 30% 20% / 0.08), 0 0 20px hsl(215 60% 30% / 0.06), inset 0 1px 0 hsl(0 0% 100% / 0.6)',
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted text-2xl">
                    {item.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-[#1E3A5F]">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#1E3A5F]" />
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
            background: 'hsl(215 50% 30% / 0.05)',
            border: '1px solid hsl(215 50% 30% / 0.14)',
            boxShadow: '0 0 40px hsl(215 60% 30% / 0.04)',
          }}
        >
          <Shield className="mx-auto mb-2 h-6 w-6 text-[#1E3A5F]" />
          <p className="text-sm font-bold text-[#1E3A5F]">Designed for Safety</p>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            No public profiles · No messaging · No social sharing · Play with a trusted adult
          </p>
        </motion.div>

        {/* Admin */}
        <div className="text-center pb-8">
          <Link to="/admin" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-[#1E3A5F] transition-colors">
            <Settings className="h-3.5 w-3.5" />
            Manage Cards
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
