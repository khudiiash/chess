import { Piece, PieceModel, PieceView } from "@/components/Base";
import { IPieceConstructorParams } from "@/interfaces/Piece";

class Queen extends Piece {

  constructor(params: IPieceConstructorParams) {  
    super();
    this.model = new QueenModel(params);
    this.view = new QueenView(params);
    this.build();
  }

}

class QueenModel extends PieceModel {

  constructor(params: IPieceConstructorParams) {
    super(params);
    this.type = 'queen';
  }

  get char() {
    return this.side === 'white' ? 'Q' : 'q';
  }

}

class QueenView extends PieceView {
  
}



export default Queen;