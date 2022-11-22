import { BasePiece, BasePieceModel, BasePieceView } from "@/components/Base";
import { IPieceConstructorParams, IPieceViewBuildConfig } from "@/interfaces/Piece";
import { TBoardMap, TMove } from "@/types";
import { inBoard, isTeam, reverseArray } from "@/utils";

class King extends BasePiece {

  constructor(params: IPieceConstructorParams) {  
    super();
    this.model = new KingModel(params);
    this.view = new KingView(params);
    this.build();
  }

  getMoves(board: TBoardMap): TMove[] {
    return King.getMoves(board, this.position.row, this.position.col);
  }

  static get values() : number[][] {
    return [
      [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
      [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
      [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
      [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
      [ -2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
      [ -1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
      [  2.0,  2.0,  0.0,  0.0,  0.0,  0.0,  2.0,  2.0 ],
      [  2.0,  3.0,  1.0,  0.0,  0.0,  1.0,  3.0,  2.0 ]
    ]
  }

  static getValue(y: number, x: number, isWhite: boolean): number {
    return isWhite ? King.values[y][x] : reverseArray(King.values)[y][x];
  }

  static getMoves(board: TBoardMap, row: number, col: number): TMove[] {
    const moves: TMove[] = [];
    const value = board[row][col];
    
   // Check all 8 directions
    for (let r = row - 1; r <= row + 1; r++) {
      for (let c = col - 1; c <= col + 1; c++) {
        if (r === row && c === col) continue;
        if (inBoard(r, c) && !isTeam(board, value, r, c)) {
          // check if opponents are not able to attack this square
          moves.push([{ row, col }, { row: r, col: c }]);
        }
      }
    }

    return moves;
  }

}

class KingModel extends BasePieceModel {

  constructor(params: IPieceConstructorParams) {
    super(params);
    this.type = 'king';
  }

 
}

class KingView extends BasePieceView {
  
    build(config: IPieceViewBuildConfig): void {
      super.build(config);
      this.mesh.rotation.z = 0;
      this.defaultRotation = this.mesh.rotation.clone();
    }
  
}


export default King;