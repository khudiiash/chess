import { TMovesMap } from "@/types";
import { BasePiece, BasePieceModel, BasePieceView } from "@/components/Base";

class Knight extends BasePiece {

  constructor(value: number) {
    super(value);
    this.model = new KnightModel(value);
    this.view = new KnightView();
    this.view.build({ size: this.model.size, color: this.model.color, team: this.model.team  });
    this.makeClickable();
  }
  
}

class KnightModel extends BasePieceModel {

  constructor(value: number) {
    super(value);
    this.type = 'knight';
    this.size = { width: 0.5, height: 0.8, depth: 0.5 };
  }

  get moves(): TMovesMap {
    return [[1, -2], [2, -1], [2, 1],  [1, 2],
            [-1, 2], [-2, 1], [-2, -1],[-1, -2]];
  }

}

class KnightView extends BasePieceView {
  
    constructor() {
      super();
    }
  
}




export default Knight;