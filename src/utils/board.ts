import { inRange } from "./math";

export const areOpponentValues = (value1: number, value2: number) => {
  return inRange(value1, 1, 6) && inRange(value2, 7, 12) || inRange(value2, 1, 6) && inRange(value1, 7, 12);
}