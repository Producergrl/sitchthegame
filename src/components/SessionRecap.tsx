import { Button } from '@/components/ui/button';
import { Printer, Mail } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export interface RecapEntry {
  title: string;
  scenario: string;
  deckName: string;
  chosen: string;
  outcome: 'safe' | 'risky' | 'own-idea' | 'skipped';
  practicePhrase?: string;
  prompts: string[];
}

interface Props {
  playerName: string;
  ageBand: string;
  mode: string;
  entries: RecapEntry[];
}

const outcomeLabel: Record<RecapEntry['outcome'], string> = {
  safe: 'Safe choice',
  risky: 'Risky choice, worth revisiting',
  'own-idea': 'Own idea (Wow-Me answer)',
  skipped: 'Skipped',
};

function buildPlainText(p: Props): string {
  const lines: string[] = [];
  lines.push(`Sitch session recap for ${p.playerName}`);
  lines.push(`${new Date().toLocaleString()} | Ages ${p.ageBand} | ${p.mode} mode`);
  lines.push('');
  p.entries.forEach((e, i) => {
    lines.push(`${i + 1}. ${e.title} (${e.deckName})`);
    lines.push(`   Scenario: ${e.scenario}`);
    lines.push(`   Their answer: ${e.chosen}`);
    lines.push(`   Result: ${outcomeLabel[e.outcome]}`);
    if (e.practicePhrase) lines.push(`   Practice phrase: "${e.practicePhrase}"`);
    if (e.prompts.length) lines.push(`   Keep talking: ${e.prompts.join(' / ')}`);
    lines.push('');
  });
  lines.push('Sitch is a family conversation game. It is not therapy or professional advice.');
  return lines.join('\n');
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const SessionRecap = (props: Props) => {
  const { playerName, ageBand, mode, entries } = props;

  const handlePrint = () => {
    const rows = entries
      .map(
        (e, i) => `
      <div class="card">
        <h3>${i + 1}. ${escapeHtml(e.title)} <span class="deck">${escapeHtml(e.deckName)}</span></h3>
        <p class="scenario">${escapeHtml(e.scenario)}</p>
        <p><strong>Their answer:</strong> ${escapeHtml(e.chosen)}</p>
        <p><strong>Result:</strong> ${escapeHtml(outcomeLabel[e.outcome])}</p>
        ${e.practicePhrase ? `<p><strong>Practice phrase:</strong> &ldquo;${escapeHtml(e.practicePhrase)}&rdquo;</p>` : ''}
        ${e.prompts.length ? `<p><strong>Keep talking:</strong></p><ul>${e.prompts.map(q => `<li>${escapeHtml(q)}</li>`).join('')}</ul>` : ''}
      </div>`,
      )
      .join('');

    const html = `<!doctype html><html><head><meta charset="utf-8" />
      <title>Sitch session recap for ${escapeHtml(playerName)}</title>
      <style>
        body { font-family: Arial, Helvetica, sans-serif; color: #142851; margin: 32px; }
        h1 { color: #C8311B; margin-bottom: 4px; font-size: 24px; }
        .meta { color: #1F4593; font-size: 13px; margin-bottom: 20px; }
        .card { border: 2px solid #F2B80C; border-radius: 12px; padding: 14px 16px; margin-bottom: 14px; page-break-inside: avoid; }
        h3 { margin: 0 0 6px; font-size: 15px; color: #F86D10; }
        .deck { font-size: 11px; color: #1F4593; font-weight: normal; }
        .scenario { font-style: italic; color: #444; font-size: 13px; }
        p { font-size: 13px; margin: 4px 0; }
        ul { margin: 4px 0 0 18px; font-size: 13px; }
        footer { margin-top: 24px; font-size: 11px; color: #666; }
      </style></head><body>
      <h1>Sitch session recap</h1>
      <div class="meta">${escapeHtml(playerName)} &middot; ${new Date().toLocaleString()} &middot; Ages ${escapeHtml(ageBand)} &middot; ${escapeHtml(mode)} mode &middot; ${entries.length} missions</div>
      ${rows}
      <footer>&copy; 2026 Sitch&trade;. A fun family card game to hone your instincts and learn together. Not therapy or professional advice.</footer>
      </body></html>`;

    const win = window.open('', '_blank');
    if (!win) {
      toast({ title: 'Popup blocked', description: 'Allow popups for this site to print the recap.' });
      return;
    }
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 300);
  };

  const handleEmail = () => {
    const subject = `Sitch session recap for ${playerName}`;
    const body = buildPlainText(props);
    const href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.slice(0, 1800))}`;
    window.location.href = href;
  };

  if (entries.length === 0) return null;

  return (
    <div className="rounded-2xl border-2 border-primary/30 bg-card p-5 space-y-3 text-left">
      <div>
        <p className="text-sm font-black text-primary">🧾 Parent recap</p>
        <p className="mt-1 text-xs text-muted-foreground">
          A summary of what {playerName} chose and the prompts to keep the conversation going.
        </p>
      </div>
      <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
        {entries.map((e, i) => (
          <div key={`${e.title}-${i}`} className="rounded-xl border bg-background/60 p-3">
            <p className="text-xs font-bold text-card-foreground">{i + 1}. {e.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">Answer: {e.chosen}</p>
            <p className="text-xs font-semibold text-primary">{outcomeLabel[e.outcome]}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button variant="outline" className="flex-1 gap-2 font-bold" onClick={handlePrint}>
          <Printer className="h-4 w-4" /> Print recap
        </Button>
        <Button variant="outline" className="flex-1 gap-2 font-bold" onClick={handleEmail}>
          <Mail className="h-4 w-4" /> Email recap
        </Button>
      </div>
    </div>
  );
};

export default SessionRecap;
