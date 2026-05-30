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
    try {
      // Fetch a batch of random cards at once to avoid rate limiting
      const res = await fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php?num=50&offset=0&sort=random');
      
      if (!res.ok) {
        throw new Error(`YGO API failed with status ${res.status}`);
      }
      
      const data = await res.json();
      
      if (!data.data || data.data.length === 0) {
        throw new Error('No Yu-Gi-Oh! cards found');
      }
      
      // Shuffle and take the requested count
      const shuffled = shuffleCards(data.data);
      const selectedCards = shuffled.slice(0, count);
      
      return selectedCards.map(cardData => {
        return {
          id: cardData.id,
          name: cardData.name,
          rarity: cardData.card_sets?.[0]?.set_rarity || cardData.type || 'Common',
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
    } catch (error) {
      console.error('Yu-Gi-Oh! API Error:', error);
      throw new Error(`Failed to fetch Yu-Gi-Oh! cards: ${error.message}`);
    }
  }

  const apiKey = import.meta.env.VITE_TCG_API_KEY;

  if (!apiKey) {
    throw new Error('API Key is missing. Please add VITE_TCG_API_KEY to your .env file.');
  }

  try {
    // Try different strategies based on TCG
    let url;
    let limit = 100;
    
    // Dragon Ball has fewer cards and API issues, use very small limit
    if (tcgId === 'dragon-ball-fusion-world') {
      limit = 10; // Very small limit
    }
    
    url = `${API_BASE_URL}/${tcgId}/cards?page=1&limit=${limit}`;

    console.log(`Fetching ${tcgId} cards with limit=${limit}...`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error(`First attempt failed with status ${response.status}`);
      
      // If first attempt fails, try with even smaller limit
      if (limit > 5) {
        console.log(`Retrying ${tcgId} with limit=5...`);
        const retryUrl = `${API_BASE_URL}/${tcgId}/cards?page=1&limit=5`;
        const retryResponse = await fetch(retryUrl, {
          method: 'GET',
          headers: {
            'x-api-key': apiKey,
            'Content-Type': 'application/json'
          }
        });
        
        if (!retryResponse.ok) {
          console.error(`Retry also failed with status ${retryResponse.status}`);
          throw new Error(`API request failed with status ${retryResponse.status}. The ${tcgId} API may be temporarily unavailable.`);
        }
        
        const retryResult = await retryResponse.json();
        if (!retryResult.data || retryResult.data.length === 0) {
          throw new Error(`No cards found for ${tcgId}`);
        }
        
        console.log(`Retry succeeded! Got ${retryResult.data.length} cards`);
        return processCards(retryResult.data, tcgId, count);
      }
      
      throw new Error(`API request failed with status ${response.status}. The ${tcgId} API may be temporarily unavailable.`);
    }

    const result = await response.json();

    if (!result.data || result.data.length === 0) {
      throw new Error(`No cards found for ${tcgId}`);
    }

    console.log(`Success! Got ${result.data.length} cards`);
    return processCards(result.data, tcgId, count);
  } catch (error) {
    console.error(`Error fetching ${tcgId} cards:`, error);
    throw new Error(`Failed to fetch ${tcgId} cards: ${error.message}`);
  }
}

// Helper function to check if a card image URL is a back card
function isBackCardUrl(url) {
  if (!url) return true;
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
}

// Helper function to process cards
function processCards(cards, tcgId, count) {
  // FILTER OUT cards with back card images BEFORE processing
  const validCards = cards.filter(card => {
    // Must have card object
    if (!card) {
      return false;
    }
    
    // Must have valid image URL
    if (!card.images || !card.images.large) {
      console.log(`Filtering out card without image: ${card.name || 'Unknown'}`);
      return false;
    }
    
    // Must NOT be a back card URL
    if (isBackCardUrl(card.images.large)) {
      console.log(`Filtering out back card: ${card.name || 'Unknown'} - ${card.images.large}`);
      return false;
    }
    
    return true;
  });
  
  console.log(`Filtered ${cards.length} cards down to ${validCards.length} valid cards`);
  
  // If we don't have enough valid cards, we need more from API
  if (validCards.length < count) {
    console.warn(`Only ${validCards.length} valid cards available, requested ${count}`);
  }
  
  // Bypass hotlink protection for One Piece images using a free image proxy
  const processedData = validCards.map(card => {
    const processedCard = { ...card, tcgId };
    
    // Ensure rarity field is preserved with fallback
    if (!processedCard.rarity) {
      processedCard.rarity = card.rarity || card.type || 'Common';
    }
    
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
