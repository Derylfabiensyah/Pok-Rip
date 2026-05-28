/**
 * Maps rarity string to neo-brutalism CSS class and level
 * Works across multiple TCGs
 * @param {string} rarity - The card rarity from API
 * @returns {{ glowClass: string, level: number, label: string }}
 */
export function getRarityGlow(rarity) {
  if (!rarity) return { glowClass: 'rarity-common', level: 1, label: 'Common' };

  const r = rarity.toLowerCase();
  
  // Ultra Rare / Secret Rare / Alternate Art / Special
  if (
    r.includes('secret') || 
    r.includes('ultra') || 
    r.includes('alt') ||
    r.includes('special') ||
    r.includes('starlight') ||
    r.includes('ghost') ||
    r.includes('ultimate') ||
    r.includes('prismatic') ||
    r.includes('hyper') ||
    r === 'sec' ||
    r === 'sr' || // One Piece Secret Rare
    r === 'manga'
  ) {
    return { glowClass: 'rarity-ultra-rare', level: 5, label: 'Ultra Rare' };
  }
  
  // Super Rare / VMAX / VSTAR / GX / EX
  if (
    r.includes('super') ||
    r.includes('vmax') ||
    r.includes('vstar') ||
    r.includes('gx') ||
    r.includes('ex') ||
    r.includes('v-union') ||
    r.includes('amazing') ||
    r === 'sp'
  ) {
    return { glowClass: 'rarity-rare-holo', level: 4, label: 'Super Rare' };
  }
  
  // Rare Holo / Rare
  if (
    r.includes('holo') || 
    r === 'r' || 
    r === 'rare' ||
    r === 'promo' ||
    r === 'v' // Pokemon V
  ) {
    return { glowClass: 'rarity-rare', level: 3, label: 'Rare' };
  }
  
  // Uncommon
  if (
    r.includes('uncommon') || 
    r === 'uc' || 
    r === 'u'
  ) {
    return { glowClass: 'rarity-uncommon', level: 2, label: 'Uncommon' };
  }
  
  // Default Common
  return { glowClass: 'rarity-common', level: 1, label: 'Common' };
}

/**
 * Gets a text color class for rarity display
 */
export function getRarityColor(level) {
  switch (level) {
    case 5: return 'text-amber-500 font-bold'; // Ultra Rare
    case 4: return 'text-purple-500 font-bold'; // Super Rare
    case 3: return 'text-blue-500 font-semibold'; // Rare
    case 2: return 'text-cyan-600 font-semibold'; // Uncommon
    default: return 'text-gray-600 font-medium'; // Common
  }
}

/**
 * Helper to determine rarity for cards that don't have a clear rarity field
 * Specifically handles Pokemon subtypes and Digimon levels
 */
export function getCardRarity(card) {
  // If explicitly provided
  if (card.rarity) {
    return card.rarity;
  }
  
  // Pokemon specific logic (sometimes missing rarity field, but has subtypes)
  if (card.supertype === 'Pokémon' && card.subtypes) {
    const subs = card.subtypes.map(s => s.toLowerCase());
    if (subs.includes('mega') || subs.includes('vmax') || subs.includes('vstar') || subs.includes('v-union')) return 'Ultra Rare';
    if (subs.includes('ex') || subs.includes('gx')) return 'Super Rare';
    if (subs.includes('v') || subs.includes('break')) return 'Rare Holo';
    if (subs.includes('stage 2')) return 'Rare';
  }
  
  // Pokemon Energy is always common
  if (card.supertype === 'Energy') {
    return 'Common';
  }
  
  // Digimon fallback (often missing rarity)
  if (card.level) {
    const lvl = parseInt(card.level, 10);
    if (lvl >= 6) return 'Secret Rare';
    if (lvl === 5) return 'Super Rare';
    if (lvl === 4) return 'Rare';
    if (lvl === 3) return 'Uncommon';
  }
  
  return 'Common';
}
