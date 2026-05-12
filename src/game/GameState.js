export const Phase = {
  ROUND_START: 'ROUND_START',
  PLAYER_TURN: 'PLAYER_TURN',
  SCORING: 'SCORING',
  REFILL: 'REFILL',
  CHECK_END: 'CHECK_END',
  LEVEL_COMPLETE: 'LEVEL_COMPLETE',
  GAME_OVER: 'GAME_OVER',
};

export function createGameState({ gameConfig, levelConfig, levelId }) {
  const slotsAmount = gameConfig.play_cards_slots_amount;

  return {
    config: {
      startHandSize: gameConfig.start_hand_size,
      playCardsSlotsAmount: slotsAmount,
      handsCount: gameConfig.hands_count,
      replaceAttemptsCount: gameConfig.replace_attempts_count,
      maxCardsReplaceCount: gameConfig.max_cards_replace_count,
      pointsProgression: gameConfig.points_progression,
    },
    level: {
      id: levelId,
      targetPoints: levelConfig.target_points,
      categories: levelConfig.categories,
      bonusPoints: levelConfig.bonus_points,
    },
    deck: [],
    playerHand: [],
    wordSlots: new Array(slotsAmount).fill(null),
    exchanger: [],
    score: 0,
    handsLeft: gameConfig.hands_count,
    replaceAttemptsLeft: gameConfig.replace_attempts_count,
    phase: Phase.ROUND_START,
  };
}
