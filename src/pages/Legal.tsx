import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';

const Legal = () => (
  <main className="min-h-screen bg-background text-foreground p-6 max-w-2xl mx-auto">
    <SEO
      title="Legal — Terms, IP & Privacy | Sitch"
      description="Sitch terms of use, intellectual property rights, privacy, refunds, and cookie/local-storage policy for our family card game."
      path="/legal"
    />
    <Button variant="ghost" size="sm" asChild className="mb-6" aria-label="Back to home">
      <Link to="/" aria-label="Back to home"><ArrowLeft className="h-4 w-4 mr-1" aria-hidden="true" /> Back</Link>
    </Button>

    <h1 className="text-2xl font-bold mb-2">Terms of Use, Privacy & Policies</h1>
    <p className="text-sm text-muted-foreground mb-2 italic">Sitch — Family Edition</p>
    <p className="text-xs text-muted-foreground mb-10">Last updated: September 12, 2026</p>

    {/* ------------------- ABOUT / DISCLAIMER ------------------- */}
    <section className="space-y-4 text-sm text-muted-foreground mb-10">
      <h2 className="text-lg font-semibold text-foreground">About Sitch — a family game, played together</h2>
      <p>Sitch is a <strong>fun family card game</strong> designed to help families hone their instincts and learn together through conversation. It is <strong>not</strong> a therapy tool, a counselling service, a safeguarding programme, or a substitute for professional, legal, medical, or psychological advice.</p>
      <p>Some decks touch on real-world topics like body boundaries, online strangers, peer pressure, bullying, and emergencies. We recommend that a parent, guardian, or trusted adult plays alongside younger children (especially in the 4–6 and 7–9 age bands). If a scenario surfaces a real concern in your family, please speak to a qualified professional or, in an emergency, contact your local emergency services.</p>
      <p className="italic">Designed for fun — play with care.</p>
    </section>

    {/* ------------------- IP ------------------- */}
    <section className="space-y-4 text-sm text-muted-foreground mb-10">
      <h2 className="text-lg font-semibold text-foreground">Intellectual Property Rights</h2>
      <p>The Sitch game, including but not limited to its concept, gameplay structure, scenarios, prompts, questions, dialogue, design, graphics, user interface, characters, and all related content, are proprietary intellectual property and are protected under United States and international copyright, trademark, and intellectual property laws.</p>
      <p>All rights, title, and interest in and to the game and its content remain exclusively with the creator and rights holder. No ownership rights are transferred to users through use of the game.</p>
      <p>Users are granted a limited, non-exclusive, non-transferable, revocable license to access and play the game solely for personal, non-commercial entertainment or educational purposes.</p>
      <p className="font-medium text-foreground">Users may not:</p>
      <ul className="list-disc list-inside space-y-1 pl-2">
        <li>copy, reproduce, republish, or distribute any part of the game</li>
        <li>modify, translate, or create derivative works based on the game</li>
        <li>reverse engineer, decompile, or attempt to extract the game's content or mechanics</li>
        <li>commercially exploit the game's concept, prompts, or gameplay format</li>
        <li>publish or reproduce the game's prompts or scenarios in other products or services</li>
      </ul>
      <p>Unauthorized use may result in termination of access and legal action, including claims for damages and injunctive relief.</p>
    </section>

    {/* ------------------- USER CONDUCT ------------------- */}
    <section className="space-y-4 text-sm text-muted-foreground mb-10">
      <h2 className="text-lg font-semibold text-foreground">User Conduct & Age of Purchase</h2>
      <p>You must be at least 18 years old to purchase a Sitch license. Children may play the game under the supervision of a parent, guardian, or trusted adult.</p>
      <p>Users agree to use the game responsibly and for lawful purposes only. Any misuse, including attempts to interfere with the app's operation, share or resell license keys, access restricted systems, or exploit vulnerabilities, may result in suspension or termination of access.</p>
    </section>

    {/* ------------------- LIABILITY ------------------- */}
    <section className="space-y-4 text-sm text-muted-foreground mb-10">
      <h2 className="text-lg font-semibold text-foreground">Limitation of Liability</h2>
      <p>The game is provided "as is" without warranties of any kind, either express or implied. The creator and associated parties shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from the use or inability to use the app.</p>
      <p>Gameplay scenarios are designed for family fun, conversation, and instinct-building only. They are not professional advice of any kind.</p>
    </section>

    {/* ------------------- REFUNDS ------------------- */}
    <section className="space-y-4 text-sm text-muted-foreground mb-10">
      <h2 className="text-lg font-semibold text-foreground">Refund Policy</h2>
      <p>Sitch is a digital product delivered instantly via a Gumroad license key. Because access is granted immediately on purchase, <strong>all sales are final and non-refundable</strong>.</p>
      <p>If your license key isn't working, please email <a href="mailto:admin@kdcandfilms.com" className="text-foreground underline underline-offset-2 hover:text-primary">admin@kdcandfilms.com</a> and we'll help you get up and running.</p>
    </section>

    {/* ------------------- PRIVACY ------------------- */}
    <section className="space-y-4 text-sm text-muted-foreground mb-10">
      <h2 className="text-lg font-semibold text-foreground">Privacy Policy</h2>
      <p>Sitch respects your privacy. The game runs without user accounts, logins, or public profiles.</p>
      <p className="font-medium text-foreground">What we store on your device (in your browser only):</p>
      <ul className="list-disc list-inside space-y-1 pl-2">
        <li>Your license key and optional local player nicknames</li>
        <li>Your gameplay progress, XP, and Safety Scout level</li>
        <li>Earned stickers and milestones</li>
        <li>Session settings (age band, mode, chosen decks)</li>
        <li>Any free-text "custom answers" you type in during play</li>
      </ul>
      <p>Gameplay progress, nicknames and custom answers stay on your device. Your license key is sent to our verification service and Gumroad to check purchase validity when the game opens.</p>
      <p className="font-medium text-foreground">What we store on our servers:</p>
      <ul className="list-disc list-inside space-y-1 pl-2">
        <li>A hash of your license key, with verification and expiry timestamps.</li>
        <li>IP addresses and request timestamps used to limit repeated verification attempts.</li>
      </ul>
      <p>We use Supabase as our backend provider to verify license keys, and Gumroad as our seller of record for purchases. Gumroad handles your purchase and payment information under its own privacy policy — we never see your card details.</p>
      <p>We do not use tracking cookies, advertising cookies, or third-party analytics. We do not sell or rent personal information to anyone.</p>
      <p>To request deletion of your license record, email <a href="mailto:admin@kdcandfilms.com" className="text-foreground underline underline-offset-2 hover:text-primary">admin@kdcandfilms.com</a>.</p>
    </section>

    {/* ------------------- CHILDREN / COPPA ------------------- */}
    <section className="space-y-4 text-sm text-muted-foreground mb-10">
      <h2 className="text-lg font-semibold text-foreground">Children's Privacy (COPPA)</h2>
      <p>Sitch is designed to be played by children with a parent, guardian, or trusted adult. We do <strong>not</strong> knowingly collect personal information from children under 13.</p>
      <p>Players may choose a nickname for a local profile; please use a nickname rather than a full name. The game does not require a child’s email, address, phone number or photo. Profile nicknames and gameplay progress stay on the device.</p>
      <p>If you are a parent or guardian and believe a child has provided personal information to us, please contact <a href="mailto:admin@kdcandfilms.com" className="text-foreground underline underline-offset-2 hover:text-primary">admin@kdcandfilms.com</a> and we will delete it promptly.</p>
    </section>

    {/* ------------------- COOKIES / LOCAL STORAGE ------------------- */}
    <section className="space-y-4 text-sm text-muted-foreground mb-10">
      <h2 className="text-lg font-semibold text-foreground">Cookies & Local Storage</h2>
      <p>Sitch does not use tracking cookies, advertising cookies, or third-party analytics.</p>
      <p>The app uses your browser's <strong>local storage</strong> to save your license key and gameplay progress so the game works between visits. You can clear this at any time in your browser settings — please note this will reset your progress.</p>
    </section>

    {/* ------------------- CHANGES ------------------- */}
    <section className="space-y-4 text-sm text-muted-foreground mb-10">
      <h2 className="text-lg font-semibold text-foreground">Changes to These Terms</h2>
      <p>These terms may be updated periodically to reflect legal or operational changes. Continued use of the app after updates constitutes acceptance of the revised terms. The "Last updated" date at the top of this page will always reflect the latest version.</p>
    </section>

    {/* ------------------- CONTACT ------------------- */}
    <section className="space-y-4 text-sm text-muted-foreground mb-10">
      <h2 className="text-lg font-semibold text-foreground">Contact</h2>
      <p>For support, license-key problems, refund enquiries, privacy requests, or copyright concerns, please contact <a href="mailto:admin@kdcandfilms.com" className="text-foreground underline underline-offset-2 hover:text-primary">admin@kdcandfilms.com</a>.</p>
    </section>

    <footer className="border-t border-border pt-6 pb-10 text-center text-xs text-muted-foreground space-y-1">
      <p className="font-semibold text-foreground">© 2026 Sitch™. All rights reserved.</p>
      <p>Unauthorized reproduction or distribution prohibited.</p>
    </footer>
  </main>
);

export default Legal;
