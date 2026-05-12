export function renderDeckView({ remaining, total, composition }) {
  const root = document.createElement('div');
  root.className = 'deck-view';
  root.dataset.component = 'deck-view';

  if (composition) {
    const label = document.createElement('div');
    label.className = 'deck-view__composition';
    label.dataset.component = 'deck-composition';
    label.textContent = composition;
    root.appendChild(label);
  }

  const stack = document.createElement('div');
  stack.className = 'deck-view__stack';

  for (let i = 0; i < 3; i++) {
    const layer = document.createElement('div');
    layer.className = 'deck-view__layer';
    layer.style.setProperty('--layer-index', String(i));
    stack.appendChild(layer);
  }

  const counter = document.createElement('div');
  counter.className = 'deck-view__counter';
  counter.dataset.component = 'deck-counter';
  counter.textContent = `${remaining}/${total}`;

  root.appendChild(stack);
  root.appendChild(counter);
  return root;
}

export function updateDeckCounter(deckViewEl, remaining, total) {
  const counter = deckViewEl.querySelector('[data-component="deck-counter"]');
  if (!counter) return;
  const newText = `${remaining}/${total}`;
  if (counter.textContent !== newText) {
    counter.textContent = newText;
    counter.classList.remove('tick');
    void counter.offsetWidth;
    counter.classList.add('tick');
  }
}

export function updateDeckComposition(deckViewEl, composition) {
  const label = deckViewEl.querySelector('[data-component="deck-composition"]');
  if (!label) return;
  if (label.textContent !== composition) {
    label.textContent = composition;
  }
}

export function formatComposition(categories) {
  if (!categories || categories.length === 0) return '';
  const counts = categories.map((c) => c.wordsIds.length);
  const allEqual = counts.every((c) => c === counts[0]);
  if (allEqual) {
    return `${categories.length} × ${counts[0]} cards`;
  }
  const total = counts.reduce((a, b) => a + b, 0);
  return `${total} cards / ${categories.length} cats`;
}
