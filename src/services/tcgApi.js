import { shuffleCards } from '../utils/shuffleCards';

const API_BASE_URL = 'https://www.apitcg.com/api';

/**
 * Fetch random cards for a specific TCG
 * @param {string} tcgId - The ID of the TCG (e.g., 'pokemon', 'one-piece', 'yugioh')
 * @param {number} count - Number of cards to return
 * @returns {Promise<Array>} Array of card objects
 */
export async function fetchRandomCards(tcgId, count = 5) {
  // Special case for Yu-Gi-Oh! using YGOProDeck API
  if (tcgId === 'yugioh') {
    // To avoid rate limiting (status 500/429) from making 5 concurrent requests to randomcard.php,
    // we fetch sequentially or use a small delay, OR we can fetch 5 random cards sequentially.
    const results = [];
    for (let i = 0; i < count; i++) {
      const res = await fetch('https://db.ygoprodeck.com/api/v7/randomcard.php');
      if (!res.ok) throw new Error(`YGO API failed with status ${res.status}`);
      const data = await res.json();
      results.push(data);
      // tiny delay to prevent rate limit issues
      if (i < count - 1) await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    return results.map(card => {
      const cardData = card.data ? card.data[0] : card;
      
      return {
        id: cardData.id,
        name: cardData.name,
        rarity: cardData.card_sets?.[0]?.set_rarity || cardData.type,
        images: {
          small: cardData.card_images?.[0]?.image_url_small,
          large: cardData.card_images?.[0]?.image_url
        },
        type: cardData.type,
        race: cardData.race,
        attribute: cardData.attribute,
        level: cardData.level,
        atk: cardData.atk,
        def: cardData.def,
        desc: cardData.desc,
        tcgId: 'yugioh'
      };
    });
  }

  const apiKey = import.meta.env.VITE_TCG_API_KEY;

  if (!apiKey) {
    throw new Error('API Key is missing. Please add VITE_TCG_API_KEY to your .env file.');
  }

  // Use page=1 and limit=100 for all TCGs, then shuffle. 
  // This avoids status 500/404 errors for TCGs like Dragon Ball that don't have many pages.
  const url = `${API_BASE_URL}/${tcgId}/cards?page=1&limit=100`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const result = await response.json();

  if (!result.data || result.data.length === 0) {
    throw new Error(`No cards found for ${tcgId}`);
  }

  // Bypass hotlink protection for One Piece images using a free image proxy
  const processedData = result.data.map(card => {
    const processedCard = { ...card, tcgId };
    if (processedCard.images) {
      const fixUrl = (url) => {
        if (!url) return url;
        if (url.includes('en.onepiece-cardgame.com')) {
          const cleanUrl = url.replace(/^https?:\/\//, '');
          return `https://wsrv.nl/?url=${encodeURIComponent(cleanUrl)}`;
        }
        return url;
      };
      processedCard.images = {
        ...processedCard.images,
        small: fixUrl(processedCard.images.small),
        large: fixUrl(processedCard.images.large)
      };
    }
    return processedCard;
  });

  // Shuffle and pick the requested number of cards
  const shuffled = shuffleCards(processedData);
  return shuffled.slice(0, count);
}
