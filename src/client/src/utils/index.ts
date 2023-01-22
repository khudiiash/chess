import { BoardMap } from "@/types";

export const decomposeFen = (fen: string): any => {
  const [pieces, turn, castling, enPassant, halfMove, fullMove] = fen.split(' ');
  return { pieces, turn, castling, enPassant, halfMove, fullMove };
}

export const isTeam = (v1: number, v2: number): boolean => {
  return v1 > 0 && v2 > 0 && Math.floor(v1 / 7) === Math.floor(v2 / 7);
}

export const isOpponentValue = (v: number, v2: number): boolean => {
  return v > 0 && Math.floor(v / 7) !== Math.floor(v2 / 7);
}

export const inBoard = (row: number, col: number): boolean => {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

export const isAttack = (v1: number, v2: number): boolean => {
  return v1 > 0 && v2 > 0 && Math.floor(v1 / 7) !== Math.floor(v2 / 7); 
}  

export const reverseArray = (array: any[]): any[] => {
  return array.slice().reverse();
}

export const randomFloat = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
}

export const fenToBoard = (fen: string): BoardMap => {
  fen = fen.split(' ')[0];
  const fenRows = fen.split('/');
  const map = fenRows.map(row => {
      const cells = row.split('');
      return cells.map(cell => {
          if (Number.isInteger(+cell)) {
              return new Array(+cell).fill(0)
          } else {
              return cell;
          }
      }).flat();
  })

  return map.reverse();
}

export const boardToFen = (board: BoardMap): string => {
  return board.map(row => {
    let fenRow = '';
    let empty = 0;
    for (let i = 0; i < 8; i++) {
      if (row[i] === 0) {
        empty++;
      } else {
        if (empty > 0) {
          fenRow += empty;
          empty = 0;
        }
        fenRow += row[i];
      }
    }
    if (empty > 0) {
      fenRow += empty;
    }
    return fenRow;
  }).reverse().join('/');
}
