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
    <div className="min-h-screen overflow-x-hidden" style={{ background: 'linear-gradient(180deg, #F58B1F 0%, #F7941D 22%, #F9A642 45%, #FBC97A 70%, #FEF3D0 100%)' }}>
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

        {/* ── Logo + integrated CTA stack ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="relative z-10 flex flex-col items-center px-4"
        >
          {/* Logo bleeds into the orange hero — edges feathered with a radial mask */}
          <img
            src={sitchLogoV2}
            alt="Sitch — Family Edition · Are You Smart Under Pressure? A Game of Choice & Consequence"
            className="mx-auto w-[min(640px,94vw)] mix-blend-multiply"
            style={{
              WebkitMaskImage: 'radial-gradient(ellipse 75% 75% at 50% 50%, #000 55%, transparent 95%)',
              maskImage: 'radial-gradient(ellipse 75% 75% at 50% 50%, #000 55%, transparent 95%)',
              filter: 'drop-shadow(0 18px 40px hsl(15 75% 22% / 0.35))',
            }}
          />

          {/* CTA pair — styled as an extension of the logo plate */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
          >
            <Link to="/play?decks=__compilation__&age=7-9&mode=quiz">
              <Button
                size="lg"
                className="group w-full gap-2.5 text-base font-black tracking-[0.08em] uppercase active:animate-btn-press transition-all duration-300 hover:scale-[1.04] px-9 py-6 rounded-xl border-0 sm:w-auto"
                style={{
                  background: 'linear-gradient(180deg, #E63329 0%, #B81E16 100%)',
                  boxShadow: '0 6px 0 #7A1108, 0 12px 24px hsl(15 70% 20% / 0.35), inset 0 1px 0 hsl(45 95% 75% / 0.4)',
                  color: '#FEF3D0',
                  border: '1.5px solid #FDB913',
                }}
              >
                <Zap className="h-5 w-5 transition-transform group-hover:rotate-12 group-hover:scale-110" />
                Quick Play
              </Button>
            </Link>
            <Link to="/session/setup">
              <Button
                size="lg"
                className="w-full gap-2.5 text-base font-black tracking-[0.08em] uppercase active:animate-btn-press transition-all duration-300 hover:scale-[1.04] px-9 py-6 rounded-xl sm:w-auto"
                style={{
                  background: 'linear-gradient(180deg, #FEF3D0 0%, #FAD89A 100%)',
                  color: '#B81E16',
                  border: '1.5px solid #FDB913',
                  boxShadow: '0 6px 0 #B8861A, 0 12px 24px hsl(15 70% 20% / 0.25), inset 0 1px 0 hsl(0 0% 100% / 0.6)',
                }}
              >
                <Sparkles className="h-5 w-5" />
                Custom Game
              </Button>
            </Link>
          </motion.div>

          {/* ── Nav trio: Safety Hub enlarged & red ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 0.55 }}
            className="mt-6 grid w-full max-w-md grid-cols-3 gap-2.5"
          >
            {navItems.map((item) => {
              const isSafety = item.title === 'Safety Hub';
              return (
                <Link key={item.title} to={item.to}>
                  <motion.div
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    className={`flex h-full flex-col items-center justify-center gap-1 rounded-xl px-2 py-3 text-center ${isSafety ? 'scale-[1.08]' : ''}`}
                    style={
                      isSafety
                        ? {
                            background: 'linear-gradient(180deg, #E63329 0%, #B81E16 100%)',
                            border: '1.5px solid #FDB913',
                            boxShadow: '0 5px 0 #7A1108, 0 10px 22px hsl(15 70% 20% / 0.32), inset 0 1px 0 hsl(45 95% 75% / 0.4)',
                            color: '#FFFFFF',
                          }
                        : {
                            background: 'hsl(15 70% 20% / 0.14)',
                            border: '1px solid hsl(45 95% 70% / 0.4)',
                            backdropFilter: 'blur(8px)',
                            color: '#FEF3D0',
                          }
                    }
                  >
                    <span className="text-xl leading-none">{item.emoji}</span>
                    <span className={`text-[0.7rem] font-black uppercase tracking-wider leading-tight ${isSafety ? 'text-white' : 'text-[#FEF3D0]'}`}>
                      {item.title}
                    </span>
                  </motion.div>
                </Link>
              );
            })}
          </motion.div>

          {/* Slim level chip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.9, duration: 0.5 }}
            className="mt-4 flex items-center gap-2 rounded-full px-3.5 py-1.5"
            style={{
              background: 'hsl(15 70% 20% / 0.18)',
              border: '1px solid hsl(45 95% 70% / 0.35)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <span className="text-sm">{level.icon}</span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#FEF3D0]">{level.title}</span>
            <span className="h-3 w-px bg-[#FEF3D0]/30" />
            <span className="text-xs font-bold text-[#FEF3D0]">{progress.totalXP} XP</span>
          </motion.div>
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

        {/* Nav cards moved into the hero */}

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
