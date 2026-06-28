import { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SITE_URL = 'https://sitchthegame.com';
const SHARE_TEXT = `Play Sitch with me! It's a family safety card game for kids and adults. Check it out here: ${SITE_URL}`;

const ShareInviteButton = () => {
  const [copied, setCopied] = useState(false);

  const openMailto = () => {
    const subject = encodeURIComponent('Play Sitch with me!');
    const body = encodeURIComponent(
      `Hey!\n\nI'm playing Sitch — a family safety card game for kids and adults. Want to play with me?\n\n${SITE_URL}\n`,
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleShare = async () => {
    // On mobile / supported browsers, open the native share sheet (email, SMS, WhatsApp, etc.)
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: 'Sitch — Family Edition',
          text: 'Play Sitch with me! A family safety card game we can play together.',
          url: SITE_URL,
        });
        return;
      } catch {
        // User cancelled or share failed — fall through to email
      }
    }

    // Desktop fallback: open the user's email client with the message pre-filled
    // so they can just type an address and hit send.
    openMailto();

    // Also copy as a quiet backup in case no mail client is configured.
    try {
      await navigator.clipboard.writeText(SHARE_TEXT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available — ignore
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.55, duration: 0.5 }}
    >
      <Button
        onClick={handleShare}
        size="lg"
        className="group gap-2.5 text-sm font-black tracking-[0.08em] uppercase active:animate-btn-press transition-all duration-300 hover:scale-[1.04] px-8 py-5 rounded-xl min-h-[48px]"
        style={{
          background: 'linear-gradient(180deg, #FDB913 0%, #F7941D 100%)',
          color: '#FFFFFF',
          border: '1.5px solid #FFFFFF',
          boxShadow: '0 5px 0 #B8861A, 0 10px 20px hsl(15 70% 20% / 0.25), inset 0 1px 0 hsl(45 95% 90% / 0.5)',
        }}
      >
        {copied ? (
          <Check className="h-5 w-5 transition-transform" />
        ) : (
          <Share2 className="h-5 w-5 transition-transform group-hover:rotate-12 group-hover:scale-110" />
        )}
        {copied ? 'Copied!' : 'Play Sitch with me!'}
      </Button>
    </motion.div>
  );
};

export default ShareInviteButton;
