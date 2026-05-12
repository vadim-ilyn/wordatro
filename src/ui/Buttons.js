export function renderReturnAllButton({ disabled, onClick }) {
  const btn = document.createElement('button');
  btn.className = 'btn btn--return-all';
  btn.dataset.component = 'return-all-button';
  btn.type = 'button';
  btn.title = 'Return all cards to hand';
  btn.textContent = 'Return All';
  btn.disabled = !!disabled;
  if (!disabled) {
    btn.addEventListener('click', onClick);
  }
  return btn;
}

export function renderPlayButton({ disabled, onClick }) {
  const btn = document.createElement('button');
  btn.className = 'btn btn--play';
  btn.dataset.component = 'play-button';
  btn.type = 'button';
  btn.title = 'Play hand';
  btn.textContent = 'Play';
  btn.disabled = !!disabled;
  if (!disabled) {
    btn.addEventListener('click', onClick);
  }
  return btn;
}

export function renderResetButton({ disabled, onClick }) {
  const btn = document.createElement('button');
  btn.className = 'btn btn--reset';
  btn.dataset.component = 'reset-button';
  btn.type = 'button';
  btn.title = 'Return all cards from exchanger to hand';
  btn.textContent = '↻';
  btn.disabled = !!disabled;
  if (!disabled) {
    btn.addEventListener('click', onClick);
  }
  return btn;
}

export function renderReplaceButton({ disabled, onClick }) {
  const btn = document.createElement('button');
  btn.className = 'btn btn--replace';
  btn.dataset.component = 'replace-button';
  btn.type = 'button';
  btn.title = 'Discard cards in exchanger and draw the same number from deck';
  btn.textContent = 'Replace';
  btn.disabled = !!disabled;
  if (!disabled) {
    btn.addEventListener('click', onClick);
  }
  return btn;
}
