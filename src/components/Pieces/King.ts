import { TPosition } from "@/types/TPosition";
import { BasePiece, BasePieceModel, BasePieceView } from "./BasePiece";

class KingModel extends BasePieceModel {

  constructor(value: number) {
    super(value);
    this.type = "bishop";
    this.size = { width: 0.5, height: 0.8, depth: 0.5 };
  }
}

class KingView extends BasePieceView {
  
    constructor() {
      super();
    }
  
}

class King extends BasePiece {

  constructor(value: number) {
    super();
    this.model = new KingModel(value);
    this.view = new KingView();
    this.view.build({ size: this.model.size, color: this.model.color });
    this.makeClickable();
  }

  getPossibleMoves(): TPosition[] {
    const { row, col } = this.position;
    const moves = [[1, -1],  [1, 0],  [1, 1],
                   [0, -1],           [0, 1],
                   [-1, -1], [-1, 0], [-1, 1]];
    return moves.map(move => {
      return {row: row + move[0], col: col + move[1]};
    });
  }

}



export default King;