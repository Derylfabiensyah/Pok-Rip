import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRarityGlow, getRarityColor, getCardRarity } from '../utils/rarityGlow';

const STORAGE_KEY = 'pokerip_collection';

export function getCollection() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveToCollection(newCards) {
  const existing = getCollection();
  const updated = [...existing, ...newCards];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export default function Collection({ onGoHome, onOpenPack }) {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    setCards(getCollection());
  }, []);

  return (
    <div className="min-h-screen flex flex-col px-4 py-8 relative">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 right-1/4 w-80 h-80 bg-purple-600/6 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/4 w-72 h-72 bg-blue-500/6 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 z-10"
      >
        <h2 className="text-4xl md:text-5xl font-black gradient-text mb-2">My Collection</h2>
        <p className="text-slate-400">
          {cards.length} {cards.length === 1 ? 'card' : 'cards'} collected
        </p>
      </motion.div>

      {/* Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex gap-3 justify-center mb-8 z-10"
      >
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onOpenPack}
          className="btn-primary text-sm px-6 py-3"
          id="btn-collection-open-pack"
        >
          ⚡ Open Pack
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onGoHome}
          className="btn-secondary text-sm px-6 py-3"
          id="btn-collection-home"
        >
          🏠 Home
        </motion.button>
      </motion.div>

      {/* Cards Grid */}
      {cards.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center z-10"
        >
          <div className="text-6xl mb-4">📦</div>
          <p className="text-slate-400 text-lg mb-2">No cards yet!</p>
          <p className="text-slate-500 text-sm mb-6">Open a booster pack to start collecting</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenPack}
            className="btn-primary"
          >
            ⚡ Open Your First Pack
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 max-w-7xl mx-auto w-full z-10"
        >
          <AnimatePresence>
            {cards.map((card, i) => {
              const cardRarity = getCardRarity(card);
            const { glowClass, level } = getRarityGlow(cardRarity);
              const rarityColor = getRarityColor(level);

              return (
                <motion.div
                  key={`${card.id}-${i}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: Math.min(i * 0.03, 1), duration: 0.4 }}
                  className="group"
                >
                  <div className={`rounded-xl overflow-hidden ${glowClass} transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-1`}>
                    {card?.images?.small ? (
                      <img
                        src={card.images.small}
                        alt={card.name}
                        className="w-full h-auto"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full aspect-[2.5/3.5] bg-gray-800 flex items-center justify-center">
                        <p className="text-slate-500 text-xs">{card.name}</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-xs font-semibold text-white truncate">{card.name}</p>
                    <p className={`text-xs ${rarityColor}`}>{cardRarity}</p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
