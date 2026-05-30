import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CardFlip from './CardFlip';

export default function CardReveal({ cards, onComplete, tcgId = 'pokemon' }) {
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
        className="mb-8 z-10 flex flex-col items-center"
      >
        {/* Progress Bar */}
        <div className="flex gap-3 items-center justify-center mb-4">
          {cards.map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`h-3 rounded-lg border-2 border-black transition-all duration-300 shadow-[2px_2px_0_#000] ${
                i === currentIndex
                  ? 'w-12 bg-[#ffeb3b]'
                  : i < currentIndex
                  ? 'w-8 bg-[#4caf50]'
                  : 'w-8 bg-white'
              }`}
            />
          ))}
        </div>
        
        {/* Card Counter Text */}
        <div className="neo-badge bg-black border-2 border-black px-4 py-2 shadow-[3px_3px_0_#000]">
          <p className="text-white font-black text-base tracking-tight">
            CARD <span className="text-[#ff4081]">{currentIndex + 1}</span> / {cards.length}
          </p>
        </div>
      </motion.div>

      {/* Card Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 80, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -80, scale: 0.9 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="z-10 w-full max-w-sm mx-auto"
          onAnimationComplete={() => setRevealed(true)}
        >
          <CardFlip card={currentCard} index={currentIndex} tcgId={tcgId} autoFlip={true} />
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
