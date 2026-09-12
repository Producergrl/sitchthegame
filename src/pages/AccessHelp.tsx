import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';

export default function AccessHelp() {
  return (
    <main className="mx-auto min-h-screen max-w-2xl space-y-6 bg-background p-6 text-foreground">
      <SEO title="Access & phone setup | Sitch" description="Return to Sitch, recover your license key and add the game to your home screen." path="/access-help" />
      <h1 className="text-2xl font-bold">Ready to play again?</h1>
      <Link className="inline-block rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground" to="/">Open Sitch</Link>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Already purchased?</h2>
        <p>Open play.sitchthegame.com and paste the license key from your Gumroad receipt. Your browser remembers it after you unlock. You do not need to purchase again on another device.</p>
        <a className="inline-block underline" href="https://gumroad.com/license-key-lookup" target="_blank" rel="noopener noreferrer">Recover my license key through Gumroad</a>
        <p>Use the email address you used at checkout. Check spam or junk if the receipt does not arrive.</p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Add Sitch to your home screen</h2>
        <p><strong>iPhone or iPad:</strong> Open play.sitchthegame.com in Safari. Tap Share, then Add to Home Screen (you may need to scroll). If shown, turn on Open as Web App, then tap Add.</p>
        <p><strong>Android:</strong> Open play.sitchthegame.com in Chrome. Open the three-dot menu and choose Add to home screen or Install app, then follow the instructions.</p>
        <p>If you opened Sitch inside an email or social app, open the link in Safari or Chrome first. You can also bookmark the game and play in your browser.</p>
        <p>An internet connection is needed to open and verify access. Keep your receipt handy: the home-screen version may ask for your key once more.</p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Your family’s devices and progress</h2>
        <p>Use your purchase key on your own family devices. Progress and player profiles stay in each browser; they do not sync between devices. Clearing browser data or using private browsing can remove saved progress and your remembered key.</p>
        <p>If verification is temporarily unavailable, check your connection and try Unlock again. You do not need to buy another copy.</p>
      </section>
      <p>Still stuck? <a className="underline" href="mailto:admin@kdcandfilms.com?subject=Sitch%20access%20help">Email Sitch support</a> with your purchase email, device, browser and the error message. Please do not send payment-card details.</p>
      <Link className="inline-block underline" to="/legal">Terms & Privacy</Link>
    </main>
  );
}
