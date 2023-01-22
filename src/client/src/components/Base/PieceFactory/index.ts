import { King, Queen, Bishop, Knight, Rook, Pawn } from "@/components/Pieces";
import { IPieceConstructorParams } from "@/interfaces/Piece";

interface PieceTypes {
    [key: string]: typeof King | typeof Queen | typeof Bishop | typeof Knight | typeof Rook | typeof Pawn;
}

class PieceFactory {
  
  static map: PieceTypes

  createPiece(params: IPieceConstructorParams) {
    const piece = new this.map[params.value.toLowerCase()](params);
    return piece;
  }

  get map(): PieceTypes {
    return {
      r: Rook,
      n: Knight,
      b: Bishop,
      q: Queen,
      k: King,
      p: Pawn,
    };
  }

}

export default PieceFactory;