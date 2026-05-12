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

export function renderLevelCompletePopup({ score, target, levelId, onNextLevel }) {
  return makeEndgamePopup({
    variant: 'win',
    componentName: 'level-complete-popup',
    icon: '🎉',
    title: 'Level Complete',
    subtitle: `Score: ${score} / ${target}`,
    extra: `Level ${levelId} cleared`,
    buttonLabel: 'Next Level',
    onAction: onNextLevel,
  });
}

export function renderGameOverPopup({ score, target, handsUsed, onRestart }) {
  return makeEndgamePopup({
    variant: 'lose',
    componentName: 'game-over-popup',
    icon: '💀',
    title: 'Game Over',
    subtitle: `Score: ${score} / ${target}`,
    extra: `${handsUsed} hand${handsUsed === 1 ? '' : 's'} used — target not reached`,
    buttonLabel: 'Restart',
    onAction: onRestart,
  });
}

function makeEndgamePopup({
  variant,
  componentName,
  icon,
  title,
  subtitle,
  extra,
  buttonLabel,
  onAction,
}) {
  const backdrop = document.createElement('div');
  backdrop.className = 'endgame-backdrop';
  backdrop.dataset.component = `endgame-backdrop-${variant}`;

  const popup = document.createElement('div');
  popup.className = `endgame-popup endgame-popup--${variant}`;
  popup.dataset.component = componentName;

  const iconEl = document.createElement('div');
  iconEl.className = 'endgame-popup__icon';
  iconEl.textContent = icon;
  popup.appendChild(iconEl);

  const titleEl = document.createElement('h2');
  titleEl.className = 'endgame-popup__title';
  titleEl.textContent = title;
  popup.appendChild(titleEl);

  const subtitleEl = document.createElement('div');
  subtitleEl.className = 'endgame-popup__subtitle';
  subtitleEl.textContent = subtitle;
  popup.appendChild(subtitleEl);

  if (extra) {
    const extraEl = document.createElement('div');
    extraEl.className = 'endgame-popup__extra';
    extraEl.textContent = extra;
    popup.appendChild(extraEl);
  }

  const btn = document.createElement('button');
  btn.className = `btn btn--endgame btn--endgame-${variant}`;
  btn.type = 'button';
  btn.textContent = buttonLabel;
  btn.addEventListener('click', () => {
    backdrop.remove();
    onAction();
  });
  popup.appendChild(btn);

  backdrop.appendChild(popup);
  return backdrop;
}
