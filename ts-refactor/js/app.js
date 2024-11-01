import Store from './store.js';
import View from './view.js';

const players = [
  { id: 1, name: 'Player 1', iconClass: 'fa-x', colorClass: 'turquoise' },
  { id: 2, name: 'Player 2', iconClass: 'fa-o', colorClass: 'yellow' },
  // add more players as needed...
];

function init() {
  const view = new View();
  const store = new Store('t3-storage', players);
  // tab state change
  store.addEventListener('statechange', () => {
    view.render(store.game, store.stats);
  });

  // different tab state changes
  window.addEventListener('storage', () => {
    view.render(store.game, store.stats);
  });

  view.bindResetEvent((event) => {
    store.reset();
  });
  view.bindNewRoundEvent((event) => {
    store.newRound();
  });
  view.bindPlayerMoveEvent((square) => {
    console.log(square);
    
    const existingMove = store.game.currentGameMoves.find(
      (move) => move.squareId === +square.id
    );
    if (existingMove) {
      return;
    }
    // Advance to the next state by pushing a move to the moves array
    store.playerMove(+square.id);
  });

  // initView();
  view.render(store.game, store.stats);
}

window.addEventListener('load', init);
