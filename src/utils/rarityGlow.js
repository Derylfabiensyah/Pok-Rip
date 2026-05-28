/**
 * Maps rarity string to glow CSS class and level
 * @param {string} rarity - The card rarity from API
 * @returns {{ glowClass: string, level: number, label: string }}
 */
export function getRarityGlow(rarity) {
  if (!rarity) {
    return { glowClass: 'glow-common', level: 0, label: 'Common' };
  }

  const rarityLower = rarity.toLowerCase();

  if (
    rarityLower.includes('secret') ||
    rarityLower.includes('illustration') ||
    rarityLower.includes('hyper') ||
    rarityLower.includes('rainbow') ||
    rarityLower.includes('gold') ||
    rarityLower.includes('special art') ||
    rarityLower.includes('ultra')
  ) {
    return { glowClass: 'glow-ultra-rare', level: 4, label: rarity };
  }

  if (
    rarityLower.includes('holo') ||
    rarityLower.includes('amazing') ||
    rarityLower.includes('v ') ||
    rarityLower === 'rare holo' ||
    rarityLower.includes('promo')
  ) {
    return { glowClass: 'glow-rare-holo', level: 3, label: rarity };
  }

  if (rarityLower.includes('rare')) {
    return { glowClass: 'glow-rare', level: 2, label: rarity };
  }

  if (rarityLower.includes('uncommon')) {
    return { glowClass: 'glow-uncommon', level: 1, label: rarity };
  }

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
