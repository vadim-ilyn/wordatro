export function renderLevelSelector({ currentLevelId, levels, onSelect }) {
  const root = document.createElement('div');
  root.className = 'level-selector';
  root.dataset.component = 'level-selector';

  const chip = document.createElement('button');
  chip.className = 'level-selector__chip';
  chip.type = 'button';

  const label = document.createElement('span');
  label.className = 'level-selector__label';
  label.textContent = 'Level';

  const value = document.createElement('span');
  value.className = 'level-selector__value';
  value.textContent = String(currentLevelId);

  const caret = document.createElement('span');
  caret.className = 'level-selector__caret';
  caret.textContent = '▾';

  chip.appendChild(label);
  chip.appendChild(value);
  chip.appendChild(caret);
  root.appendChild(chip);

  const menu = document.createElement('ul');
  menu.className = 'level-selector__menu';
  menu.hidden = true;

  for (const level of levels) {
    const item = document.createElement('li');
    item.className = 'level-selector__item';
    if (level.id === currentLevelId) item.dataset.current = 'true';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'level-selector__item-btn';
    btn.textContent = `Level ${level.id}  ·  target ${level.targetPoints}`;
    btn.addEventListener('click', () => {
      closeMenu();
      onSelect(level.id);
    });

    item.appendChild(btn);
    menu.appendChild(item);
  }

  root.appendChild(menu);

  const openMenu = () => {
    menu.hidden = false;
    caret.textContent = '▴';
    root.dataset.open = 'true';
  };
  const closeMenu = () => {
    menu.hidden = true;
    caret.textContent = '▾';
    delete root.dataset.open;
  };

  chip.addEventListener('click', (e) => {
    e.stopPropagation();
    if (menu.hidden) openMenu();
    else closeMenu();
  });

  const onDocClick = (e) => {
    if (!root.isConnected) {
      document.removeEventListener('click', onDocClick);
      return;
    }
    if (!root.contains(e.target)) closeMenu();
  };
  document.addEventListener('click', onDocClick);

  return root;
}
