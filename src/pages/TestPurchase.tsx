import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, ExternalLink, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

const GUMROAD_URL = 'https://sitchthegame.gumroad.com/l/sitch';

interface CheckItem {
  id: string;
  title: string;
  description: string;
}

const CHECKS: CheckItem[] = [
  {
    id: 'preview',
    title: '1. Preview (inside Lovable)',
    description:
      "Click the button below. Gumroad blocks being shown inside the preview iframe, so it must open in a NEW TAB at sitchthegame.gumroad.com/l/sitch (not 'refused to connect').",
  },
  {
    id: 'newtab',
    title: '2. New Tab (force window.open)',
    description:
      'Open the link explicitly in a new tab. The Gumroad checkout page should load fully and show the $9.99 price.',
  },
  {
    id: 'live',
    title: '3. Live Domain (sitchthegame.com)',
    description:
      'Visit https://sitchthegame.com, enter the Unlock screen, and tap "Buy Sitch on Gumroad". The link should open Gumroad in a new tab without errors.',
  },
];

const TestPurchase = () => {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (id: string) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const openGumroad = () => {
    window.open(GUMROAD_URL, '_blank', 'noopener,noreferrer');
    try {
      window.top!.location.href = GUMROAD_URL;
    } catch {
      /* cross-origin top — ignore */
    }
  };

  const allDone = CHECKS.every((c) => checked[c.id]);

  return (
    <div
      className="min-h-screen p-4 sm:p-8"
      style={{
        background:
          'radial-gradient(ellipse at top, #FDB913 0%, #F7941D 60%, #FEF3D0 100%)',
      }}
    >
      <div className="mx-auto w-full max-w-2xl">
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-[#1E3A5F] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6 sm:p-8"
          style={{
            background: 'linear-gradient(180deg, #FFF8E7 0%, #FEF3D0 100%)',
            border: '2px solid #1E3A5F',
            boxShadow: '0 8px 32px hsl(215 50% 20% / 0.18)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full"
              style={{
                background: 'linear-gradient(135deg, #1E3A5F, #2D5F8A)',
                boxShadow: '0 4px 12px hsl(215 50% 20% / 0.3)',
              }}
            >
              <ShoppingBag className="h-6 w-6 text-[#FEF3D0]" />
            </div>
            <div>
              <h1
                className="text-2xl font-black"
                style={{
                  background:
                    'linear-gradient(135deg, #1E3A5F, #2D5F8A, #1E3A5F)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Purchase Link Test
              </h1>
              <p className="text-sm font-semibold text-[#2D5F8A]">
                Verify the Gumroad checkout works in all three contexts.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {CHECKS.map((c) => (
              <div
                key={c.id}
                className="flex items-start gap-3 rounded-xl p-4"
                style={{
                  background: 'white',
                  border: '2px solid hsl(215 50% 30% / 0.2)',
                  boxShadow: '0 2px 8px hsl(215 30% 20% / 0.08)',
                }}
              >
                <Checkbox
                  id={c.id}
                  checked={!!checked[c.id]}
                  onCheckedChange={() => toggle(c.id)}
                  className="mt-1 h-5 w-5"
                  aria-label={`Mark ${c.title} as verified`}
                />
                <div className="flex-1">
                  <label
                    htmlFor={c.id}
                    className="block cursor-pointer font-bold text-[#1E3A5F]"
                  >
                    {c.title}
                  </label>
                  <p className="mt-1 text-sm text-[#2D5F8A]">{c.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={openGumroad}
              className="flex-1 gap-2 rounded-xl py-6 font-bold uppercase tracking-wide hover:scale-[1.02] transition-transform"
              style={{
                background: 'linear-gradient(135deg, #1E3A5F, #2D5F8A)',
                color: '#FEF3D0',
                boxShadow: '0 4px 16px hsl(215 50% 20% / 0.3)',
              }}
              aria-label="Open Gumroad checkout in a new tab"
            >
              <ExternalLink className="h-4 w-4" />
              Open Gumroad in New Tab
            </Button>
            <a
              href="https://sitchthegame.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#1E3A5F] bg-white py-4 px-4 font-bold uppercase tracking-wide text-[#1E3A5F] hover:scale-[1.02] transition-transform"
              aria-label="Open the live site in a new tab"
            >
              <ExternalLink className="h-4 w-4" />
              Open Live Site
            </a>
          </div>

          {allDone && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 flex items-center gap-2 rounded-xl p-4"
              style={{
                background: 'linear-gradient(135deg, #FDB913, #F7941D)',
                color: '#1E3A5F',
                border: '2px solid #1E3A5F',
              }}
            >
              <Check className="h-5 w-5" />
              <span className="font-black uppercase tracking-wide">
                All three checks confirmed — purchase flow is working!
              </span>
            </motion.div>
          )}

          <p className="mt-6 text-xs font-semibold text-[#2D5F8A]">
            Target URL:{' '}
            <code
              className="rounded px-2 py-0.5 font-mono"
              style={{
                background: 'hsl(215 50% 30% / 0.1)',
                color: '#1E3A5F',
              }}
            >
              {GUMROAD_URL}
            </code>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default TestPurchase;
