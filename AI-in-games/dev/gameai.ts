/// <reference path="knight.ts" />
/// <reference path="king.ts" />
/// <reference path="board.ts" />
/// <reference path="gamestate.ts" />
/// <reference path="chesspiece.ts" />

class GameAI {
    // let the AI choose a move, and update both the
    // knight and the gamestate
    
    public static moveKnight(king:King, knights: Knight[], gameState:GameState) {
        let t0 = performance.now();

         // TODO: remove random move, amnd replace with AI move

        // RANDOM MOVE - START ------------------

        console.log(king); // only to avoid error: 'king' is declared but its value is never read.

        // choose knight to move
        let i:number =  Math.floor(Math.random() * Math.floor(knights.length));

        let legalMovesKnight: [number, number][] = knights[i].getMoves();

        // console.log(legalMovesKnight);

        let j:number =  Math.floor(Math.random() * Math.floor(legalMovesKnight.length));

        knights[i].setPosition(legalMovesKnight[j]);
        gameState.knightPositions[i] = legalMovesKnight[j];

        // RANDOM MOVE - END   ------------------

        console.log(gameState.knightPositions);
        for(let i = 0; i < knights.length; i++) {
            this.minimax(gameState.knightPositions[i], 1, false, i)
        }

        let t1 = performance.now();
        console.log("Knight AI move took " + (t1 - t0) + " milliseconds.");

    }

    // public static moveKing(king: King, knights: Knight[], gameState: GameState) {
    //     let t0 = performance.now();
    //      // TODO: remove random move, amnd replace with AI move
    //     console.log("knights " + knights); // only to avoid error: 'knights' is declared but its value is never read.
    //     // RANDOM MOVE - START ------------------

    //     let legalMovesKing: [number, number][] = king.getMoves();

    //     console.log(legalMovesKing);

    //     let j:number =  Math.floor(Math.random() * Math.floor(legalMovesKing.length));

    //     king.setPosition(legalMovesKing[j]);
    //     gameState.kingPos = legalMovesKing[j];

    //     // RANDOM MOVE - END   ------------------

    //     //Minimax Move - START ------------------
    //     this.minimax(king.boardPosition, 0, true)
    //     //Minimax Move - END   ------------------

    //     let t1 = performance.now();
    //     console.log("King AI move took " + (t1 - t0) + " milliseconds.");

    // }

    public static minimax(position:[number, number], depth:number, maximizingPlayer: boolean, i:number) {
        console.log(position, depth, maximizingPlayer, i, "avoiding errors") // avoiding errors
    }
}