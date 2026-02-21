import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdultGate from '@/components/AdultGate';

const resources = [
  {
    icon: '🛡️',
    title: 'Personal Safety Basics',
    content: 'Teach children about body autonomy, safe and unsafe touches, and the importance of telling a trusted adult when something feels wrong.',
  },
  {
    icon: '📱',
    title: 'Online Safety Tips',
    content: 'Never share personal information online. Always tell a parent about messages from strangers. Remember: people online may not be who they say they are.',
  },
  {
    icon: '🤝',
    title: 'Building a Safety Network',
    content: 'Help your child identify 3–5 trusted adults they can talk to — parents, grandparents, teachers, school counselors, or family friends.',
  },
  {
    icon: '🗣️',
    title: 'How to Talk About Difficult Topics',
    content: 'Use age-appropriate language. Let the child lead with questions. Stay calm and reassuring. Validate their feelings. Practice scenarios through roleplay.',
  },
  {
    icon: '🚨',
    title: 'Emergency Preparedness',
    content: 'Make sure children know how to call emergency services in your country. Practice what to say: name, location, and what happened.',
  },
  {
    icon: '💛',
    title: 'Recognizing Warning Signs',
    content: 'Changes in behavior, sleep, appetite, or mood may indicate something is wrong. Create an environment where children feel safe speaking up.',
  },
];

const ResourcesContent = () => (
  <div className="min-h-screen bg-background">
    <div className="bg-primary px-4 py-6 text-primary-foreground">
      <div className="mx-auto flex max-w-3xl items-center gap-3">
        <Link to="/">
          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-black">Help & Safety Resources</h1>
      </div>
    </div>

    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 rounded-2xl border border-caution/30 bg-caution/5 p-5">
        <div className="flex items-start gap-3">
          <Shield className="mt-0.5 h-6 w-6 shrink-0 text-caution" />
          <div>
            <p className="font-bold text-foreground">Important Disclaimer</p>
            <p className="mt-1 text-sm text-muted-foreground">
              This app is an educational tool designed to support conversations between children and trusted adults.
              It is not a substitute for professional advice. If a child is in immediate danger, please contact your
              local emergency services.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {resources.map((r, i) => (
          <div key={i} className="rounded-2xl border bg-card p-5">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{r.icon}</span>
              <div>
                <h3 className="font-bold text-card-foreground">{r.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{r.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-help/30 bg-help/5 p-6 text-center">
        <Phone className="mx-auto mb-2 h-8 w-8 text-help" />
        <p className="font-bold text-foreground">Need Help?</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Contact your local child protection services or emergency number.
          Administrators can customize this section with local resources.
        </p>
      </div>
    </div>
  </div>
);

const Resources = () => (
  <AdultGate title="Adults Only" description="Safety resources and guidance are intended for parents, guardians, and teachers.">
    <ResourcesContent />
  </AdultGate>
);

export default Resources;
