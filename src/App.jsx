import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Home from './components/Home';
import BoosterPack from './components/BoosterPack';
import CardReveal from './components/CardReveal';
import PackResult from './components/PackResult';
import Collection, { saveToCollection } from './components/Collection';
import { fetchRandomCards } from './services/tcgApi';

/*
  App States (screens):
  - home
  - loading
  - pack       (booster pack animation)
  - reveal     (card-by-card reveal)
  - result     (all cards summary)
  - collection (saved cards)
  - error
*/

export default function App() {
  const [screen, setScreen] = useState('home');
  const [cards, setCards] = useState([]);
  const [error, setError] = useState('');
  const [selectedTcg, setSelectedTcg] = useState('pokemon');

  /** Fetch cards from API and transition to pack screen */
  const startOpenPack = useCallback(async (tcgId) => {
    const tcgToOpen = tcgId || selectedTcg;
    setSelectedTcg(tcgToOpen);
    setScreen('loading');
    setError('');

    try {
      const fetchedCards = await fetchRandomCards(tcgToOpen, 5);
      setCards(fetchedCards);
      saveToCollection(fetchedCards); // Auto-save cards immediately
      setScreen('pack');
    } catch (err) {
      console.error('Failed to fetch cards:', err);
      setError(err.message || 'Failed to fetch cards. Please try again.');
      setScreen('error');
    }
  }, [selectedTcg]);

  /** Pack animation done → go to card reveal */
  const handlePackOpened = useCallback(() => {
    setScreen('reveal');
  }, []);

  /** All cards revealed → show results */
  const handleRevealComplete = useCallback(() => {
    setScreen('result');
  }, []);

  /** Navigation helpers */
  const goHome = useCallback(() => setScreen('home'), []);
  const goCollection = useCallback(() => setScreen('collection'), []);

  return (
    <AnimatePresence mode="wait">
      {/* ===== HOME ===== */}
      {screen === 'home' && (
        <motion.div
          key="home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Home onOpenPack={startOpenPack} onViewCollection={goCollection} />
        </motion.div>
      )}

      {/* ===== LOADING ===== */}
      {screen === 'loading' && (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen flex flex-col items-center justify-center gap-6"
        >
          {/* Spinner */}
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-500 border-r-cyan-400 animate-spin-slow" />
            <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-yellow-400 border-l-purple-400 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '1s' }} />
          </div>
          <p className="text-slate-400 text-lg tracking-wide animate-pulse">Opening pack...</p>
        </motion.div>
      )}

      {/* ===== ERROR ===== */}
      {screen === 'error' && (
        <motion.div
          key="error"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 w-full"
        >
          <div className="neo-card p-8 text-center max-w-md w-full bg-white">
            <div className="text-5xl mb-4">😵</div>
            <h3 className="text-xl font-black uppercase mb-2">Oops! Something went wrong</h3>
            <p className="text-slate-600 font-bold text-sm mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => startOpenPack(selectedTcg)}
                className="btn-primary flex-1"
                id="btn-retry"
              >
                🔄 Retry
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={goHome}
                className="btn-secondary flex-1"
              >
                🏠 Home
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ===== BOOSTER PACK ===== */}
      {screen === 'pack' && (
        <motion.div
          key="pack"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <BoosterPack tcgId={selectedTcg} onPackOpen={handlePackOpened} />
        </motion.div>
      )}

      {/* ===== CARD REVEAL ===== */}
      {screen === 'reveal' && (
        <motion.div
          key="reveal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <CardReveal cards={cards} tcgId={selectedTcg} onComplete={handleRevealComplete} />
        </motion.div>
      )}

      {/* ===== PACK RESULT ===== */}
      {screen === 'result' && (
        <motion.div
          key="result"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <PackResult
            cards={cards}
            onOpenAnother={() => startOpenPack(selectedTcg)}
            onGoHome={goHome}
          />
        </motion.div>
      )}

      {/* ===== COLLECTION ===== */}
      {screen === 'collection' && (
        <motion.div
          key="collection"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Collection onGoHome={goHome} onOpenPack={() => startOpenPack(selectedTcg)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
