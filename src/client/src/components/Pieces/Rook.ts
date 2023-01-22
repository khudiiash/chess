import { Piece, PieceModel, PieceView } from "@/components/Base";
import { IPieceConstructorParams } from "@/interfaces/Piece";
import { Cell } from "../Cell";

class Rook extends Piece {

  constructor(params: IPieceConstructorParams) {  
    super();
    this.model = new RookModel(params);
    this.view = new RookView(params);
    this.build();
  }

  castle(): void {
    const square = Cell.toSquare(this.model.position.row, this.model.position.col);
    switch (square) {
      case 'h1': this.move({ from: 'h1', to: 'f1'}); break;
      case 'a1': this.move({ from: 'a1', to: 'c1'}); break;
      case 'h8': this.move({ from: 'h8', to: 'f8'}); break;
      case 'a8': this.move({ from: 'a8', to: 'c8'}); break;
    }
  }

}

class RookModel extends PieceModel {

  constructor(params: IPieceConstructorParams) {
    super(params);
    this.type = 'rook';
  }

  get char() {
    return this.side === 'white' ? 'R' : 'r';
  }

}

class RookView extends PieceView {
  
  
}


export default Rook;