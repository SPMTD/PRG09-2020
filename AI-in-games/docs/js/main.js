"use strict";
class GameObject extends HTMLElement {
    constructor() {
        super();
        this.pos = [0, 0];
        this.targetPos = [0, 0];
        this.speed = [2, 2];
        this.direction = 1;
        this.moving = false;
        document.body.appendChild(this);
    }
    update() {
        this.moving = false;
        for (let i = 0; i < 2; i++) {
            if (Math.abs(this.targetPos[i] - this.pos[i]) <= this.speed[i]) {
                this.pos[i] = this.targetPos[i];
            }
            else {
                this.moving = true;
            }
        }
        if (this.pos[0] > this.targetPos[0]) {
            this.pos[0] -= this.speed[0];
        }
        else if (this.pos[0] < this.targetPos[0]) {
            this.pos[0] += this.speed[0];
        }
        else if (this.pos[1] > this.targetPos[1]) {
            this.pos[1] -= this.speed[1];
        }
        else if (this.pos[1] < this.targetPos[1]) {
            this.pos[1] += this.speed[1];
        }
        this.style.width = this.width + "px";
        this.style.height = this.height + "px";
        this.style.backgroundSize = this.width + "px " + this.height + "px";
        this.style.transform = "translate(" + this.pos[0] + "px, " + this.pos[1] + "px) scale(" + this.direction + ",1)";
    }
}
class ChessPiece extends GameObject {
    constructor() {
        super();
        this.width = Board.getInstance().getTileSize();
        this.height = Board.getInstance().getTileSize();
    }
    setPosition(pos) {
        this.boardPosition = pos;
        this.targetPos = Board.getInstance().boardToScreenPos(this.boardPosition);
    }
    initPosition(pos) {
        this.setPosition(pos);
        this.pos = Board.getInstance().boardToScreenPos(this.boardPosition);
    }
}
class Tile extends ChessPiece {
    constructor(color) {
        super();
        this.width = Board.getInstance().getTileSize();
        this.height = Board.getInstance().getTileSize();
        this.style.backgroundColor = color;
    }
    update() {
        super.update();
    }
    getMoves() {
        let moves = [];
        return moves;
    }
}
window.customElements.define("tile-component", Tile);
class Board {
    constructor() {
        this.BOARD_SIZE = 8;
        this.tileSize = 100;
        let smallestSide = Math.min(window.innerWidth, window.innerHeight);
        this.tileSize = Math.floor(smallestSide / this.BOARD_SIZE);
    }
    static getInstance() {
        if (Board.instance == null) {
            Board.instance = new Board();
            for (let i = 0; i < Board.getInstance().getSize(); i++) {
                for (let j = 0; j < Board.getInstance().getSize(); j++) {
                    let t = new Tile((i + j) % 2 == 0 ? "#ffffff" : "#000000");
                    t.initPosition([i, j]);
                    t.update();
                }
            }
        }
        return Board.instance;
    }
    legalPosition(pos) {
        return (pos[0] >= 0) && (pos[1] >= 0) && (pos[0] < this.BOARD_SIZE) && (pos[1] < this.BOARD_SIZE);
    }
    getSize() {
        return this.BOARD_SIZE;
    }
    getTileSize() {
        return this.tileSize;
    }
    boardToScreenPos(boardPos) {
        return [boardPos[0] * this.tileSize, boardPos[1] * this.tileSize];
    }
    screenToBoardPos(screenPos) {
        return [Math.floor(screenPos[0] / this.tileSize), Math.floor(screenPos[1] / this.tileSize)];
    }
    static samePosition(a, b) {
        return (a[0] == b[0]) && (a[1] == b[1]);
    }
}
class GameState {
    constructor(kingPos, knightPositions) {
        this.Knightpos = [0, 0];
        this.targetPos = [0, 0];
        this.Knightspeed = [2, 2];
        this.Kingpos = [0, 0];
        this.enemyPos = [0, 0];
        this.Kingpeed = [2, 2];
        this.kingPos = kingPos;
        this.knightPositions = knightPositions;
    }
    getScore() {
        for (let z of this.knightPositions) {
            if (Board.samePosition(z, this.kingPos)) {
                return [-100, true];
            }
        }
        if (this.kingPos[1] == 0) {
            return [100, true];
        }
        for (let i = 0; i < 2; i++) {
            if (Math.abs(this.targetPos[i] - this.Knightpos[i]) <= this.Knightspeed[i]) {
                return [-20, false];
            }
        }
        return [0, false];
    }
    copy() {
        const knightPosCopy = Object.assign([], this.knightPositions);
        return new GameState(this.kingPos, knightPosCopy);
    }
}
class Game {
    constructor() {
        this.knights = [];
        this.gameOver = false;
        this.KNIGHTS = 4;
        this.playerTurn = true;
        Board.getInstance();
        this.king = new King();
        this.king.initPosition([Math.floor(Board.getInstance().getSize() / 2), Board.getInstance().getSize() - 1]);
        let knightPos = [];
        for (let c = 0; c < this.KNIGHTS; c++) {
            let z = new Knight();
            let pos = [Math.floor((c / this.KNIGHTS) * Board.getInstance().getSize()), 0];
            z.initPosition(pos);
            knightPos.push(pos);
            this.knights.push(z);
        }
        this.gameState = new GameState(this.king.boardPosition, knightPos);
        window.addEventListener("click", () => this.onWindowClick());
        this.gameLoop();
    }
    onWindowClick() {
        this.playerMove();
    }
    playerMove() {
        let boardPos = this.king.boardPosition;
        let moving = false;
        for (let go of this.knights) {
            if (go.moving) {
                moving = true;
            }
        }
        if ((this.playerTurn) && (!moving) && (!this.gameOver)) {
            console.log(boardPos);
            GameAI.moveKing(this.king, this.knights, this.gameState);
            this.playerTurn = false;
        }
        else {
            console.log("Not player turn, yet");
        }
    }
    gameLoop() {
        this.king.update();
        for (let go of this.knights) {
            go.update();
        }
        if (!this.playerTurn) {
            GameAI.moveKnight(this.king, this.knights, this.gameState);
            this.playerTurn = true;
            if (this.gameState.getScore()[1]) {
                console.log("You have lost!");
                this.gameOver = true;
            }
        }
        requestAnimationFrame(() => this.gameLoop());
    }
}
console.log("Start AI Chess");
window.addEventListener("load", () => new Game());
class Knight extends ChessPiece {
    getMoves(from = this.boardPosition) {
        let moves = [];
        for (let i = -2; i < 3; i++) {
            for (let j = -2; j < 3; j++) {
                if ((Math.abs(i) == Math.abs(j)) || (i == 0) || (j == 0)) {
                    continue;
                }
                let newPos = [from[0] + i, from[1] + j];
                if (Board.getInstance().legalPosition(newPos)) {
                    moves.push(newPos);
                }
            }
        }
        return moves;
    }
}
window.customElements.define("knight-component", Knight);
class King extends ChessPiece {
    getMoves(from = this.boardPosition) {
        let moves = [];
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                if ((i == 0) && (j == 0)) {
                    continue;
                }
                let newPos = [from[0] + i, from[1] + j];
                if (Board.getInstance().legalPosition(newPos)) {
                    moves.push(newPos);
                }
            }
        }
        return moves;
    }
}
window.customElements.define("king-component", King);
class GameAI {
    static moveKnight(king, knights, gameState) {
        let t0 = performance.now();
        console.log(king);
        let i = Math.floor(Math.random() * Math.floor(knights.length));
        let legalMovesKnight = knights[i].getMoves();
        console.log(legalMovesKnight);
        let j = Math.floor(Math.random() * Math.floor(legalMovesKnight.length));
        knights[i].setPosition(legalMovesKnight[j]);
        gameState.knightPositions[i] = legalMovesKnight[j];
        let t1 = performance.now();
        console.log("Knight AI move took " + (t1 - t0) + " milliseconds.");
    }
    static moveKing(king, knights, gameState) {
        let t0 = performance.now();
        console.log(knights);
        let legalMovesKing = king.getMoves();
        console.log(legalMovesKing);
        let j = Math.floor(Math.random() * Math.floor(legalMovesKing.length));
        king.setPosition(legalMovesKing[j]);
        gameState.kingPos = legalMovesKing[j];
        this.minimax(king.boardPosition, 0, true);
        let t1 = performance.now();
        console.log("King AI move took " + (t1 - t0) + " milliseconds.");
    }
    static evaluate(board_size) {
        console.log("board_size = " + board_size);
        console.log("kingPos = " + King.prototype.boardPosition, "knightPositions = " + Knight.prototype.boardPosition);
    }
    static minimax(position, depth, maximizingPlayer) {
        let score = this.evaluate([7, 7]);
        console.log(score);
        console.log(position, depth, maximizingPlayer, "avoiding errors");
    }
}
//# sourceMappingURL=main.js.map