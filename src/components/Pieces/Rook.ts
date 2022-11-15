import { BasePiece, BasePieceModel, BasePieceView } from "@/components/Base";

class Rook extends BasePiece {

  constructor(value: number) {
    super(value);
    this.model = new RookModel(value);
    this.view = new RookView();
    this.view.build({ size: this.model.size, color: this.model.color });
    this.makeClickable();
  }

}

class RookModel extends BasePieceModel {

  constructor(value: number) {
    super(value);
    this.type = "bishop";
    this.size = { width: 0.5, height: 0.8, depth: 0.5 };
  }

  get moves(): any {
    return [[0, 0], [8, 0], [0, 0],
            [0, -8],          [0, 8],
            [0, 0], [-8, 0],[0, 0]];
  }

}

class RookView extends BasePieceView {
  
    constructor() {
      super();
    }
}


export default Rook;