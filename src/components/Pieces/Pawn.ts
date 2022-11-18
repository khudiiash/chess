import { BasePiece, BasePieceModel, BasePieceView } from "@/components/Base";
import { IPieceConstructorParams } from "@/interfaces/Piece";
import { TMovesMap } from "@/types";

class Pawn extends BasePiece {

  constructor(params: IPieceConstructorParams) {  
    super();
    this.model = new PawnModel(params);
    this.view = new PawnView(params);
    this.build();
  }

}

class PawnModel extends BasePieceModel {

  constructor(params: IPieceConstructorParams) {
    super(params);
    this.type = 'pawn';
  }

  get moves(): TMovesMap {
    const moves = [ [1, -1],  [1, 0],  [1, 1],
              [0, -1],           [0, 1],
              [-1, -1], [-1, 0], [-1, 1]];
    if (!this.state.hasMoved) {
      moves.push([2, 0], [-2, 0]);
    }
    return moves;
  }

}

class PawnView extends BasePieceView {
  
}



export default Pawn;