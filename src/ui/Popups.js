export function renderScorePopup({
  count,
  base,
  bonus,
  total,
  scoreBefore,
  scoreAfter,
  winningCards,
  onDismiss,
}) {
  const root = document.createElement('div');
  root.className = 'score-popup';
  root.dataset.component = 'score-popup';

  const title = document.createElement('div');
  title.className = 'score-popup__title';
  title.textContent = 'Hand scored';
  root.appendChild(title);

  const grid = document.createElement('div');
  grid.className = 'score-popup__grid';

  const cardsLabel = `${count} card${count === 1 ? '' : 's'}`;
  grid.appendChild(makeRow(cardsLabel, `+${base}`));

  if (bonus > 0) {
    const bonusCards = winningCards.filter((c) => c.bonus > 0);
    const breakdown =
      bonusCards.length > 0
        ? bonusCards.map((c) => `+${c.bonus}`).join(' ')
        : '';
    const label = breakdown ? `Bonuses (${breakdown})` : 'Bonuses';
    grid.appendChild(makeRow(label, `+${bonus}`));
  }

  const totalRow = makeRow('Total', `+${total}`);
  totalRow.classList.add('score-popup__row--total');
  grid.appendChild(totalRow);

  root.appendChild(grid);

  const summary = document.createElement('div');
  summary.className = 'score-popup__summary';
  summary.textContent = `Score: ${scoreBefore} → ${scoreAfter}`;
  root.appendChild(summary);

  if (onDismiss) {
    root.addEventListener('click', onDismiss);
    root.classList.add('score-popup--dismissible');
  }

  return root;
}

function makeRow(label, value) {
  const row = document.createElement('div');
  row.className = 'score-popup__row';

  const labelEl = document.createElement('span');
  labelEl.className = 'score-popup__row-label';
  labelEl.textContent = label;

  const valueEl = document.createElement('span');
  valueEl.className = 'score-popup__row-value';
  valueEl.textContent = value;

  row.appendChild(labelEl);
  row.appendChild(valueEl);
  return row;
}
