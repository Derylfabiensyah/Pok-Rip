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
    // We fetch a few random cards at once using the cardinfo endpoint with sort=random
    // Note: YGOProDeck doesn't strictly support limit with random perfectly in v7 in a single call without multiple randomcard.php calls,
    // but we can fetch multiple random cards by just calling randomcard.php multiple times if needed, 
    // or use cardinfo.php?num=count&offset=0&sort=random (Wait, the docs say sort=random doesn't work well with pagination, but let's try calling randomcard multiple times or just a single list fetch for simplicity).
    // Actually, YGOProDeck provides a randomcard endpoint. Let's fetch `count` times.
    const promises = Array.from({ length: count }).map(() =>
      fetch('https://db.ygoprodeck.com/api/v7/randomcard.php').then(res => res.json())
    );
    const results = await Promise.all(promises);
    
    return results.map(card => {
      // Sometimes randomcard returns { data: [...] } instead of the direct card if we use some endpoints, but randomcard.php returns the card directly or wrapped?
      // Our curl showed: {"data":[{"id":66719324,"name":"Rain of Mercy",...}]} for cardinfo with random sort, but randomcard.php usually returns just the object if not v7?
      // Actually, YGOProDeck v7 returns { data: [card] } for randomcard.php too. Let's handle both.
      const cardData = card.data ? card.data[0] : card;
      
      return {
        id: cardData.id,
        name: cardData.name,
        // YGO cards don't have a single rarity, they have sets. We'll pick the first set's rarity, or fallback to type.
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

  const randomPage = Math.floor(Math.random() * 10) + 1;
  const url = `${API_BASE_URL}/${tcgId}/cards?page=${randomPage}&limit=50`;

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
