const API_BASE_URL = 'https://api.pokemontcg.io/v2/cards';

/**
 * Fetch random Pokemon cards from the TCG API.
 * Picks a random page to get varied results each time.
 * @param {number} count - Number of cards to fetch
 * @returns {Promise<Array>} Array of card objects
 */
export async function fetchRandomCards(count = 5) {
  // Pick a random page for variety (API has many pages)
  const randomPage = Math.floor(Math.random() * 50) + 1;

  const response = await fetch(
    `${API_BASE_URL}?page=${randomPage}&pageSize=30&select=id,name,images,hp,types,rarity,set`
  );

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const data = await response.json();

  if (!data.data || data.data.length === 0) {
    throw new Error('No cards found from API');
  }

  // Shuffle and pick the requested number of cards
  const shuffled = shuffleArray(data.data);
  return shuffled.slice(0, count);
}

/**
 * Fisher-Yates shuffle
 */
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
