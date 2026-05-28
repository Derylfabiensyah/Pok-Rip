/**
 * Helper to get card rarity from standard rarity or infer from Digimon level
 */
export function getCardRarity(card) {
  if (card?.rarity) return card.rarity;
  if (card?.level) {
    if (card.level === 'Lv.7' || card.level === 'Lv.6') return 'Secret Rare';
    if (card.level === 'Lv.5') return 'Super Rare';
    if (card.level === 'Lv.4') return 'Rare';
    return 'Uncommon';
  }
  return 'Common';
}

/**
 * Maps rarity string to glow CSS class and level
 * Works across multiple TCGs
 * @param {string} rarity - The card rarity from API
 * @returns {{ glowClass: string, level: number, label: string }}
 */
export function getRarityGlow(rarity) {
  if (!rarity) {
    return { glowClass: 'glow-common', level: 0, label: 'Common' };
  }

  const rarityLower = rarity.toLowerCase();

  // Level 4 (Highest) - Ultra Rares, Secrets, Special Arts
  if (
    rarityLower.includes('secret') ||
    rarityLower.includes('illustration') ||
    rarityLower.includes('hyper') ||
    rarityLower.includes('rainbow') ||
    rarityLower.includes('gold') ||
    rarityLower.includes('special art') ||
    rarityLower.includes('ultra') ||
    rarityLower === 'sec' || // One Piece / Digimon Secret Rare
    rarityLower === 'sp' ||  // Special
    rarityLower === 'mangas' || 
    rarityLower === 'mythic' // Magic
  ) {
    return { glowClass: 'glow-ultra-rare', level: 4, label: rarity };
  }

  // Level 3 - Super Rares, Holos
  if (
    rarityLower.includes('holo') ||
    rarityLower.includes('amazing') ||
    rarityLower.includes('v ') ||
    rarityLower === 'rare holo' ||
    rarityLower.includes('promo') ||
    rarityLower === 'sr' || // Super Rare (OP, Digimon)
    rarityLower === 'pr'    // Promo
  ) {
    return { glowClass: 'glow-rare-holo', level: 3, label: rarity };
  }

  // Level 2 - Rares
  if (
    rarityLower.includes('rare') || 
    rarityLower === 'r' // Rare (OP, Digimon)
  ) {
    return { glowClass: 'glow-rare', level: 2, label: rarity };
  }

  // Level 1 - Uncommons
  if (
    rarityLower.includes('uncommon') || 
    rarityLower === 'u' // Uncommon (OP, Digimon)
  ) {
    return { glowClass: 'glow-uncommon', level: 1, label: rarity };
  }

  // Level 0 - Commons / Leaders
  // One Piece leaders usually just "L" or "Common" "C"
  return { glowClass: 'glow-common', level: 0, label: rarity || 'Common' };
}

/**
 * Get rarity badge color classes
 */
export function getRarityColor(level) {
  switch (level) {
    case 4: return 'text-yellow-400';
    case 3: return 'text-purple-400';
    case 2: return 'text-blue-400';
    case 1: return 'text-cyan-400';
    default: return 'text-slate-400';
  }
}
