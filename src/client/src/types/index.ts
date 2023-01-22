
import { Cell } from "@/components";
import { Rook, Knight, Bishop, Queen, King, Pawn } from "@/components/Pieces";

export type Piece = King | Queen | Bishop | Knight | Rook | Pawn;
export type Mode = 'ai' | 'online' | 'local' | '';
export enum Difficulty { easy = 'easy', medium = 'medium', hard = 'hard', }
export type Side = 'white' | 'black';
export type Square =  'a1' | 'a2' | 'a3' | 'a4' | 'a5' | 'a6' | 'a7' | 'a8' |
                      'b1' | 'b2' | 'b3' | 'b4' | 'b5' | 'b6' | 'b7' | 'b8' |
                      'c1' | 'c2' | 'c3' | 'c4' | 'c5' | 'c6' | 'c7' | 'c8' |
                      'd1' | 'd2' | 'd3' | 'd4' | 'd5' | 'd6' | 'd7' | 'd8' |
                      'e1' | 'e2' | 'e3' | 'e4' | 'e5' | 'e6' | 'e7' | 'e8' |
                      'f1' | 'f2' | 'f3' | 'f4' | 'f5' | 'f6' | 'f7' | 'f8' |
                      'g1' | 'g2' | 'g3' | 'g4' | 'g5' | 'g6' | 'g7' | 'g8' |
                      'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'h7' | 'h8' | 'none'
export type Position = { row: number, col: number, square?: Square };
export type BoardMap = Array<Array<string | number>>;
export type Move = {
  from: Square, 
  to: Square, 
  captured?: string, 
  promoted?: string, 
  enpassant?: boolean,
  doublepawn?: boolean,
  castling?: boolean,
  bit?: number 
}

export type Resources = {
  textures: {
      [key: string]: {
          [key: string]: THREE.Texture
      }
  },
  models: {
      [key: string]: THREE.Mesh
  },
  matcaps: {
      [key: string]: THREE.Texture
  }
}

export type Size = {
  width: number,
  height: number,
  depth: number
}

export type TSquare = {
  cell: Cell,
  piece: Piece,
}

export type TSquares = {
  [key: string]: TSquare;
}