import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRarityGlow, getRarityColor, getCardRarity } from '../utils/rarityGlow';

export default function CardFlip({ card }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const cardRarity = getCardRarity(card);

  const { glowClass, level } = useMemo(
    () => getRarityGlow(cardRarity),
    [cardRarity]
  );
  const rarityColor = getRarityColor(level);

  const isUltraRare = level >= 4;
  const isRareOrAbove = level >= 2;

  return (
    <div className="flex flex-col items-center">
      {/* Sparkle particles for rare cards on reveal */}
      <div className="relative">
        <AnimatePresence>
          {isFlipped && isRareOrAbove && (
            <>
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={`sparkle-${i}`}
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                    x: (Math.random() - 0.5) * 250,
                    y: (Math.random() - 0.5) * 350,
                  }}
                  transition={{ duration: 1 + Math.random() * 0.5, delay: Math.random() * 0.3 }}
                  className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full pointer-events-none z-20"
                  style={{
                    background: level >= 4 ? '#fbbf24' : level >= 3 ? '#a855f7' : '#3b82f6',
                    boxShadow: `0 0 8px 3px ${level >= 4 ? '#fbbf24' : level >= 3 ? '#a855f7' : '#3b82f6'}`,
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* 3D Card Container */}
        <motion.div
          className="perspective-1000 cursor-pointer"
          onClick={() => !isFlipped && setIsFlipped(true)}
          animate={
            isFlipped && isUltraRare
              ? { scale: [1, 1.08, 1.03] }
              : {}
          }
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <motion.div
            className="relative w-56 h-80 md:w-64 md:h-[22rem] preserve-3d"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.7, ease: [0.4, 0.0, 0.2, 1] }}
          >
            {/* Card Back */}
            <div className="absolute inset-0 backface-hidden rounded-xl overflow-hidden border border-purple-500/20">
              <div className="w-full h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex flex-col items-center justify-center relative">
                {/* Pattern overlay */}
                <div className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)',
                  }}
                />
                {/* Pokeball */}
                <div className="w-20 h-20 relative z-10">
                  <div className="absolute inset-0 rounded-full border-2 border-yellow-400/40 overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1/2 bg-red-500/30" />
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white/15" />
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-yellow-400/50 -translate-y-1/2" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-yellow-400/50" />
                  </div>
                </div>
                <p className="text-yellow-400/50 text-xs mt-3 tracking-[0.2em] uppercase z-10">Tap to reveal</p>
              </div>
            </div>

            {/* Card Front */}
            <div className={`absolute inset-0 backface-hidden rotate-y-180 rounded-xl overflow-hidden ${glowClass}`}>
              {card?.images?.large ? (
                <img
                  src={card.images.large}
                  alt={card.name}
                  className="w-full h-full object-cover rounded-xl"
                  loading="eager"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center rounded-xl">
                  <p className="text-slate-400">No image</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Card Info (shown after flip) */}
      <AnimatePresence>
        {isFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-6 text-center glass rounded-2xl px-6 py-4 max-w-xs"
          >
            <h3 className="text-xl font-bold text-white mb-2">{card?.name || 'Unknown'}</h3>
            <div className="flex flex-wrap gap-2 justify-center text-sm">
              {card?.hp && (
                <span className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-xs font-medium">
                  HP {card.hp}
                </span>
              )}
              {card?.power && (
                <span className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-xs font-medium">
                  Power {card.power}
                </span>
              )}
              {card?.cost !== undefined && (
                <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs font-medium">
                  Cost {card.cost}
                </span>
              )}
              {card?.color && (
                <span className="bg-pink-500/20 text-pink-300 px-3 py-1 rounded-full text-xs font-medium">
                  {card.color}
                </span>
              )}
              {card?.type && (
                <span className="bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-xs font-medium">
                  {card.type}
                </span>
              )}
              {card?.types?.map((type) => (
                <span key={type} className="bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-xs font-medium">
                  {type}
                </span>
              ))}
              <span className={`bg-purple-500/20 px-3 py-1 rounded-full text-xs font-medium ${rarityColor}`}>
                {cardRarity}
              </span>
            </div>
            {(card?.set?.name || card?.set) && (
              <p className="text-slate-500 text-xs mt-2">
                Set: {card?.set?.name || card?.set}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
