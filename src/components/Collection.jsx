import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRarityGlow, getCardRarity } from '../utils/rarityGlow';

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

const TCG_FILTERS = [
  { id: 'all', label: 'All Cards' },
  { id: 'pokemon', label: 'Pokémon' },
  { id: 'one-piece', label: 'One Piece' },
  { id: 'yugioh', label: 'Yu-Gi-Oh!' },
  { id: 'dragon-ball-fusion-world', label: 'Dragon Ball' },
  { id: 'digimon', label: 'Digimon' },
  { id: 'gundam', label: 'Gundam' },
];

export default function Collection({ onGoHome, onOpenPack }) {
  const [cards, setCards] = useState([]);
  const [filterTcg, setFilterTcg] = useState('all');
  const [filterRarity, setFilterRarity] = useState('all');

  useEffect(() => {
    setCards(getCollection());
  }, []);

  // Calculate unique cards and duplicate counts
  const displayData = useMemo(() => {
    // 1. Group by ID to find duplicates
    const cardMap = new Map();
    cards.forEach(card => {
      if (cardMap.has(card.id)) {
        cardMap.get(card.id).count += 1;
      } else {
        cardMap.set(card.id, { ...card, count: 1 });
      }
    });

    let uniqueCards = Array.from(cardMap.values());

    // 2. Filter by TCG
    if (filterTcg !== 'all') {
      uniqueCards = uniqueCards.filter(c => {
        // Fallback for older cards saved before tcgId was added
        let cardTcgId = c.tcgId;
        if (!cardTcgId) {
          if (c.supertype || c.subtypes || c.hp) cardTcgId = 'pokemon';
          else if (c.attribute || cardTcgId === 'yugioh') cardTcgId = 'yugioh'; // basic check
          else cardTcgId = 'pokemon'; // Default to pokemon for old saves
        }
        return cardTcgId === filterTcg;
      });
    }

    // 3. Filter by Rarity
    if (filterRarity !== 'all') {
      uniqueCards = uniqueCards.filter(c => {
        const rarity = getCardRarity(c);
        const { label } = getRarityGlow(rarity);
        return label === filterRarity;
      });
    }

    // 4. Sort (maybe by count descending, then name)
    uniqueCards.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

    return uniqueCards;
  }, [cards, filterTcg, filterRarity]);

  return (
    <div className="min-h-screen flex flex-col px-4 py-8 relative bg-[var(--color-bg-primary)]">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 z-10"
      >
        <h2 className="text-5xl md:text-6xl font-black uppercase mb-4" style={{ textShadow: '3px 3px 0 var(--color-border)' }}>
          My Collection
        </h2>
        <div className="inline-block bg-white border-2 border-black px-4 py-1 font-bold">
          {cards.length} Total Cards ({displayData.length} Unique)
        </div>
      </motion.div>

      {/* Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex gap-4 justify-center mb-8 z-10"
      >
        <button onClick={onOpenPack} className="btn-primary text-sm px-6 py-3">
          ⚡ Open Pack
        </button>
        <button onClick={onGoHome} className="btn-secondary text-sm px-6 py-3">
          🏠 Home
        </button>
      </motion.div>

      {/* Filters (Neubrutalism style) */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="max-w-7xl mx-auto w-full mb-8 z-10 flex flex-col md:flex-row gap-4"
      >
        {/* TCG Filter */}
        <div className="flex-1 neo-card p-3 flex flex-wrap gap-2 items-center">
          <span className="font-bold mr-2 uppercase text-sm">Game:</span>
          {TCG_FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setFilterTcg(f.id)}
              className={`px-3 py-1 text-sm font-bold border-2 border-black transition-transform ${
                filterTcg === f.id ? 'bg-[#ffeb3b] shadow-[2px_2px_0_#000] translate-y-[-2px]' : 'bg-white hover:bg-gray-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Rarity Filter */}
        <div className="neo-card p-3 flex gap-2 items-center">
          <span className="font-bold mr-2 uppercase text-sm">Rarity:</span>
          <select 
            className="border-2 border-black bg-white px-2 py-1 font-bold focus:outline-none shadow-[2px_2px_0_#000]"
            value={filterRarity}
            onChange={(e) => setFilterRarity(e.target.value)}
          >
            <option value="all">All Rarities</option>
            <option value="Common">Common</option>
            <option value="Uncommon">Uncommon</option>
            <option value="Rare">Rare</option>
            <option value="Super Rare">Super Rare</option>
            <option value="Ultra Rare">Ultra Rare</option>
          </select>
        </div>
      </motion.div>

      {/* Cards Grid */}
      {displayData.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center z-10 mt-12"
        >
          <div className="text-6xl mb-4 transform rotate-12">📦</div>
          <p className="font-black text-2xl mb-2 uppercase">No cards found!</p>
          <p className="text-gray-600 font-bold mb-6">Open some packs or change your filters.</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 max-w-7xl mx-auto w-full z-10 pb-12"
        >
          <AnimatePresence>
            {displayData.map((card, i) => {
              const cardRarity = getCardRarity(card);
              const { glowClass } = getRarityGlow(cardRarity);

              return (
                <motion.div
                  key={`${card.id}-${i}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="group flex flex-col items-center relative"
                >
                  {/* Duplicate Badge */}
                  {card.count > 1 && (
                    <div className="absolute -top-3 -right-3 z-20 neo-badge bg-[#00e5ff] text-black border border-black shadow-[2px_2px_0_#000] text-sm">
                      ×{card.count}
                    </div>
                  )}
                  
                  <div className={`w-full aspect-[2.5/3.5] bg-white rounded-xl overflow-hidden mb-3 transition-transform duration-200 group-hover:scale-105 group-hover:-rotate-2 ${glowClass}`}>
                    {card?.images?.small ? (
                      <img
                        src={card.images.small}
                        alt={card.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <p className="text-xs font-bold p-2 text-center">{card.name}</p>
                      </div>
                    )}
                  </div>
                  <div className="text-center w-full px-1">
                    <p className="text-sm font-bold text-black truncate">{card.name}</p>
                    <p className="text-xs neo-badge mt-1 bg-black text-white">{cardRarity}</p>
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
