import { Cell } from "@/components/Cell";
import { IPieceConstructorParams, IPieceModelConstructorParams } from "@/interfaces/Piece";
import { TSize, TPosition, TMovesMap } from "@/types";

class BasePieceModel {

  value: number;
  name: string;
  size: TSize;
  color: number;
  team: string;
  type: string;

  state: {
    id: string;
    isSelected: boolean;
    isAlive: boolean;
    hasMoved: boolean;
    position: TPosition;
    startPosition: TPosition;
    validMoves: TPosition[];
  }

  constructor({value, row, col}: IPieceConstructorParams) {
    this.type = 'base';
    this.value = value;
    this.team = value > 6 ? 'black' : 'white';
    this.color = value > 6 ? 0x333333 : 0xeeeeee;

    this.state = {
      // generate random hex id
      id: Math.floor(Math.random() * 16777215).toString(16),
      isSelected: false,
      isAlive: true,
      hasMoved: false,
      position: {
        row: row,
        col: col
      },
      startPosition: {
        row: row,
        col: col
      },
      validMoves: []
    }
  }

  reset() {
    this.state.isSelected = false;
    this.state.hasMoved = false;
    this.state.isAlive = true;
    this.state.position.col = this.state.startPosition.col;
    this.state.position.row = this.state.startPosition.row;
    this.state.validMoves.length = 0;
  }
 
  kill() {
    this.state.position.row = -1;
    this.state.position.col = -1;
    this.state.isAlive = false;
  }

  set validMoves(moves: TPosition[]) {
    this.state.validMoves.length = 0;
    this.state.validMoves.push(...moves);
  }

  get validMoves(): TPosition[] {
    return this.state.validMoves;
  }

  setPosition(position: TPosition) {
    this.state.position.row = position.row;
    this.state.position.col = position.col;
  }

  setHasMoved(hasMoved: boolean) {
    this.state.hasMoved = hasMoved;
  }

  get position(): TPosition {
    return this.state.position;
  }

  set selected(isSelected: boolean) {
    this.state.isSelected = isSelected;
  }

  get selected(): boolean {
    return this.state.isSelected;
  }

  get hasMoved(): boolean {
    return this.state.hasMoved;
  }

  get isAlive(): boolean {
    return this.state.isAlive;
  }

  get isDead(): boolean {
    return !this.state.isAlive;
  }

  get moves(): TMovesMap {
    return  [ [1, -1],  [1, 0],  [1, 1],
              [0, -1],           [0, 1],
              [-1, -1], [-1, 0], [-1, 1]];
  }

}

export default BasePieceModel;