import { SIDES } from "./constants";

export enum PIECES {
  EMPTY = 0,
  wP = 1, wN = 2, wB = 3, wR = 4, wQ = 5, wK = 6,
  bP = 7, bN = 8, bB = 9, bR = 10, bQ = 11, bK = 12
}

export class Pieces {
  static get values() {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  }

  static get names() {
    return ['EMPTY', 'wP', 'wN', 'wB', 'wR', 'wQ', 'wK', 'bP', 'bN', 'bB', 'bR', 'bQ', 'bK'];
  }

  static wP = 1;
  static wN = 2;
  static wB = 3;
  static wR = 4;
  static wQ = 5;
  static wK = 6;
  static bP = 7;
  static bN = 8;
  static bB = 9;
  static bR = 10;
  static bQ = 11;
  static bK = 12;

  static chars = 'ePNBRQKpnbrqko';
  static unicodes = ' ♟♞♝♜♛♚♙♘♗♖♕♔';

  static sides = [2, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2];

  static PROMOTIONS = [[Pieces.wQ, Pieces.wR, Pieces.wB, Pieces.wN], [Pieces.bQ, Pieces.bR, Pieces.bB, Pieces.bN]];
  static EMPTY = 0;

  static getValue(piece: number | string): number {
    if (typeof piece === 'number') {
      return piece;
    } else {
      return this.values[this.chars.indexOf(piece) || this.unicodes.indexOf(piece)];
    }
  }

  static getName(piece: number | string): string {
    if (typeof piece === 'string') {
      return piece;
    } else {
      return this.names[piece];
    }
  }

  static side(n: number): SIDES {
    return this.sides[n];
  }

  static char(piece: number | string) {
    const n = Pieces.getValue(piece);
    return this.chars[n];
  }

  static unicode(piece: number | string) {
    const n = Pieces.getValue(piece);
    return this.unicodes[n]?.replace(' ', '\u3000');
  }

  static isWhite(piece: number | string) {
    return piece >= 1 && piece <= 6;
  }

  static isBlack(piece: number | string) {
    return piece >= 7 && piece <= 12;
  }

  static isPawn(n: number, side?: SIDES) {
    switch (side) {
      case SIDES.WHITE: return n === 1;
      case SIDES.BLACK: return n === 7;
      default: return n === 1 || n === 7;
    }
  }

  static isKnight(n: number, side?: SIDES) {
    switch (side) {
      case SIDES.WHITE: return n === 2;
      case SIDES.BLACK: return n === 8;
      default: return n === 2 || n === 8;
    }
  }

  static isBishop(n: number, side?: SIDES) {
    switch (side) {
      case SIDES.WHITE: return n === 3;
      case SIDES.BLACK: return n === 9;
      default: return n === 3 || n === 9;
    }
  }

  static isRook(n: number, side?: SIDES) {
    switch (side) {
      case SIDES.WHITE: return n === 4;
      case SIDES.BLACK: return n === 10;
      default: return n === 4 || n === 10;
    }
  }

  static isQueen(n: number, side?: SIDES) {
    switch (side) {
      case SIDES.WHITE: return n === 5;
      case SIDES.BLACK: return n === 11;
      default: return n === 5 || n === 11;
    }
  }

  static isKing(n: number, side?: SIDES) {
    switch (side) {
      case SIDES.WHITE: return n === 6;
      case SIDES.BLACK: return n === 12;
      default: return n === 6 || n === 12;
    }
  }

  static isQueenOrRook(n: number, side?: SIDES) {
    switch (side) {
      case SIDES.WHITE: return n === 4 || n === 5;
      case SIDES.BLACK: return n === 10 || n === 11;
      default: return n === 4 || n === 5 || n === 10 || n === 11;
    }
  }

  static isQueenOrBishop(n : number, side?: SIDES) {
    switch (side) {
      case SIDES.WHITE: return n === 3 || n === 5;
      case SIDES.BLACK: return n === 9 || n === 11;
      default: return n === 3 || n === 5 || n === 9 || n === 11;
    }
  }

  static isPiece(n: number) {
    return n >= 1 && n <= 12;
  }

  static isEmpty(n: number) {
    return n === 0;
  }

}