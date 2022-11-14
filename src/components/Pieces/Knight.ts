import { TMovesMap } from "@/types";
import { TPosition } from "@/types/TPosition";
import { BasePiece, BasePieceModel, BasePieceView } from "./BasePiece";

class KnightModel extends BasePieceModel {

  constructor(value: number) {
    super(value);
    this.type = "bishop";
    this.size = { width: 0.5, height: 0.8, depth: 0.5 };
  }
}

class KnightView extends BasePieceView {
  
    constructor() {
      super();
    }
  
}

class Knight extends BasePiece {

  constructor(value: number) {
    super();
    this.model = new KnightModel(value);
    this.view = new KnightView();
    this.view.build({ size: this.model.size, color: this.model.color });
    this.makeClickable();
  }

  get moves(): TMovesMap {
    return [[1, -2], [2, -1], [2, 1],  [1, 2],
            [-1, 2], [-2, 1], [-2, -1],[-1, -2]];
  }
  
}



export default Knight;