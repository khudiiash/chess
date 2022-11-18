import { TMovesMap } from "@/types";
import { BasePiece, BasePieceModel, BasePieceView } from "@/components/Base";
import { IPieceConstructorParams } from "@/interfaces/Piece";

class Bishop extends BasePiece {

  constructor(params: IPieceConstructorParams) {  
    super();
    this.model = new BishopModel(params);
    this.view = new BishopView(params);
    this.build();
  }

}

class BishopModel extends BasePieceModel {

  constructor(params: IPieceConstructorParams) {
    super(params);
    this.type = 'bishop';
  }

  get moves(): TMovesMap {
    return  [ [8, -8],  [0, 0],  [8, 8],
              [0, 0],            [0, 0],
              [-8, -8], [0, 0], [-8, 8]];
  }

}

class BishopView extends BasePieceView {
  
}



export default Bishop;