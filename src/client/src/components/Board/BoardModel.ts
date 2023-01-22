import { BoardMap, Move, Side, Square, Piece as TPiece, TSquares} from "@/types";
import { Cell, Observer } from '@/components'
import { boardToFen, decomposeFen, fenToBoard } from "@/utils";
import { START_FEN } from "@/../../globals";
import { Piece } from "@/components/Base";
import { King, Rook } from "@/components/Pieces";

class BoardModel {
  
  state: { 
    fen: string,
    board: BoardMap,
    moves?: Move[],
    selected?: string,
    side: Side,
  }

  observer: Observer;
  squares: TSquares;
  history: string[];
  isRestore: boolean;
  sides: {
    user: Side,
    opponent: Side,
  }
  
  constructor() {
    const localState = JSON.parse(localStorage.getItem('state'));
    if (localState) {
      this.isRestore = true;
    }
    this.observer = new Observer();
    this.history = [];
    this.sides = {
      user: 'white',
      opponent: 'black',
    }
    this.state = {
      fen: localState?.fen ? localState.fen : START_FEN,
      board: localState?.board ? localState.board : fenToBoard(START_FEN),
      side: localState?.side ? localState.side : 'white',
    }
    this.initSquares();
  }

  reset() {
    this.state.fen = START_FEN;
    this.state.board = fenToBoard(START_FEN);
    this.state.side = 'white';
    this.history = [];
    this.clearPieces();
  }

  initSquares() {
    this.squares = {};
    for (let i = 0; i < 64; i++) {
      const r = (i % 8);
      const c = Math.floor(i / 8);
      this.squares[Cell.toSquare(r, c)] = {cell: null, piece: null};
    }
  }

  clearPieces() {
    for (let i = 0; i < 64; i++) {
      const r = (i % 8);
      const c = Math.floor(i / 8);
      this.squares[Cell.toSquare(r, c)].piece = null;
    }
  }

  selecPiece(piece: Piece) {
    this.state.selected = piece.square;
  }

  clearSelected() {
    this.state.selected = null;
  }

  getKing(side: Side): King {
    const pieces = this.getPieces();
    return pieces.find(piece => piece.type === 'king' && piece.side === side) as King;
  }

  addPiece(piece: Piece) {
    this.squares[piece.square].piece = piece;
  }

  clearPiece(piece: Piece) {
    this.squares[piece.square].piece = null;
  }

  makeMove(move: Move) {
    const fromSq = this.squares[move.from];
    const toSq = this.squares[move.to];
    const piece = fromSq.piece;
    toSq.piece = piece;
    fromSq.piece = null;
    this.squaresToBoard();
    this.history.push(this.state.fen);
  }

  castle(from: string, to: Square): Rook {
    const rook = this.getPiece(from) as Rook;
    this.movePiece(rook, to);
    const castling = decomposeFen(this.state.fen).castling;
    let updatedFenCastling = castling;
    switch (from) {
      case 'a1': updatedFenCastling = castling.replace('Q', ''); break;
      case 'h1': updatedFenCastling = castling.replace('K', ''); break;
      case 'a8': updatedFenCastling = castling.replace('q', ''); break;
      case 'h8': updatedFenCastling = castling.replace('k', ''); break;
    }

    this.state.fen = updatedFenCastling.length ?
      this.state.fen.replace(castling,  updatedFenCastling):
      this.state.fen.replace(castling, '-');
    return rook;
  }

  storeState() {
    localStorage.setItem('state', JSON.stringify(this.state));
  }

  swapSide() {
    this.state.side = this.state.side === 'white' ? 'black' : 'white';
  }

  setUserSide(side: Side) {
    this.sides.user = side;
    this.sides.opponent = side === 'white' ? 'black' : 'white';
  }

  updateFen() {
    const piecesFen = boardToFen(this.state.board);
    this.state.fen = this.state.fen.replace(/^[^ ]+/, piecesFen);
    this.state.fen = this.state.fen.replace(/\s(?:w|b)\s/, ` ${this.state.side[0]} `);
  }

  squaresToBoard() {
    const board = this.state.board;
    const squares = this.squares;

    for (const sq of Object.keys(squares)) {
      const { row, col } = Cell.fromSquare(sq);
      const piece = squares[sq].piece;
      board[row][col] = piece ? piece.value : 0;
    }
  }

  getPiece(square: string): TPiece {
    return this.squares[square]?.piece;
  }

  getCell(square: string): Cell {
    return this.squares[square]?.cell;
  }
  
  getCells() {
    return Object.values(this.squares).map(sq => sq.cell);
  }

  getPieces() {
    return Object.values(this.squares).map(sq => sq.piece).filter(Boolean);
  }

  getSelected() {
    return this.squares[this.state.selected]?.piece;
  }

  getMove(from: Square, to: Square): Move {
    return this.state.moves?.find(move => move.from === from && move.to === to);
  }

  get fen() {
    return this.state.fen || START_FEN;
  }

  movePiece(piece: Piece, to: Square) {
    const from = piece.square;
    const fromSq = this.squares[from];
    const toSq = this.squares[to];
    toSq.piece = piece;
    fromSq.piece = null;
    this.squaresToBoard();
    this.updateFen();
  }

  setSelectedPieceSq(piece: Piece) {
    this.state.selected = piece.square;
  }

  getSelectedPieceSq() {
    return this.state.selected;
  }

  setMoves(moves: Move[]) {
    this.state.moves = moves;
  }

  getMoves() {
    return this.state.moves;
  }

  getMovesForPiece(piece: Piece) {
    return this.state.moves?.filter(move => move.from === piece.square);
  }

  get side(): Side {
    return this.state.side;
  }

  get opponentSide(): Side {
    return this.sides.opponent;
  }

  get userSide(): Side {
    return this.sides.user;
  }

  get userTurn(): boolean {
    return this.state.side === this.sides.user;
  }

  get opponentTurn(): boolean {
    return this.state.side !== this.sides.user;
  }

}

export default BoardModel;