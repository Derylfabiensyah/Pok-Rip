import { useState } from 'react';
import { motion } from 'framer-motion';

const TCG_OPTIONS = [
  { id: 'pokemon', name: 'Pokémon', icon: '⚡', color: 'from-yellow-400 to-red-500' },
  { id: 'one-piece', name: 'One Piece', icon: '🏴‍☠️', color: 'from-blue-400 to-blue-600' },
  { id: 'dragon-ball-fusion', name: 'Dragon Ball', icon: '🐉', color: 'from-orange-400 to-orange-600' },
  { id: 'digimon', name: 'Digimon', icon: '🦖', color: 'from-cyan-400 to-blue-500' },
  { id: 'magic', name: 'Magic: MTG', icon: '🔮', color: 'from-purple-500 to-indigo-600' },
  { id: 'gundam', name: 'Gundam', icon: '🤖', color: 'from-slate-400 to-slate-600' },
];

export default function Home({ onOpenPack, onViewCollection }) {
  const [selectedTcg, setSelectedTcg] = useState('pokemon');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden py-12">
      {/* Background decorative orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Logo / Title */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center z-10 w-full max-w-4xl"
      >
        <h1 className="text-6xl md:text-8xl font-black gradient-text mb-4 tracking-tight">
          TCGRip
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-lg md:text-xl text-slate-400 mb-12 font-light tracking-wide"
        >
          Open booster packs from your favorite games
        </motion.p>
      </motion.div>

      {/* TCG Selector */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="z-10 w-full max-w-2xl mb-12"
      >
        <p className="text-center text-slate-300 mb-4 text-sm uppercase tracking-widest font-semibold">
          Select Trading Card Game
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {TCG_OPTIONS.map((tcg) => (
            <motion.button
              key={tcg.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedTcg(tcg.id)}
              className={`relative overflow-hidden rounded-xl p-4 border transition-all duration-300 flex flex-col items-center justify-center gap-2 ${
                selectedTcg === tcg.id
                  ? 'border-purple-400 bg-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                  : 'border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 hover:border-slate-500'
              }`}
            >
              <div className="text-3xl">{tcg.icon}</div>
              <span className={`font-semibold text-sm ${
                selectedTcg === tcg.id ? 'text-white' : 'text-slate-400'
              }`}>
                {tcg.name}
              </span>
              
              {/* Active glow gradient */}
              {selectedTcg === tcg.id && (
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${tcg.color}`} />
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="flex flex-col sm:flex-row gap-4 z-10"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onOpenPack(selectedTcg)}
          className="btn-primary text-lg px-10 py-4"
          id="btn-open-pack"
        >
          ⚡ Open Pack
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onViewCollection}
          className="btn-secondary text-lg px-10 py-4"
          id="btn-view-collection"
        >
          📦 View Collection
        </motion.button>
      </motion.div>

      {/* Decorative bottom text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-6 text-xs text-slate-600 tracking-widest uppercase"
      >
        Powered by API TCG
      </motion.p>
    </div>
  );
}
