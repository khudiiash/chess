import { Cell } from "@/components/Cell";
import { IPieceConstructorParams } from "@/interfaces/Piece";
import { Size, Position, Move, Side, Square } from "@/types";
import { Observer } from "@/components";

interface State {
  id: string;
  isSelected: boolean;
  isAlive: boolean;
  position: Position;
}

class PieceModel {

  value: string;
  name: string;
  size: Size;
  color: number;
  side: Side;
  type: string;
  validMoves: {[key: string]: Move[]};

  state: State;
  history: any[];
  observer: Observer;

  constructor({value, row, col}: IPieceConstructorParams) {
    this.type = 'base';
    this.value = value;
    this.side = value.charCodeAt(0) < 98 ? 'white' : 'black';
    this.color = this.side === 'white' ?  0xffe9ae : 0x363c44;
    
    this.state = {
      // generate random hex id
      id: Math.floor(Math.random() * 16777215).toString(16),
      isSelected: false,
      isAlive: true,
      position: {
        row: row,
        col: col,
        square: Cell.toSquare(row, col)
      }
    }
  }

  reset() {
    this.state.isSelected = false;
    this.state.isAlive = true;
  }
 
  kill() {
    this.state.isAlive = false;
  }

  revive() {
    this.state.isAlive = true;
  }

  setPosition(square: Square) {
    const { row, col } = Cell.fromSquare(square);
    this.state.position.row = row;
    this.state.position.col = col;
    this.state.position.square = square;
  }

  get char(): string {
    return 'p';
  }

  get square(): string {
    return this.state.position.square;
  }

  get position(): Position {
    return this.state.position;
  }

  set selected(isSelected: boolean) {
    this.state.isSelected = isSelected;
  }

  get selected(): boolean {
    return this.state.isSelected;
  }

  get isAlive(): boolean {
    return this.state.isAlive;
  }

  get isDead(): boolean {
    return !this.state.isAlive;
  }

}

export default PieceModel;