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
    r.includes('rainbow') ||
    r.includes('gold') ||
    r.includes('illustration') ||
    r === 'sec' ||
    r === 'sr' || // One Piece Secret Rare
    r === 'manga' ||
    r === 'ace spec'
  ) {
    return { glowClass: 'rarity-ultra-rare', level: 5, label: 'Ultra Rare' };
  }
  
  // Super Rare / VMAX / VSTAR / GX / EX / Full Art
  if (
    r.includes('super') ||
    r.includes('vmax') ||
    r.includes('vstar') ||
    r.includes('gx') ||
    r.includes('ex') ||
    r.includes('v-union') ||
    r.includes('amazing') ||
    r.includes('full art') ||
    r.includes('trainer gallery') ||
    r.includes('radiant') ||
    r === 'sp' ||
    r === 'double rare'
  ) {
    return { glowClass: 'rarity-rare-holo', level: 4, label: 'Super Rare' };
  }
  
  // Rare Holo / Rare
  if (
    r.includes('holo') || 
    r.includes('reverse') ||
    r === 'r' || 
    r === 'rare' ||
    r === 'promo' ||
    r === 'v' || // Pokemon V
    r === 'shiny' ||
    r === 'shiny rare'
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
 * Helper to determine rarity for cards
 * Uses actual rarity data from API first, then falls back to heuristics
 */
export function getCardRarity(card) {
  // Priority 1: Use explicit rarity field from API
  if (card.rarity) {
    return card.rarity;
  }
  
  // Priority 2: Pokemon specific logic (sometimes missing rarity field, but has subtypes)
  if (card.supertype === 'Pokémon' && card.subtypes) {
    const subs = card.subtypes.map(s => s.toLowerCase());
    if (subs.includes('mega') || subs.includes('vmax') || subs.includes('vstar') || subs.includes('v-union')) return 'Ultra Rare';
    if (subs.includes('ex') || subs.includes('gx')) return 'Super Rare';
    if (subs.includes('v') || subs.includes('break')) return 'Rare Holo';
    if (subs.includes('stage 2')) return 'Rare';
  }
  
  // Priority 3: Pokemon Energy is always common
  if (card.supertype === 'Energy') {
    return 'Common';
  }
  
  // Priority 4: Digimon fallback (often missing rarity)
  if (card.level) {
    const lvl = parseInt(card.level, 10);
    if (lvl >= 6) return 'Secret Rare';
    if (lvl === 5) return 'Super Rare';
    if (lvl === 4) return 'Rare';
    if (lvl === 3) return 'Uncommon';
  }
  
  // Priority 5: Yu-Gi-Oh! - use type as fallback
  if (card.type && card.tcgId === 'yugioh') {
    const type = card.type.toLowerCase();
    if (type.includes('xyz') || type.includes('synchro') || type.includes('fusion')) return 'Rare';
    if (type.includes('effect')) return 'Uncommon';
  }
  
  // Default fallback
  return 'Common';
}
