import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getCardRarity, getRarityGlow } from '../utils/rarityGlow';

// Import back card images from assets (primary)
import pokemonBack from '../assets/pokemon-back_card.png';
import onepieceBack from '../assets/onepiece-back_card.png';
import digimonBack from '../assets/digimon-back_card.png';
import gundamBack from '../assets/gundam-back_card.png';
import yugiohBack from '../assets/yugioh-back_card.jpg';

// Fallback images from public folder
const FALLBACK_IMAGES = {
  'pokemon': '/images/pokemon-card-back.png',
  'one-piece': '/images/onepiece-card-back.png',
  'yugioh': '/images/yugioh-card-back.jpg',
  'digimon': '/images/digimon-card-back.png',
  'gundam': '/images/gundam-card-back.png',
};

const BACK_IMAGES = {
  'pokemon': pokemonBack,
  'one-piece': onepieceBack,
  'yugioh': yugiohBack,
  'digimon': digimonBack,
  'gundam': gundamBack,
};

export default function CardFlip({ card, index = 0, tcgId = 'pokemon', autoFlip = false }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [backImageError, setBackImageError] = useState(false);
  const [frontImageError, setFrontImageError] = useState(false);
  const cardRef = useRef(null);

  // Determine rarity class for the border - with safe fallback
  const rarity = card ? getCardRarity(card) : 'Common';
  const { glowClass } = getRarityGlow(rarity);

  // NEVER use API back image, always use local images
  const backImage = backImageError 
    ? (FALLBACK_IMAGES[tcgId] || FALLBACK_IMAGES['pokemon'])
    : (BACK_IMAGES[tcgId] || pokemonBack);

  // Auto-flip after a delay if autoFlip is enabled
  useEffect(() => {
    if (autoFlip) {
      // Reset flip state when card changes
      setIsFlipped(false);
      
      const timer = setTimeout(() => {
        setIsFlipped(true);
      }, 500); // Flip after 500ms
      
      return () => clearTimeout(timer);
    }
  }, [autoFlip, card, index]); // Re-run when card or index changes

  const handleFlip = () => {
    // Only allow flip once
    if (!isFlipped) {
      setIsFlipped(true);
    }
  };

  const handleBackImageError = () => {
    // If primary back image fails, use fallback from public folder
    setBackImageError(true);
  };

  const handleFrontImageError = () => {
    // If front image fails to load, show fallback
    setFrontImageError(true);
  };

  // Check if the front image URL might be a back card - SPECIFIC PATTERN DETECTION
  const isSuspiciousBackCard = (url) => {
    if (!url) return true; // No URL = suspicious
    const lowerUrl = url.toLowerCase();
    
    // ONLY block McDonald's promo cards with specific pattern
    // Pattern: /mcd15/7_hires.png (set/number format)
    if (lowerUrl.match(/\/mcd\d+\/\d+_hires\.png/)) {
      return true;
    }
    
    // Block obvious back card URLs
    if (lowerUrl.includes('card-back') || lowerUrl.includes('cardback')) {
      return true;
    }
    
    return false;
  };

  // AGGRESSIVE: Determine if we should show the front image or fallback
  const shouldShowFrontImage = card?.images?.large && 
                                !frontImageError && 
                                !isSuspiciousBackCard(card.images.large) &&
                                card.name && // Must have a name
                                card.name !== 'Unknown'; // Not unknown card

  return (
    <div
      ref={cardRef}
      className="card-flip-container"
      onClick={handleFlip}
    >
      <motion.div
        className="card-flip-inner"
        initial={{ rotateY: 0, y: 50, opacity: 0 }}
        animate={{
          rotateY: isFlipped ? 180 : 0,
          y: 0,
          opacity: 1,
        }}
        transition={{
          y: { delay: index * 0.15, type: 'spring', stiffness: 200, damping: 20 },
          opacity: { delay: index * 0.15, duration: 0.3 },
          rotateY: { type: 'spring', stiffness: 200, damping: 20 },
        }}
      >
        {/* BACK OF CARD (Visible before flip - rotateY(0deg)) */}
        <div className="card-face card-back">
          <div className="card-back-inner">
            <img 
              src={backImage} 
              alt="Card Back" 
              className="card-back-image"
              onError={handleBackImageError}
              loading="eager"
            />
          </div>
        </div>

        {/* FRONT OF CARD (Visible after flip - rotateY(180deg)) */}
        <div className={`card-face card-front ${glowClass}`}>
          {shouldShowFrontImage ? (
            <div className="card-front-content">
              <img
                src={card.images.large}
                alt={card.name}
                className="card-front-image"
                loading="eager"
                onError={handleFrontImageError}
              />
            </div>
          ) : (
            <div className="card-front-fallback">
              <div className="w-16 h-16 border-4 border-black rounded-full mb-4 bg-white shadow-[4px_4px_0_#000]"></div>
              <h3 className="text-xl font-bold border-b-2 border-black pb-1 mb-2">{card?.name || 'Unknown'}</h3>
              <div className="flex flex-wrap gap-2 justify-center text-sm">
                <span className="neo-badge bg-[#ff4081] border border-black">{rarity}</span>
              </div>
              {frontImageError && (
                <p className="text-xs text-gray-500 mt-2">Image failed to load</p>
              )}
              {isSuspiciousBackCard(card?.images?.large) && (
                <p className="text-xs text-gray-500 mt-2">API returned back card image</p>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
