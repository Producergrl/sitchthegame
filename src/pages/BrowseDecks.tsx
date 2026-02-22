import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock } from 'lucide-react';
import { decks, getCardsByDeck } from '@/data/seedData';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';

const BrowseDecks = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="hero-gradient px-4 py-6 text-primary-foreground">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/10 active:animate-btn-press">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-black drop-shadow-sm">Browse Decks</h1>
          </div>
          <ThemeToggle className="text-primary-foreground hover:bg-white/10" />
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {decks.map((deck, i) => {
            const cardCount = getCardsByDeck(deck.id).length;
            return (
              <motion.div
                key={deck.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link to={`/decks/${deck.slug}`}>
                  <div className={`group relative cursor-pointer rounded-2xl card-elevated bg-card p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1.5 hover:scale-[1.02] active:animate-btn-press ${!deck.is_free ? 'opacity-75' : ''}`}>
                    {!deck.is_free && (
                      <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-gold/15 px-2.5 py-1 text-xs font-bold text-gold">
                        <Lock className="h-3 w-3" /> Full Access
                      </div>
                    )}
                    <div className="mb-3 text-4xl">{deck.icon}</div>
                    <h3 className="text-lg font-bold text-card-foreground">{deck.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{deck.description}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                        Ages {deck.age_band}
                      </span>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        {cardCount} cards
                      </span>
                      {deck.is_free && (
                        <span className="rounded-full bg-safe/15 px-3 py-1 text-xs font-bold text-safe">
                          Free
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BrowseDecks;
