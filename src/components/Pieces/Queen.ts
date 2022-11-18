import { BasePiece, BasePieceModel, BasePieceView } from "@/components/Base";
import { IPieceConstructorParams } from "@/interfaces/Piece";
import { TMovesMap } from "@/types";



class Queen extends BasePiece {

  constructor(params: IPieceConstructorParams) {  
    super();
    this.model = new QueenModel(params);
    this.view = new QueenView(params);
    this.build();
  }

}

class QueenModel extends BasePieceModel {

  constructor(params: IPieceConstructorParams) {
    super(params);
    this.type = 'queen';
  }

  get moves(): TMovesMap {
    return [[8, -8], [8, 0], [8, 8],
            [0, -8],          [0, 8],
            [-8, -8], [-8, 0],[-8, 8]];
  }
}

class QueenView extends BasePieceView {
  
}



export default Queen;