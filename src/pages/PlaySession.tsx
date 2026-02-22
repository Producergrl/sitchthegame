import { useState, useMemo, useCallback } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, Volume2, Eye, CheckCircle2, Flag, RotateCcw, Share2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cards as allCards, decks } from '@/data/seedData';
import type { AgeBand, PlayStyle } from '@/types/game';
import { parsePlayParams, buildPlayUrl } from '@/lib/playParams';
import { toast } from '@/hooks/use-toast';
import ThemeToggle from '@/components/ThemeToggle';

const ageBands: { value: AgeBand; label: string }[] = [
  { value: '4-6', label: '4–6 years' },
  { value: '5-7', label: '5–7 years' },
  { value: '7-11', label: '7–11 years' },
  { value: '8-10', label: '8–10 years' },
  { value: '11-13', label: '11–13 years' },
  { value: '12+', label: '12+ years' },
];

const playStyles: { value: PlayStyle; label: string; desc: string; icon: string }[] = [
  { value: 'discussion', label: 'Discussion', desc: 'Talk through scenarios together', icon: '💬' },
  { value: 'quiz', label: 'Quiz', desc: 'Light scoring for fun', icon: '🎯' },
  { value: 'roleplay', label: 'Roleplay', desc: 'Act out your responses', icon: '🎭' },
];

const PlaySession = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { params: parsed, isValid: autoStart } = useMemo(
    () =>
      parsePlayParams({
        decks: searchParams.get('decks'),
        age: searchParams.get('age'),
        mode: searchParams.get('mode'),
      }),
    [searchParams],
  );

  // Setup state – pre-filled from parsed params
  const [setupAgeBand, setSetupAgeBand] = useState<AgeBand>(parsed.age);
  const [setupMode, setSetupMode] = useState<PlayStyle>(parsed.mode);
  const [setupDecks, setSetupDecks] = useState<string[]>(parsed.deckIds);
  const [manualStarted, setManualStarted] = useState(false);

  const isPlaying = autoStart || manualStarted;

  // Active session params
  const activeDeckIds = isPlaying ? (autoStart ? parsed.deckIds : setupDecks) : [];
  const activeMode = isPlaying ? (autoStart ? parsed.mode : setupMode) : 'discussion';
  const activeAge = isPlaying ? (autoStart ? parsed.age : setupAgeBand) : '8-10';

  const sessionCards = useMemo(() => {
    if (activeDeckIds.length === 0) return allCards.filter(c => c.status === 'published');
    return allCards.filter(c => activeDeckIds.includes(c.deck_id) && c.status === 'published');
  }, [activeDeckIds]);

  const [index, setIndex] = useState(0);
  const [showGuidance, setShowGuidance] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [discussed, setDiscussed] = useState<Set<string>>(new Set());
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [sessionDone, setSessionDone] = useState(false);

  const card = sessionCards[index];
  const deck = card ? decks.find(d => d.id === card.deck_id) : null;

  const handleNext = useCallback(() => {
    if (index + 1 >= sessionCards.length) {
      setSessionDone(true);
    } else {
      setIndex(i => i + 1);
      setShowGuidance(false);
      setSelectedOption(null);
    }
  }, [index, sessionCards.length]);

  const handleSelectOption = (label: string) => {
    setSelectedOption(label);
    if (activeMode === 'quiz' && card?.correct_option === label) {
      setScore(s => s + 1);
    }
  };

  const handleReadAloud = () => {
    if (!card) return;
    const text = `${card.title}. ${card.scenario}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.pitch = 1.1;
    speechSynthesis.speak(utterance);
  };

  const toggleDiscussed = () => {
    if (!card) return;
    setDiscussed(prev => {
      const next = new Set(prev);
      next.has(card.id) ? next.delete(card.id) : next.add(card.id);
      return next;
    });
  };

  const toggleFlagged = () => {
    if (!card) return;
    setFlagged(prev => {
      const next = new Set(prev);
      next.has(card.id) ? next.delete(card.id) : next.add(card.id);
      return next;
    });
  };

  const handleShare = () => {
    const slugs = activeDeckIds.map(id => {
      const d = decks.find(dk => dk.id === id);
      return d?.slug ?? id;
    });
    const url = buildPlayUrl(
      { deckIds: slugs, age: activeAge, mode: activeMode },
      window.location.origin,
    );
    navigator.clipboard.writeText(url).then(() => {
      toast({ title: 'Link copied!', description: 'Share this URL to jump right into the session.' });
    });
  };

  const handleManualStart = () => {
    const sp = new URLSearchParams({ decks: setupDecks.join(','), age: setupAgeBand, mode: setupMode });
    navigate(`/play?${sp.toString()}`, { replace: true });
    setManualStarted(true);
  };

  const toggleSetupDeck = (id: string) => {
    const deck = decks.find(d => d.id === id);
    if (!deck?.is_free) return;
    setSetupDecks(prev => (prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]));
  };

  // ── Setup screen (no valid deep-link) ──
  if (!isPlaying) {
    return (
      <div className="min-h-screen bg-background">
        <div className="hero-gradient px-4 py-6 text-primary-foreground">
          <div className="mx-auto flex max-w-2xl items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/10 active:animate-btn-press">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-2xl font-black">Start a Session</h1>
            </div>
            <ThemeToggle className="text-primary-foreground hover:bg-white/10" />
          </div>
        </div>

        <div className="mx-auto max-w-2xl space-y-8 px-4 py-8">
          {/* Age Band */}
          <section>
            <h2 className="mb-3 text-lg font-bold">Age Group</h2>
            <div className="flex flex-wrap gap-2">
              {ageBands.map(ab => (
                <button
                  key={ab.value}
                  onClick={() => setSetupAgeBand(ab.value)}
                  className={`rounded-xl border-2 px-5 py-3 text-sm font-bold transition-all ${
                    setupAgeBand === ab.value
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-card text-card-foreground hover:border-primary/40'
                  }`}
                >
                  {ab.label}
                </button>
              ))}
            </div>
          </section>

          {/* Play Style */}
          <section>
            <h2 className="mb-3 text-lg font-bold">Play Style</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {playStyles.map(ps => (
                <button
                  key={ps.value}
                  onClick={() => setSetupMode(ps.value)}
                  className={`rounded-2xl border-2 p-4 text-left transition-all ${
                    setupMode === ps.value
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
          </section>

          {/* Deck Selection */}
          <section>
            <h2 className="mb-3 text-lg font-bold">Choose Decks</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {decks.map(d => {
                const isLocked = !d.is_free;
                return (
                  <button
                    key={d.id}
                    onClick={() => toggleSetupDeck(d.id)}
                    disabled={isLocked}
                    className={`relative flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all ${
                      isLocked
                        ? 'cursor-not-allowed border-border bg-muted/50 opacity-60'
                        : setupDecks.includes(d.id)
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-border bg-card hover:border-primary/40'
                    }`}
                  >
                    {isLocked && (
                      <div className="absolute right-3 top-3">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    <span className="text-3xl">{d.icon}</span>
                    <div>
                      <div className="font-bold text-card-foreground">{d.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Ages {d.age_band}
                        {isLocked && <span className="ml-1 text-caution">• Full Access</span>}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <Button
            size="lg"
            onClick={handleManualStart}
            disabled={setupDecks.length === 0}
            className="w-full gap-2 text-lg font-bold cta-glow bg-secondary text-secondary-foreground hover:bg-secondary/90 active:animate-btn-press transition-all duration-200 hover:scale-[1.02]"
          >
            Start Session ({setupDecks.length} deck{setupDecks.length !== 1 ? 's' : ''})
          </Button>
        </div>
      </div>
    );
  }

  // ── No cards ──
  if (sessionCards.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="text-center">
          <p className="text-lg font-bold text-foreground">No cards found for this selection.</p>
          <Link to="/play" className="mt-4 inline-block text-primary underline">Go back</Link>
        </div>
      </div>
    );
  }

  // ── Session done ──
  if (sessionDone) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="mx-auto max-w-lg pt-12 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}>
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-safe text-4xl text-primary-foreground">
              🎉
            </div>
          </motion.div>
          <h1 className="text-3xl font-black text-foreground">Great Job!</h1>
          <p className="mt-2 text-muted-foreground">You covered {sessionCards.length} cards together.</p>
          {activeMode === 'quiz' && (
            <p className="mt-1 text-lg font-bold text-primary">Score: {score} / {sessionCards.length}</p>
          )}
          <div className="mt-6 space-y-2 rounded-2xl border bg-card p-4 text-left">
            <p className="text-sm font-bold text-card-foreground">Session Summary</p>
            <p className="text-sm text-muted-foreground">✅ Discussed: {discussed.size} cards</p>
            <p className="text-sm text-muted-foreground">🚩 Flagged for review: {flagged.size} cards</p>
          </div>
          <div className="mt-6 flex flex-col gap-2">
            <Link to="/play">
              <Button className="w-full gap-2 font-bold"><RotateCcw className="h-4 w-4" /> New Session</Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="w-full font-bold">Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Active play ──
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="hero-gradient px-4 py-4 text-primary-foreground">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/play">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/10 active:animate-btn-press">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <span className="text-sm font-bold opacity-80">{deck?.icon} {deck?.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle className="text-primary-foreground hover:bg-white/10" />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="gap-1.5 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Share2 className="h-4 w-4" /> Share
            </Button>
            <span className="rounded-full bg-primary-foreground/20 px-3 py-1 text-sm font-bold">
              {index + 1} / {sessionCards.length}
            </span>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mx-auto mt-3 max-w-2xl">
          <div className="h-2 rounded-full bg-primary-foreground/20">
            <motion.div
              className="h-2 rounded-full bg-primary-foreground"
              initial={{ width: 0 }}
              animate={{ width: `${((index + 1) / sessionCards.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="mx-auto max-w-2xl px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={card.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="space-y-5"
          >
            {/* Scenario */}
            <div className="rounded-2xl card-edge-lit bg-card p-6">
              <h2 className="mb-3 text-xl font-black text-card-foreground">{card.title}</h2>
              <p className="text-base leading-relaxed text-card-foreground">{card.scenario}</p>
              <Button variant="ghost" size="sm" onClick={handleReadAloud} className="mt-3 gap-1.5 text-primary">
                <Volume2 className="h-4 w-4" /> Read Aloud
              </Button>
            </div>

            {/* Options */}
            <div className="space-y-2">
              {card.options.map(opt => {
                const isSelected = selectedOption === opt.label;
                const isCorrect = showGuidance && card.correct_option === opt.label;
                const isWrong = showGuidance && isSelected && card.correct_option !== opt.label;
                return (
                  <button
                    key={opt.label}
                    onClick={() => handleSelectOption(opt.label)}
                    disabled={showGuidance}
                    className={`w-full rounded-xl border p-4 text-left transition-all ${
                      isCorrect ? 'border-safe bg-safe/10' :
                      isWrong ? 'border-destructive bg-destructive/5' :
                      isSelected ? 'border-primary bg-primary/5' :
                      'card-edge-lit bg-card hover:border-gold/30'
                    }`}
                  >
                    <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                      {opt.label}
                    </span>
                    <span className="font-semibold text-card-foreground">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Guidance */}
            {!showGuidance && selectedOption && (
              <Button onClick={() => setShowGuidance(true)} className="w-full gap-2 font-bold" variant="outline">
                <Eye className="h-4 w-4" /> Reveal Guidance
              </Button>
            )}

            <AnimatePresence>
              {showGuidance && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-3"
                >
                  <div className="rounded-2xl border border-safe/30 bg-safe/5 p-5">
                    <p className="mb-1 text-sm font-bold text-safe">✅ Best Next Step</p>
                    <p className="text-sm text-card-foreground">{card.guidance_text}</p>
                  </div>
                  <div className="rounded-2xl border bg-card p-5">
                    <p className="mb-1 text-sm font-bold text-primary">💡 Why This Helps</p>
                    <p className="text-sm text-card-foreground">{card.why_text}</p>
                  </div>
                  <div className="rounded-2xl border border-accent/50 bg-accent/10 p-5">
                    <p className="mb-1 text-sm font-bold text-accent-foreground">🗣️ Practice Phrase</p>
                    <p className="text-sm italic text-card-foreground">{card.practice_phrase}</p>
                  </div>
                  <div className="rounded-2xl border border-help/30 bg-help/5 p-5">
                    <p className="mb-1 text-sm font-bold text-help">🤝 Ask an Adult</p>
                    <p className="text-sm text-card-foreground">{card.help_prompt}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={discussed.has(card.id) ? 'default' : 'outline'}
                size="sm"
                onClick={toggleDiscussed}
                className="gap-1.5"
              >
                <CheckCircle2 className="h-4 w-4" /> {discussed.has(card.id) ? 'Discussed ✓' : 'Mark Discussed'}
              </Button>
              <Button
                variant={flagged.has(card.id) ? 'destructive' : 'outline'}
                size="sm"
                onClick={toggleFlagged}
                className="gap-1.5"
              >
                <Flag className="h-4 w-4" /> {flagged.has(card.id) ? 'Flagged' : 'Flag for Review'}
              </Button>
              <div className="flex-1" />
              <Button onClick={handleNext} className="gap-1.5 font-bold">
                {index + 1 >= sessionCards.length ? 'Finish' : 'Next Card'} <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PlaySession;
