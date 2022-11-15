import { TMovesMap } from "@/types";
import { BasePiece, BasePieceModel, BasePieceView } from "@/components/Base";

class Bishop extends BasePiece {

  constructor(value: number) {  
    super(value);
    this.model = new BishopModel(value);
    this.view = new BishopView();
    this.view.build({ size: this.model.size, color: this.model.color });
    this.makeClickable();
  }

}

class BishopModel extends BasePieceModel {

  constructor(value: number) {
    super(value);
    this.type = "bishop";
    this.size = { width: 0.5, height: 1, depth: 0.5 };
  }

  get moves(): TMovesMap {
    return  [ [8, -8],  [0, 0],  [8, 8],
              [0, 0],            [0, 0],
              [-8, -8], [0, 0], [-8, 8]];
  }

}

class BishopView extends BasePieceView {
  
    constructor() {
      super();
    }
  
}



export default Bishop;