import { TBoardMap, TPiece } from "@/types";
import { TPosition } from "@/types/TPosition";
import { Cell } from "../Cell";
import PieceFactory from "@/components/Base/PieceFactory";

class BoardModel {
  
  map: number[][];
  coords: number[][];
  pieceFactory: PieceFactory;
  history: number[][][] = [];
  state: { map: any; turn: string, selection: { piece: any; cell: any; }; };
  
  constructor() {
    this.pieceFactory = new PieceFactory();
    this.history.push(this.map);

    this.state = {
      map: this.startMap,
      turn: 'white',
      selection: { piece: null, cell: null } 
    }
  }

  setSelectedPiece(piece: TPiece) {
    this.state.selection.piece = piece;
    this.state.selection.cell = null;
  }

  setSelectedCell(cell: Cell) {
    this.state.selection.cell = cell;
    this.state.selection.piece = null;
  }

  getPossibleMoves(piece: TPiece) {
    const moves = piece.getPossibleMoves();
    return moves;
  }

  getSelectedCell() {
    return this.state.selection.cell;
  }

  getSelectedPiece() {
    return this.state.selection.piece;
  }

  nextTurn() {
    this.history.push(this.state.map);
    this.state.turn = this.state.turn === 'white' ? 'black' : 'white';
  }

  makeMove(move: { from: TPosition; to: TPosition; }) {
    const { from, to } = move;
    const piece = this.state.map[from.row][from.col];
    this.state.map[from.row][from.col] = 0;
    this.state.map[to.row][to.col] = piece;
    this.nextTurn();
  }

  clearSelection() {
    this.state.selection.piece.deselect();
    this.state.selection.piece = null;
    this.state.selection.cell = null;
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