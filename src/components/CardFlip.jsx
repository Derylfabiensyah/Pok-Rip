import { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { getCardRarity, getRarityGlow } from '../utils/rarityGlow';

import pokemonBack from '../assets/pokemon.png';
import onepieceBack from '../assets/onepiece.png';
import dragonballBack from '../assets/dragonball.webp';
import digimonBack from '../assets/digimon.png';
import gundamBack from '../assets/gundam.png';
import yugiohBack from '../assets/yugioh.jpg';

const BACK_IMAGES = {
  'pokemon': pokemonBack,
  'one-piece': onepieceBack,
  'yugioh': yugiohBack,
  'dragon-ball-fusion-world': dragonballBack,
  'digimon': digimonBack,
  'gundam': gundamBack,
};

export default function CardFlip({ card, index, tcgId = 'pokemon' }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef(null);

  // Determine rarity class for the border
  const rarity = getCardRarity(card);
  const { glowClass } = getRarityGlow(rarity);

  // Determine which back image to use
  const backImage = BACK_IMAGES[tcgId] || pokemonBack;

  // Mouse tracking for 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth the mouse movement
  const mouseX = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseY = useSpring(y, { stiffness: 300, damping: 30 });

  // Transform mouse position into rotation angles
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);

  const handleMouseMove = (e) => {
    if (!cardRef.current || !isFlipped) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;
    const xPct = mouseXPos / width - 0.5;
    const yPct = mouseYPos / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleFlip = () => {
    if (!isFlipped) setIsFlipped(true);
  };

  return (
    <div
      ref={cardRef}
      className="perspective-1000 w-full max-w-sm mx-auto"
      style={{ aspectRatio: '2.5/3.5' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleFlip}
    >
      <motion.div
        className="w-full h-full relative preserve-3d cursor-pointer"
        initial={{ rotateY: 0, y: 50, opacity: 0 }}
        animate={{
          rotateY: isFlipped ? 180 : 0,
          rotateX: isFlipped ? rotateX.get() : 0,
          y: 0,
          opacity: 1,
        }}
        transition={{
          y: { delay: index * 0.15, type: 'spring', stiffness: 200, damping: 20 },
          opacity: { delay: index * 0.15, duration: 0.3 },
          rotateY: { type: 'spring', stiffness: 200, damping: 20 },
        }}
        style={{ rotateX, rotateY }}
      >
        {/* FRONT OF CARD (Hidden before flip) */}
        <div 
          className={`absolute inset-0 backface-hidden rotate-y-180 bg-white ${glowClass} flex flex-col overflow-hidden`}
          style={{ borderRadius: '12px' }}
        >
          {card?.images?.large ? (
            <div className="relative w-full h-full">
              <img
                src={card.images.large}
                alt={card.name}
                className="w-full h-full object-cover"
                loading="eager"
              />
              
              {/* Optional Info Overlay (Neubrutalism style) */}
              <div className="absolute bottom-2 left-2 right-2 bg-white border-2 border-black p-2 transform rotate-1 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                <p className="font-bold text-sm truncate">{card.name}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs neo-badge bg-[#ff4081] text-white px-2 py-0.5 border-black border rounded-none">
                    {rarity}
                  </span>
                  {card.hp && <span className="text-xs font-bold bg-green-300 border border-black px-1">HP {card.hp}</span>}
                  {card.atk && <span className="text-xs font-bold bg-red-300 border border-black px-1">ATK {card.atk}</span>}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center bg-[#f0f0f0]">
              <div className="w-16 h-16 border-4 border-black rounded-full mb-4 bg-white shadow-[4px_4px_0_#000]"></div>
              <h3 className="text-xl font-bold border-b-2 border-black pb-1 mb-2">{card?.name || 'Unknown'}</h3>
              <div className="flex flex-wrap gap-2 justify-center text-sm">
                <span className="neo-badge bg-[#ff4081] border border-black">{rarity}</span>
              </div>
            </div>
          )}
        </div>

        {/* BACK OF CARD (Visible before flip) */}
        <div 
          className="absolute inset-0 backface-hidden bg-white neo-card flex items-center justify-center p-2"
        >
          <div className="w-full h-full bg-black/5 rounded flex items-center justify-center overflow-hidden">
            <img 
              src={backImage} 
              alt="Card Back" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
