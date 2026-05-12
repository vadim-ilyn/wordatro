export function getBonusTier(bonus) {
  if (bonus <= 0) return 'none';
  if (bonus <= 5) return 'low';
  if (bonus <= 15) return 'mid';
  if (bonus <= 30) return 'high';
  return 'legendary';
}

export function renderWordCard(card, { state = 'inHand', losing = false } = {}) {
  const el = document.createElement('div');
  el.className = 'word-card';
  el.dataset.component = 'word-card';
  el.dataset.cardId = card.id;
  el.dataset.state = state;
  if (losing) el.dataset.losing = 'true';

  const wordEl = document.createElement('div');
  wordEl.className = 'word-card__word-text';
  wordEl.dataset.component = 'word-card-word-text';
  wordEl.textContent = card.word;
  el.appendChild(wordEl);

  if (card.bonus > 0) {
    const badge = document.createElement('div');
    badge.className = 'word-card__bonus-badge';
    badge.dataset.component = 'word-card-bonus-badge';
    badge.dataset.tier = getBonusTier(card.bonus);
    badge.textContent = `+${card.bonus}`;
    el.appendChild(badge);
  }

  if (losing) {
    const cross = document.createElement('div');
    cross.className = 'word-card__cross';
    cross.textContent = '×';
    el.appendChild(cross);
  }

  return el;
}
