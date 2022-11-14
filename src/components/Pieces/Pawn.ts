import { BasePiece, BasePieceModel, BasePieceView } from "./BasePiece";

class PawnModel extends BasePieceModel {

  constructor(value: number) {
    super(value);
    this.type = "bishop";
    this.size = { width: 0.5, height: 0.8, depth: 0.5 };
  }
}

class PawnView extends BasePieceView {
  
    constructor() {
      super();
    }
  
}

class Pawn extends BasePiece {

  constructor(value: number) {
    super();
    this.model = new PawnModel(value);
    this.view = new PawnView();
    this.view.build({ size: this.model.size, color: this.model.color });
    this.makeClickable();
  }

}



export default Pawn;