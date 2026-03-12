import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Copy, Check, MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface ShareMilestoneCardProps {
  levelTitle: string;
  levelIcon: string;
  levelNumber: number;
  missionsCompleted: number;
  totalXP: number;
  badgeCount: number;
  stickerCount: number;
  /** Optional: specific milestone text override */
  milestoneText?: string;
}

const ShareMilestoneCard = ({
  levelTitle,
  levelIcon,
  levelNumber,
  missionsCompleted,
  totalXP,
  badgeCount,
  stickerCount,
  milestoneText,
}: ShareMilestoneCardProps) => {
  const [showPanel, setShowPanel] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareMessage = milestoneText
    ?? `How safe is your child? 🛡️ My child just became a ${levelTitle} in "What Would You Do?" — the child safety game! 🎮✨ ${missionsCompleted} missions completed, ${totalXP} XP earned.`;

  const shareUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const fullShareText = `${shareMessage}\n\nPlay free → ${shareUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullShareText).then(() => {
      setCopied(true);
      toast({ title: 'Copied!', description: 'Share text copied to clipboard.' });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${levelTitle} — What Would You Do?`,
        text: shareMessage,
        url: shareUrl,
      }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  const shareToWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(fullShareText)}`, '_blank');
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(shareMessage)}&u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  // Gradient based on level
  const gradients: Record<number, string> = {
    1: 'from-[hsl(160,84%,28%)] to-[hsl(160,70%,40%)]',
    2: 'from-[hsl(200,80%,40%)] to-[hsl(160,84%,28%)]',
    3: 'from-[hsl(280,60%,50%)] to-[hsl(200,80%,40%)]',
    4: 'from-[hsl(42,90%,50%)] to-[hsl(24,95%,52%)]',
  };
  const gradient = gradients[levelNumber] ?? gradients[1];

  return (
    <div className="space-y-3">
      {/* The visual card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} p-6 text-white shadow-xl`}
      >
        {/* Decorative circles */}
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
        <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-white/8" />
        <div className="absolute right-12 bottom-4 h-16 w-16 rounded-full bg-white/5" />

        <div className="relative z-10">
          {/* Header badge */}
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">
            <span className="text-xs font-bold tracking-wider uppercase">🛡️ What Would You Do?</span>
          </div>

          {/* Level icon & title */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-inner">
              <span className="text-4xl">{levelIcon}</span>
            </div>
            <div>
              <p className="text-sm font-bold text-white/80 uppercase tracking-wide">Level {levelNumber}</p>
              <h3 className="text-2xl font-black leading-tight">{levelTitle}</h3>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="rounded-xl bg-white/15 px-3 py-2.5 text-center backdrop-blur-sm">
              <p className="text-xl font-black">{missionsCompleted}</p>
              <p className="text-[10px] font-bold text-white/80 uppercase tracking-wide">Missions</p>
            </div>
            <div className="rounded-xl bg-white/15 px-3 py-2.5 text-center backdrop-blur-sm">
              <p className="text-xl font-black">{totalXP}</p>
              <p className="text-[10px] font-bold text-white/80 uppercase tracking-wide">XP Earned</p>
            </div>
            <div className="rounded-xl bg-white/15 px-3 py-2.5 text-center backdrop-blur-sm">
              <p className="text-xl font-black">{badgeCount + stickerCount}</p>
              <p className="text-[10px] font-bold text-white/80 uppercase tracking-wide">Rewards</p>
            </div>
          </div>

          {/* Message */}
          <p className="text-sm text-white/90 leading-relaxed">
            "My child is learning to stay safe with <span className="font-bold">What Would You Do?</span> — the child safety game that makes tough conversations easier."
          </p>
        </div>
      </motion.div>

      {/* Share button */}
      <Button
        onClick={() => setShowPanel(!showPanel)}
        className="w-full gap-2 font-bold bg-card text-card-foreground border-2 border-border hover:bg-muted transition-all"
        variant="outline"
        size="lg"
      >
        <Share2 className="h-5 w-5" />
        Share This Milestone
      </Button>

      {/* Share options panel */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden rounded-2xl border-2 border-border bg-card"
          >
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-card-foreground">Share via</p>
                <button onClick={() => setShowPanel(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Share preview */}
              <div className="rounded-xl bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground leading-relaxed">{shareMessage}</p>
              </div>

              {/* Share buttons */}
              <div className="grid grid-cols-2 gap-2">
                {/* Native share (mobile) */}
                {'share' in navigator && (
                  <button
                    onClick={handleNativeShare}
                    className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-95 col-span-2"
                  >
                    <Share2 className="h-4 w-4" /> Share
                  </button>
                )}

                <button
                  onClick={shareToWhatsApp}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[hsl(142,70%,40%)] px-4 py-3 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </button>

                <button
                  onClick={shareToFacebook}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[hsl(220,46%,48%)] px-4 py-3 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
                >
                  📘 Facebook
                </button>

                <button
                  onClick={shareToTwitter}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[hsl(200,90%,45%)] px-4 py-3 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
                >
                  🐦 Twitter / X
                </button>

                <button
                  onClick={handleCopy}
                  className="flex items-center justify-center gap-2 rounded-xl bg-muted px-4 py-3 text-sm font-bold text-card-foreground transition-all hover:bg-muted/80 active:scale-95"
                >
                  {copied ? <Check className="h-4 w-4 text-safe" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied!' : 'Copy Text'}
                </button>
              </div>

              <p className="text-[10px] text-muted-foreground text-center">
                No personal data is shared — only your milestone achievement.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShareMilestoneCard;
