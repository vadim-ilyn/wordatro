export function groupByCategory(cards) {
  const map = new Map();
  for (const c of cards) {
    if (!map.has(c.category)) map.set(c.category, []);
    map.get(c.category).push(c);
  }
  return map;
}

export function determineWinner(cards) {
  if (!cards || cards.length === 0) return null;

  const groups = groupByCategory(cards);

  let maxCount = 0;
  for (const arr of groups.values()) {
    if (arr.length > maxCount) maxCount = arr.length;
  }

  const candidates = [];
  for (const [category, arr] of groups) {
    if (arr.length === maxCount) {
      candidates.push({
        category,
        cards: arr,
        bonusSum: arr.reduce((s, c) => s + c.bonus, 0),
      });
    }
  }

  if (candidates.length === 1) return candidates[0];

  candidates.sort((a, b) => b.bonusSum - a.bonusSum);
  return candidates[0];
}

export function calculatePoints(winningCards, pointsProgression) {
  const count = winningCards.length;
  if (count === 0) {
    return { base: 0, bonus: 0, total: 0, count: 0 };
  }
  const idx = Math.min(count - 1, pointsProgression.length - 1);
  const base = pointsProgression[idx];
  const bonus = winningCards.reduce((s, c) => s + c.bonus, 0);
  return { base, bonus, total: base + bonus, count };
}
