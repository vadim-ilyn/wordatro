export function renderDeckView({ remaining, total }) {
  const root = document.createElement('div');
  root.className = 'deck-view';
  root.dataset.component = 'deck-view';

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
