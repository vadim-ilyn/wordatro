export function renderScoreProgressBar({ score, target }) {
  const root = document.createElement('div');
  root.className = 'score-progress-bar';
  root.dataset.component = 'score-progress-bar';

  const label = document.createElement('div');
  label.className = 'score-progress-bar__label';
  label.textContent = 'Score';
  root.appendChild(label);

  const value = document.createElement('div');
  value.className = 'score-progress-bar__value';
  root.appendChild(value);

  const track = document.createElement('div');
  track.className = 'score-progress-bar__track';
  const fill = document.createElement('div');
  fill.className = 'score-progress-bar__fill';
  track.appendChild(fill);
  root.appendChild(track);

  updateScoreProgressBar(root, { score, target });
  return root;
}

export function updateScoreProgressBar(root, { score, target }) {
  const valueEl = root.querySelector('.score-progress-bar__value');
  const fillEl = root.querySelector('.score-progress-bar__fill');
  const newText = `${score} / ${target}`;
  if (valueEl.textContent !== newText) {
    valueEl.textContent = newText;
    flash(valueEl, 'value-changed');
  }
  const pct = target > 0 ? Math.min(100, (score / target) * 100) : 0;
  fillEl.style.width = `${pct}%`;
}

export function renderHandsCounter({ handsLeft }) {
  return makeChip('hands-counter', 'Hands', String(handsLeft));
}

export function updateHandsCounter(root, { handsLeft }) {
  updateChip(root, String(handsLeft));
}

export function renderSwapCounter({ swapAttemptsLeft }) {
  return makeChip('swap-counter', 'Swap', String(swapAttemptsLeft));
}

export function updateSwapCounter(root, { swapAttemptsLeft }) {
  updateChip(root, String(swapAttemptsLeft));
}

export function renderSwapSelectionCounter({ current, max }) {
  return makeChip(
    'swap-selection-counter',
    'Selected',
    `${current}/${max}`
  );
}

export function updateSwapSelectionCounter(root, { current, max }) {
  updateChip(root, `${current}/${max}`);
}

function makeChip(componentClass, labelText, valueText) {
  const root = document.createElement('div');
  root.className = `chip-counter ${componentClass}`;
  root.dataset.component = componentClass;

  const label = document.createElement('div');
  label.className = 'chip-counter__label';
  label.textContent = labelText;
  root.appendChild(label);

  const value = document.createElement('div');
  value.className = 'chip-counter__value';
  value.textContent = valueText;
  root.appendChild(value);
  return root;
}

function updateChip(root, valueText) {
  const valueEl = root.querySelector('.chip-counter__value');
  if (valueEl.textContent !== valueText) {
    valueEl.textContent = valueText;
    flash(valueEl, 'tick');
  }
}

function flash(el, className) {
  el.classList.remove(className);
  void el.offsetWidth;
  el.classList.add(className);
}
