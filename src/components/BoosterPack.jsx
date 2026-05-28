import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import pokemonBack from '../assets/pokemon.png';
import onepieceBack from '../assets/onepiece.png';
import dragonballBack from '../assets/dragonball.webp';
import digimonBack from '../assets/digimon.png';
import gundamBack from '../assets/gundam.png';
import yugiohBack from '../assets/yugioh.jpg';

const TCG_DATA = {
  'pokemon': { name: 'Pokémon', image: pokemonBack, color: 'var(--color-pokemon)' },
  'one-piece': { name: 'One Piece', image: onepieceBack, color: 'var(--color-onepiece)' },
  'yugioh': { name: 'Yu-Gi-Oh!', image: yugiohBack, color: 'var(--color-yugioh)' },
  'dragon-ball-fusion-world': { name: 'Dragon Ball', image: dragonballBack, color: 'var(--color-dragonball)' },
  'digimon': { name: 'Digimon', image: digimonBack, color: 'var(--color-digimon)' },
  'gundam': { name: 'Gundam', image: gundamBack, color: 'var(--color-gundam)' },
};

export default function BoosterPack({ tcgId = 'pokemon', onPackOpen }) {
  const [phase, setPhase] = useState('idle'); // idle, shaking, glowing, opened
  const tcgInfo = TCG_DATA[tcgId] || TCG_DATA['pokemon'];

  const handleClick = () => {
    if (phase !== 'idle') return;

    // Phase 1: Shake
    setPhase('shaking');
    setTimeout(() => {
      // Phase 2: Glow
      setPhase('glowing');
      setTimeout(() => {
        // Phase 3: Opened - trigger parent callback
        setPhase('opened');
        setTimeout(() => {
          onPackOpen();
        }, 600);
      }, 800);
    }, 700);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden bg-[var(--color-bg-primary)]">
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 z-10"
      >
        <h2 className="text-3xl font-black uppercase" style={{ textShadow: '2px 2px 0 var(--color-border)' }}>
          {phase === 'idle' && 'Rip the Pack!'}
          {phase === 'shaking' && 'Opening...'}
          {phase === 'glowing' && 'BOOM!'}
          {phase === 'opened' && 'Done!'}
        </h2>
      </motion.div>

      {/* Booster Pack */}
      <div className="relative z-10 perspective-1000">
        {/* Glow light from inside */}
        <AnimatePresence>
          {phase === 'glowing' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1.5 }}
              exit={{ opacity: 0, scale: 2 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 bg-white rounded-3xl -z-10"
              style={{ boxShadow: `0 0 100px 50px ${tcgInfo.color}` }}
            />
          )}
        </AnimatePresence>

        <motion.div
          onClick={handleClick}
          className={`cursor-pointer select-none relative ${phase === 'shaking' ? 'animate-shake' : ''}`}
          whileHover={phase === 'idle' ? { scale: 1.05, rotate: 2 } : {}}
          whileTap={phase === 'idle' ? { scale: 0.95 } : {}}
          animate={
            phase === 'opened'
              ? { scale: 0, rotate: 15, opacity: 0 }
              : { scale: 1, rotate: 0, opacity: 1 }
          }
          transition={{ duration: 0.5 }}
        >
          {/* Pack visual - Neubrutalism style */}
          <div className="w-64 h-96 neo-card overflow-hidden relative flex flex-col group" style={{ backgroundColor: tcgInfo.color }}>
            
            {/* Top crimp */}
            <div className="h-6 w-full border-b-4 border-black flex items-center justify-center bg-white overflow-hidden">
               {/* Zig zag pattern for crimp using repeating linear gradient */}
               <div className="w-full h-full" style={{
                 backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)'
               }}></div>
            </div>

            {/* Pack content */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
              <div className="w-32 h-44 neo-card bg-white mb-6 p-2 rotate-[-5deg] group-hover:rotate-0 transition-transform">
                <img src={tcgInfo.image} alt="Card Back" className="w-full h-full object-cover rounded" />
              </div>

              <div className="bg-white border-4 border-black px-4 py-2 transform rotate-2">
                <h3 className="font-black text-2xl uppercase tracking-tighter text-center">{tcgInfo.name}</h3>
              </div>
              <div className="neo-badge mt-4 bg-black text-white px-3 py-1 text-sm uppercase font-bold transform -rotate-3">
                Booster Pack
              </div>
            </div>

            {/* Bottom crimp */}
            <div className="h-6 w-full border-t-4 border-black flex items-center justify-center bg-white overflow-hidden">
               <div className="w-full h-full" style={{
                 backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)'
               }}></div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
