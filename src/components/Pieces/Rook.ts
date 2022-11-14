import { BasePiece, BasePieceModel, BasePieceView } from "./BasePiece";

class RookModel extends BasePieceModel {

  constructor(value: number) {
    super(value);
    this.type = "bishop";
    this.size = { width: 0.5, height: 0.8, depth: 0.5 };
  }
}

class RookView extends BasePieceView {
  
    constructor() {
      super();
    }
}

class Rook extends BasePiece {

  constructor(value: number) {
    super();
    this.model = new RookModel(value);
    this.view = new RookView();
    this.view.build({ size: this.model.size, color: this.model.color });
    this.makeClickable();
  }

  getPossibleMoves(): any {
    return [[0, 0], [8, 0], [8, 8],
            [0, -8],          [0, 8],
            [-8, -8], [-8, 0],[-8, 8]];
  }

}



export default Rook;