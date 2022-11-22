import { TBoardMap, TMove } from "@/types";
import { BasePiece, BasePieceModel, BasePieceView } from "@/components/Base";
import { IPieceConstructorParams } from "@/interfaces/Piece";
import { isTeam } from "@/utils";

class Knight extends BasePiece {

  constructor(params: IPieceConstructorParams) {  
    super();
    this.model = new KnightModel(params);
    this.view = new KnightView(params);
    this.build();
  }

  static get values() : number[][] {
    return [
      [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
      [-4.0, -2.0,  0.0,  0.0,  0.0,  0.0, -2.0, -4.0],
      [-3.0,  0.0,  1.0,  1.5,  1.5,  1.0,  0.0, -3.0],
      [-3.0,  0.5,  1.5,  2.0,  2.0,  1.5,  0.5, -3.0],
      [-3.0,  0.0,  1.5,  2.0,  2.0,  1.5,  0.0, -3.0],
      [-3.0,  0.5,  1.0,  1.5,  1.5,  1.0,  0.5, -3.0],
      [-4.0, -2.0,  0.0,  0.5,  0.5,  0.0, -2.0, -4.0],
      [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0]
    ];
  }

  static getValue(y: number, x: number, isWhite: boolean) : number {
    return Knight.values[y][x];
  }

  getMoves(board: TBoardMap): TMove[] {
    return Knight.getMoves(board, this.position.row, this.position.col);
  }

  static getMoves(board: TBoardMap, row: number, col: number): TMove[] {
    const moves: TMove[] = [];
    const X = [ 2, 1, -1, -2, -2, -1, 1, 2 ];
    const Y = [ 1, 2, 2, 1, -1, -2, -2, -1 ];
    
    // Check if each possible move is valid or not
    for (let i = 0; i < 8; i++) {
        // Position of knight after move
        const x = row + X[i];
        const y = col + Y[i];

        if (x >= 0 && y >= 0 && x < 8 && y < 8 && !isTeam(board, board[row][col], x, y)) {
          moves.push([{row, col}, {row: x, col: y}]);
        }

    }
    return moves;
  }
  
}

class KnightModel extends BasePieceModel {

  constructor(params: IPieceConstructorParams) {
    super(params);
    this.type = 'knight';
  }

}

class KnightView extends BasePieceView {
  
    build(config: any) {
      super.build(config);
    }
  
}




export default Knight;