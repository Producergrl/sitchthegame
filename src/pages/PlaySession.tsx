import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, Eye, CheckCircle2, Flag, RotateCcw, Share2, Lock, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cards as allCards, decks, COMPILATION_DECK_ID, getCompilationCards } from '@/data/seedData';
import type { AgeBand, PlayStyle } from '@/types/game';
import { parsePlayParams, buildPlayUrl } from '@/lib/playParams';
import { toast } from '@/hooks/use-toast';
import ThemeToggle from '@/components/ThemeToggle';
import { playCorrectChime, playWrongBuzzer, playWowFanfare, playWowRing } from '@/lib/sounds';
import MissionProgress from '@/components/MissionProgress';
import ShareMilestoneCard from '@/components/ShareMilestoneCard';
import Confetti from '@/components/Confetti';
import {
  loadProgress, completeMission, getCurrentLevel, getXPProgress,
  XP_CORRECT, XP_BONUS, XP_DEMERIT,
  type PlayerProgress, type Badge as BadgeDef,
} from '@/lib/progression';
import {
  loadStickerProgress, checkNewStickers, awardStickers,
  type StickerProgress, type Sticker as StickerDef,
} from '@/lib/stickers';
import { saveWowResponse, getSessionResponses } from '@/lib/wowReview';
import AdultGate from '@/components/AdultGate';
import SEO from '@/components/SEO';

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
  const [setupStep, setSetupStep] = useState(1); // 1=Age, 2=Mode, 3=Deck

  const isPlaying = autoStart || manualStarted;

  // Active session params
  const activeDeckIds = isPlaying ? (autoStart ? parsed.deckIds : setupDecks) : [];
  const activeMode = isPlaying ? (autoStart ? parsed.mode : setupMode) : 'discussion';
  const activeAge = isPlaying ? (autoStart ? parsed.age : setupAgeBand) : '7-9';

  // Build session cards ONCE per session — memoized so React never re-creates them mid-play.
  const sessionKey = `${activeDeckIds.join(',')}|${activeAge}|${isPlaying ? '1' : '0'}`;
  const sessionCards = useMemo<typeof allCards>(() => {
    if (!isPlaying) return [];
    if (activeDeckIds.includes(COMPILATION_DECK_ID)) return getCompilationCards(10, activeAge);
    if (activeDeckIds.length === 0) return allCards.filter(c => c.status === 'published');
    return allCards.filter(c => activeDeckIds.includes(c.deck_id) && c.status === 'published');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionKey]);

  const [index, setIndex] = useState(0);
  // Reset index ONLY when the session key actually changes (new session/deck/age)
  const lastSessionKeyRef = useRef<string>(sessionKey);
  useEffect(() => {
    if (lastSessionKeyRef.current !== sessionKey) {
      lastSessionKeyRef.current = sessionKey;
      setIndex(0);
    }
  }, [sessionKey]);
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

  // Sticker state
  const [stickerProgress, setStickerProgress] = useState<StickerProgress>(loadStickerProgress);
  const [newStickersThisSession, setNewStickersThisSession] = useState<StickerDef[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  // Speech-to-text state
  const [isListening, setIsListening] = useState(false);
  const [speechSupported] = useState(() =>
    typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  );

  const toggleSpeechToText = useCallback(() => {
    if (!speechSupported) {
      toast({ title: '🎤 Not supported', description: 'Speech recognition is not available in this browser.' });
      return;
    }
    if (isListening) {
      setIsListening(false);
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setCustomAnswer(prev => {
        const combined = prev ? `${prev} ${transcript}` : transcript;
        return combined.slice(0, 500);
      });
    };

    recognition.start();
  }, [speechSupported, isListening]);

  const NONE_LABEL = '✨';

  const card = sessionCards[index];
  const deck = card ? decks.find(d => d.id === card.deck_id) : null;

  const finishCurrentMission = useCallback(() => {
    if (!card) return;
    const result = completeMission(playerProgress, card.id, missionXPEarned);
    setPlayerProgress(result.progress);
    setSessionXP(prev => prev + missionXPEarned + 5);
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
    // Check for new stickers
    const currentLevel = getCurrentLevel(result.progress.totalXP).level;
    const newStickers = checkNewStickers(stickerProgress, result.progress.missionsCompleted, streak, currentLevel);
    if (newStickers.length > 0) {
      const updatedStickerProg = awardStickers(stickerProgress, newStickers, streak);
      setStickerProgress(updatedStickerProg);
      setNewStickersThisSession(prev => [...prev, ...newStickers]);
      newStickers.forEach(s => {
        toast({ title: `🎨 Sticker Earned: ${s.name}!`, description: s.description });
      });
    }
    setMissionXPEarned(0);
  }, [card, playerProgress, missionXPEarned, stickerProgress, streak]);

  const handleNext = () => {
    const isLast = index + 1 >= sessionCards.length;
    // Award XP for the card we're leaving (uses current `card`)
    if (selectedOption !== null) {
      try { finishCurrentMission(); } catch (e) { console.error('finishCurrentMission failed', e); }
    }
    if (isLast) {
      setSessionDone(true);
      setShowConfetti(true);
      return;
    }
    setIndex(i => i + 1);
    setShowGuidance(false);
    setSelectedOption(null);
    setCustomAnswer('');
    setCustomAnswerSubmitted(false);
    setShowLevelUp(false);
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  };

  const handleSelectOption = (label: string) => {
    if (selectedOption !== null) return;
    setSelectedOption(label);
    setCustomAnswerSubmitted(false);

    // Sound effects play in ALL modes
    const isCorrect = card?.correct_option === label;
    const isWorst = card?.worst_option === label;

    if (label === NONE_LABEL) {
      // Option D gets its own special ring sound — not correct or wrong
      playWowRing();
    } else if (isCorrect) {
      playCorrectChime();
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2500);
    } else {
      playWrongBuzzer();
    }

    // Scoring & streaks only in quiz mode
    if (activeMode === 'quiz') {
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

  const sessionIdRef = useRef<string>(`s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);

  const handleSubmitCustomAnswer = () => {
    if (customAnswer.trim().length >= 10) {
      setCustomAnswerSubmitted(true);
      playWowFanfare();
      // Persist to local session log so an adult can review later
      if (card) {
        saveWowResponse(
          sessionIdRef.current,
          { ageBand: activeAge, mode: activeMode },
          {
            cardId: card.id,
            cardTitle: card.title,
            scenario: card.scenario,
            answer: customAnswer.trim(),
            timestamp: Date.now(),
          },
        );
      }
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
      <div className="min-h-screen bg-background" data-age-theme={setupAgeBand}>
        <div className="hero-gradient px-4 py-6 text-primary-foreground">
          <div className="mx-auto flex max-w-2xl items-center justify-between">
            <div className="flex items-center gap-3">
              {setupStep === 1 ? (
                <Link to="/" aria-label="Back to home">
                  <Button variant="ghost" size="icon" aria-label="Back to home" className="text-primary-foreground hover:bg-white/10 active:animate-btn-press">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <Button variant="ghost" size="icon" aria-label="Back to previous step" onClick={() => setSetupStep(s => s - 1)} className="text-primary-foreground hover:bg-white/10 active:animate-btn-press">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <h1 className="text-2xl font-black">
                {setupStep === 1 ? 'How old is the player?' : setupStep === 2 ? 'Pick a play style' : 'Choose your deck'}
              </h1>
            </div>
            <span className="rounded-full bg-primary-foreground/20 px-3 py-1 text-sm font-bold">
              {setupStep} / 3
            </span>
          </div>
          {/* Step progress — clickable to jump back to a completed step */}
          <div className="mx-auto mt-3 max-w-2xl">
            <div className="flex gap-2" role="tablist" aria-label="Setup steps">
              {[1, 2, 3].map(s => {
                const isReachable = s < setupStep;
                const isCurrent = s === setupStep;
                return (
                  <button
                    key={s}
                    type="button"
                    role="tab"
                    aria-selected={isCurrent}
                    aria-label={`Go to step ${s}`}
                    disabled={!isReachable}
                    onClick={() => isReachable && setSetupStep(s)}
                    className={`h-1.5 flex-1 rounded-full transition-all ${
                      s <= setupStep ? 'bg-primary-foreground' : 'bg-primary-foreground/20'
                    } ${isReachable ? 'cursor-pointer hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground' : 'cursor-default'}`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-2xl px-4 py-8">
          <AnimatePresence mode="wait">
            {/* Step 1: Age */}
            {setupStep === 1 && (
              <motion.div key="age" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {ageBands.map(ab => (
                    <button
                      key={ab.value}
                      onClick={() => { setSetupAgeBand(ab.value); setSetupStep(2); }}
                      className={`rounded-2xl border-2 p-5 text-center font-bold transition-all text-lg ${
                        setupAgeBand === ab.value
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-card text-card-foreground hover:border-primary/40'
                      }`}
                    >
                      {ab.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Play Style */}
            {setupStep === 2 && (
              <motion.div key="mode" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-4">
                <div className="grid gap-3">
                  {playStyles.map(ps => (
                    <button
                      key={ps.value}
                      onClick={() => { setSetupMode(ps.value); setSetupStep(3); }}
                      className={`flex items-center gap-4 rounded-2xl border-2 p-5 text-left transition-all ${
                        setupMode === ps.value
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-border bg-card hover:border-primary/40'
                      }`}
                    >
                      <span className="text-4xl">{ps.icon}</span>
                      <div>
                        <div className="text-lg font-bold text-card-foreground">{ps.label}</div>
                        <div className="text-sm text-muted-foreground">{ps.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Deck Selection */}
            {setupStep === 3 && (
              <motion.div key="decks" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-4">
                <button
                  onClick={() => toggleSetupDeck(COMPILATION_DECK_ID)}
                  className={`relative w-full flex items-center gap-3 rounded-2xl border-2 p-5 text-left transition-all ${
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
                <div className="grid gap-3 grid-cols-2">
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
                        <span className="text-2xl">{d.icon}</span>
                        <div>
                          <div className="text-sm font-bold text-card-foreground">{d.name}</div>
                          <div className="text-xs text-muted-foreground">
                            Ages {d.age_band}
                            {isLocked && <span className="ml-1 text-caution">• Full Access</span>}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <Button
                  size="lg"
                  onClick={handleManualStart}
                  disabled={setupDecks.length === 0}
                  className="w-full gap-2 text-lg font-bold cta-glow bg-secondary text-secondary-foreground hover:bg-secondary/90 active:animate-btn-press transition-all duration-200 hover:scale-[1.02]"
                >
                  🚀 Start Session
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // ── No cards ──
  if (sessionCards.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4" data-age-theme={activeAge}>
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
      <div className="min-h-screen bg-background p-4" data-age-theme={activeAge}>
        <Confetti active={showConfetti} />
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

          {/* Shareable Milestone Card */}
          <ShareMilestoneCard
            levelTitle={level.title}
            levelIcon={level.icon}
            levelNumber={level.level}
            missionsCompleted={playerProgress.missionsCompleted}
            totalXP={playerProgress.totalXP}
            badgeCount={playerProgress.badgesEarned.length}
            stickerCount={stickerProgress.earnedIds.length}
          />

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

          {/* Stickers earned this session */}
          {newStickersThisSession.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-5 text-center"
            >
              <p className="text-sm font-bold text-primary mb-3">🎨 Stickers Earned This Session!</p>
              <div className="flex flex-wrap justify-center gap-3">
                {newStickersThisSession.map(s => (
                  <motion.div
                    key={s.id}
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring' as const, bounce: 0.5, delay: 0.3 }}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.color} shadow-md`}>
                      <span className="text-2xl">{s.emoji}</span>
                    </div>
                    <span className="text-xs font-bold text-card-foreground">{s.name}</span>
                  </motion.div>
                ))}
              </div>
              <Link to="/stickers" className="mt-3 inline-block text-xs font-bold text-primary underline">
                View Collection →
              </Link>
            </motion.div>
          )}

          {/* Adult-only: Wow-Me responses review */}
          {getSessionResponses(sessionIdRef.current).length > 0 && (
            <AdultGate
              title="Review ✨ Wow-Me Answers"
              description={`${getSessionResponses(sessionIdRef.current).length} custom answer(s) saved this session. Press & hold to review.`}
            >
              <div className="rounded-2xl border-2 border-primary/30 bg-card p-4 text-left space-y-3">
                <p className="text-sm font-black text-primary">✨ Wow-Me Responses</p>
                {getSessionResponses(sessionIdRef.current).map((r) => (
                  <div key={r.cardId + r.timestamp} className="rounded-xl border bg-background/60 p-3">
                    <p className="text-xs font-bold text-card-foreground">{r.cardTitle}</p>
                    <p className="mt-1 text-xs italic text-muted-foreground">"{r.scenario}"</p>
                    <p className="mt-2 text-sm text-foreground">{r.answer}</p>
                  </div>
                ))}
              </div>
            </AdultGate>
          )}

          <div className="space-y-2 rounded-2xl border bg-card p-4 text-left">
            <p className="text-sm font-bold text-card-foreground">Session Summary</p>
            <p className="text-sm text-muted-foreground">✅ Discussed: {discussed.size} missions</p>
            <p className="text-sm text-muted-foreground">🚩 Flagged for review: {flagged.size} missions</p>
            {bonusPoints > 0 && (
              <p className="text-sm text-primary">✨ Critical thinking answers: {bonusPoints}</p>
            )}
          </div>
          {/* Try this next — recommend a different mode/deck combo */}
          <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-4 text-left">
            <p className="mb-2 text-sm font-black text-primary">🎯 Try this next</p>
            <div className="grid gap-2">
              <Link to={`/play?decks=__compilation__&age=${activeAge}&mode=${activeMode === 'quiz' ? 'discussion' : 'quiz'}`}>
                <Button variant="outline" className="w-full justify-start font-bold">
                  {activeMode === 'quiz' ? '💬 Switch to Discussion mode' : '🎯 Try Quiz mode for points'}
                </Button>
              </Link>
              <Link to="/decks">
                <Button variant="outline" className="w-full justify-start font-bold">
                  📦 Browse a different deck
                </Button>
              </Link>
              <Link to="/stickers">
                <Button variant="outline" className="w-full justify-start font-bold">
                  ⭐ See your sticker collection
                </Button>
              </Link>
            </div>
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
    <div className="min-h-screen bg-background overflow-x-hidden" data-age-theme={activeAge}>
      <Confetti active={showConfetti} />
      {/* Header */}
      <div className="hero-gradient px-3 py-3 sm:px-4 sm:py-4 text-primary-foreground">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <Link to="/play" aria-label="Back to session setup">
              <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0 text-primary-foreground hover:bg-white/10 active:animate-btn-press">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <span className="text-xs sm:text-sm font-bold opacity-80 truncate">{deck?.icon} Mission {index + 1}</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <ThemeToggle className="text-primary-foreground hover:bg-white/10" />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              aria-label="Share session link"
              className="h-10 w-10 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <span className="rounded-full bg-primary-foreground/20 px-2.5 py-1 text-xs sm:text-sm font-bold whitespace-nowrap">
              {index + 1}/{sessionCards.length}
            </span>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mx-auto mt-3 max-w-2xl">
          <div className="h-3 rounded-full bg-primary-foreground/20 overflow-hidden">
            <motion.div
              className="h-3 rounded-full bg-primary-foreground"
              initial={{ width: 0 }}
              animate={{ width: `${((index + 1) / sessionCards.length) * 100}%` }}
            />
          </div>
          {activeMode === 'quiz' && (
            <div className="mt-2 flex justify-center">
              <span className="rounded-full bg-primary-foreground/20 px-3 py-1 text-sm font-black text-primary-foreground">
                ⭐ {score + bonusPoints - demerits} pts
              </span>
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
              {/* Only show title as heading if it differs meaningfully from the scenario */}
              {card.scenario.toLowerCase().startsWith(card.title.toLowerCase().replace(/…$/, '')) ? (
                <h2 className="mb-3 text-xl font-black text-card-foreground">
                  <span className="text-primary">Here's the Sitch… </span>
                  {card.scenario}
                </h2>
              ) : (
                <>
                  <h2 className="mb-3 text-xl font-black text-card-foreground">{card.title}</h2>
                  <p className="text-base leading-relaxed text-card-foreground">
                    <span className="font-black text-primary">Here's the Sitch… </span>
                    {card.scenario}
                  </p>
                </>
              )}
            </div>

            {/* Options */}
            <div className="space-y-2">
              {card.options.map(opt => {
                const isSelected = selectedOption === opt.label;
                const hasSelected = selectedOption !== null && selectedOption !== NONE_LABEL;
                const isQuiz = activeMode === 'quiz';
                // Immediate feedback in quiz mode
                const selectedCorrect = isQuiz && isSelected && card.correct_option === opt.label;
                const selectedWrong = isQuiz && isSelected && card.correct_option !== opt.label;
                const revealCorrect = isQuiz && hasSelected && card.correct_option === opt.label && !isSelected;
                // Guidance-only reveals
                const isWorst = showGuidance && card.worst_option === opt.label;
                return (
                  <motion.button
                    key={opt.label}
                    onClick={() => handleSelectOption(opt.label)}
                    disabled={selectedOption !== null}
                    animate={
                      selectedCorrect ? { scale: [1, 1.03, 1] } :
                      selectedWrong ? { x: [0, -6, 6, -4, 4, 0] } :
                      {}
                    }
                    transition={{ duration: 0.4 }}
                    className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                      selectedCorrect ? 'border-safe bg-safe/15 ring-2 ring-safe/40' :
                      selectedWrong ? 'border-destructive bg-destructive/10 ring-2 ring-destructive/30' :
                      revealCorrect ? 'border-safe/50 bg-safe/5' :
                      isWorst ? 'border-destructive bg-destructive/10' :
                      isSelected ? 'border-primary bg-primary/5' :
                      'border-border card-edge-lit bg-card hover:border-gold/30'
                    }`}
                  >
                    <span className={`mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${
                      selectedCorrect ? 'bg-safe text-white' :
                      selectedWrong ? 'bg-destructive text-white' :
                      revealCorrect ? 'bg-safe/20 text-safe' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {selectedCorrect ? '✓' : selectedWrong ? '✗' : opt.label}
                    </span>
                    <span className="font-semibold text-card-foreground">{opt.text}</span>
                    {selectedCorrect && (
                      <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-safe/20 px-2 py-0.5 text-xs font-bold text-safe">
                        ✅ Correct!
                      </span>
                    )}
                    {selectedWrong && (
                      <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-destructive/20 px-2 py-0.5 text-xs font-bold text-destructive">
                        {isWorst ? '⚠️ Worst choice' : '❌ Not quite'}
                      </span>
                    )}
                  </motion.button>
                );
              })}
              {/* Critical thinking option */}
              {(() => {
                const isSelected = selectedOption === NONE_LABEL;
                return (
                  <>
                    <motion.button
                      onClick={() => {
                        handleSelectOption(NONE_LABEL);
                        // Scroll the textarea into view on the next frame
                        setTimeout(() => {
                          document.getElementById('wow-me-textarea')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 80);
                      }}
                      disabled={showGuidance}
                      animate={isSelected && !customAnswerSubmitted ? { scale: [1, 1.04, 1] } : {}}
                      transition={{ duration: 0.5, repeat: isSelected && !customAnswerSubmitted ? Infinity : 0, repeatDelay: 0.8 }}
                      className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                        showGuidance && isSelected && customAnswerSubmitted ? 'border-primary bg-primary/10 ring-2 ring-primary/30' :
                        showGuidance && isSelected ? 'border-caution bg-caution/5' :
                        isSelected ? 'border-primary bg-primary/10 ring-2 ring-primary/30 shadow-lg' :
                        'border-border card-edge-lit bg-card hover:border-gold/30'
                      }`}
                    >
                      <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-bold text-primary-foreground">
                        ✨
                      </span>
                      <span className="font-semibold text-card-foreground">
                        {isSelected && !customAnswerSubmitted
                          ? "Your turn — tell us your idea below ↓"
                          : "None of the above — I'm going to wow you with my answer!"}
                      </span>
                      {showGuidance && isSelected && customAnswerSubmitted && (
                        <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-primary/20 px-2 py-0.5 text-xs font-bold text-primary">
                          ✨ +1 Bonus
                        </span>
                      )}
                    </motion.button>
                    {/* Custom answer input */}
                    {isSelected && !showGuidance && (
                      <motion.div
                        id="wow-me-textarea"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="rounded-xl border-2 border-primary/40 bg-primary/5 p-4 space-y-3 shadow-sm"
                      >
                        <div>
                          <p className="text-sm font-black text-primary">✨ Wow us with your answer!</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">What would YOU do? Type or speak it — there's no wrong answer.</p>
                        </div>
                        <div className="relative">
                          <textarea
                            autoFocus
                            value={customAnswer}
                            onChange={e => setCustomAnswer(e.target.value.slice(0, 500))}
                            maxLength={500}
                            placeholder={speechSupported ? "Type your idea, or tap 🎤 to speak it…" : "Type your idea here…"}
                            className="w-full rounded-lg border border-border bg-background p-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 min-h-[80px] resize-none"
                          />
                          {speechSupported && !customAnswerSubmitted && (
                            <button
                              type="button"
                              onClick={toggleSpeechToText}
                              aria-label={isListening ? 'Stop recording your answer' : 'Speak your answer with the microphone'}
                              aria-pressed={isListening}
                              className={`absolute right-2 top-2 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                                isListening
                                  ? 'bg-destructive text-destructive-foreground animate-pulse'
                                  : 'bg-primary/10 text-primary hover:bg-primary/20'
                              }`}
                            >
                              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                            </button>
                          )}
                        </div>
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
                            <motion.span
                              initial={{ scale: 0.6, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: 'spring', bounce: 0.55 }}
                              className="text-sm font-bold text-safe"
                            >
                              ✨ Nice thinking — answer locked in!
                            </motion.span>
                          )}
                        </div>
                        {customAnswerSubmitted && (
                          <motion.p
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="rounded-lg bg-primary/10 px-3 py-2 text-xs font-medium text-primary"
                          >
                            👇 Now tap <span className="font-black">Reveal Guidance</span> to compare your idea.
                          </motion.p>
                        )}
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
                  {/* Demerit warning — references the actual choice + scenario */}
                  {activeMode === 'quiz' && selectedOption && card.worst_option === selectedOption && (() => {
                    const chosen = card.options.find(o => o.label === selectedOption);
                    return (
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="rounded-2xl border-2 border-destructive bg-destructive/10 p-5"
                      >
                        <p className="mb-1 text-sm font-bold text-destructive">⚠️ Demerit Point (-1) — here's why</p>
                        {chosen && (
                          <p className="mb-2 text-xs italic text-muted-foreground">You chose: "{chosen.text}"</p>
                        )}
                        <p className="text-sm text-card-foreground">
                          In this sitch, that's the riskiest move.{card.why_text ? ` ${card.why_text}` : ''}
                        </p>
                      </motion.div>
                    );
                  })()}
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
                  <div className="rounded-2xl border border-safe/30 bg-safe/5 p-5 space-y-3">
                    <p className="text-sm font-bold text-safe">✅ Best Next Step</p>
                    <p className="text-sm text-card-foreground">{card.guidance_text}</p>
                    <p className="text-sm text-card-foreground opacity-80">💡 {card.why_text}</p>
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
                </motion.div>
              )}
            </AnimatePresence>

            {/* Spacer so sticky bar never covers content */}
            <div className="h-24" aria-hidden />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Sticky bottom action bar — always reachable */}
      <div
        className="sticky bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="mx-auto flex max-w-2xl items-center gap-2 px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDiscussed}
            aria-label={discussed.has(card.id) ? 'Discussed' : 'Mark as discussed'}
            className={`h-11 w-11 ${discussed.has(card.id) ? 'text-safe' : 'text-muted-foreground'}`}
          >
            <CheckCircle2 className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFlagged}
            aria-label={flagged.has(card.id) ? 'Flagged' : 'Flag for review'}
            className={`h-11 w-11 ${flagged.has(card.id) ? 'text-destructive' : 'text-muted-foreground'}`}
          >
            <Flag className="h-5 w-5" />
          </Button>
          <div className="flex-1 text-center">
            {!selectedOption && (
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Pick an answer ↑
              </span>
            )}
          </div>
          <Button
            onClick={handleNext}
            size="lg"
            disabled={!selectedOption || (selectedOption === NONE_LABEL && !customAnswerSubmitted)}
            className="gap-1.5 font-bold px-6 min-h-[48px] disabled:opacity-50"
            aria-label={index + 1 >= sessionCards.length ? 'Finish session' : 'Go to next card'}
          >
            {index + 1 >= sessionCards.length ? '🎉 Finish' : 'Next Card'} <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="text-center py-2">

        <Link to="/legal" className="text-[10px] text-muted-foreground/50 hover:text-muted-foreground transition-colors">
          Terms & Privacy
        </Link>
      </div>
    </div>
  );
};

export default PlaySession;
