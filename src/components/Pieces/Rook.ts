import { BasePiece, BasePieceModel, BasePieceView } from "@/components/Base";
import { IPieceConstructorParams } from "@/interfaces/Piece";
import { TBoardMap, TMove } from "@/types";
import { isAttack, isTeam, reverseArray } from "@/utils";

class Rook extends BasePiece {

  constructor(params: IPieceConstructorParams) {  
    super();
    this.model = new RookModel(params);
    this.view = new RookView(params);
    this.build();
  }

  static get values() : number[][] {
    return [
      [  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
      [  0.5,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  0.5],
      [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
      [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
      [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
      [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
      [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
      [  0.0,   0.0, 0.0,  0.5,  0.5,  0.0,  0.0,  0.0]
    ]
  }

  static getValue(y: number, x: number, isWhite: boolean): number {
    return isWhite ? Rook.values[y][x] : reverseArray(Rook.values)[y][x];
  }

  getMoves(board: TBoardMap): TMove[] {
    return Rook.getMoves(board, this.position.row, this.position.col);
  }

  static getMoves(board: TBoardMap, row: number, col: number): TMove[] {
    const moves: TMove[] = []
    const value = board[row][col];
    
    for (let r = row + 1; r < 8; r++) {
      if (isTeam(board, value, r, col)) break;
      if (isAttack(board, value, r, col)) {
        moves.push([{ row, col }, { row: r, col }]);
        break;
      }
      moves.push([{ row, col }, { row: r, col }]);
    }

    for (let r = row - 1; r >= 0; r--) {
      if (isTeam(board, value, r, col)) break;
      if (isAttack(board, value, r, col)) {
        moves.push([{ row, col }, { row: r, col }]);
        break;
      }
      moves.push([{ row, col }, { row: r, col }]);
    }

    for (let c = col + 1; c < 8; c++) {
      if (isTeam(board, value, row, c)) break;
      if (isAttack(board, value, row, c)) {
        moves.push([{ row, col }, { row, col: c }]);
        break;
      }
      moves.push([{ row, col }, { row, col: c }]);
    }

    for (let c = col - 1; c >= 0; c--) {
      if (isTeam(board, value, row, c)) break;
      if (isAttack(board, value, row, c)) {
        moves.push([{ row, col }, { row, col: c }]);
        break;
      }
      moves.push([{ row, col }, { row, col: c }]);
    }

    return moves;
  }

}

class RookModel extends BasePieceModel {

  constructor(params: IPieceConstructorParams) {
    super(params);
    this.type = 'rook';
  }

}

class RookView extends BasePieceView {
  
}


export default Rook;