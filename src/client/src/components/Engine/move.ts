import { char } from "./constants";
import { Pieces } from "./pieces";
import { Squares } from "./squares";

type MoveData = {
  from: number;
  to: number;
  promoted: number;
  captured: number;
  doublepawn: number;
  enpassant: number;
  castling: number;
}


export class Move {
  score: any;
  static bit({from, to, promoted, captured, doublepawn, enpassant, castling}: MoveData) {
    return from | to << 7 | captured << 14 | promoted << 18 | doublepawn << 22 | enpassant << 23 | castling << 24;
  }

  static unbit(move: number) {
    return {
      from: move & 127,
      to: (move >> 7) & 127,
      captured: (move >> 14) & 15,
      promoted: (move >> 18) & 15,
      doublepawn: (move >> 22) & 1,
      enpassant: (move >> 23) & 1,
      castling: (move >> 24) & 1,
    }
  }

  static is_capture(move: number): boolean {
    return !!((move >> 14) & 15);
  }

  static pretty(move: number) {
    if (!move) throw new Error('Invalid move');
    let { from, to, captured, promoted, doublepawn, enpassant, castling } = Move.unbit(move);
    let f = Squares.toString(from);
    let t = Squares.toString(to);
    let c = char[captured];
    let p = promoted ? Pieces.char(promoted) : '';
    return {from: f, to: t, captured: c, promoted: p, enpassant: !!enpassant, castling: !!castling, doublepawn: !!doublepawn, bit: move };
  }

  static print(move: number) {
    let { from, to, captured, promoted, doublepawn, enpassant, castling } = Move.pretty(move);
    return `${from}${to}${captured}${promoted}${enpassant ? 'e' : ''}${castling ? 'c' : ''}${doublepawn ? 'd' : ''}`;
  }
    

  static get flags() {
    return {
      enpassant: 1,
      castling: 2,
      doublepawn: 4,
    };
  }

  static from(move: number) {
    return move & 127;
  }

  static to(move: number) {
    return (move >> 7) & 127;
  }

  static captured(move: number) {
    return (move >> 14) & 15;
  }

  static promoted(move: number) {
    return (move >> 18) & 15;
  }

  static doublepawn(move: number) {
    return (move >> 22) & 1;
  }

  static enpassant(move: number) {
    return (move >> 23) & 1;
  }

  static castling(move: number) {
    return (move >> 24) & 1;
  }

}