import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CardFlip from './CardFlip';

export default function CardReveal({ cards, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const currentCard = cards[currentIndex];
  const isLast = currentIndex === cards.length - 1;

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setRevealed(false);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-purple-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-cyan-500/8 rounded-full blur-3xl" />
      </div>

      {/* Card Counter */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 z-10"
      >
        <div className="flex gap-2 items-center">
          {cards.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? 'w-8 bg-gradient-to-r from-purple-500 to-cyan-400'
                  : i < currentIndex
                  ? 'w-4 bg-purple-500/40'
                  : 'w-4 bg-slate-700'
              }`}
            />
          ))}
        </div>
        <p className="text-center text-slate-500 text-sm mt-3 tracking-wide">
          Card {currentIndex + 1} of {cards.length}
        </p>
      </motion.div>

      {/* Card Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 80, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -80, scale: 0.9 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="z-10"
          onAnimationComplete={() => setRevealed(true)}
        >
          <CardFlip card={currentCard} />
        </motion.div>
      </AnimatePresence>

      {/* Next Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0.3 }}
        className="mt-8 z-10"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          className="btn-primary"
          id="btn-next-card"
        >
          {isLast ? '🎉 See Results' : '→ Next Card'}
        </motion.button>
      </motion.div>
    </div>
  );
}
