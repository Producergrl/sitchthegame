import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, BookOpen, Settings, Heart, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  { icon: Play, title: 'Start Session', desc: 'Begin a guided discussion', to: '/session/setup', color: 'bg-primary' },
  { icon: BookOpen, title: 'Browse Decks', desc: 'Explore card collections', to: '/decks', color: 'bg-secondary' },
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
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden bg-primary px-4 pb-16 pt-12 text-primary-foreground">
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-primary-foreground"
              style={{
                width: `${60 + i * 30}px`,
                height: `${60 + i * 30}px`,
                top: `${10 + i * 12}%`,
                left: `${5 + i * 16}%`,
              }}
            />
          ))}
        </div>
        <div className="relative mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-foreground/20 text-5xl"
          >
            <Shield className="h-10 w-10" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 text-4xl font-black md:text-5xl"
          >
            What Would You Do?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-md text-lg opacity-90"
          >
            A fun card game to help kids learn safe choices — play together with a trusted adult!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 flex flex-wrap justify-center gap-3"
          >
            <Link to="/session/setup">
              <Button size="lg" variant="secondary" className="gap-2 text-lg font-bold shadow-lg">
                <Sparkles className="h-5 w-5" />
                Start Playing
              </Button>
            </Link>
            <Link to="/decks">
              <Button size="lg" variant="outline" className="gap-2 border-primary-foreground/30 text-lg font-bold text-primary-foreground hover:bg-primary-foreground/10">
                <BookOpen className="h-5 w-5" />
                Browse Decks
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <div className="mx-auto max-w-4xl px-4 py-12">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-4 sm:grid-cols-2"
        >
          {features.map((f) => (
            <motion.div key={f.title} variants={item}>
              <Link to={f.to}>
                <div className="group flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${f.color} text-primary-foreground`}>
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
          className="mt-12 rounded-2xl border border-border bg-muted/50 p-6 text-center"
        >
          <Shield className="mx-auto mb-2 h-8 w-8 text-primary" />
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
