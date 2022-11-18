import { BasePiece, BasePieceModel, BasePieceView } from "@/components/Base";
import { IPieceConstructorParams } from "@/interfaces/Piece";

class Rook extends BasePiece {

  constructor(params: IPieceConstructorParams) {  
    super();
    this.model = new RookModel(params);
    this.view = new RookView(params);
    this.build();
  }

}

class RookModel extends BasePieceModel {

  constructor(params: IPieceConstructorParams) {
    super(params);
    this.type = 'rook';
  }

  get moves(): any {
    return [[0, 0], [8, 0], [0, 0],
            [0, -8],          [0, 8],
            [0, 0], [-8, 0],[0, 0]];
  }

}

class RookView extends BasePieceView {
  
}


export default Rook;