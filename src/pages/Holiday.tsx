import { Gift, ShoppingBag } from 'lucide-react';
import SEO from '@/components/SEO';

/** Checkout for both Buy and Gift. Do not change these UTM tags. */
export const HOLIDAY_CHECKOUT_URL =
  'https://sitchthegame.com?utm_source=sitch-holiday-page&utm_medium=landing&utm_campaign=sitch-holiday';

const OPEN_SECRET_URL = 'https://opensecretthefilm.com';

/** Kerry's table-card set, minus Sleepover (her Nov 18 edit). Still pending her yes, shown as draft only. */
const TABLE_CARD_QUESTIONS = [
  'School: A classmate shows you a group chat making fun of another kid and asks you to add a laughing emoji. What do you do?',
  "Online: Someone you met in a game says they're your age and asks you to move to a private app and send a photo. What's your move?",
  "Stranger danger: A grown-up you don't know says Mom sent them to pick you up, and they know your name. What do you do? (Pick a family code word.)",
  'Secrets: An adult you know asks you to keep something "just between us" and not tell your parents. Is that a safe secret or an unsafe one?',
] as const;

const TOPICS = [
  'Peer pressure',
  'Online safety',
  'Body autonomy',
  'Social Media',
  'Predators',
  'Bullying',
  'Getting lost',
  'Gut instincts',
  'Common sense...or is it?',
] as const;

const OpenSecretLink = () => (
  <a
    href={OPEN_SECRET_URL}
    target="_blank"
    rel="noopener noreferrer"
    className="font-bold underline underline-offset-2 hover:text-[#1E3A5F]"
  >
    Open Secret
  </a>
);

const Holiday = () => (
  <div
    className="min-h-screen text-[#1E3A5F]"
    style={{ background: 'linear-gradient(180deg, #8B1A0E 0%, #B8261A 16%, #E87A4A 28%, #FEF3D0 42%, #FFF8E7 100%)' }}
  >
    <SEO
      title="Would your kids make safe choices when you're not around? | Sitch, Family Edition"
      description="Play Sitch, the fun family game that turns real-life possible situations into valuable conversations."
      path="/holiday"
      noindex
    />

    <header className="px-4 pt-8 pb-16 text-center">
      <p
        className="text-xs font-black uppercase tracking-[0.18em] text-[#F2B80C]"
        style={{ textShadow: '0 2px 8px hsl(10 70% 12% / 0.55)' }}
      >
        Holiday family game night
      </p>
    </header>

    <main className="relative mx-auto max-w-xl px-4 pb-16">
      <section className="-mt-8 rounded-3xl bg-[#FFF8E7] px-5 py-8 shadow-lg sm:px-8" style={{ border: '1.5px solid #FDB913' }}>
        <h1 className="text-3xl font-black leading-tight tracking-tight text-[#1E3A5F] sm:text-4xl">
          Would your kids make safe choices when you&apos;re not around?
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[#1E3A5F]/90 sm:text-lg">
          Play Sitch, the fun family game that turns real-life possible situations into valuable conversations.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-white px-4 py-4" style={{ border: '1px solid hsl(215 50% 30% / 0.12)' }}>
            <p className="text-xs font-black tracking-wider text-[#B8261A]">Before Sitch:</p>
            <p className="mt-2 text-sm leading-relaxed text-[#1E3A5F]/90">
              No idea how your child will respond to situations when you aren&apos;t there, or how to bring them up to discuss.
            </p>
          </div>
          <div className="rounded-2xl bg-white px-4 py-4" style={{ border: '1px solid hsl(215 50% 30% / 0.12)' }}>
            <p className="text-xs font-black tracking-wider text-[#1E3A5F]">After Sitch:</p>
            <p className="mt-2 text-sm leading-relaxed text-[#1E3A5F]/90">
              Understand exactly how your child processes real-life situations, and now you have a language and forum to discuss all of them, without fear of embarrassment.
            </p>
          </div>
        </div>

        <h2 className="mt-8 text-2xl font-black tracking-tight text-[#1E3A5F]">Not Lecturing. Playing!</h2>
        <p className="mt-3 text-base leading-relaxed text-[#1E3A5F]/90">
          Discover what your kids would choose and why, then explore safer choices together, without the real-life risk.
        </p>
        <p className="mt-4 text-base leading-relaxed text-[#1E3A5F]/90">
          Sitch was created by a filmmaker with 25 years in the film industry, who discovered on her current feature documentary, <OpenSecretLink />, that many parents want to have conversations around uncomfortable subjects with their kids, but don&apos;t know how. Sitch was her solution. A way to have these vital talks, but in a non-threatening arena.
        </p>
        <p className="mt-4 text-base leading-relaxed text-[#1E3A5F]/90">
          Four age groups (ages 4 to 6, 7 to 9, 10+, and teens). Choose your topics or hit &apos;random.&apos; Up the pressure? Set a timer! Play it at home, in the car, on vacation, or on that field trip you&apos;re already dreading. Any number of players. No setup. No pieces. Just a screen, a host of challenging situations and your best judgment. Multiple ways to play, all devised to open up the conversations and explore possibilities together:
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {TOPICS.map((topic) => (
            <li
              key={topic}
              className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#1E3A5F]"
              style={{ border: '1px solid hsl(215 50% 30% / 0.16)' }}
            >
              {topic}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <div
          className="relative rounded-2xl bg-white px-5 py-6 sm:px-6"
          style={{
            border: '2px dashed #FDB913',
            boxShadow: '0 8px 24px hsl(15 40% 20% / 0.08)',
          }}
        >
          <span className="absolute right-4 top-4 rounded-full bg-[#F2B80C] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#142851]">
            Draft
          </span>
          <p className="pr-16 text-sm font-black uppercase tracking-wider text-[#B8261A]">Holiday table card</p>
          <p className="mt-1 text-xs font-bold text-[#2D5F8A]">Placeholder questions, pending approval. Not a downloadable card yet.</p>
          <ol className="mt-4 space-y-3">
            {TABLE_CARD_QUESTIONS.map((question, index) => (
              <li key={question} className="flex gap-3 text-sm leading-relaxed text-[#1E3A5F] sm:text-base">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1E3A5F] text-xs font-black text-[#FEF3D0]">
                  {index + 1}
                </span>
                <span>{question}</span>
              </li>
            ))}
          </ol>
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="mt-6 flex w-full cursor-not-allowed items-center justify-center rounded-xl border-2 border-[#1E3A5F]/25 bg-[#FEF3D0]/60 py-3 px-4 text-sm font-bold uppercase tracking-wide text-[#1E3A5F]/50"
          >
            Download table card, coming soon
          </button>
        </div>
      </section>

      <section className="mt-10 rounded-3xl bg-white px-5 py-7 sm:px-7" style={{ border: '1px solid hsl(215 50% 30% / 0.12)', boxShadow: '0 4px 24px hsl(215 30% 20% / 0.08)' }}>
        <h2 className="text-xl font-black text-[#1E3A5F]">$6.99, one time</h2>
        <p className="mt-2 text-base leading-relaxed text-[#1E3A5F]/90">
          $6.99, one time. It arrives in your inbox, no shipping. Gift it, or play the same night at play.sitchthegame.com with your license key.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href={HOLIDAY_CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl px-6 py-4 text-center text-sm font-black uppercase tracking-wide text-[#FEF3D0] transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FDB913] focus-visible:ring-offset-2"
            style={{
              background: 'linear-gradient(180deg, #E63329 0%, #B81E16 100%)',
              boxShadow: '0 4px 0 #7A1108, 0 8px 16px hsl(15 70% 20% / 0.25)',
              border: '1.5px solid #FDB913',
            }}
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            Get Sitch, $6.99
          </a>
          <a
            href={HOLIDAY_CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl border-2 border-[#1E3A5F] bg-white px-6 py-4 text-center text-sm font-black uppercase tracking-wide text-[#1E3A5F] transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A5F] focus-visible:ring-offset-2"
          >
            <Gift className="h-4 w-4" aria-hidden="true" />
            Gift Sitch
          </a>
        </div>
      </section>

      <section className="mt-8 space-y-3 text-sm leading-relaxed text-[#1E3A5F]/80">
        <p>Sitch is a game, not a replacement for therapy or a medically endorsed product.</p>
        <p>20% of net proceeds are donated to completing <em><OpenSecretLink /></em>.</p>
      </section>

      <footer className="mt-10 border-t border-[#1E3A5F]/15 pt-6 text-center text-xs text-[#2D5F8A]">
        <p>
          Already have a license key?{' '}
          <a href="/" className="font-bold underline underline-offset-2 hover:text-[#1E3A5F]">
            Play at play.sitchthegame.com
          </a>
        </p>
        <p className="mt-2">
          <a href="/legal" className="underline underline-offset-2 hover:text-[#1E3A5F]">
            Terms &amp; Privacy
          </a>
          {' · '}
          <a href="mailto:admin@kdcandfilms.com" className="underline underline-offset-2 hover:text-[#1E3A5F]">
            admin@kdcandfilms.com
          </a>
        </p>
      </footer>
    </main>
  </div>
);

export default Holiday;
