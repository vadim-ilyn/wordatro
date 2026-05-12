import { renderWordCard } from './WordCard.js';
import { makeDraggable, makeDropTarget } from './DragDrop.js';

export function renderExchanger(state, handlers) {
  const root = document.createElement('div');
  root.className = 'exchanger';
  root.dataset.component = 'exchanger';

  const maxCards = state.config.maxCardsReplaceCount;

  for (let i = 0; i < maxCards; i++) {
    const slot = document.createElement('div');
    slot.className = 'exchanger__slot';
    slot.dataset.component = 'exchanger-slot';
    slot.dataset.slotIndex = String(i);

    const card = state.exchanger[i];
    if (card) {
      slot.dataset.state = 'filled';
      const cardEl = renderWordCard(card, { state: 'inExchanger' });
      makeDraggable(cardEl, { cardId: card.id, from: 'exchanger' });
      cardEl.addEventListener('click', () =>
        handlers.onExchangerCardClick(card.id)
      );
      slot.appendChild(cardEl);
    } else {
      slot.dataset.state = 'empty';
    }

    root.appendChild(slot);
  }

  makeDropTarget(root, {
    accepts: (ctx) =>
      ctx.from === 'hand' &&
      state.exchanger.length < maxCards,
    onDrop: (ctx) => handlers.onDropOnExchanger(ctx),
  });

  return root;
}
