import { motion } from 'framer-motion';
import { getCardRarity, getRarityGlow, getRarityColor } from '../utils/rarityGlow';

export default function PackResult({ cards, onOpenAnother, onGoHome }) {
  // Find highest rarity card for the summary
  const sortedCards = [...cards].sort((a, b) => {
    const levelA = getRarityGlow(getCardRarity(a)).level;
    const levelB = getRarityGlow(getCardRarity(b)).level;
    return levelB - levelA;
  });
  const bestCard = sortedCards[0];
  const bestRarity = getCardRarity(bestCard);

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 relative z-10 bg-[var(--color-bg-primary)]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h2 className="text-4xl md:text-5xl font-black uppercase mb-2" style={{ textShadow: '2px 2px 0 var(--color-border)' }}>
          Pack Summary
        </h2>
        <p className="text-lg font-bold border-b-2 border-black inline-block pb-1">
          Here's what you got
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap justify-center gap-4 md:gap-6 mb-12 max-w-6xl w-full"
      >
        {cards.map((card, i) => {
          const rarity = getCardRarity(card);
          const { glowClass } = getRarityGlow(rarity);
          const isBest = card.id === bestCard.id;

          return (
            <motion.div
              key={`${card.id}-${i}`}
              whileHover={{ y: -5, scale: 1.02 }}
              className="relative w-32 md:w-40 flex flex-col items-center"
            >
              {isBest && (
                <div className="absolute -top-3 -right-3 z-10 neo-badge bg-[#ffeb3b] text-black transform rotate-6 border border-black text-xs px-2 shadow-[2px_2px_0_#000]">
                  ⭐ Best Pull!
                </div>
              )}
              <div className={`w-full aspect-[2.5/3.5] bg-white rounded-xl overflow-hidden mb-3 ${glowClass}`}>
                {card?.images?.small ? (
                  <img
                    src={card.images.small}
                    alt={card.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <p className="text-xs font-bold p-2 text-center">{card.name}</p>
                  </div>
                )}
              </div>
              <p className="font-bold text-sm truncate w-full text-center">{card.name}</p>
              <p className="text-xs neo-badge mt-1 bg-black text-white">{rarity}</p>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenAnother}
          className="btn-primary"
        >
          🔄 Open Another Pack
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onGoHome}
          className="btn-secondary"
        >
          🏠 Back Home
        </motion.button>
      </motion.div>
    </div>
  );
}
