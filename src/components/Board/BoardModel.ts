import { TBoardMap, TMove, TPiece, TPosition} from "@/types";
import { Observer } from '@/components'
import { Rook, Pawn, Knight, Bishop, Queen, King } from "@/components/Pieces";
import { isTeam } from "@/utils";


class BoardModel {
  
  state: { 
    board: TBoardMap; 
    turn: string, 
    selection: TPosition; 
    isGameOver: boolean;
    isCheck: boolean;
    checkedColor: string;
    moves: TMove[];
    history: string[];
  }
  observer: Observer;
  
  constructor() {
    const localState = JSON.parse(localStorage.getItem('state'));
    this.observer = new Observer();

    this.state = {
      board: localState?.board || this.startBoard,
      turn: localState?.turn || 'white',
      selection: localState?.selection || { row: null, col: null},
      isGameOver: localState?.isGameOver || false,
      isCheck: localState?.isCheck || false,
      checkedColor: localState?.checkedColor || '',
      moves: localState?.moves,
      history: localState?.history || [],
    };
  }

  setSelectedPiece(piece: TPiece) {
    Object.assign(this.state.selection, piece.position);
  }

  getSelectedPiecePosition(): TPosition {
    return this.state.selection;
  }

  nextTurn() {
    this.state.turn = this.state.turn === 'white' ? 'black' : 'white';
    this.observer.emit(this.observer.events.turn, this.state.turn)
  }

  restart() {
    this.board = this.startBoard;
    this.state.turn = 'white';
    this.state.selection.row = null;
    this.state.selection.col = null;
    this.state.isGameOver = false;
    this.state.isCheck = false;
    this.state.checkedColor = '';
    this.state.history.length = 0;
    this.state.moves = this.getAllMoves(this.turn);
    this.save();
  }

  undo() {
    const move = JSON.parse(this.state.history.pop());
    this.undoMove(move);
    this.nextTurn();
    return move;
  }

  makeMove(move: TMove) {
    const [from, to] = move;;
    move.push(this.board[to.row][to.col]);

    const piece =this.board[from.row][from.col];
    this.board[from.row][from.col] = 0;
    this.board[to.row][to.col] = piece;
  }

  undoMove(move: TMove) {
    const [from, to, value] = move;;
    this.board[from.row][from.col] = this.board[to.row][to.col];
    this.board[to.row][to.col] = value;
    this.state.isGameOver = false;
  }

  record(move: TMove) {
    this.state.history.push(JSON.stringify(move));
  }

  save() {
    localStorage.setItem('state', JSON.stringify(this.state));
  }

  getPieceMoves(piece: TPiece): TMove[] {
    return this.state.moves.filter(move => move[0].row === piece.position.row && move[0].col === piece.position.col);
  }

  generateMoves() {
    this.state.moves = this.getAllMoves(this.turn)
  }

  getHistory(): TMove[] {
    return this.state.history.map(move => JSON.parse(move));
  }

  clearSelection() {
    this.state.selection.row = null;
    this.state.selection.col = null;
  }

  get turn() {
    return this.state.turn;
  }

  get isWhiteTurn() {
    return this.state.turn === 'white';
  }

  get isBlackTurn() {
    return this.state.turn === 'black';
  }

  get startBoard(): TBoardMap {
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

  isGameOver() {
    return this.state.isGameOver;
  }

  inRange(value: number, min: number, max: number) {
    return value >= min && value <= max;
  }

  areOpponentValues(value1: number, value2: number): boolean {
    return this.inRange(value1, 1, 6) && this.inRange(value2, 7, 12) || this.inRange(value2, 1, 6) && this.inRange(value1, 7, 12);
  }

  areTeamValues(value1: number, value2: number) {
    return this.inRange(value1, 7, 12) && this.inRange(value2, 7, 12) || this.inRange(value2, 1, 6) && this.inRange(value1, 1, 6);
  }

  isPawn(v: number) {
    return v === 6 || v === 12;
  }

  isRook(v: number) {
    return v === 1 || v === 7;
  }

  isKnight(v: number) {
    return v === 2 || v === 8;
  }

  isBishop(v: number) {
    return v === 3 || v === 9;
  }

  isQueen(v: number) {
    return v === 4 || v === 10;
  }

  isKing(v: number) {
    return v === 5 || v === 11;
  }

  isWhite(v: number) {
    return v >= 1 && v <= 6;
  }

  isBlack(v: number) {
    return v >= 6 && v <= 12;
  }

  samePositions(pos1: TPosition, pos2: TPosition) {
    return pos1.row === pos2.row && pos1.col === pos2.col;
  }

  reverseArray(array: number[][]): number[][] {
    return array.slice().reverse();
  }

  getColor(v: number) {
    if (v >= 1 && v <= 6) {
      return 'white';
    }
    if (v >= 7 && v <= 12) {
      return 'black';
    }
    return 'empty';
  }

  check() {
    const check = this.isCheck();
    if (typeof check === 'string') {
      this.observer.emit(this.observer.events.check, check);
      this.state.isCheck = true;
      this.state.checkedColor = check;
    } else {
      this.state.isCheck = false;
      this.state.checkedColor = '';
    }
  }

  isCheck(moves?: TMove[]): string | boolean {
    const allMoves = moves || this.getAllMoves();
    for (const move of allMoves) {
      const [from,to] = move;
      const pieceToMove = this.board[from.row][from.col];
      const pieceToCapture = this.board[to.row][to.col];
      if (this.isKing(pieceToCapture) && this.areOpponentValues(pieceToMove, pieceToCapture)) {
        return this.getColor(pieceToCapture);
      }
    }
    
    return false;
  }

  get board() {
    return this.state.board;
  }

  set board (board: TBoardMap) {
    this.state.board = board.map(row => row.slice());
  }

  getOppositeColor(color: string): string {
    return color === 'white' ? 'black' : 'white';
  }

  getAllMoves(color: string = '') {
    const blackMoves: TMove[] = [];
    const whiteMoves: TMove[] = [];
    const board = this.board;

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (!piece) continue;
        const w = !Math.floor(piece / 7);
        const moves = w ? whiteMoves : blackMoves;

        if (this.isRook(piece)) {
          moves.push(...Rook.getMoves(board, row, col));
        }

        if (this.isPawn(piece)) {
          moves.push(...Pawn.getMoves(board, row, col));
        }

        if (this.isKnight(piece)) {
          moves.push(...Knight.getMoves(board, row, col));
        }

        if (this.isBishop(piece)) {
          moves.push(...Bishop.getMoves(board, row, col));
        }

        if (this.isQueen(piece)) {
          moves.push(...Queen.getMoves(board, row, col));
        }

        if (this.isKing(piece)) {
          const kmoves = King.getMoves(board, row, col);
          for (const kmove of kmoves) {
            this.makeMove(kmove);
            if (!this.isCheck(this.isWhite(piece) ? blackMoves : whiteMoves)) {
              moves.push(kmove);
            }
            this.undoMove(kmove);
          }
        }

      }
    }

    if (color && color === this.state.checkedColor) {
      const moves = color === 'white' ? whiteMoves : blackMoves;
      const opponentMoves = color === 'white' ? blackMoves : whiteMoves;

      const checkMoves: TMove[] = []
      for (const move of moves) {
        this.makeMove(move);
        if (!this.isCheck(opponentMoves)) {
          checkMoves.push(move);
        }
        this.undoMove(move);
      }

      moves.length = 0;
      moves.push(...checkMoves);
    
      if (!moves.length) {
        this.observer.emit(this.observer.events.gameover, this.getOppositeColor(color));
        this.state.isGameOver = true;
        return [];
      }

    }
    
      // Return possible moves
    return color ? color === 'white' ? whiteMoves : blackMoves : whiteMoves.concat(blackMoves);
  }

}

export default BoardModel;