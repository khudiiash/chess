
export enum SQUARES {
  A8 = 0,   B8 = 1,   C8 = 2,   D8 = 3,   E8 = 4,   F8 = 5,   G8 = 6,   H8 = 7,
  A7 = 16,  B7 = 17,  C7 = 18,  D7 = 19,  E7 = 20,  F7 = 21,  G7 = 22,  H7 = 23,
  A6 = 32,  B6 = 33,  C6 = 34,  D6 = 35,  E6 = 36,  F6 = 37,  G6 = 38,  H6 = 39,
  A5 = 48,  B5 = 49,  C5 = 50,  D5 = 51,  E5 = 52,  F5 = 53,  G5 = 54,  H5 = 55,
  A4 = 64,  B4 = 65,  C4 = 66,  D4 = 67,  E4 = 68,  F4 = 69,  G4 = 70,  H4 = 71,
  A3 = 80,  B3 = 81,  C3 = 82,  D3 = 83,  E3 = 84,  F3 = 85,  G3 = 86,  H3 = 87,
  A2 = 96,  B2 = 97,  C2 = 98,  D2 = 99,  E2 = 100, F2 = 101, G2 = 102, H2 = 103,
  A1 = 112, B1 = 113, C1 = 114, D1 = 115, E1 = 116, F1 = 117, G1 = 118, H1 = 119, NO_SQ = 120
}

export type Square =  'a1' | 'a2' | 'a3' | 'a4' | 'a5' | 'a6' | 'a7' | 'a8' |
                      'b1' | 'b2' | 'b3' | 'b4' | 'b5' | 'b6' | 'b7' | 'b8' |
                      'c1' | 'c2' | 'c3' | 'c4' | 'c5' | 'c6' | 'c7' | 'c8' |
                      'd1' | 'd2' | 'd3' | 'd4' | 'd5' | 'd6' | 'd7' | 'd8' |
                      'e1' | 'e2' | 'e3' | 'e4' | 'e5' | 'e6' | 'e7' | 'e8' |
                      'f1' | 'f2' | 'f3' | 'f4' | 'f5' | 'f6' | 'f7' | 'f8' |
                      'g1' | 'g2' | 'g3' | 'g4' | 'g5' | 'g6' | 'g7' | 'g8' |
                      'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'h7' | 'h8' | 'no_sq';

export class Squares {
  
  static fromString(square: string): SQUARES {
    return Squares.string_to_number[square];
  }

  static toString(square: SQUARES): string {
    return Squares.number_to_string[square];
  }

  static offboard(square: SQUARES): boolean {
    return (square & 0x88) !== 0;
  }

  static onboard(square: SQUARES): boolean {
    return (square & 0x88) === 0;
  }

  static file(square: number): number {
    return square % 16;
  }

  static rank(square: number): number {
    return 8 - Math.floor(square / 16);
  }
  
  static file_rank(square: SQUARES): [number, number] {
    return [Squares.file(square), Squares.rank(square)];
  }

  static get EMPTY(): number {
    return 0;
  }

  static NO_SQUARE: SQUARES = 120;

  static get string_to_number(): { [key: string]: number } {
    return {
      'a8': 0,  'b8': 1,  'c8': 2,  'd8': 3,  'e8': 4,  'f8': 5,  'g8': 6,  'h8': 7,
      'a7': 16, 'b7': 17, 'c7': 18, 'd7': 19, 'e7': 20, 'f7': 21, 'g7': 22, 'h7': 23,
      'a6': 32, 'b6': 33, 'c6': 34, 'd6': 35, 'e6': 36, 'f6': 37, 'g6': 38, 'h6': 39,
      'a5': 48, 'b5': 49, 'c5': 50, 'd5': 51, 'e5': 52, 'f5': 53, 'g5': 54, 'h5': 55,
      'a4': 64, 'b4': 65, 'c4': 66, 'd4': 67, 'e4': 68, 'f4': 69, 'g4': 70, 'h4': 71,
      'a3': 80, 'b3': 81, 'c3': 82, 'd3': 83, 'e3': 84, 'f3': 85, 'g3': 86, 'h3': 87,
      'a2': 96, 'b2': 97, 'c2': 98, 'd2': 99, 'e2': 100, 'f2': 101, 'g2': 102, 'h2': 103,
      'a1': 112, 'b1': 113, 'c1': 114, 'd1': 115, 'e1': 116, 'f1': 117, 'g1': 118, 'h1': 119, 'no_sq': 120
    };
  }

  static get number_to_string(): { [key: number]: string } {
    return {
      0: 'a8', 1: 'b8', 2: 'c8', 3: 'd8', 4: 'e8', 5: 'f8', 6: 'g8', 7: 'h8',
      16: 'a7', 17: 'b7', 18: 'c7', 19: 'd7', 20: 'e7', 21: 'f7', 22: 'g7', 23: 'h7',
      32: 'a6', 33: 'b6', 34: 'c6', 35: 'd6', 36: 'e6', 37: 'f6', 38: 'g6', 39: 'h6',
      48: 'a5', 49: 'b5', 50: 'c5', 51: 'd5', 52: 'e5', 53: 'f5', 54: 'g5', 55: 'h5',
      64: 'a4', 65: 'b4', 66: 'c4', 67: 'd4', 68: 'e4', 69: 'f4', 70: 'g4', 71: 'h4',
      80: 'a3', 81: 'b3', 82: 'c3', 83: 'd3', 84: 'e3', 85: 'f3', 86: 'g3', 87: 'h3',
      96: 'a2', 97: 'b2', 98: 'c2', 99: 'd2', 100: 'e2', 101: 'f2', 102: 'g2', 103: 'h2',
      112: 'a1', 113: 'b1', 114: 'c1', 115: 'd1', 116: 'e1', 117: 'f1', 118: 'g1', 119: 'h1', 120: 'no_sq'
    }
  }
}