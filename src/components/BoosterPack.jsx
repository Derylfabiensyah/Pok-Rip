import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BoosterPack({ onPackOpen }) {
  const [phase, setPhase] = useState('idle'); // idle, shaking, glowing, opened

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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-slate-400 text-lg mb-8 tracking-wide z-10"
      >
        {phase === 'idle' && 'Tap the pack to rip it open!'}
        {phase === 'shaking' && 'Something is inside...'}
        {phase === 'glowing' && '✨ Here it comes!'}
        {phase === 'opened' && 'Pack opened!'}
      </motion.p>

      {/* Booster Pack */}
      <div className="relative z-10">
        {/* Glow light from inside */}
        <AnimatePresence>
          {phase === 'glowing' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1.5 }}
              exit={{ opacity: 0, scale: 2 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 bg-gradient-to-t from-purple-500/40 via-cyan-400/30 to-yellow-300/20 rounded-3xl blur-2xl -z-10"
            />
          )}
        </AnimatePresence>

        {/* Sparkle particles */}
        <AnimatePresence>
          {(phase === 'glowing' || phase === 'opened') && (
            <>
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: (Math.random() - 0.5) * 300,
                    y: (Math.random() - 0.5) * 300,
                  }}
                  transition={{ duration: 0.8 + Math.random() * 0.4, delay: Math.random() * 0.3 }}
                  className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full pointer-events-none"
                  style={{
                    background: ['#fbbf24', '#00d4ff', '#a855f7', '#ffffff'][Math.floor(Math.random() * 4)],
                    boxShadow: `0 0 6px 2px ${['#fbbf24', '#00d4ff', '#a855f7', '#ffffff'][Math.floor(Math.random() * 4)]}`,
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        <motion.div
          onClick={handleClick}
          className={`cursor-pointer select-none relative ${phase === 'shaking' ? 'animate-shake' : ''}`}
          whileHover={phase === 'idle' ? { scale: 1.03, rotate: 1 } : {}}
          whileTap={phase === 'idle' ? { scale: 0.97 } : {}}
          animate={
            phase === 'opened'
              ? { scale: 0, rotate: 15, opacity: 0 }
              : { scale: 1, rotate: 0, opacity: 1 }
          }
          transition={{ duration: 0.5 }}
        >
          {/* Pack visual */}
          <div className="w-56 h-80 md:w-64 md:h-96 rounded-2xl overflow-hidden relative group">
            {/* Pack background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-800 via-indigo-900 to-blue-900" />

            {/* Pack design elements */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
              {/* Top decorative line */}
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent mb-4" />

              {/* Pokeball pattern */}
              <div className="w-24 h-24 relative mb-4">
                <div className="absolute inset-0 rounded-full border-2 border-yellow-400/30 overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-red-500/20" />
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white/10" />
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-yellow-400/40 -translate-y-1/2" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-yellow-400/40 bg-transparent" />
                </div>
              </div>

              {/* Pack text */}
              <p className="text-yellow-300/80 font-bold text-xl tracking-wider mb-1">POKÉMON</p>
              <p className="text-yellow-400/60 text-xs tracking-[0.3em] uppercase">Booster Pack</p>

              {/* Bottom decorative line */}
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent mt-4" />

              {/* Tear line */}
              <div className="absolute top-8 left-0 right-0 border-t border-dashed border-white/10" />
            </div>

            {/* Holographic shimmer overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
