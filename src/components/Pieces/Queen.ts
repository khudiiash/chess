import { BasePiece, BasePieceModel, BasePieceView } from "./BasePiece";

class QueenModel extends BasePieceModel {

  constructor(value: number) {
    super(value);
    this.type = "bishop";
    this.size = { width: 0.5, height: 0.8, depth: 0.5 };
  }
}

class QueenView extends BasePieceView {
  
    constructor() {
      super();
    }
  
}

class Queen extends BasePiece {

  constructor(value: number) {
    super();
    this.model = new QueenModel(value);
    this.view = new QueenView();
    this.view.build({ size: this.model.size, color: this.model.color });
    this.makeClickable();
  }
  getPossibleMoves(): any {
    return [[8, -8], [8, 0], [8, 8],
            [0, -8],          [0, 8],
            [-8, -8], [-8, 0],[-8, 8]];
  }
}



export default Queen;