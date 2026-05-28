import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { getRarityGlow, getRarityColor, getCardRarity } from '../utils/rarityGlow';

export default function PackResult({ cards, onOpenAnother, onGoHome }) {
  // Find the most rare card
  const mostRare = useMemo(() => {
    let best = cards[0];
    let bestLevel = 0;
    cards.forEach((card) => {
      const { level } = getRarityGlow(getCardRarity(card));
      if (level > bestLevel) {
        bestLevel = level;
        best = card;
      }
    });
    return best;
  }, [cards]);

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-10 relative">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-cyan-500/6 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10 z-10"
      >
        <h2 className="text-4xl md:text-5xl font-black gradient-text mb-3">Pack Opened!</h2>
        <p className="text-slate-400 text-lg">Here's what you got</p>
      </motion.div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6 max-w-5xl w-full z-10 mb-10">
        {cards.map((card, i) => {
          const cardRarity = getCardRarity(card);
          const { glowClass, level } = getRarityGlow(cardRarity);
          const rarityColor = getRarityColor(level);
          const isBest = card.id === mostRare?.id && level >= 2;

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 40, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: 'easeOut' }}
              className={`relative group ${isBest ? 'col-span-2 sm:col-span-1' : ''}`}
            >
              {/* Best card highlight badge */}
              {isBest && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, type: 'spring' }}
                  className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full z-20 whitespace-nowrap"
                >
                  ⭐ Best Pull!
                </motion.div>
              )}

              <div className={`rounded-xl overflow-hidden ${glowClass} transition-transform duration-300 group-hover:scale-105`}>
                {card?.images?.small ? (
                  <img
                    src={card.images.small}
                    alt={card.name}
                    className="w-full h-auto"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full aspect-[2.5/3.5] bg-gray-800 flex items-center justify-center">
                    <p className="text-slate-500 text-sm">{card.name}</p>
                  </div>
                )}
              </div>

              {/* Card Info */}
              <div className="mt-2 text-center">
                <p className="text-sm font-semibold text-white truncate">{card.name}</p>
                <p className={`text-xs ${rarityColor}`}>{cardRarity}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="flex flex-col sm:flex-row gap-3 z-10"
      >


        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onOpenAnother}
          className="btn-secondary"
          id="btn-open-another"
        >
          🔄 Open Another Pack
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onGoHome}
          className="btn-secondary"
          id="btn-back-home"
        >
          🏠 Back Home
        </motion.button>
      </motion.div>
    </div>
  );
}
