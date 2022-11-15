export const clampToBoard = (value: number) => {
  return Math.min(Math.max(value, 0), 7);
}

export const outOfBoard = (row: number, col: number) => {
  return row < 0 || row > 7 || col < 0 || col > 7;
}

export const inRange = (value: number, min: number, max: number) => {
  return value >= min && value <= max;
}