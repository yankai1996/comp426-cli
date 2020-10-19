class Game {
    constructor(size) {
        this.size = size;
        this.board = [];
        for (let i = 0; i < size; i++) {
            let row = new Array(size).fill(0);
            this.board.push(row);
        }
        this.score = 0;
        this.won = false;
        this.over = false;
        this.setupNewGame();
    }
}
Game.prototype.setupNewGame = function() {
    let tiles = 2;
    let count = this.size ** 2;
    for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
            if (Math.random() < tiles/count ) {
                this.board[i][j] = Math.random() < 0.1 ? 4 : 2;
                tiles--;
            } else {
                this.board[i][j] = 0;
            }
            count--;
        }
    }
    this.score = 0;
    this.won = false;
    this.over = false;
}

Game.prototype.loadGame = function(gameState) {
    for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
            this.board[i][j] = gameState.board[this.size*i + j];
        }
    }
    this.score = gameState.score;
    this.won = gameState.won;
    this.over = gameState.over;
}

Game.prototype.move = function(direction) {
    let moved = false;
    switch (direction) {
        case 'up':
            moved = this.performMove(true, false);
            break;
        case 'down':
            moved = this.performMove(true, true);
            break;
        case 'left':
            moved = this.performMove(false, false);
            break;
        case 'right':
            moved = this.performMove(false, true);
            break;
    }

    if (!moved) return false;

    let zeros = 0;
    for (const row of this.board) {
        for (const tile of row) {
            zeros += tile == 0 ? 1 : 0;
        }
    }
    let added = false;
    for (let i = 0; !added && i < this.size; i++) {
        for (let j = 0; !added && j < this.size; j++) {
            if (this.board[i][j] != 0) continue;
            if (Math.random() < 1/zeros ) {
                this.board[i][j] = Math.random() < 0.1 ? 4 : 2;
                added = true;
            }
            zeros--;
        }
    }

    this.won = this.isWon();
    if (!this.won) this.over = this.isOver();

    return moved;
}

Game.prototype.performMove = function(verticle, reverse) {
    const [start, step] = reverse ? [this.size - 1, -1] : [0, 1];
    let moved = false;
    for (let i = 0; i < this.size; i++) {
        let curr = start;
        let next = start + step;
        while (0 <= next && next < this.size) {
            if (verticle) {
                while (0 <= next && next < this.size && this.board[next][i] == 0) next += step;
                if (next < 0 || next >= this.size) break;
                if (this.board[curr][i] == 0) {
                    this.board[curr][i] = this.board[next][i];
                    this.board[next][i] = 0;
                    moved = true;
                }
                while (0 <= next && next < this.size && this.board[next][i] == 0) next += step;
                if (next < 0 || next >= this.size) break;
                if (this.board[curr][i] == this.board[next][i]) {
                    this.board[curr][i] *= 2;
                    this.score += this.board[curr][i];
                    this.board[next][i] = 0;
                    moved = true;
                }
            } else {
                while (0 <= next && next < this.size && this.board[i][next] == 0) next += step;
                if (next < 0 || next >= this.size) break;
                if (this.board[i][curr] == 0) {
                    this.board[i][curr] = this.board[i][next];
                    this.board[i][next] = 0;
                    moved = true;
                }
                while (0 <= next && next < this.size && this.board[i][next] == 0) next += step;
                if (next < 0 || next >= this.size) break;
                if (this.board[i][curr] == this.board[i][next]) {
                    this.board[i][curr] *= 2;
                    this.score += this.board[i][curr];
                    this.board[i][next] = 0;
                    moved = true;
                }
            }
            curr += step;
            if (curr == next) next += step;
        }
    }
    return moved;
}

Game.prototype.isOver = function() {
    for (let i = 0; i < this.size ; i++) {
        for (let j = 0; j < this.size ; j++) {
            if (this.board[i][j] == 0) return false;
            if (j < this.size - 1 && this.board[i][j] == this.board[i][j+1]) return false;
            if (i < this.size - 1 && this.board[i][j] == this.board[i+1][j]) return false;
        }
    }
    return true;
}

Game.prototype.isWon = function() {
    for (const row of this.board)
        for (const tile of row)
            if (tile == 2048) return true;
    return false;
}

Game.prototype.getGameState = function() {
    let board = [];
    for (const row of this.board) {
        for (const tile of row) {
            board.push(tile);
        }
    }
    return {
        board: board,
        score: this.score,
        won: this.won,
        over: this.over
    };
}

Game.prototype.toString = function() {
    let s = '';
    for (const row of this.board) {
        for (const tile of row) {
            s += `${tile}   `;
        }
        s += '\n';
    }
    s += `Score: ${this.score}\n`;
    if (this.won) s += "Won!\n"
    else if (this.over) s += "Game Over!\n"
    return s;
}

Game.prototype.onMove = function(callback) {
    callback(this.getGameState());
}

Game.prototype.onLose = function(callback) {
    callback(this.getGameState());
}

Game.prototype.onWin = function(callback) {
    callback(this.getGameState());
}
