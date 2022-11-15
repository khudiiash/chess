import { BasePiece, BasePieceModel, BasePieceView } from "@/components/Base";
import { TMovesMap } from "@/types";



class Queen extends BasePiece {

  constructor(value: number) {
    super(value);
    this.model = new QueenModel(value);
    this.view = new QueenView();
    this.view.build({ size: this.model.size, color: this.model.color,  team: this.model.team  });
    this.makeClickable();
  }

}

class QueenModel extends BasePieceModel {

  constructor(value: number) {
    super(value);
    this.type = 'queen';
    this.size = { width: 0.5, height: 0.8, depth: 0.5 };
  }

  get moves(): TMovesMap {
    return [[8, -8], [8, 0], [8, 8],
            [0, -8],          [0, 8],
            [-8, -8], [-8, 0],[-8, 8]];
  }
}

class QueenView extends BasePieceView {
  
    constructor() {
      super();
    }
  
}



export default Queen;