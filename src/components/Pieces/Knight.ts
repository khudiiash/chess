import { TMovesMap } from "@/types";
import { BasePiece, BasePieceModel, BasePieceView } from "@/components/Base";
import { IPieceConstructorParams } from "@/interfaces/Piece";

class Knight extends BasePiece {

  constructor(params: IPieceConstructorParams) {  
    super();
    this.model = new KnightModel(params);
    this.view = new KnightView(params);
    this.build();
  }
  
}

class KnightModel extends BasePieceModel {

  constructor(params: IPieceConstructorParams) {
    super(params);
    this.type = 'knight';
  }

  get moves(): TMovesMap {
    return [[1, -2], [2, -1], [2, 1],  [1, 2],
            [-1, 2], [-2, 1], [-2, -1],[-1, -2]];
  }

}

class KnightView extends BasePieceView {
  
    build(config: any) {
      super.build(config);
    }
  
}




export default Knight;