import { TBoardMap, TMove, TMovesMap } from "@/types";
import { BasePiece, BasePieceModel, BasePieceView } from "@/components/Base";
import { IPieceConstructorParams } from "@/interfaces/Piece";
import { isTeam, isAttack, inBoard, reverseArray } from "@/utils";
class Bishop extends BasePiece {

  constructor(params: IPieceConstructorParams) {  
    super();
    this.model = new BishopModel(params);
    this.view = new BishopView(params);
    this.build();
  }

  getMoves(board: TBoardMap): TMove[] {
    return Bishop.getMoves(board, this.position.row, this.position.col);
  }

  reverseArray(array: number[][]): number[][] {
    return array.slice().reverse();
  }

  static get values() : number[][] {
    return [
      [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
      [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
      [ -1.0,  0.0,  0.5,  1.0,  1.0,  0.5,  0.0, -1.0],
      [ -1.0,  0.5,  0.5,  1.0,  1.0,  0.5,  0.5, -1.0],
      [ -1.0,  0.0,  1.0,  1.0,  1.0,  1.0,  0.0, -1.0],
      [ -1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0, -1.0],
      [ -1.0,  0.5,  0.0,  0.0,  0.0,  0.0,  0.5, -1.0],
      [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]
    ]
  }

  static getValue(y: number, x: number, isWhite: boolean): number {
    return isWhite ? Bishop.values[y][x] : reverseArray(Bishop.values)[y][x];
  }

  static getMoves(board: TBoardMap, row: number, col: number): TMove[] {
    const moves: TMove[] = [];
    const value = board[row][col];

    for (let r = row + 1, c = col + 1; r < 8 && c < 8; r++, c++) {
      if (isTeam(board, value, r, c)) break;
      if (isAttack(board, value, r, c)) {
        moves.push([{ row, col }, { row: r, col: c }]);
        break;
      }
      moves.push([{ row, col }, { row: r, col: c }]);
    }

    for (let r = row - 1, c = col - 1; r >= 0 && c >= 0; r--, c--) {
      if (isTeam(board, value, r, c)) break;
      if (isAttack(board, value, r, c)) {
        moves.push([{ row, col }, { row: r, col: c }]);
        break;
      }
      inBoard(r,c) && moves.push([{ row, col }, { row: r, col: c }]);
    }

    for (let r = row + 1, c = col - 1; r < 8 && c >= 0; r++, c--) {
      if (isTeam(board, value, r, c)) break;
      if (isAttack(board, value, r, c)) {
        moves.push([{ row, col }, { row: r, col: c }]);
        break;
      }
      inBoard(r,c) && moves.push([{ row, col }, { row: r, col: c }]);
    }

    for (let r = row - 1, c = col + 1; r >= 0 && c < 8; r--, c++) {
      if (isTeam(board, value, r, c)) break;
      if (isAttack(board, value, r, c)) {
        moves.push([{ row, col }, { row: r, col: c }]);
        break;
      }
      inBoard(r,c) && moves.push([{ row, col }, { row: r, col: c }]);
    }

    return moves;
  }
}

class BishopModel extends BasePieceModel {

  constructor(params: IPieceConstructorParams) {
    super(params);
    this.type = 'bishop';
  }

  

}

class BishopView extends BasePieceView {
  
}



export default Bishop;