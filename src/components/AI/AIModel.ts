import { TBoardMap, TMove, TPiece, TPosition } from "@/types";
import BoardModel from "@/components/Board/BoardModel";
import { Board } from "../Board";
import { Bishop, King, Knight, Pawn, Queen, Rook } from "../Pieces";

class AIModel {

  state: {
    checkmate: boolean;
    check: boolean;
    captured: { value: number, position: TPosition }[]
  }

  opponents: TPiece[];
  team: TPiece[];
  iterations: number;
  board: BoardModel;

  constructor(board: BoardModel, team: TPiece[], opponents: TPiece[]) {
    this.team = team;
    this.iterations = 0;
    this.opponents = opponents;
    this.board = board;
    this.state = {
      checkmate: false,
      check: false,
      captured: []
    }
   
  }


  minimaxRoot(board: BoardModel, depth: number, isMaximisingPlayer: boolean) {
    let newGameMoves = board.getAllMoves(isMaximisingPlayer ? 'white' : 'black');
    let bestScore = isMaximisingPlayer ? -9999 : 9999;
    let bestMoveFound;

    for(let i = 0; i < newGameMoves.length; i++) {
        const newGameMove = newGameMoves[i]
        board.makeMove(newGameMove);
        const value = this.minimax(board, depth - 1, -10000, 10000, isMaximisingPlayer);
        board.undoMove(newGameMove);
        if(isMaximisingPlayer) {
            if(value >= bestScore) {
                bestScore = value;
                bestMoveFound = newGameMove;
            }
        } else {
          if(value <= bestScore) {
              bestScore = value;
              bestMoveFound = newGameMove;
          }
        }
    }
    return bestMoveFound;
  };

  minimax(board: BoardModel, depth: number, alpha: number, beta: number, isMaximisingPlayer: boolean) {
    if (depth === 0) {
        return this.evaluateBoard(board.board);
    }

    const newGameMoves = board.getAllMoves(isMaximisingPlayer ? 'white' : 'black');

    if (isMaximisingPlayer) {
        let score = -9999;
        for (let i = 0; i < newGameMoves.length; i++) {
            board.makeMove(newGameMoves[i]);
            score = Math.max(score, this.minimax(board, depth - 1, alpha, beta, false));
            board.undoMove(newGameMoves[i]);
            alpha = Math.max(alpha, score);
            if (beta <= alpha) {
                return score;
            }
        }
        return score;
    } else {
        let score = 9999;
        for (let i = 0; i < newGameMoves.length; i++) {
            board.makeMove(newGameMoves[i]);
            score = Math.min(score, this.minimax(board, depth - 1, alpha, beta, true));
            board.undoMove(newGameMoves[i]);
            beta = Math.min(beta, score);
            if (beta <= alpha) {
                return score;
            }
        }
        return score;
    }
  };

  evaluateBoard(board: TBoardMap) {
    let totalEvaluation = 0;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            totalEvaluation = totalEvaluation + this.getPieceValue(board[i][j], i ,j);
        }
    }
    return totalEvaluation;
  };

  reverseArray = function(array: number[][]) {
    return array.slice().reverse();
  };

  getBestMove() {
    if (this.board.isGameOver()) {
        return;
    }

    const depth = 3;
    const d = new Date().getTime();
    const bestMove = this.minimaxRoot(this.board, depth, false);
    const d2 = new Date().getTime();
    const moveTime = (d2 - d);
    return bestMove;
  };

  getPieceValue(piece: number, x: number, y: number): number {
    if (piece === 0) {
        return 0;
    }
    const { isPawn, isKnight, isBishop, isRook, isQueen, isKing, isWhite } = this.board;

    const getAbsoluteValue = (piece: number, isMaximizing: boolean, x: number, y: number) => {

        if (isPawn(piece)) {
            return 10 + Pawn.getValue(y, x, isMaximizing);
        } else if (isRook(piece)) {
            return 50 + Rook.getValue(y, x, isMaximizing);
        } else if (isKnight(piece)) {
            return 30 + Knight.getValue(y, x, isMaximizing);
        } else if (isBishop(piece)) {
            return 30 + Bishop.getValue(y, x, isMaximizing);
        } else if (isQueen(piece)) {
            return 90 + Queen.getValue(y, x, isMaximizing);
        } else if (isKing(piece)) {
            return 900 + King.getValue(y, x, isMaximizing);
        }
        throw "Unknown piece type: " + piece;
    };

    const absoluteValue = getAbsoluteValue(piece, isWhite(piece), x ,y);
    return isWhite(piece) ? absoluteValue : -absoluteValue;
  };


  samePositions(pos1: TPosition, pos2: TPosition): boolean {
    return pos1.row === pos2.row && pos1.col === pos2.col;
  }

}

export default AIModel;