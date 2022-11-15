import { TSize, TPosition, TMovesMap } from "@/types";

class BasePieceModel {

  value: number;
  name: string;
  size: TSize;
  color: number;
  team: string;
  type: string;
  originalPosition: TPosition = null;

  state: {
    isSelected: boolean;
    isHovered: boolean;
    isAlive: boolean;
    position: {
      row: number;
      col: number;
    };
  }

  constructor(value: number) {
    this.size = { width: 0.5, height: 0.5, depth: 0.5 };
    this.type = 'base';
    this.value = value;
    this.team = value > 6 ? 'black' : 'white';
    this.color = value > 6 ? 0x333333 : 0xeeeeee;

    this.state = {
      isSelected: false,
      isHovered: false,
      isAlive: true,
      position: {
        row: 0,
        col: 0
      }
    }
  }

  setOriginalPosition(row: number, col: number) {
    if (this.originalPosition) return;
    this.originalPosition = { row, col };
  }

  setPosition(row: number, col: number) {
    this.state.position.row = row;
    this.state.position.col = col;
  }

  setSelected(isSelected: boolean) {
    this.state.isSelected = isSelected;
  }

  setHovered(isHovered: boolean) {
    this.state.isHovered = isHovered;
  }

  hasMoved(): boolean {
    return !!this.originalPosition;
  }

  kill() {
    this.state.isAlive = false;
  }

  get moves(): TMovesMap {
    return  [ [1, -1],  [1, 0],  [1, 1],
              [0, -1],           [0, 1],
              [-1, -1], [-1, 0], [-1, 1]];
  }

}

export default BasePieceModel;