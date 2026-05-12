let dragContext = null;

export function getDragContext() {
  return dragContext;
}

export function makeDraggable(el, payload) {
  el.draggable = true;
  const originalState = el.dataset.state;

  el.addEventListener('dragstart', (e) => {
    dragContext = payload;
    el.dataset.state = 'dragging';
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', payload.cardId || '');
    }
  });

  el.addEventListener('dragend', () => {
    dragContext = null;
    el.dataset.state = originalState;
  });
}

export function makeDropTarget(el, { onDrop, accepts }) {
  el.addEventListener('dragover', (e) => {
    if (!dragContext) return;
    if (accepts && !accepts(dragContext)) return;
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    el.dataset.dropHover = 'true';
  });

  el.addEventListener('dragleave', (e) => {
    if (e.target === el) {
      delete el.dataset.dropHover;
    }
  });

  el.addEventListener('drop', (e) => {
    e.preventDefault();
    delete el.dataset.dropHover;
    const ctx = dragContext;
    if (!ctx) return;
    if (accepts && !accepts(ctx)) return;
    onDrop(ctx);
  });
}
