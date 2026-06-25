import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Download, Upload, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { decks as seedDecks, cards as seedCards } from '@/data/seedData';
import AdultGate from '@/components/AdultGate';

const AdminContent = () => (
  <div className="min-h-screen bg-background">
    <div className="bg-primary px-4 py-6 text-primary-foreground">
      <div className="mx-auto flex max-w-4xl items-center gap-3">
        <Link to="/" aria-label="Back to home">
          <Button variant="ghost" size="icon" aria-label="Back to home" className="text-primary-foreground hover:bg-primary-foreground/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-black">Manage Cards</h1>
      </div>
    </div>

    <div className="mx-auto max-w-4xl px-4 py-8">
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

const AdminPage = () => (
  <AdultGate title="Adults Only" description="Card management and exports are for parents, guardians, and teachers.">
    <AdminContent />
  </AdultGate>
);

export default AdminPage;
