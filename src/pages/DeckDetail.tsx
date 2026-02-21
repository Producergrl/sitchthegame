import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getDeckBySlug, getCardsByDeck } from '@/data/seedData';

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
      <div className="bg-primary px-4 py-6 text-primary-foreground">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <Link to="/decks">
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black">{deck.icon} {deck.name}</h1>
              {!deck.is_free && (
                <span className="flex items-center gap-1 rounded-full bg-primary-foreground/20 px-2.5 py-1 text-xs font-bold">
                  <Lock className="h-3 w-3" /> Full Access
                </span>
              )}
            </div>
            <p className="text-sm opacity-80">Ages {deck.age_band} • {deckCards.length} cards</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8">
        <p className="mb-6 text-muted-foreground">{deck.description}</p>

        {deck.is_free ? (
          <Link to={`/play?decks=${deck.slug}&mode=discussion&age=${deck.age_band}`}>
            <Button className="mb-8 w-full gap-2 text-lg font-bold" size="lg">
              <Play className="h-5 w-5" /> Play This Deck
            </Button>
          </Link>
        ) : (
          <div className="mb-8 rounded-2xl border-2 border-dashed border-caution/40 bg-caution/5 p-6 text-center">
            <Lock className="mx-auto mb-2 h-8 w-8 text-caution" />
            <p className="font-bold text-card-foreground">Full Access Required</p>
            <p className="mt-1 text-sm text-muted-foreground">This deck is part of the full collection. Coming soon!</p>
          </div>
        )}

        <h2 className="mb-4 text-lg font-bold">Cards in this Deck</h2>
        <div className="space-y-3">
          {deckCards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border bg-card p-4"
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
