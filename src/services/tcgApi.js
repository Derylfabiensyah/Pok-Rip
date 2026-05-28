import { shuffleCards } from '../utils/shuffleCards';

const API_BASE_URL = 'https://www.apitcg.com/api';

/**
 * Fetch random cards for a specific TCG
 * @param {string} tcgId - The ID of the TCG (e.g., 'pokemon', 'one-piece')
 * @param {number} count - Number of cards to return
 * @returns {Promise<Array>} Array of card objects
 */
export async function fetchRandomCards(tcgId, count = 5) {
  const apiKey = import.meta.env.VITE_TCG_API_KEY;

  if (!apiKey) {
    throw new Error('API Key is missing. Please add VITE_TCG_API_KEY to your .env file.');
  }

  // We fetch a page of cards and shuffle them to simulate a random pack
  // The API doesn't have a direct "random" endpoint yet.
  // We'll pick a random page number (e.g., 1-10) to get varied results
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

  // Shuffle and pick the requested number of cards
  const shuffled = shuffleCards(result.data);
  return shuffled.slice(0, count);
}
