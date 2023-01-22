export const BLACK = 'b';


export type Color = 'w' | 'b';
export type PieceType = 'k' | 'q' | 'r' | 'b' | 'n' | 'p' | '';
export const MATE = 10000;

export const PIECE_TO_UCODE: PieceUnicode[] = [ '\u3000', '♟', '♞', '♝', '♜', '♛', '♚', '♙', '♘', '♗', '♖', '♕', '♔', 'o' ]
export const PIECE_TO_CHAR: PieceSymbol[] = [ '', 'P', 'N', 'B', 'R', 'Q', 'K', 'p', 'n', 'b', 'r', 'q', 'k', 'o' ]
export type PieceUnicode = '\u3000' | '♟' | '♞' | '♝' | '♜' | '♛' | '♚' | '♙' | '♘' | '♗' | '♖' | '♕' | '♔' | 'o';
export type PieceSymbol = '' | 'P' | 'N' | 'B' | 'R' | 'Q' | 'K' | 'p' | 'n' | 'b' | 'r' | 'q' | 'k' | 'o';


export enum CASTLEBIT {
  K = 1,
  Q = 2,
  k = 4,
  q = 8
}

export enum SIDES {
  WHITE = 0,
  BLACK = 1,
  BOTH = 2
}

export enum BITS {
  QUIET         = 1,
  CAPTURE       = 2,
  BIG_PAWN      = 4,
  EP_CAPTURE    = 8,
  PROMOTION     = 16,
  KSIDE_CASTLE  = 32,
  QSIDE_CASTLE  = 64,
}

export const CastlePerm = new Uint16Array([
  7,  15, 15, 15, 3,  15, 15, 11,  15, 15, 15, 15, 15, 15, 15, 15,
  15, 15, 15, 15, 15, 15, 15, 15,  15, 15, 15, 15, 15, 15, 15, 15,
  15, 15, 15, 15, 15, 15, 15, 15,  15, 15, 15, 15, 15, 15, 15, 15,
  15, 15, 15, 15, 15, 15, 15, 15,  15, 15, 15, 15, 15, 15, 15, 15,
  15, 15, 15, 15, 15, 15, 15, 15,  15, 15, 15, 15, 15, 15, 15, 15,
  15, 15, 15, 15, 15, 15, 15, 15,  15, 15, 15, 15, 15, 15, 15, 15,
  15, 15, 15, 15, 15, 15, 15, 15,  15, 15, 15, 15, 15, 15, 15, 15,
  13, 15, 15, 15, 12, 15, 15, 14,  15, 15, 15, 15, 15, 15, 15, 15,
]);


export const char = ['', 'P', 'N', 'B', 'R', 'Q', 'K', 'p', 'n', 'b', 'r', 'q', 'k', 'off'];

export const FENS = {
  DEFAULT: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  TRICKY: 'r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1',
  PROMOTION: 'n1n5/PPPk4/8/8/8/8/4Kppp/5N1N w - - 0 1', // ;D1 24 ;D2 496 ;D3 9483 ;D4 182838 ;D5 3605103 ;D6 71179139
  CAPTURES: 'rnbqkbnr/pppppppp/8/8/8/4n3/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  ENPASSANT: 'rnbqkbnr/pp1ppppp/8/2pP4/8/8/PPP1PPPP/RNBQKBNR w KQkq c6 0 1',
  PAWNS_FRONT: 'rnbqkbnr/8/8/pppppppp/PPPPPPPP/8/8/RNBQKBNR w KQkq - 0 1',
}

export const [N, E, S, W] = [-16, -1, 16, 1];
export const bigpawnrank = [0, 2, 0, 0, 0, 0, 0, 7];

export const OFFSETS = {
  KNIGHT: [N+N+E, N+N+W, E+E+N, E+E+S, S+S+E, S+S+W, W+W+N, W+W+S],
  BISHOP: [N+E, S+E, S+W, N+W],
  ROOK: [N, E, S, W],
  QUEEN: [N, E, S, W, N+E, S+E, S+W, N+W],
  KING: [N, E, S, W, N+E, S+E, S+W, N+W],
  WHITE_PAWN: [N, N+N, N+E, N+W],
  BLACK_PAWN: [S, S+S, S+E, S+W],
}

export const OFFSETS_BY_PIECE = [
  [],
  OFFSETS.WHITE_PAWN,
  OFFSETS.KNIGHT,
  OFFSETS.BISHOP,
  OFFSETS.ROOK,
  OFFSETS.QUEEN,
  OFFSETS.KING,
  OFFSETS.BLACK_PAWN,
  OFFSETS.KNIGHT,
  OFFSETS.BISHOP,
  OFFSETS.ROOK,
  OFFSETS.QUEEN,
  OFFSETS.KING,
]

export const MAXDEPTH = 64;
export const MAXMOVES = 256;
export const MAXPOSITIONMOVES = 256;
export const MAXGAMEMOVES = 2048;
export const BOARDSQUARES = 120;
export const PVENTRIES = 10000;

export const sides = [2, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2];

export function offboard(sq: number) {
  return (sq & 0x88) !== 0;
}

export function onboard(sq: number) {
  return (sq & 0x88) === 0;
}

export function file(sq: number) {
  return sq & 0xf;
}

export function rank(sq: number) {
  return 8 - (sq >> 4);
}

export function square(f: number, r: number) {
  return (f << 4) + r;
}

export function opponents(a: number, b: number) {
  return a && b && sides[a] !== sides[b];
}

export function team(a: number, b: number) {
  return a && b && sides[a] === sides[b];
}

export function pawn(a: number) {
  return a === 1 || a === 7;
}

export function king(a: number) {
  return a === 6 || a === 12;
}


