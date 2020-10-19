import keypress from 'keypress';
import Game from "./engine/game";

keypress(process.stdin);


/**
 * The code in this file is used to run your game in the console. Use it
 * to help develop your game engine.
 *
 */

let game = new Game(4);
console.log(game.toString());

// game.onMove(gameState => {
//     console.log(game.toString());
// });

// game.onWin(gameState => {
//     console.log('You won with a gameState of...', gameState)
// });

// game.onLose(gameState => {
//     console.log('You lost! :(', gameState)
//     console.log(`Your score was ${gameState.score}`);
// });

process.stdin.on('keypress', function (ch, key) {
    switch (key.name) {
        case 'right':
            game.move('right');
            console.log(game.toString());
            break;
        case 'left':
            game.move('left');
            console.log(game.toString());
            break;
        case 'down':
            game.move('down');
            console.log(game.toString());
            break;
        case 'up':
            game.move('up');
            console.log(game.toString());
            break;
    }
    if (key && key.ctrl && key.name == 'c') {
        process.stdin.pause();
    }
});


process.stdin.setRawMode(true);
process.stdin.resume();

