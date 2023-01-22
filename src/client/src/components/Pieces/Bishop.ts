import { TBoardMap, Move, TMovesMap } from "@/types";
import { Piece, PieceModel, PieceView } from "@/components/Base";
import { IPieceConstructorParams } from "@/interfaces/Piece";
import { isTeam, isAttack, inBoard, reverseArray } from "@/utils";
class Bishop extends Piece {

  constructor(params: IPieceConstructorParams) {  
    super();
    this.model = new BishopModel(params);
    this.view = new BishopView(params);
    this.build();
  }

}

class BishopModel extends PieceModel {

  constructor(params: IPieceConstructorParams) {
    super(params);
    this.type = 'bishop';
  }

  get char() {
    return this.side === 'white' ? 'B' : 'b';
  }

}

class BishopView extends PieceView {
  
}



export default Bishop;