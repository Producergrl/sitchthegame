import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { decks as seedDecks, cards as seedCards } from '@/data/seedData';

const AdminPage = () => {
  const [gateUnlocked, setGateUnlocked] = useState(false);
  const [gateAnswer, setGateAnswer] = useState('');

  if (!gateUnlocked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="mx-auto max-w-sm rounded-2xl border bg-card p-8 text-center shadow-sm">
          <div className="mb-4 text-4xl">🔒</div>
          <h2 className="text-xl font-black text-card-foreground">Adult Gate</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This section is for adults only. Please solve this to continue:
          </p>
          <p className="mt-4 text-lg font-bold text-foreground">What is 7 × 8?</p>
          <input
            type="text"
            value={gateAnswer}
            onChange={e => setGateAnswer(e.target.value)}
            className="mt-3 w-full rounded-xl border bg-background px-4 py-3 text-center text-lg font-bold text-foreground outline-none focus:ring-2 focus:ring-primary"
            placeholder="Your answer"
          />
          <Button
            onClick={() => { if (gateAnswer.trim() === '56') setGateUnlocked(true); }}
            className="mt-4 w-full font-bold"
          >
            Continue
          </Button>
          <Link to="/" className="mt-3 inline-block text-sm text-primary underline">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary px-4 py-6 text-primary-foreground">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          <Link to="/">
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-black">Manage Cards</h1>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Actions */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Button className="gap-2 font-bold" disabled>
            <Plus className="h-4 w-4" /> New Card
          </Button>
          <Button variant="outline" className="gap-2 font-bold" disabled>
            <Upload className="h-4 w-4" /> Import JSON
          </Button>
          <Button variant="outline" className="gap-2 font-bold" onClick={() => {
            const data = JSON.stringify({ decks: seedDecks, cards: seedCards }, null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = 'wwyd-cards-export.json'; a.click();
            URL.revokeObjectURL(url);
          }}>
            <Download className="h-4 w-4" /> Export JSON
          </Button>
        </div>

        <p className="mb-4 text-sm text-muted-foreground">
          Full CRUD and import features require backend integration. Export is available now.
        </p>

        {/* Deck list */}
        {seedDecks.map(deck => {
          const deckCards = seedCards.filter(c => c.deck_id === deck.id);
          return (
            <div key={deck.id} className="mb-6">
              <h2 className="mb-3 text-lg font-bold text-foreground">{deck.icon} {deck.name} ({deckCards.length})</h2>
              <div className="space-y-2">
                {deckCards.map(card => (
                  <div key={card.id} className="flex items-center gap-3 rounded-xl border bg-card p-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-card-foreground">{card.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{card.scenario}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${
                      card.status === 'published' ? 'bg-safe/10 text-safe' : 'bg-muted text-muted-foreground'
                    }`}>
                      {card.status}
                    </span>
                    <Button variant="ghost" size="icon" disabled className="shrink-0"><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" disabled className="shrink-0"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminPage;
