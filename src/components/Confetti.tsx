import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiProps {
  active: boolean;
  duration?: number;
}

const COLORS = [
  'hsl(42 90% 55%)',   // gold
  'hsl(160 84% 40%)',  // green
  'hsl(200 80% 50%)',  // blue
  'hsl(340 80% 55%)',  // pink
  'hsl(280 60% 55%)',  // purple
  'hsl(20 90% 55%)',   // orange
];

const SHAPES = ['●', '■', '▲', '✦', '★'];

interface Particle {
  id: number;
  x: number;
  color: string;
  shape: string;
  size: number;
  delay: number;
  duration: number;
  drift: number;
}

const Confetti = ({ active, duration = 2500 }: ConfettiProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) { setParticles([]); return; }

    const ps: Particle[] = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      size: 8 + Math.random() * 12,
      delay: Math.random() * 0.5,
      duration: 1.5 + Math.random() * 1.5,
      drift: (Math.random() - 0.5) * 120,
    }));
    setParticles(ps);

    const timer = setTimeout(() => setParticles([]), duration);
    return () => clearTimeout(timer);
  }, [active, duration]);

  return (
    <AnimatePresence>
      {particles.length > 0 && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          {particles.map(p => (
            <motion.div
              key={p.id}
              initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0 }}
              animate={{
                y: '110vh',
                x: `calc(${p.x}vw + ${p.drift}px)`,
                opacity: [1, 1, 0],
                rotate: 360 + Math.random() * 360,
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: 'easeIn',
              }}
              style={{
                position: 'absolute',
                fontSize: p.size,
                color: p.color,
              }}
            >
              {p.shape}
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

export default Confetti;
