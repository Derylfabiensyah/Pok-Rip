import { motion } from 'framer-motion';

export default function Home({ onOpenPack, onViewCollection }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorative orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Logo / Title */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center z-10"
      >
        {/* Pokeball icon */}
        <motion.div
          className="mb-6 animate-float"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        >
          <div className="w-20 h-20 mx-auto relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-red-500 to-red-600 overflow-hidden">
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white" />
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-800 -translate-y-1/2" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-3 border-gray-800" />
            </div>
          </div>
        </motion.div>

        <h1 className="text-6xl md:text-8xl font-black gradient-text mb-4 tracking-tight">
          PokéRip
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-lg md:text-xl text-slate-400 mb-12 font-light tracking-wide"
        >
          Open your Pokémon booster pack
        </motion.p>
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
          onClick={onOpenPack}
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
        Powered by Pokémon TCG API
      </motion.p>
    </div>
  );
}
