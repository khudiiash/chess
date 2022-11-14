import { King, Queen, Bishop, Knight, Rook, Pawn } from ".";

interface PieceTypes {
    [key: string]: typeof King | typeof Queen | typeof Bishop | typeof Knight | typeof Rook | typeof Pawn;
}

class PieceFactory {
  static map: PieceTypes

  createPiece(value: number) {
    const pieceType = value > 6 ? value - 6 : value;
    const piece = new this.map[pieceType](value)
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