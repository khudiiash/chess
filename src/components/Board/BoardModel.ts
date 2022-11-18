import { TBoardMap, TMove, TPiece } from "@/types";
import { TPosition } from "@/types/TPosition";

class BoardModel {
  
  coords: number[][];
  isRestore: boolean = false;
  state: { map: any; turn: string, selection: TPosition; history: TMove[] };
  
  constructor() {
    const localState = JSON.parse(localStorage.getItem('state'));
    if (localState) {
      this.isRestore = true;
    }
    this.state = {
      map: localState?.map || this.startMap,
      turn: localState?.turn || 'white',
      selection: localState?.selection || { row: null, col: null},
      history: localState?.history || []
    }
  }

  setSelectedPiece(piece: TPiece) {
    Object.assign(this.state.selection, piece.position);
  }

  getPossibleMoves(piece: TPiece) {
    const moves = piece.getPossibleMoves();
    return moves;
  }


  getSelectedPiecePosition(): TPosition {
    return this.state.selection;
  }

  nextTurn() {
    this.state.turn = this.state.turn === 'white' ? 'black' : 'white';
  }

  restart() {
    this.state.map = [...this.startMap];
    this.state.turn = 'white';
    this.state.selection.row = null;
    this.state.selection.col = null;
    this.state.history.length = 0;
    this.writeStateToLocalStorage();
  }

  makeMove([from, to]: TMove) {
    const piece = this.state.map[from.row][from.col];
    this.state.map[from.row][from.col] = 0;
    this.state.map[to.row][to.col] = piece;
    this.state.history.push([from, to]);
    this.nextTurn();
    this.writeStateToLocalStorage();

  }

  writeStateToLocalStorage() {
    localStorage.setItem('state', JSON.stringify(this.state));
  }

  clearSelection() {
    this.state.selection.row = null;
    this.state.selection.col = null;
  }

  get isWhiteTurn() {
    return this.state.turn === 'white';
  }

  get isBlackTurn() {
    return this.state.turn === 'black';
  }

  get startMap(): TBoardMap {
    return [
      [1, 2, 3, 4, 5, 3, 2, 1],
      [6, 6, 6, 6, 6, 6, 6, 6],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [12, 12, 12, 12, 12, 12, 12, 12],
      [7, 8, 9, 10, 11, 9, 8, 7],
    ];
  }

}

export default BoardModel;