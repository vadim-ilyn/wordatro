import { loadGameConfig, loadLevelConfig } from './game/LevelLoader.js';
import { createGameState, Phase } from './game/GameState.js';
import { createDeck, drawCards } from './game/Deck.js';
import { determineWinner, calculatePoints } from './game/Scoring.js';
import { renderPlayerHand } from './ui/PlayerHand.js';
import { renderWordSlots } from './ui/WordSlots.js';
import { renderExchanger } from './ui/Exchanger.js';
import { renderDeckView, updateDeckCounter } from './ui/DeckView.js';
import {
  renderReturnAllButton,
  renderPlayButton,
  renderResetButton,
  renderReplaceButton,
} from './ui/Buttons.js';
import {
  renderScoreProgressBar,
  renderHandsCounter,
  renderSwapCounter,
  renderSwapSelectionCounter,
} from './ui/Counters.js';
import { renderScorePopup } from './ui/Popups.js';

const STARTING_LEVEL_ID = 1;
const LOSING_MARK_DELAY_MS = 1000;
const SCORE_POPUP_VISIBLE_MS = 3500;

function dealStartingHand(state) {
  const need = state.config.startHandSize - state.playerHand.length;
  const drawn = drawCards(state.deck, need);
  state.playerHand.push(...drawn);
  return drawn;
}

function isBoardEmpty(state) {
  return state.wordSlots.every((c) => c === null);
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function showScorePopup(view, breakdown) {
  return new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      popup.remove();
      clearTimeout(timeoutId);
      resolve();
    };
    const popup = renderScorePopup({ ...breakdown, onDismiss: finish });
    view.popupLayer.appendChild(popup);
    const timeoutId = setTimeout(finish, SCORE_POPUP_VISIBLE_MS);
  });
}

function makeHandlers(state, view) {
  const isPlayerTurn = () => state.phase === Phase.PLAYER_TURN;

  return {
    onDropOnSlot: (ctx, slotIndex) => {
      if (!isPlayerTurn()) return;
      if (state.wordSlots[slotIndex] !== null) return;
      if (ctx.from === 'hand') {
        const idx = state.playerHand.findIndex((c) => c.id === ctx.cardId);
        if (idx === -1) return;
        const [card] = state.playerHand.splice(idx, 1);
        state.wordSlots[slotIndex] = card;
      } else if (ctx.from && ctx.from.startsWith('slot:')) {
        const fromIdx = Number(ctx.from.slice(5));
        if (fromIdx === slotIndex) return;
        const card = state.wordSlots[fromIdx];
        if (!card) return;
        state.wordSlots[fromIdx] = null;
        state.wordSlots[slotIndex] = card;
      } else {
        return;
      }
      render(state, view);
    },

    onDropOnHand: (ctx) => {
      if (!isPlayerTurn()) return;
      if (ctx.from && ctx.from.startsWith('slot:')) {
        const fromIdx = Number(ctx.from.slice(5));
        const card = state.wordSlots[fromIdx];
        if (!card) return;
        state.wordSlots[fromIdx] = null;
        state.playerHand.push(card);
      } else if (ctx.from === 'exchanger') {
        const idx = state.exchanger.findIndex((c) => c.id === ctx.cardId);
        if (idx === -1) return;
        const [card] = state.exchanger.splice(idx, 1);
        state.playerHand.push(card);
      } else {
        return;
      }
      render(state, view);
    },

    onSlotCardClick: (slotIndex) => {
      if (!isPlayerTurn()) return;
      const card = state.wordSlots[slotIndex];
      if (!card) return;
      state.wordSlots[slotIndex] = null;
      state.playerHand.push(card);
      render(state, view);
    },

    onReturnAll: () => {
      if (!isPlayerTurn()) return;
      for (let i = 0; i < state.wordSlots.length; i++) {
        const card = state.wordSlots[i];
        if (card) {
          state.playerHand.push(card);
          state.wordSlots[i] = null;
        }
      }
      render(state, view);
    },

    onDropOnExchanger: (ctx) => {
      if (!isPlayerTurn()) return;
      if (ctx.from !== 'hand') return;
      if (state.exchanger.length >= state.config.maxCardsReplaceCount) return;
      const idx = state.playerHand.findIndex((c) => c.id === ctx.cardId);
      if (idx === -1) return;
      const [card] = state.playerHand.splice(idx, 1);
      state.exchanger.push(card);
      render(state, view);
    },

    onExchangerCardClick: (cardId) => {
      if (!isPlayerTurn()) return;
      const idx = state.exchanger.findIndex((c) => c.id === cardId);
      if (idx === -1) return;
      const [card] = state.exchanger.splice(idx, 1);
      state.playerHand.push(card);
      render(state, view);
    },

    onReset: () => {
      if (!isPlayerTurn()) return;
      while (state.exchanger.length > 0) {
        state.playerHand.push(state.exchanger.shift());
      }
      render(state, view);
    },

    onReplace: () => {
      if (!isPlayerTurn()) return;
      if (state.exchanger.length === 0) return;
      if (state.replaceAttemptsLeft <= 0) return;
      const discarded = state.exchanger.splice(0);
      const drawn = drawCards(state.deck, discarded.length);
      state.playerHand.push(...drawn);
      state.replaceAttemptsLeft -= 1;
      console.log(
        `[Exchanger] replace ${discarded.length}: ${discarded.map((c) => c.word).join(', ')} → ${drawn.map((c) => c.word).join(', ') || '— (deck empty)'}; swap left ${state.replaceAttemptsLeft}; deck ${state.deck.length}/${state.totalDeckSize}`
      );
      render(state, view);
    },

    onPlay: async () => {
      if (!isPlayerTurn()) return;
      const onBoard = state.wordSlots.filter((c) => c !== null);
      if (onBoard.length === 0) return;

      state.phase = Phase.SCORING;

      const winner = determineWinner(onBoard);
      const winnerIds = new Set(winner.cards.map((c) => c.id));
      const losers = onBoard.filter((c) => !winnerIds.has(c.id));
      state.losingCardIds = new Set(losers.map((c) => c.id));

      console.groupCollapsed(
        `%c[Play] Hand #${state.config.handsCount - state.handsLeft + 1}`,
        'color:#3D8FCC;font-weight:bold'
      );
      console.log(
        'on board:',
        onBoard.map((c) => `${c.word}[${c.category}${c.bonus ? '+' + c.bonus : ''}]`)
      );
      console.log(
        `winner: ${winner.category} (${winner.cards.length} cards, bonusSum=${winner.bonusSum})`
      );
      console.log('winning cards:', winner.cards.map((c) => c.word));
      console.log('losing cards:', losers.map((c) => c.word));

      render(state, view);

      await wait(LOSING_MARK_DELAY_MS);

      for (let i = 0; i < state.wordSlots.length; i++) {
        const c = state.wordSlots[i];
        if (c && state.losingCardIds.has(c.id)) {
          state.wordSlots[i] = null;
        }
      }
      state.losingCardIds = new Set();
      render(state, view);

      const points = calculatePoints(winner.cards, state.config.pointsProgression);
      const scoreBefore = state.score;
      const scoreAfter = scoreBefore + points.total;

      console.log(
        `points: base ${points.base} + bonus ${points.bonus} = ${points.total} → score ${scoreBefore} → ${scoreAfter} / ${state.level.targetPoints}`
      );

      await showScorePopup(view, {
        count: points.count,
        base: points.base,
        bonus: points.bonus,
        total: points.total,
        scoreBefore,
        scoreAfter,
        winningCards: winner.cards,
      });

      state.score = scoreAfter;

      for (let i = 0; i < state.wordSlots.length; i++) {
        state.wordSlots[i] = null;
      }

      state.handsLeft -= 1;

      state.phase = Phase.REFILL;
      const refillNeed = state.config.startHandSize - state.playerHand.length;
      const refilled = drawCards(state.deck, refillNeed);
      state.playerHand.push(...refilled);
      console.log(
        `refill: drew ${refilled.length} (${refilled.map((c) => c.word).join(', ') || '—'}); deck ${state.deck.length}/${state.totalDeckSize}; handsLeft ${state.handsLeft}`
      );

      if (state.score >= state.level.targetPoints) {
        state.phase = Phase.LEVEL_COMPLETE;
        console.log(
          '%c🎉 LEVEL COMPLETE',
          'color:#E8A02D;font-weight:bold;font-size:14px'
        );
      } else if (state.handsLeft <= 0) {
        state.phase = Phase.GAME_OVER;
        console.log(
          '%c💀 GAME OVER',
          'color:#c64a4a;font-weight:bold;font-size:14px'
        );
      } else {
        state.phase = Phase.PLAYER_TURN;
      }
      console.groupEnd();

      render(state, view);
    },
  };
}

function render(state, view) {
  const lockedForPlay = state.phase !== Phase.PLAYER_TURN;
  const boardEmpty = isBoardEmpty(state);
  const exchangerEmpty = state.exchanger.length === 0;
  const noSwapAttempts = state.replaceAttemptsLeft <= 0;

  view.handArea.replaceChildren(renderPlayerHand(state, view.handlers));
  view.slotsArea.replaceChildren(renderWordSlots(state, view.handlers));
  view.exchangerArea.replaceChildren(renderExchanger(state, view.handlers));

  view.playArea.replaceChildren(
    renderPlayButton({
      disabled: lockedForPlay || boardEmpty,
      onClick: view.handlers.onPlay,
    })
  );
  view.returnAllArea.replaceChildren(
    renderReturnAllButton({
      disabled: lockedForPlay || boardEmpty,
      onClick: view.handlers.onReturnAll,
    })
  );
  view.resetArea.replaceChildren(
    renderResetButton({
      disabled: lockedForPlay || exchangerEmpty,
      onClick: view.handlers.onReset,
    })
  );
  view.replaceArea.replaceChildren(
    renderReplaceButton({
      disabled: lockedForPlay || exchangerEmpty || noSwapAttempts,
      onClick: view.handlers.onReplace,
    })
  );

  view.scoreArea.replaceChildren(
    renderScoreProgressBar({
      score: state.score,
      target: state.level.targetPoints,
    })
  );
  view.handsArea.replaceChildren(
    renderHandsCounter({ handsLeft: state.handsLeft })
  );
  view.swapCounterArea.replaceChildren(
    renderSwapCounter({ swapAttemptsLeft: state.replaceAttemptsLeft })
  );
  view.swapSelectionArea.replaceChildren(
    renderSwapSelectionCounter({
      current: state.exchanger.length,
      max: state.config.maxCardsReplaceCount,
    })
  );

  updateDeckCounter(view.deckView, state.deck.length, state.totalDeckSize);
}

async function bootstrap() {
  const statusEl = document.getElementById('boot-status');
  const handArea = document.getElementById('hand-area');
  const slotsArea = document.getElementById('slots-area');
  const deckArea = document.getElementById('deck-area');
  const returnAllArea = document.getElementById('returnall-area');
  const playArea = document.getElementById('play-area');
  const scoreArea = document.getElementById('score-area');
  const handsArea = document.getElementById('hands-area');
  const popupLayer = document.getElementById('popup-layer');
  const exchangerArea = document.getElementById('exchanger-area');
  const resetArea = document.getElementById('reset-area');
  const replaceArea = document.getElementById('replace-area');
  const swapCounterArea = document.getElementById('swap-counter-area');
  const swapSelectionArea = document.getElementById('swap-selection-area');
  setStatus(statusEl, 'Loading configs...');

  try {
    const [gameConfig, levelConfig] = await Promise.all([
      loadGameConfig(),
      loadLevelConfig(STARTING_LEVEL_ID),
    ]);

    const state = createGameState({
      gameConfig,
      levelConfig,
      levelId: STARTING_LEVEL_ID,
    });

    state.deck = createDeck(levelConfig);
    state.totalDeckSize = state.deck.length;
    state.losingCardIds = new Set();

    dealStartingHand(state);
    state.phase = Phase.PLAYER_TURN;

    const deckViewEl = renderDeckView({
      remaining: state.deck.length,
      total: state.totalDeckSize,
    });
    deckArea.appendChild(deckViewEl);

    const view = {
      handArea,
      slotsArea,
      returnAllArea,
      playArea,
      scoreArea,
      handsArea,
      popupLayer,
      exchangerArea,
      resetArea,
      replaceArea,
      swapCounterArea,
      swapSelectionArea,
      deckView: deckViewEl,
      handlers: null,
    };
    view.handlers = makeHandlers(state, view);

    render(state, view);

    window.gameState = state;
    window.view = view;
    window.render = () => render(state, view);

    console.log('[Wordatro] Stage 6 ready');
    console.log(
      `  hand: ${state.playerHand.length}, deck: ${state.deck.length}/${state.totalDeckSize}, target: ${state.level.targetPoints}, hands: ${state.handsLeft}, swap attempts: ${state.replaceAttemptsLeft}, max per swap: ${state.config.maxCardsReplaceCount}`
    );
    console.log(
      '  Try: drag a card to the left Exchanger box, click ↻ to return all, or Replace to discard + draw.'
    );

    setStatus(
      statusEl,
      `Stage 6 OK — left column: Swap counter / Reset / Exchanger / Selected / Replace. ` +
        `Drop cards into exchanger, then press Replace.`
    );
  } catch (err) {
    console.error('[Wordatro] bootstrap failed', err);
    setStatus(statusEl, `Bootstrap error: ${err.message}`, 'error');
  }
}

function setStatus(el, text, state) {
  if (!el) return;
  el.textContent = text;
  if (state) {
    el.dataset.state = state;
  } else {
    delete el.dataset.state;
  }
}

bootstrap();
