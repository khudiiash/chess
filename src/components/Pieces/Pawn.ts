import { BasePiece, BasePieceModel, BasePieceView } from "@/components/Base";
import { IPieceConstructorParams } from "@/interfaces/Piece";
import { TBoardMap, TMove } from "@/types";
import { inBoard, isAttack, reverseArray } from "@/utils";

class Pawn extends BasePiece {

  constructor(params: IPieceConstructorParams) {  
    super();
    this.model = new PawnModel(params);
    this.view = new PawnView(params);
    this.build();
  }

  static get values() {
    return [
      [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
      [5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0],
      [1.0,  1.0,  2.0,  3.0,  3.0,  2.0,  1.0,  1.0],
      [0.5,  0.5,  1.0,  2.5,  2.5,  1.0,  0.5,  0.5],
      [0.0,  0.0,  0.0,  2.0,  2.0,  0.0,  0.0,  0.0],
      [0.5, -0.5, -1.0,  0.0,  0.0, -1.0, -0.5,  0.5],
      [0.5,  1.0, 1.0,  -2.0, -2.0,  1.0,  1.0,  0.5],
      [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0]
  ];
  }

  static getValue(y: number, x: number, isWhite: boolean): number {
    return isWhite ? this.values[y][x] : reverseArray(this.values)[y][x];
  }

  getMoves(board: TBoardMap): TMove[] {
    return Pawn.getMoves(board, this.position.row, this.position.col);
  }

  static getMoves(board: TBoardMap, row: number, col: number): TMove[] {
    const moves: TMove[] = []
    const value = board[row][col];
    const n = value === 6 ? 1 : -1;

    if (inBoard(row + n, col) && board[row + n][col] === 0) {
      moves.push([{ row, col }, { row: row + n, col }]);
      
      if (inBoard(row + 2 * n, col)) {
        if ([1, 6].includes(row) && board[row + 2 * n][col] === 0) {
          moves.push([{ row, col }, { row: row + 2 * n, col }]);
        }
      }

    }

    if (inBoard(row + n, col + 1) && isAttack(board, value, row + n, col + 1)) {
      moves.push([{ row, col }, { row: row + n, col: col + 1 }]);
    }

    if (inBoard(row + n, col - 1) && isAttack(board, value, row + n, col - 1)){
      moves.push([{ row, col }, { row: row + n, col: col - 1 }]);
    }

    return moves;
  }

}

class PawnModel extends BasePieceModel {

  constructor(params: IPieceConstructorParams) {
    super(params);
    this.type = 'pawn';
  }

}

class PawnView extends BasePieceView {
  
}



export default Pawn;