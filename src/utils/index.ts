import { TBoardMap } from "@/types";

export const isTeam = (board: TBoardMap, v: number, r: number, c: number): boolean => {
  return board[r][c] > 0 && Math.floor(v / 7) === Math.floor(board[r][c] / 7); 
}

export const isOpponentValue = (v: number, v2: number): boolean => {
  return v > 0 && Math.floor(v / 7) !== Math.floor(v2 / 7);
}

export const inBoard = (row: number, col: number): boolean => {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

export const isAttack = (board: TBoardMap, v: number, r: number, c: number): boolean => {
  return board[r][c] > 0 && Math.floor(v / 7) !== Math.floor(board[r][c] / 7); 
}  

export const reverseArray = (array: any[]): any[] => {
  return array.slice().reverse();
}