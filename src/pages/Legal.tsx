import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Legal = () => (
  <div className="min-h-screen bg-background text-foreground p-6 max-w-2xl mx-auto">
    <Button variant="ghost" size="sm" asChild className="mb-6">
      <Link to="/"><ArrowLeft className="h-4 w-4 mr-1" /> Back</Link>
    </Button>

    <h1 className="text-2xl font-bold mb-8">Terms of Use, Intellectual Property & Privacy Policy</h1>
    <p className="text-sm text-muted-foreground mb-10 italic">Sitch Game</p>

    <section className="space-y-4 text-sm text-muted-foreground mb-10">
      <h2 className="text-lg font-semibold text-foreground">Intellectual Property Rights</h2>
      <p>The What Would You Do? game, including but not limited to its concept, gameplay structure, scenarios, prompts, questions, dialogue, design, graphics, user interface, characters, and all related content, are proprietary intellectual property and are protected under United States and international copyright, trademark, and intellectual property laws.</p>
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
      <p>The distinctive structure, format, and gameplay methodology of What Would You Do? constitute proprietary creative work. Any attempt to replicate or commercially exploit the game format without authorization is prohibited.</p>
    </section>

    <section className="space-y-4 text-sm text-muted-foreground mb-10">
      <h2 className="text-lg font-semibold text-foreground">User Conduct</h2>
      <p>Users agree to use the game responsibly and for lawful purposes only. Any misuse of the app, including attempts to interfere with the app's operation, access restricted systems, or exploit vulnerabilities, may result in suspension or termination of access.</p>
    </section>

    <section className="space-y-4 text-sm text-muted-foreground mb-10">
      <h2 className="text-lg font-semibold text-foreground">Limitation of Liability</h2>
      <p>The game is provided "as is" without warranties of any kind, either express or implied. The creator and associated parties shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from the use or inability to use the app.</p>
      <p>Gameplay scenarios are designed for educational and conversational purposes only and do not constitute professional advice.</p>
    </section>

    <section className="space-y-4 text-sm text-muted-foreground mb-10">
      <h2 className="text-lg font-semibold text-foreground">Privacy Policy</h2>
      <p>The What Would You Do? app respects user privacy and is committed to protecting personal information.</p>
      <p>The app may collect limited non-identifiable information such as device type, operating system, gameplay analytics, or crash reports to improve performance and user experience.</p>
      <p>If optional features allow users to submit information (such as usernames or feedback), such information is used solely to operate and improve the app.</p>
      <p>The app does not sell or rent personal data to third parties.</p>
      <p>Third-party services such as analytics providers or app distribution platforms may collect anonymized technical data under their own privacy policies.</p>
      <p>Users may request deletion of any personal information associated with their account where applicable.</p>
    </section>

    <section className="space-y-4 text-sm text-muted-foreground mb-10">
      <h2 className="text-lg font-semibold text-foreground">Children's Privacy</h2>
      <p>If the app is used by minors, it is intended to be used under the supervision of a parent, guardian, or educator. The app does not knowingly collect personal information from children without appropriate consent where required by law.</p>
    </section>

    <section className="space-y-4 text-sm text-muted-foreground mb-10">
      <h2 className="text-lg font-semibold text-foreground">Changes to Terms</h2>
      <p>These terms may be updated periodically to reflect legal or operational changes. Continued use of the app after updates constitutes acceptance of the revised terms.</p>
    </section>

    <section className="space-y-4 text-sm text-muted-foreground mb-10">
      <h2 className="text-lg font-semibold text-foreground">Contact</h2>
      <p>For legal inquiries, licensing requests, or copyright concerns, please contact the rights holder through the official website associated with the game.</p>
    </section>
  </div>
);

export default Legal;
