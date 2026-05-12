export function buildDeck(levelConfig) {
  const deck = [];
  let counter = 0;
  for (const category of levelConfig.categories) {
    for (const word of category.wordsIds) {
      deck.push({
        id: `${category.categoryId}:${word}:${counter++}`,
        word,
        category: category.categoryId,
        bonus: 0,
      });
    }
  }
  return deck;
}

export function shuffle(arr, rng = Math.random) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function applyBonuses(deck, bonusPoints) {
  const n = Math.min(bonusPoints.length, deck.length);
  for (let i = 0; i < n; i++) {
    deck[i].bonus = bonusPoints[i];
  }
  return deck;
}

export function createDeck(levelConfig, rng = Math.random) {
  const deck = buildDeck(levelConfig);
  shuffle(deck, rng);
  applyBonuses(deck, levelConfig.bonus_points || []);
  shuffle(deck, rng);
  return deck;
}

export function drawCard(deck) {
  return deck.shift() || null;
}

export function drawCards(deck, count) {
  const drawn = [];
  for (let i = 0; i < count && deck.length > 0; i++) {
    drawn.push(deck.shift());
  }
  return drawn;
}
