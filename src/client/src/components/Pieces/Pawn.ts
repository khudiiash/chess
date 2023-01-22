import { Piece, PieceModel, PieceView } from "@/components/Base";
import { IPieceConstructorParams, IPieceViewBuildConfig } from "@/interfaces/Piece";
import { TBoardMap, Move } from "@/types";
import { inBoard, isAttack, isTeam, reverseArray } from "@/utils";

class Pawn extends Piece {

  constructor(params: IPieceConstructorParams) {  
    super();
    this.model = new PawnModel(params);
    this.view = new PawnView(params);
    this.build();
  }

  promote() {
    // this.view.promote();
  }
  
}

class PawnModel extends PieceModel {

  constructor(params: IPieceConstructorParams) {
    super(params);
    this.type = 'pawn';
  }

  get char() {
    return this.side === 'white' ? 'P' : 'p';
  }

}

class PawnView extends PieceView {

  promote() {
    
  }
  
}



export default Pawn;