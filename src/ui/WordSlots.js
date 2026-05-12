import { renderWordCard } from './WordCard.js';
import { makeDraggable, makeDropTarget } from './DragDrop.js';

export function renderWordSlots(state, handlers) {
  const root = document.createElement('div');
  root.className = 'word-slots';
  root.dataset.component = 'word-slots';

  for (let i = 0; i < state.wordSlots.length; i++) {
    const slot = document.createElement('div');
    slot.className = 'word-slot';
    slot.dataset.component = 'word-slot';
    slot.dataset.slotIndex = String(i);

    const card = state.wordSlots[i];
    if (card) {
      slot.dataset.state = 'filled';
      const losing = state.losingCardIds?.has(card.id) ?? false;
      const cardEl = renderWordCard(card, { state: 'onBoard', losing });
      if (!losing) {
        makeDraggable(cardEl, { cardId: card.id, from: `slot:${i}` });
        cardEl.addEventListener('click', () => handlers.onSlotCardClick(i));
      }
      slot.appendChild(cardEl);
    } else {
      slot.dataset.state = 'empty';
    }

    makeDropTarget(slot, {
      accepts: (ctx) => {
        if (ctx.from === `slot:${i}`) return false;
        return state.wordSlots[i] === null;
      },
      onDrop: (ctx) => handlers.onDropOnSlot(ctx, i),
    });

    root.appendChild(slot);
  }

  return root;
}
