import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle, HelpCircle, Theater, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import SEO from '@/components/SEO';

const playModes = [
  {
    icon: MessageCircle,
    title: 'Discussion Mode',
    description:
      'Read a real-life scenario and talk about it together. Share what you would do, why, and listen to other perspectives. Great for family conversations!',
  },
  {
    icon: HelpCircle,
    title: 'Quiz Mode',
    description:
      'Pick the best answer from multiple choices. See how you score and learn why some choices work better than others.',
  },
  {
    icon: Theater,
    title: 'Roleplay Mode',
    description:
      'Act it out! Take on a role in the scenario and practice handling the situation. A fun way to build real-world confidence.',
  },
];

const steps = [
  { num: '1', text: 'Pick your age group' },
  { num: '2', text: 'Choose a topic deck' },
  { num: '3', text: 'Select a play style' },
  { num: '4', text: 'Work through scenarios and earn points!' },
];

const HowToPlay = () => (
  <div className="min-h-screen bg-background text-foreground">
    <SEO
      title="How to Play Sitch — Family Safety Card Game"
      description="A simple beginner guide to Sitch: pick an age band, choose a topic deck, and play one of three modes — Discussion, Quiz, or Roleplay."
      path="/how-to-play"
    />
    {/* Header */}
    <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="max-w-3xl mx-auto flex items-center gap-3 px-4 py-3">
        <Link to="/" aria-label="Back to home">
          <Button variant="ghost" size="icon" aria-label="Back to home" className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">How to Play</h1>
      </div>
    </div>

    <main className="max-w-3xl mx-auto px-4 py-8 space-y-10">
      {/* Intro */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <Sparkles className="w-10 h-10 mx-auto text-gold" />
        <h2 className="text-2xl font-bold">It's simple!</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Read a scenario, decide what you'd do, and learn together. Play solo or with family and friends.
        </p>
      </motion.section>

      {/* Steps */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold">Getting Started</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {steps.map((s) => (
            <Card key={s.num} className="text-center">
              <CardContent className="p-4 space-y-1">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                  {s.num}
                </span>
                <p className="text-sm font-medium">{s.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* Play Modes */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold">Three Ways to Play</h3>
        <div className="space-y-3">
          {playModes.map((mode) => (
            <Card key={mode.title}>
              <CardContent className="flex items-start gap-4 p-5">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                  <mode.icon className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="font-semibold">{mode.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{mode.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center pt-4"
      >
        <Link to="/session/setup">
          <Button size="lg" className="rounded-full px-8 bg-primary text-primary-foreground">
            Start Playing
          </Button>
        </Link>
      </motion.div>
    </main>
  </div>
);

export default HowToPlay;
