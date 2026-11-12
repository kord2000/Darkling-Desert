export const gameState = {
  lives: 3,
  keyCount: 10,
  rounds: 1,

  maxRoundTime: 60,
  roundTime: 60,

  currentState: "rewardRound",
};

export const resetGameState = () => {
  gameState.keys = 0;
  gameState.lives = 3;
  gameState.roundTime = 60;
  gameState.maxRoundTime = 60;
  gameState.currentState = "fightRound";
};
