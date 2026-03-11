import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, BookOpen, Settings, Heart, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import MissionProgress from '@/components/MissionProgress';
import { loadProgress, type PlayerProgress } from '@/lib/progression';

const features = [
  { icon: Play, title: 'Start Mission', desc: 'Begin a guided mission', to: '/session/setup', color: 'bg-primary' },
  { icon: BookOpen, title: 'Browse Decks', desc: 'Explore mission packs', to: '/decks', color: 'bg-secondary' },
  { icon: Settings, title: 'Manage Cards', desc: 'Create & edit content', to: '/admin', color: 'bg-gentle' },
  { icon: Heart, title: 'Resources', desc: 'Help & safety info', to: '/resources', color: 'bg-help' },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const Index = () => {
  const [progress, setProgress] = useState<PlayerProgress>(loadProgress);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden hero-gradient px-4 pb-20 pt-16 text-primary-foreground grain-overlay vignette">
        <div className="absolute right-3 top-3 z-20">
          <ThemeToggle className="text-primary-foreground hover:bg-white/10" />
        </div>
        {/* Decorative orbs */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${80 + i * 40}px`,
                height: `${80 + i * 40}px`,
                top: `${5 + i * 14}%`,
                left: `${3 + i * 16}%`,
                background: `radial-gradient(circle, hsl(160 84% 40% / 0.15), transparent)`,
              }}
            />
          ))}
          <div
            className="absolute -right-20 -top-20 h-64 w-64 rounded-full"
            style={{ background: 'radial-gradient(circle, hsl(42 78% 50% / 0.08), transparent)' }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="mx-auto mb-5 flex h-22 w-22 items-center justify-center rounded-3xl gold-glow animate-glow-pulse gold-sweep"
            style={{ background: 'linear-gradient(135deg, hsl(42 78% 50%), hsl(42 90% 62%))' }}
          >
            <Shield className="relative z-10 h-11 w-11 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 text-4xl font-black md:text-5xl drop-shadow-lg"
          >
            What Would You Do?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-md text-lg text-white/85"
          >
            A fun card game to help kids learn safe choices — play together with a trusted adult!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            <Link to="/session/setup">
              <Button
                size="lg"
                className="gap-2 text-lg font-bold shadow-lg cta-glow bg-secondary text-secondary-foreground hover:bg-secondary/90 active:animate-btn-press transition-all duration-200 hover:scale-105 hover:shadow-xl"
              >
                <Sparkles className="h-5 w-5" />
                Start Playing
              </Button>
            </Link>
            <Link to="/decks">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-white/25 text-lg font-bold text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:border-white/40 active:animate-btn-press transition-all duration-200 hover:scale-105"
              >
                <BookOpen className="h-5 w-5" />
                Browse Decks
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Player Progression */}
      <div className="mx-auto max-w-4xl px-4 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <MissionProgress progress={progress} />
        </motion.div>
      </div>

      {/* Features */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-4 sm:grid-cols-2"
        >
          {features.map((f) => (
            <motion.div key={f.title} variants={item}>
              <Link to={f.to}>
                <div className="group flex items-center gap-4 rounded-2xl card-edge-lit bg-card p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] active:animate-btn-press">
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${f.color} text-primary-foreground shadow-md`}>
                    <f.icon className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-card-foreground">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Safety note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 rounded-2xl card-edge-lit bg-gold/5 p-6 text-center gold-glow"
          style={{ boxShadow: '0 0 30px hsl(42 90% 62% / 0.1)' }}
        >
          <Shield className="mx-auto mb-2 h-8 w-8 text-gold" />
          <p className="text-sm font-semibold text-foreground">Designed for Safety</p>
          <p className="mt-1 text-xs text-muted-foreground">
            No public profiles • No messaging • No social sharing • Play with a trusted adult
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
