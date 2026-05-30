import { useState } from 'react';
import { motion } from 'framer-motion';

import pokemonBack from '../assets/pokemon-back_card.png';
import onepieceBack from '../assets/onepiece-back_card.png';
import digimonBack from '../assets/digimon-back_card.png';
import gundamBack from '../assets/gundam-back_card.png';
import yugiohBack from '../assets/yugioh-back_card.jpg';

const TCG_OPTIONS = [
  { id: 'pokemon', name: 'Pokémon', image: pokemonBack, color: 'var(--color-pokemon)', disabled: false },
  { id: 'one-piece', name: 'One Piece', image: onepieceBack, color: 'var(--color-onepiece)', disabled: false },
  { id: 'yugioh', name: 'Yu-Gi-Oh!', image: yugiohBack, color: 'var(--color-yugioh)', disabled: false },
  { id: 'digimon', name: 'Digimon', image: digimonBack, color: 'var(--color-digimon)', disabled: false },
  { id: 'gundam', name: 'Gundam', image: gundamBack, color: 'var(--color-gundam)', disabled: false },
];

export default function Home({ onOpenPack, onViewCollection }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedTcg = TCG_OPTIONS[selectedIndex];

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % TCG_OPTIONS.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + TCG_OPTIONS.length) % TCG_OPTIONS.length);
  };

  return (
    <div className="min-h-screen flex flex-col pt-12 pb-8 px-4 relative z-10 items-center justify-center">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl md:text-7xl font-black mb-4 uppercase tracking-tighter" style={{ textShadow: '4px 4px 0 var(--color-border)' }}>
          Brewek<span className="text-[#ff4081]">.In</span>
        </h1>
        <p className="text-xl md:text-2xl font-bold border-b-4 border-black inline-block pb-1">
          Select Your TCG
        </p>
      </motion.div>

      {/* Carousel */}
      <div className="relative w-full max-w-4xl h-[450px] flex items-center justify-center perspective-1000 mb-12 z-20">
        {TCG_OPTIONS.map((tcg, index) => {
          // Calculate relative position (-2 to +2)
          let diff = index - selectedIndex;
          if (diff < -2) diff += TCG_OPTIONS.length;
          if (diff > 2) diff -= TCG_OPTIONS.length;

          // If it's too far, hide it
          if (Math.abs(diff) > 2) return null;

          const isActive = diff === 0;
          
          return (
            <motion.div
              key={tcg.id}
              className="absolute cursor-pointer"
              onClick={() => setSelectedIndex(index)}
              animate={{
                x: diff * 120, // Spread them out horizontally
                y: Math.abs(diff) * 20, // Push side cards down slightly
                scale: isActive ? 1.1 : Math.max(0.7, 1 - Math.abs(diff) * 0.15),
                rotateY: -diff * 15,
                rotateZ: diff * 3,
                zIndex: 10 - Math.abs(diff),
                opacity: 1 - Math.abs(diff) * 0.2
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{
                width: isActive ? '240px' : '200px',
                height: isActive ? '336px' : '280px',
              }}
            >
              <div 
                className={`w-full h-full neo-card overflow-hidden flex flex-col transition-all duration-300 ${isActive ? 'ring-4 ring-offset-4 ring-black' : ''}`}
                style={{ borderColor: isActive ? tcg.color : 'var(--color-border)' }}
              >
                <div className="flex-1 w-full relative bg-black/5">
                  <img 
                    src={tcg.image} 
                    alt={tcg.name} 
                    className="w-full h-full object-cover"
                  />
                  {!isActive && (
                    <div className="absolute inset-0 bg-black/20" />
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Carousel Controls */}
        <button 
          onClick={handlePrev}
          className="absolute left-4 md:left-12 z-30 w-12 h-12 neo-card rounded-full flex items-center justify-center bg-white hover:bg-[#ffeb3b] text-2xl"
        >
          &larr;
        </button>
        <button 
          onClick={handleNext}
          className="absolute right-4 md:right-12 z-30 w-12 h-12 neo-card rounded-full flex items-center justify-center bg-white hover:bg-[#ffeb3b] text-2xl"
        >
          &rarr;
        </button>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap gap-4 justify-center max-w-xl mx-auto w-full relative z-30"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onOpenPack(selectedTcg.id)}
          className="btn-primary w-full sm:w-auto text-xl py-4 px-12"
          style={{ backgroundColor: selectedTcg.color }}
          id="btn-home-start"
        >
          Rip Pack!
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onViewCollection}
          className="btn-secondary w-full sm:w-auto text-xl py-4 px-12"
          id="btn-home-collection"
        >
          Collection
        </motion.button>
      </motion.div>
    </div>
  );
}
