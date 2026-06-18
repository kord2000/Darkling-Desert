export const gameState = {
  lives: 1,
  keyCount: 0,
  rounds: 1,

  maxRoundTime: 60,
  roundTime: 60,

  currentState: "fightRound",
};

export const resetGameState = () => {
  gameState.keys = 0;
  gameState.lives = 3;
  gameState.roundTime = 60;
  gameState.maxRoundTime = 60;
  gameState.currentState = "fightRound";
};
