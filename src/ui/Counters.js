export function renderScoreProgressBar({ score, target }) {
  const root = document.createElement('div');
  root.className = 'score-progress-bar';
  root.dataset.component = 'score-progress-bar';

  const label = document.createElement('div');
  label.className = 'score-progress-bar__label';
  label.textContent = 'Score';

  const value = document.createElement('div');
  value.className = 'score-progress-bar__value';
  value.textContent = `${score} / ${target}`;

  const track = document.createElement('div');
  track.className = 'score-progress-bar__track';
  const fill = document.createElement('div');
  fill.className = 'score-progress-bar__fill';
  const pct = target > 0 ? Math.min(100, (score / target) * 100) : 0;
  fill.style.width = `${pct}%`;
  track.appendChild(fill);

  root.appendChild(label);
  root.appendChild(value);
  root.appendChild(track);
  return root;
}

export function renderHandsCounter({ handsLeft }) {
  return makeChip('hands-counter', 'Hands', String(handsLeft));
}

export function renderSwapCounter({ swapAttemptsLeft }) {
  return makeChip('swap-counter', 'Swap', String(swapAttemptsLeft));
}

export function renderSwapSelectionCounter({ current, max }) {
  return makeChip(
    'swap-selection-counter',
    'Selected',
    `${current}/${max}`
  );
}

function makeChip(componentClass, labelText, valueText) {
  const root = document.createElement('div');
  root.className = `chip-counter ${componentClass}`;
  root.dataset.component = componentClass;

  const label = document.createElement('div');
  label.className = 'chip-counter__label';
  label.textContent = labelText;

  const value = document.createElement('div');
  value.className = 'chip-counter__value';
  value.textContent = valueText;

  root.appendChild(label);
  root.appendChild(value);
  return root;
}
