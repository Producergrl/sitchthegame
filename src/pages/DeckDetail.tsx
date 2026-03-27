import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getDeckBySlug, getCardsByDeck } from '@/data/seedData';
import ThemeToggle from '@/components/ThemeToggle';

const DeckDetail = () => {
  const { deckId } = useParams();
  const deck = deckId ? getDeckBySlug(deckId) : undefined;
  const deckCards = deck ? getCardsByDeck(deck.id) : [];

  if (!deck) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-bold">Deck not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="hero-gradient px-4 py-6 text-primary-foreground">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/decks">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/10 active:animate-btn-press">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-black">{deck.icon} {deck.name}</h1>
              <p className="text-sm opacity-80">Ages {deck.age_band} • {deckCards.length} cards</p>
            </div>
          </div>
          <ThemeToggle className="text-primary-foreground hover:bg-white/10" />
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8">
        <p className="mb-6 text-muted-foreground">{deck.description}</p>

        <Link to={`/play?decks=${deck.slug}&mode=discussion&age=${deck.age_band}`}>
          <Button className="mb-8 w-full gap-2 text-lg font-bold cta-glow bg-secondary text-secondary-foreground hover:bg-secondary/90 active:animate-btn-press transition-all duration-200 hover:scale-[1.02]" size="lg">
            <Play className="h-5 w-5" /> Play This Deck
          </Button>
        </Link>

        <h2 className="mb-4 text-lg font-bold">Cards in this Deck</h2>
        <div className="space-y-3">
          {deckCards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl card-elevated bg-card p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-card-foreground">{card.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{card.scenario}</p>
                </div>
                <span className="ml-2 shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                  Lvl {card.difficulty}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeckDetail;
