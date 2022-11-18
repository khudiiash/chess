import { King, Queen, Bishop, Knight, Rook, Pawn } from "@/components/Pieces";
import { IPieceConstructorParams } from "@/interfaces/Piece";

interface PieceTypes {
    [key: string]: typeof King | typeof Queen | typeof Bishop | typeof Knight | typeof Rook | typeof Pawn;
}

class PieceFactory {
  
  static map: PieceTypes

  createPiece(params: IPieceConstructorParams) {
    const pieceType = params.value > 6 ? params.value - 6 : params.value;
    const piece = new this.map[pieceType](params);
    return piece;
  }

  get map(): PieceTypes {
    return {
      1: Rook,
      2: Knight,
      3: Bishop,
      4: Queen,
      5: King,
      6: Pawn,
    };
  }

}

export default PieceFactory;