import { Piece, PieceModel, PieceView } from "@/components/Base";
import { IPieceConstructorParams } from "@/interfaces/Piece";
import { Cell } from "../Cell";
import gsap from "gsap";

class Knight extends Piece {

  constructor(params: IPieceConstructorParams) {  
    super();
    this.model = new KnightModel(params);
    this.view = new KnightView(params);
    this.build();
  }
  
}

class KnightModel extends PieceModel {

  constructor(params: IPieceConstructorParams) {
    super(params);
    this.type = 'knight';
  }

  get char() {
    return this.side === 'white' ? 'N' : 'n';
  }

}

class KnightView extends PieceView {
  
    build(config: any) {
      super.build(config);
    }

    async move(square: string) {
      const { row, col } = Cell.fromSquare(square);
      return new Promise(resolve => {
        gsap.timeline()
          .to(this.mesh.position, { y: 1.2, duration: 0.3})
          .to(this.mesh.position, { x: row, z: col, duration: 0.5}, '-=0.2')
          .to(this.mesh.position, { y: 0, duration: 0.3, onComplete: resolve}, '-=0.2');
      })
    }
  
  
}




export default Knight;