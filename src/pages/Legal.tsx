import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Legal = () => (
  <div className="min-h-screen bg-background text-foreground p-6 max-w-2xl mx-auto">
    <Button variant="ghost" size="sm" asChild className="mb-6">
      <Link to="/"><ArrowLeft className="h-4 w-4 mr-1" /> Back</Link>
    </Button>

    <h1 className="text-2xl font-bold mb-6">Terms of Use & Privacy Policy</h1>

    <section className="space-y-4 text-sm text-muted-foreground mb-10">
      <h2 className="text-lg font-semibold text-foreground">What Would You Do? – Terms of Use</h2>
      <p>All content within the What Would You Do? game, including but not limited to gameplay mechanics, prompts, scenarios, questions, text, graphics, design, and overall concept, is the exclusive intellectual property of its creator and is protected under U.S. and international copyright, trademark, and intellectual property laws.</p>
      <p>Users are granted a limited, non-exclusive, non-transferable license to access and play the game for personal, non-commercial use only. No part of the game may be copied, reproduced, modified, distributed, reverse-engineered, published, sold, or used to create derivative works without prior written permission from the rights holder.</p>
      <p>Unauthorized use, reproduction, or distribution of the game or its content may result in legal action, including claims for damages and injunctive relief.</p>
      <p>By accessing or using the game, you agree to these Terms of Use.</p>
    </section>

    <section className="space-y-4 text-sm text-muted-foreground">
      <h2 className="text-lg font-semibold text-foreground">Privacy Policy</h2>
      <p>The What Would You Do? app respects your privacy. The game does not sell, rent, or share personal information with third parties for marketing purposes.</p>
      <p>If the app collects limited information (such as device type, anonymous analytics data, or optional user-provided information) it is used solely to improve gameplay, maintain app functionality, and enhance user experience.</p>
      <p>Any information collected is stored securely and handled in accordance with applicable privacy laws. Users may request deletion of any personal data associated with their account at any time.</p>
      <p>The app may use third-party services such as analytics or hosting providers, which operate under their own privacy policies.</p>
      <p>By using the app, you consent to the collection and use of information as described in this policy.</p>
    </section>
  </div>
);

export default Legal;
