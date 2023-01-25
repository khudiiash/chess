import { IModel } from "@/interfaces";
import { Piece, Square } from "@/types";
import Cell from "./Cell";

class CellModel implements IModel {

  state: { 
    isOccupied: boolean; 
    isSelected: boolean;
    isHighlighted: boolean;
    piece: Piece;
    position: { row: number; col: number; square: Square; };
  };

  name: string;
  color: number;
  colors: { default: number; move: number; attack: number; };
  
  constructor(row: number, col: number) {
    this.name =  `${String.fromCharCode(97 + col)}${row + 1}`;
    this.colors = {
      default: (row + col) % 2 === 0 ? 0x1b2027 : 0xe6c5ab,
      move: 0x0000ff,
      attack: 0xff0000,
    }

    this.state = {
      isOccupied: false,
      isSelected: false,
      isHighlighted: false,
      piece: null,
      position: { row, col, square: Cell.toSquare(row, col) }
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