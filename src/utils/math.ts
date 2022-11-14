export const clampToBoard = (value: number) => {
  return Math.min(Math.max(value, 0), 7);
}

export const outOfBoard = (row: number, col: number) => {
  return row < 0 || row > 7 || col < 0 || col > 7;
}