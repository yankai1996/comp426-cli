
const game = new Game(4);

function updateUI(gameState) {
    for (let i = 0; i < 16; i++) {
        let tile = gameState.board[i] != 0 ? gameState.board[i] : "";
        $(".grid-cell").eq(i).text(tile);
    }
    $("#score").text(gameState.score);
}

function keydownHandler(e) {
    e.preventDefault();
    const mapKey = {37: "left", 38: "up", 39: "right", 40:"down"};
    if (e.which in mapKey && game.move(mapKey[e.which])) $(document).trigger("move");
}

function newGame() {
    $(".game-message").hide();
    $("#won").hide();
    $("#over").hide();
    game.setupNewGame();
    updateUI(game.getGameState());
    $(document).keydown(keydownHandler);
}


$(".restart-button").click(newGame);

$(document).on("move", () => {
    game.onMove(updateUI);
    if (game.getGameState().won) $(document).trigger("win");
    else if (game.getGameState().over) $(document).trigger("over");
});

$(document).on("win", () => {
    $(".game-message").show();
    $("#won").show();
    $(document).unbind("keydown");
});

$(document).on("over", () => {
    $(".game-message").show();
    $("#over").show();
    $(document).unbind("keydown");
});

newGame();

// game.loadGame({
//     // board: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,1024,1024],
//     board: [0,4,2,4, 2,4,2,4, 4,2,4,2, 2,4,2,4],
//     won:false,
//     score:0,
//     over:false
// })
// updateUI(game.getGameState());