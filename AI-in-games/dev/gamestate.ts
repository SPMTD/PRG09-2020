/// <reference path="game.ts" />

class GameState {
    public kingPos: [number, number];               // position of the king in the game in board coordinates
    public knightPositions: [number, number][];     // position of the knights in the game in board coordinates
    // public bestKingNoKnightMove: [number, number];
    // public bestKingKnightMove: [number, number];
    // public bestKnightNoKingMove: [number, number];
    // public bestKnightKingMove: [number, number];

    // public Knightpos: [number, number] = [0, 0];          // current position in screen coordinates
    public targetPos: [number, number] = [0, 0];          // target position in screen coordinates
    public Knightspeed: [number, number] = [2, 2];        // move speed

    // public Kingpos: [number, number] = [0, 0];            // current position in screen coordinates
    // public enemyPos: [number, number] = [0, 0];           // target position in screen coordinates
    // public Kingpeed: [number, number] = [2, 2];           // move speed

    // public gameStateCopy = this.copy();
    public movesMade:number = 0;
    
    constructor(kingPos: [number, number], knightPositions: [number, number][]) {
        this.kingPos = kingPos;
        this.knightPositions = knightPositions;
    }

    // return the value of the state and if the state is terminal (game over)
    // higher value is better gamestate for the king (100 is win, -100 is lose)
    public getScore() : [number, boolean] {
        // game over
        for (let z of this.knightPositions) {
            if (Board.samePosition(z, this.kingPos)) {
                return [-100, true];
            }
        }

        // win
        if (this.kingPos[1] == 0) {
            return[100, true];
        } 

        //Unicorn can capture Gandalf
        // if (Math.abs(this.targetPos[] - this.kingPos[]) <= this.Knightspeed[]) {
        //     console.log(-20)
        //     return [-20, false];
        // }
        


        // not over yet, return an evaluation of the gamestate
        // higher number is better for king, lower better for the knights

        // Hint: use the position of the king stored in this.kingPos
        return [0, false]
    }

    // create a copy of the gamestate (needed by AI to look into the future)
    public copy() : GameState {
        const knightPosCopy  = Object.assign([], this.knightPositions);

        return new GameState(this.kingPos, knightPosCopy)
    }
}