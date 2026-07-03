import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Shield, Sparkles, Zap, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import SEO from '@/components/SEO';
import ShareInviteButton from '@/components/ShareInviteButton';


// MissionProgress moved to /stickers (Profile tab)
import { loadProgress, getCurrentLevel, type PlayerProgress } from '@/lib/progression';
import sitchThumbnail from '@/assets/sitch-family-edition.png.asset.json';

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
  { title: 'Profile', desc: 'Stickers & level', to: '/stickers', emoji: '⭐' },
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
    <div className="min-h-screen overflow-x-hidden" style={{ background: 'linear-gradient(180deg, #8B1A0E 0%, #B8261A 22%, #D63A22 45%, #E87A4A 70%, #FEF3D0 100%)' }}>
      <SEO
        title="Sitch — Family Edition: A Child-Safety Card Game"
        description="A premium child-safety card game of choice and consequence. Real-life scenarios kids choose — and parents talk through, together."
        path="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: 'Sitch — Family Edition',
          description: 'Child-safety card game for families. Real-life scenarios, age-banded decks, and adult-led discussion.',
          brand: { '@type': 'Brand', name: 'Sitch' },
          category: 'Educational Card Game',
          url: 'https://sitchthegame.com/',
          image: 'https://sitchthegame.com/og-image.png',
        }}
      />
      <h1 className="sr-only">Sitch — Family Edition: A Child-Safety Card Game</h1>
      <main>
      {/* ═══════════ FULL-SCREEN HERO ═══════════ */}
      <div className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden">
        {/* Deep cinematic background layers — molten red */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, hsl(15 85% 45% / 0.55) 0%, transparent 70%)',
        }} />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 50% 45%, #C9281A 0%, #9E1A0E 55%, #6B0F08 100%)',
        }} />

        {/* Grain overlay */}
        <div className="absolute inset-0 grain-overlay pointer-events-none" />

        {/* Heavy vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at center, transparent 45%, hsl(10 80% 12% / 0.55) 100%)',
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
          {/* Updated Sitch Family Edition tile — premium framed presentation */}
          <img
            src={sitchThumbnail.url}
            alt="Sitch — Family Edition · Are You Smart Under Pressure? A Game of Choice & Consequence"
            className="mx-auto w-[min(440px,82vw)] rounded-3xl"
            style={{
              border: '2px solid #FDB913',
              boxShadow: '0 20px 50px hsl(15 75% 15% / 0.55), 0 0 0 1px hsl(45 95% 70% / 0.25), inset 0 1px 0 hsl(45 95% 75% / 0.4)',
            }}
          />

          {/* One-line value prop */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="mt-5 max-w-md text-center text-sm sm:text-base font-bold leading-snug text-[#FEF3D0]"
            style={{ textShadow: '0 2px 8px hsl(10 70% 12% / 0.55)' }}
          >
            Real-life safety scenarios. Your child chooses — then you talk it through, together.
          </motion.p>

          {/* CTA pair — styled as an extension of the logo plate */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center"
          >
            <Link to="/play?decks=__compilation__&age=7-9&mode=quiz" className="flex flex-col items-center">
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
              <span className="mt-1.5 text-[10px] font-bold uppercase tracking-wider text-[#FEF3D0]/85">10 random missions · ages 7–9</span>
            </Link>
            <Link to="/session/setup" className="flex flex-col items-center">
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
              <span className="mt-1.5 text-[10px] font-bold uppercase tracking-wider text-[#FEF3D0]/85">Pick age, mode & decks</span>
            </Link>
            <ShareInviteButton />
          </motion.div>

          {/* New-user helper link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.55, duration: 0.5 }}
            className="mt-3"
          >
            <Link
              to="/how-to-play"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FEF3D0] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FDB913] min-h-[44px]"
              style={{ textShadow: '0 2px 8px hsl(10 70% 12% / 0.55)' }}
              aria-label="New here? Read the How to Play guide"
            >
              <BookOpen className="h-3.5 w-3.5" />
              New here? How to Play →
            </Link>
          </motion.div>


          {/* ── Nav trio: all logo-blue, Safety Hub enlarged ── */}
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
                    className={`flex h-full flex-col items-center justify-center gap-1 rounded-xl px-2 py-3 text-center ${isSafety ? 'scale-[1.1]' : ''}`}
                    style={
                      isSafety
                        ? {
                            background: 'linear-gradient(180deg, #2D5F8A 0%, #1E3A5F 100%)',
                            border: '1.5px solid #FDB913',
                            boxShadow: '0 5px 0 #0F1F33, 0 10px 22px hsl(215 70% 10% / 0.45), inset 0 1px 0 hsl(215 60% 60% / 0.4)',
                            color: '#FFFFFF',
                          }
                        : {
                            background: 'linear-gradient(180deg, #2D5F8A 0%, #1E3A5F 100%)',
                            border: '1px solid hsl(215 60% 55% / 0.5)',
                            boxShadow: '0 3px 0 #0F1F33, 0 6px 14px hsl(215 70% 10% / 0.35), inset 0 1px 0 hsl(215 60% 55% / 0.35)',
                            color: '#FEF3D0',
                          }
                    }
                  >
                    <span className="text-xl leading-none">{item.emoji}</span>
                    <span className="text-[0.7rem] font-black uppercase tracking-wider leading-tight text-white">
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
              background: 'hsl(10 70% 12% / 0.35)',
              border: '1px solid hsl(45 95% 70% / 0.4)',
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
        {/* Mission Progress (Safety Scout) lives in the Profile tab now */}



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

      </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1E3A5F]/10 bg-[#FEF3D0] py-8">
        <div className="mx-auto max-w-lg px-4 text-center space-y-4">
          <p className="text-sm font-black text-[#1E3A5F]">© 2026 Sitch™. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-[#1E3A5F]/80">
            <Link to="/legal" className="hover:text-[#1E3A5F] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FDB913] rounded px-1 py-1">Terms & Privacy</Link>
            <Link to="/resources" className="hover:text-[#1E3A5F] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FDB913] rounded px-1 py-1">Safety Hub</Link>
            <Link to="/how-to-play" className="hover:text-[#1E3A5F] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FDB913] rounded px-1 py-1">How to Play</Link>
            <a href="mailto:admin@kdcandfilms.com" className="hover:text-[#1E3A5F] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FDB913] rounded px-1 py-1">Contact</a>
          </div>
          <p className="text-[10px] text-[#1E3A5F]/60 leading-relaxed">
            A fun family card game to hone your instincts and learn together.
            Not therapy or professional advice. Adult supervision recommended for younger children.
            All sales final — no refunds on digital purchases.
          </p>

        </div>
      </footer>
    </div>
  );
};

export default Index;
