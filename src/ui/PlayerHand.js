import { renderWordCard } from './WordCard.js';
import { makeDraggable, makeDropTarget } from './DragDrop.js';

export function renderPlayerHand(state, handlers) {
  const root = document.createElement('div');
  root.className = 'player-hand';
  root.dataset.component = 'player-hand';

  const label = document.createElement('div');
  label.className = 'player-hand__label';
  label.textContent = 'Hand';
  root.appendChild(label);

  const cardsRow = document.createElement('div');
  cardsRow.className = 'player-hand__cards';
  cardsRow.dataset.component = 'player-hand-cards';

  for (const card of state.playerHand) {
    const cardEl = renderWordCard(card, { state: 'inHand' });
    makeDraggable(cardEl, { cardId: card.id, from: 'hand' });
    cardsRow.appendChild(cardEl);
  }

  makeDropTarget(cardsRow, {
    accepts: (ctx) =>
      ctx.from &&
      (ctx.from.startsWith('slot:') || ctx.from === 'exchanger'),
    onDrop: (ctx) => handlers.onDropOnHand(ctx),
  });

  root.appendChild(cardsRow);
  return root;
}
