import { GameState, Player } from "./src/types";

export const players: Player[] = [
  { id: 1, name: 'Player 1', iconClass: 'fa-x', colorClass: 'turquoise' },
  { id: 2, name: 'Player 2', iconClass: 'fa-o', colorClass: 'yellow' },
  // add more players as needed...
];
export function deriveGame(state: GameState) {
  const currentPlayer = players[state.currentGameMoves.length % 2];

  // check if there is a winner or tie game
  const winningPatterns = [
    [1, 2, 3],
    [1, 5, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [3, 5, 7],
    [4, 5, 6],
    [7, 8, 9],
  ];
  let winner = null;
  for (const player of players) {
    const selectedSquareIds = state.currentGameMoves
      .filter((move) => move.player.id === player.id)
      .map((move) => move.squareId);
    for (const pattern of winningPatterns) {
      if (pattern.every((p) => selectedSquareIds.includes(p))) {
        winner = player;
        break;
      }
    }
  }
  return {
    currentPlayer,
    currentGameMoves: state.currentGameMoves,
    status: {
      isComplete: winner != null || state.currentGameMoves.length === 9,
      winner,
    },
  };
}
export function deriveStats(state: GameState) {
  return {
    playerWithStats: players.map((player) => {
      const wins = state.history.currentRoundGames.filter(
        (game) => game.status.winner?.id === player.id
      ).length;
      return {
        ...player,
        wins,
      };
    }),
    ties: state.history.currentRoundGames.filter(
      (game) => game.status.winner == null
    ).length,
  };
}
