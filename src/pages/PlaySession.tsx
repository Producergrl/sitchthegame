import { useState, useMemo, useCallback, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, Volume2, Eye, CheckCircle2, Flag, RotateCcw, Share2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cards as allCards, decks, COMPILATION_DECK_ID, getCompilationCards } from '@/data/seedData';
import type { AgeBand, PlayStyle } from '@/types/game';
import { parsePlayParams, buildPlayUrl } from '@/lib/playParams';
import { toast } from '@/hooks/use-toast';
import ThemeToggle from '@/components/ThemeToggle';
import MissionProgress from '@/components/MissionProgress';
import {
  loadProgress, completeMission, getCurrentLevel, getXPProgress,
  XP_CORRECT, XP_BONUS, XP_DEMERIT,
  type PlayerProgress, type Badge as BadgeDef,
} from '@/lib/progression';

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
    if (activeDeckIds.includes(COMPILATION_DECK_ID)) return getCompilationCards(10);
    if (activeDeckIds.length === 0) return allCards.filter(c => c.status === 'published');
    return allCards.filter(c => activeDeckIds.includes(c.deck_id) && c.status === 'published');
  }, [activeDeckIds]);

  const [index, setIndex] = useState(0);
  const [showGuidance, setShowGuidance] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [discussed, setDiscussed] = useState<Set<string>>(new Set());
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [demerits, setDemerits] = useState(0);
  const [bonusPoints, setBonusPoints] = useState(0);
  const [customAnswer, setCustomAnswer] = useState('');
  const [customAnswerSubmitted, setCustomAnswerSubmitted] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);

  // Streak state
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [streakPop, setStreakPop] = useState(false);

  // Progression state
  const [playerProgress, setPlayerProgress] = useState<PlayerProgress>(loadProgress);
  const [sessionXP, setSessionXP] = useState(0);
  const [newBadgesThisSession, setNewBadgesThisSession] = useState<BadgeDef[]>([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [missionXPEarned, setMissionXPEarned] = useState(0);

  const NONE_LABEL = '✨';

  const card = sessionCards[index];
  const deck = card ? decks.find(d => d.id === card.deck_id) : null;

  // Complete a mission when moving to next card (after guidance revealed)
  const finishCurrentMission = useCallback(() => {
    if (!card) return;
    const result = completeMission(playerProgress, card.id, missionXPEarned);
    setPlayerProgress(result.progress);
    setSessionXP(prev => prev + missionXPEarned + 5); // +5 for mission complete base
    if (result.newBadges.length > 0) {
      setNewBadgesThisSession(prev => [...prev, ...result.newBadges]);
      result.newBadges.forEach(b => {
        toast({ title: `🏅 Badge Unlocked: ${b.name}!`, description: b.description });
      });
    }
    if (result.levelledUp) {
      setShowLevelUp(true);
      const newLvl = getCurrentLevel(result.progress.totalXP);
      toast({ title: `🎉 Level Up!`, description: `You're now a ${newLvl.title}!` });
    }
    setMissionXPEarned(0);
  }, [card, playerProgress, missionXPEarned]);

  const handleNext = useCallback(() => {
    // Award mission XP before advancing (whenever an option was selected)
    if (selectedOption !== null) finishCurrentMission();

    if (index + 1 >= sessionCards.length) {
      setSessionDone(true);
    } else {
      setIndex(i => i + 1);
      setShowGuidance(false);
      setSelectedOption(null);
      setCustomAnswer('');
      setCustomAnswerSubmitted(false);
      setShowLevelUp(false);
    }
  }, [index, sessionCards.length, selectedOption, finishCurrentMission]);

  const handleSelectOption = (label: string) => {
    if (selectedOption !== null) return;
    setSelectedOption(label);
    setCustomAnswerSubmitted(false);
    if (activeMode === 'quiz') {
      const isCorrect = card?.correct_option === label;
      const isWorst = card?.worst_option === label;
      if (isCorrect) {
        setScore(s => s + 1);
        setMissionXPEarned(prev => prev + XP_CORRECT);
        setStreak(prev => {
          const next = prev + 1;
          setBestStreak(b => Math.max(b, next));
          if (next >= 2) {
            setStreakPop(true);
            setTimeout(() => setStreakPop(false), 600);
          }
          return next;
        });
      } else {
        setStreak(0);
      }
      if (isWorst) {
        setDemerits(d => d + 1);
        setMissionXPEarned(prev => prev + XP_DEMERIT);
      }
    }
  };

  const handleSubmitCustomAnswer = () => {
    if (customAnswer.trim().length >= 10) {
      setCustomAnswerSubmitted(true);
      if (activeMode === 'quiz') {
        setBonusPoints(b => b + 1);
        setMissionXPEarned(prev => prev + XP_BONUS);
        // Custom answers count as safe choices for streak
        setStreak(prev => {
          const next = prev + 1;
          setBestStreak(b => Math.max(b, next));
          if (next >= 2) {
            setStreakPop(true);
            setTimeout(() => setStreakPop(false), 600);
          }
          return next;
        });
      }
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
    if (id === COMPILATION_DECK_ID) {
      setSetupDecks(prev => prev.includes(COMPILATION_DECK_ID) ? [] : [COMPILATION_DECK_ID]);
      return;
    }
    const deck = decks.find(d => d.id === id);
    if (!deck?.is_free) return;
    setSetupDecks(prev => {
      const without = prev.filter(d => d !== COMPILATION_DECK_ID);
      return without.includes(id) ? without.filter(d => d !== id) : [...without, id];
    });
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
              {/* Compilation option */}
              <button
                onClick={() => toggleSetupDeck(COMPILATION_DECK_ID)}
                className={`relative flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all sm:col-span-2 ${
                  setupDecks.includes(COMPILATION_DECK_ID)
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
    const level = getCurrentLevel(playerProgress.totalXP);
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="mx-auto max-w-lg space-y-6 pt-8">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }} className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-safe text-4xl text-primary-foreground">
              🎉
            </div>
            <h1 className="text-3xl font-black text-foreground">Mission Complete!</h1>
            <p className="mt-2 text-muted-foreground">You completed {sessionCards.length} missions this session.</p>
            {sessionXP > 0 && (
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="mt-2 text-xl font-black text-primary"
              >
                +{sessionXP} XP earned!
              </motion.p>
            )}
          </motion.div>

          {activeMode === 'quiz' && (
            <div className="space-y-2 text-center">
              <p className="text-lg font-bold text-primary">Score: {score + bonusPoints - demerits} pts</p>
              <div className="flex justify-center gap-4 text-sm">
                <span className="text-safe">✅ Correct: {score}</span>
                <span className="text-primary">✨ Bonus: {bonusPoints}</span>
                <span className="text-destructive">⚠️ Demerits: {demerits}</span>
              </div>
              {bestStreak >= 2 && (
                <motion.p
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring' }}
                  className="text-base font-black text-accent-foreground"
                >
                  🔥 Best Safety Streak: {bestStreak}
                </motion.p>
              )}
            </div>
          )}

          {/* Player Progression Card */}
          <MissionProgress progress={playerProgress} />

          {/* Session summary */}
          {newBadgesThisSession.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border-2 border-accent bg-accent/10 p-5 text-center"
            >
              <p className="text-sm font-bold text-accent-foreground mb-2">🏅 Badges Unlocked This Session!</p>
              <div className="flex justify-center gap-3">
                {newBadgesThisSession.map(b => (
                  <div key={b.id} className="flex flex-col items-center gap-1">
                    <span className="text-2xl">{b.icon}</span>
                    <span className="text-xs font-bold text-card-foreground">{b.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <div className="space-y-2 rounded-2xl border bg-card p-4 text-left">
            <p className="text-sm font-bold text-card-foreground">Session Summary</p>
            <p className="text-sm text-muted-foreground">✅ Discussed: {discussed.size} missions</p>
            <p className="text-sm text-muted-foreground">🚩 Flagged for review: {flagged.size} missions</p>
            {bonusPoints > 0 && (
              <p className="text-sm text-primary">✨ Critical thinking answers: {bonusPoints}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Link to="/play">
              <Button className="w-full gap-2 font-bold"><RotateCcw className="h-4 w-4" /> New Mission</Button>
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
            <span className="text-sm font-bold opacity-80">{deck?.icon} Mission {index + 1}</span>
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
              🎯 {index + 1} / {sessionCards.length}
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
          {activeMode === 'quiz' && (
            <div className="mt-2 flex justify-center gap-4 text-xs font-bold text-primary-foreground/80">
              <span>✅ {score}</span>
              <span>✨ {bonusPoints}</span>
              <span>⚠️ -{demerits}</span>
              <span className="text-primary-foreground">= {score + bonusPoints - demerits} pts</span>
            </div>
          )}
          {/* Streak counter */}
          {activeMode === 'quiz' && streak >= 2 && (
            <motion.div
              key={streak}
              initial={{ scale: 1.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-2 flex justify-center"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/20 px-3 py-1 text-sm font-black text-primary-foreground">
                🔥 Safety Streak: {streak}
              </span>
            </motion.div>
          )}
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
            {/* Mission briefing */}
            <div className="rounded-2xl card-edge-lit bg-card p-6">
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-bold text-primary uppercase tracking-wider">
                  Mission {index + 1}
                </span>
                <span className="text-xs text-muted-foreground">{deck?.name}</span>
              </div>
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
                const isWorst = showGuidance && card.worst_option === opt.label;
                const isWrong = showGuidance && isSelected && card.correct_option !== opt.label && !isWorst;
                return (
                  <button
                    key={opt.label}
                    onClick={() => handleSelectOption(opt.label)}
                    disabled={showGuidance}
                    className={`w-full rounded-xl border p-4 text-left transition-all ${
                      isCorrect ? 'border-safe bg-safe/10' :
                      isWorst ? 'border-destructive bg-destructive/10 ring-2 ring-destructive/30' :
                      isWrong ? 'border-destructive bg-destructive/5' :
                      isSelected ? 'border-primary bg-primary/5' :
                      'card-edge-lit bg-card hover:border-gold/30'
                    }`}
                  >
                    <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                      {opt.label}
                    </span>
                    <span className="font-semibold text-card-foreground">{opt.text}</span>
                    {isWorst && (
                      <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-destructive/20 px-2 py-0.5 text-xs font-bold text-destructive">
                        ⚠️ Worst choice
                      </span>
                    )}
                  </button>
                );
              })}
              {/* Critical thinking option */}
              {(() => {
                const isSelected = selectedOption === NONE_LABEL;
                return (
                  <>
                    <button
                      onClick={() => handleSelectOption(NONE_LABEL)}
                      disabled={showGuidance}
                      className={`w-full rounded-xl border p-4 text-left transition-all ${
                        showGuidance && isSelected && customAnswerSubmitted ? 'border-primary bg-primary/10 ring-2 ring-primary/30' :
                        showGuidance && isSelected ? 'border-caution bg-caution/5' :
                        isSelected ? 'border-primary bg-primary/5' :
                        'card-edge-lit bg-card hover:border-gold/30'
                      }`}
                    >
                      <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-bold text-primary-foreground">
                        ✨
                      </span>
                      <span className="font-semibold text-card-foreground">None of the above — I'm going to wow you with my answer!</span>
                      {showGuidance && isSelected && customAnswerSubmitted && (
                        <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-primary/20 px-2 py-0.5 text-xs font-bold text-primary">
                          ✨ +1 Bonus
                        </span>
                      )}
                    </button>
                    {/* Custom answer input */}
                    {isSelected && !showGuidance && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="rounded-xl border border-primary/30 bg-card p-4 space-y-3"
                      >
                        <p className="text-sm font-bold text-card-foreground">💭 Share your answer:</p>
                        <textarea
                          value={customAnswer}
                          onChange={e => setCustomAnswer(e.target.value)}
                          placeholder="What would YOU do in this situation? (at least 10 characters)"
                          className="w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-[80px] resize-none"
                        />
                        <div className="flex items-center justify-between">
                          <span className={`text-xs ${customAnswer.trim().length >= 10 ? 'text-safe' : 'text-muted-foreground'}`}>
                            {customAnswer.trim().length}/10 characters minimum
                          </span>
                          {!customAnswerSubmitted ? (
                            <Button
                              size="sm"
                              onClick={handleSubmitCustomAnswer}
                              disabled={customAnswer.trim().length < 10}
                              className="gap-1 font-bold"
                            >
                              <CheckCircle2 className="h-4 w-4" /> Submit Answer
                            </Button>
                          ) : (
                            <span className="text-sm font-bold text-safe">✅ Answer submitted!</span>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </>
                );
              })()}
            </div>

            {/* Guidance */}
            {!showGuidance && selectedOption && (selectedOption !== NONE_LABEL || customAnswerSubmitted) && (
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
                  {/* Demerit warning */}
                  {activeMode === 'quiz' && selectedOption && card.worst_option === selectedOption && (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="rounded-2xl border-2 border-destructive bg-destructive/10 p-5"
                    >
                      <p className="mb-1 text-sm font-bold text-destructive">⚠️ Demerit Point (-1)</p>
                      <p className="text-sm text-card-foreground">
                        This was the most dangerous choice. In real life, this could put you or others at serious risk. Let's learn why the better option matters!
                      </p>
                    </motion.div>
                  )}
                  {/* Bonus acknowledgment */}
                  {activeMode === 'quiz' && selectedOption === NONE_LABEL && customAnswerSubmitted && (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="rounded-2xl border-2 border-primary bg-primary/10 p-5"
                    >
                      <p className="mb-1 text-sm font-bold text-primary">✨ Bonus Point (+1)</p>
                      <p className="text-sm text-card-foreground">
                        Amazing critical thinking! You went beyond the options and thought for yourself. That's a powerful skill.
                      </p>
                      <p className="mt-2 text-sm italic text-muted-foreground">Your answer: "{customAnswer}"</p>
                    </motion.div>
                  )}
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
                  {/* Talk About It – parent/child conversation prompts */}
                  <div className="rounded-2xl border-2 border-gentle/40 bg-gentle/5 p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gentle/20 text-lg">💬</span>
                      <p className="text-sm font-black text-card-foreground">Talk About It</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Take a moment to chat together — there are no wrong answers here.</p>
                    <ul className="space-y-2">
                      {(card.reflection_prompts && card.reflection_prompts.length > 0
                        ? card.reflection_prompts
                        : ['Has anything like this ever happened to you?', 'Who are three adults you could tell if this happened?']
                      ).map((prompt, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-card-foreground">
                          <span className="mt-0.5 text-gentle">•</span>
                          <span>{prompt}</span>
                        </li>
                      ))}
                      <li className="flex items-start gap-2 text-sm text-card-foreground">
                        <span className="mt-0.5 text-gentle">•</span>
                        <span>How could I show you support in a situation like this?</span>
                      </li>
                    </ul>
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
