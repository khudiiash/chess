import { IModel } from "@/interfaces";
import { TPiece } from "@/types";

class CellModel implements IModel {

  state: { 
    isOccupied: boolean; 
    isSelected: boolean;
    isHighlighted: boolean;
    piece: TPiece;
    position: { row: number; col: number; };
  };

  name: string;
  color: number;
  colors: { default: number; move: number; attack: number; };
  
  constructor(row: number, col: number) {
    this.name =  `${String.fromCharCode(97 + col)}${row + 1}`;
    this.colors = {
      default: (row + col) % 2 === 0 ? 0x333333 : 0xeeeeee,
      move: 0x2222ff,
      attack: 0xd35656,
    }

    this.state = {
      isOccupied: false,
      isSelected: false,
      isHighlighted: false,
      piece: null,
      position: { row, col }
    };
  }

  reset() {
    this.state.isOccupied = false;
    this.state.isSelected = false;
    this.state.isHighlighted = false;
    this.state.piece = null;
  }

  setPosition(row: number, col: number) {
    this.state.position.row = row;
    this.state.position.col = col;
  }

  setHighlighted(isHighlighted: boolean) {
    this.state.isHighlighted = isHighlighted;
  }

}

export default CellModel;