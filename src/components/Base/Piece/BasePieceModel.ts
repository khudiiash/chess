import { Cell } from "@/components/Cell";
import { IPieceConstructorParams, IPieceModelConstructorParams } from "@/interfaces/Piece";
import { TSize, TPosition, TMovesMap, TMove, TBoardMap } from "@/types";
import { Observer } from "@/components";

interface State {
  check: boolean;
  id: string;
  isSelected: boolean;
  isAlive: boolean;
  hasMoved: boolean;
  position: TPosition;
  startPosition: TPosition;
}

class BasePieceModel {

  value: number;
  name: string;
  size: TSize;
  color: number;
  team: string;
  type: string;
  validMoves: {[key: string]: TMove[]};

  state: State;
  history: any[];
  observer: Observer;

  constructor({value, row, col}: IPieceConstructorParams) {
    this.type = 'base';
    this.value = value;
    this.team = value > 6 ? 'black' : 'white';
    this.color = value > 6 ? 0x333333 : 0xeeeeee;
    this.history = [];
    this.validMoves = {};
    this.state = {
      // generate random hex id
      id: Math.floor(Math.random() * 16777215).toString(16),
      isSelected: false,
      isAlive: true,
      hasMoved: false,
      check: false,
      position: {
        row: row,
        col: col
      },
      startPosition: {
        row: row,
        col: col
      }
    }
  }

  reset() {
    this.state.isSelected = false;
    this.state.hasMoved = false;
    this.state.isAlive = true;
    this.state.position.col = this.state.startPosition.col;
    this.state.position.row = this.state.startPosition.row;
  }
 
  kill() {
    this.state.isAlive = false;
    this.history.push({ isAlive: false });
  }

  generateMoves() {
    
  }

  revive() {
    this.state.isAlive = true;
  }

  setPosition(position: TPosition, hasMoved?: boolean) {
    const record: any = { 
      move: [
        { row: this.state.position.row, col: this.state.position.col },
        { row: position.row, col: position.col }
      ]
    };

    this.state.position.row = position.row;
    this.state.position.col = position.col;
    
    if (!this.state.hasMoved && hasMoved) {
      this.state.hasMoved = true;
      record.hasMoved = true;
    }
    this.history.push(record);
   
  }

  undo() {
    const lastAction = this.history.pop();
    if (lastAction.move) {
      this.state.position.row = lastAction.move[0].row;
      this.state.position.col = lastAction.move[0].col;
    }

    if (lastAction.isAlive === false) {
      this.state.isAlive = true;
    }

    if (lastAction.hasMoved) {
      this.state.hasMoved = false;
    }
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


  getMoves(board: TMovesMap, row: number, col: number): TMove[] { 
    return [];
  }

  hashValidMoves(map: TBoardMap, moves: TMove[]) {
    this.validMoves[JSON.stringify(map)] = moves;
  }

}

export default BasePieceModel;