import { IModel } from "@/interfaces";

class CellModel implements IModel {

  state: { 
    isOpen: boolean; 
    isSelected: boolean;
    isHighlighted: boolean;
    position: { row: number; col: number; };
  };

  name: string;
  color: number;
  
  constructor(row: number, col: number) {
    this.name =  `${String.fromCharCode(97 + col)}${row + 1}`;
    this.color = (row + col) % 2 === 0 ? 0x333333 : 0xeeeeee;

    this.state = {
      isOpen: false,
      isSelected: false,
      isHighlighted: false,
      position: { row, col }
    };
  }

  setSelected(isSelected: boolean) {
    this.state.isSelected = isSelected;
  }

  setPosition(row: number, col: number) {
    this.state.position.row = row;
    this.state.position.col = col;
  }

  setHighlighted(isHighlighted: boolean) {
    this.state.isHighlighted = isHighlighted;
  }

  setOpen(isOpen: boolean) {
    this.state.isOpen = isOpen;
  }
}

export default CellModel;