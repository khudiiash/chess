import { BasePiece, BasePieceModel, BasePieceView } from "@/components/Base";
import { TMovesMap } from "@/types";

class Pawn extends BasePiece {

  constructor(value: number) {
    super(value);
    this.model = new PawnModel(value);
    this.view = new PawnView();
    this.view.build({ size: this.model.size, color: this.model.color,  team: this.model.team  });
    this.makeClickable();
  }

}


class PawnModel extends BasePieceModel {

  constructor(value: number) {
    super(value);
    this.type = 'pawn';
    this.size = { width: 0.5, height: 0.8, depth: 0.5 };
  }

  get moves(): TMovesMap {
    const moves = [ [1, -1],  [1, 0],  [1, 1],
              [0, -1],           [0, 1],
              [-1, -1], [-1, 0], [-1, 1]];
    if (!this.originalPosition) {
      moves.push([2, 0]);
    }
    return moves;
  }

}

class PawnView extends BasePieceView {
  
    constructor() {
      super();
    }
  
}



export default Pawn;