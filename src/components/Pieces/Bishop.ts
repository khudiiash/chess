import { TMovesMap } from "@/types";
import { TPosition } from "@/types/TPosition";
import { clampToBoard, outOfBoard } from "@/utils/math";
import { BasePiece, BasePieceModel, BasePieceView } from "./BasePiece";

class BishopModel extends BasePieceModel {

  constructor(value: number) {
    super(value);
    this.type = "bishop";
    this.size = { width: 0.5, height: 1, depth: 0.5 };
  }
}

class BishopView extends BasePieceView {
  
    constructor() {
      super();
    }
  
}

class Bishop extends BasePiece {

  constructor(value: number) {  
    super();
    this.model = new BishopModel(value);
    this.view = new BishopView();
    this.view.build({ size: this.model.size, color: this.model.color });
    this.makeClickable();
  }

  get moves(): TMovesMap {
    return  [ [8, -8],  [0, 0],  [8, 8],
              [0, 0],            [0, 0],
              [-8, -8], [0, 0], [-8, 8]];
  }

}



export default Bishop;