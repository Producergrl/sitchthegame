import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { decks, COMPILATION_DECK_ID } from '@/data/seedData';
import type { AgeBand, PlayStyle } from '@/types/game';

const ageBands: { value: AgeBand; label: string }[] = [
  { value: '4-6', label: '4–6 years' },
  { value: '7-9', label: '7–9 years' },
  { value: '10+', label: '10+ years' },
  { value: 'teens', label: 'Teens' },
];

const playStyles: { value: PlayStyle; label: string; desc: string; icon: string }[] = [
  { value: 'discussion', label: 'Discussion', desc: 'Talk through scenarios together', icon: '💬' },
  { value: 'quiz', label: 'Quiz', desc: 'Light scoring for fun', icon: '🎯' },
  { value: 'roleplay', label: 'Roleplay', desc: 'Act out your responses', icon: '🎭' },
];

const SessionSetup = () => {
  const navigate = useNavigate();
  const [ageBand, setAgeBand] = useState<AgeBand>('7-9');
  const [playStyle, setPlayStyle] = useState<PlayStyle>('discussion');
  const [selectedDecks, setSelectedDecks] = useState<string[]>([]);

  const isCompilation = selectedDecks.includes(COMPILATION_DECK_ID);

  const toggleDeck = (id: string) => {
    if (id === COMPILATION_DECK_ID) {
      setSelectedDecks(prev =>
        prev.includes(COMPILATION_DECK_ID) ? [] : [COMPILATION_DECK_ID]
      );
      return;
    }
    setSelectedDecks(prev => {
      const without = prev.filter(d => d !== COMPILATION_DECK_ID);
      return without.includes(id) ? without.filter(d => d !== id) : [...without, id];
    });
  };

  const startSession = () => {
    const slugs = selectedDecks.map(id => {
      const d = decks.find(dk => dk.id === id);
      return d?.slug ?? id;
    });
    const params = new URLSearchParams({
      decks: slugs.join(','),
      age: ageBand,
      mode: playStyle,
    });
    navigate(`/play?${params}`);
  };

  return (
    <div className="min-h-screen bg-destructive" data-age-theme={ageBand}>
      <div className="hero-gradient px-4 py-6 text-primary-foreground">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <Link to="/">
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/10 active:animate-btn-press">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-black">Start a Session</h1>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8 space-y-8">
        {/* Age Band */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="mb-3 text-lg font-bold">Age Group</h2>
          <div className="flex flex-wrap gap-2">
            {ageBands.map(ab => (
              <button
                key={ab.value}
                onClick={() => { setAgeBand(ab.value); setSelectedDecks([]); }}
                className={`border-primary rounded-xl border-2 px-5 py-3 text-sm font-bold transition-all ${
                  ageBand === ab.value
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-card-foreground hover:border-primary/40'
                }`}
              >
                {ab.label}
              </button>
            ))}
          </div>
        </motion.section>

        {/* Play Style */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="mb-3 text-lg font-bold">Play Style</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {playStyles.map(ps => (
              <button
                key={ps.value}
                onClick={() => setPlayStyle(ps.value)}
                className={`rounded-2xl border-2 p-4 text-left transition-all ${
                  playStyle === ps.value
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border bg-card hover:border-primary/40'
                }`}
              >
                <div className="mb-1 text-2xl">{ps.icon}</div>
                <div className="font-bold text-card-foreground">{ps.label}</div>
                <div className="text-xs text-muted-foreground">{ps.desc}</div>
              </button>
            ))}
          </div>
        </motion.section>

        {/* Deck Selection */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="mb-3 text-lg font-bold">Choose Decks</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {/* Compilation option */}
            <button
              onClick={() => toggleDeck(COMPILATION_DECK_ID)}
              className={`relative flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all sm:col-span-2 ${
                isCompilation
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border bg-card hover:border-primary/40'
              }`}
            >
              <span className="text-3xl">🎲</span>
              <div>
                <div className="font-bold text-card-foreground">Compilation Mix</div>
                <div className="text-xs text-muted-foreground">Random missions from every deck — a surprise each time!</div>
              </div>
            </button>
            {decks.filter(deck => deck.age_band === ageBand).map(deck => (
              <button
                key={deck.id}
                onClick={() => toggleDeck(deck.id)}
                className={`relative flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all ${
                  selectedDecks.includes(deck.id)
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border bg-card hover:border-primary/40'
                }`}
              >
                <span className="text-3xl">{deck.icon}</span>
                <div>
                  <div className="font-bold text-card-foreground">{deck.name}</div>
                  <div className="text-xs text-muted-foreground">Ages {deck.age_band}</div>
                </div>
              </button>
            ))}
          </div>
        </motion.section>

        {/* Start */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <Button
            size="lg"
            onClick={startSession}
            disabled={selectedDecks.length === 0}
            className="w-full gap-2 text-lg font-bold cta-glow bg-secondary text-secondary-foreground hover:bg-secondary/90 active:animate-btn-press transition-all duration-200 hover:scale-[1.02]"
          >
            <Play className="h-5 w-5" />
            Start Session ({selectedDecks.length} deck{selectedDecks.length !== 1 ? 's' : ''})
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default SessionSetup;
