import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { decks, getCardsByDeck } from '@/data/seedData';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import SEO from '@/components/SEO';

const BrowseDecks = () => {
  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Sitch Mission Packs',
    description: 'All Sitch card decks grouped by age band and topic.',
    url: 'https://sitchthegame.com/decks',
    hasPart: decks.map((d) => ({
      '@type': 'CreativeWork',
      name: d.name,
      description: d.description,
      url: `https://sitchthegame.com/decks/${d.slug}`,
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Browse Mission Packs — Sitch Family Edition"
        description="Browse every Sitch deck: age-banded mission packs covering online safety, body autonomy, peer pressure, and emergency scenarios."
        path="/decks"
        jsonLd={collectionJsonLd}
      />
      <div className="hero-gradient px-4 py-6 text-primary-foreground">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" aria-label="Back to home">
              <Button variant="ghost" size="icon" aria-label="Back to home" className="text-primary-foreground hover:bg-white/10 active:animate-btn-press">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-black drop-shadow-sm">Browse Decks</h1>
          </div>
          <ThemeToggle className="text-primary-foreground hover:bg-white/10" />
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-4 py-8">
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
                  <div className="group relative cursor-pointer rounded-2xl card-elevated bg-card p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1.5 hover:scale-[1.02] active:animate-btn-press">
                    <div className="mb-3 text-4xl" aria-hidden="true">{deck.icon}</div>
                    <h2 className="text-lg font-bold text-card-foreground">{deck.name}</h2>
                    <p className="mt-1 text-sm text-foreground/80">{deck.description}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground/80">
                        Ages {deck.age_band}
                      </span>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        {cardCount} cards
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default BrowseDecks;
