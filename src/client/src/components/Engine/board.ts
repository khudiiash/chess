import {
  CASTLEBIT,
  SIDES,
  CastlePerm,
  rank,
  offboard,
  OFFSETS_BY_PIECE,
  sides,
  OFFSETS,
  onboard,
  char,
  opponents,
  BOARDSQUARES,
  MAXDEPTH,
} from './constants';
import { Move } from './move';
import { Pieces, PIECES } from './pieces';
import { Squares, SQUARES } from './squares';

import {
  CASTLEBIT_TO_STR,
  rand32,
  validate_fen,
} from './utils';


const {E1, E8, G1, G8, F1, F8, C1, C8, B1, B8, D1, D8} = SQUARES;

class Board {

  static instance: Board;
  board: Uint16Array;   
  enpassant: SQUARES;
  side: number;
  castling: number;
  key: number;
  fen: string;
  history: any[];
  moves: Uint32Array;
  move_scores: Uint32Array;
  ply: number;
  hisply: number;
  moves_start: Uint32Array;
  kings: number[];
  fiftymove: number;
  fullmove: number;
  sideKey: number;
  pieceKeys: Uint32Array;
  castleKeys: Uint32Array;
  mvv_lva: any;
  mvv_values: number[];
  mvv_scores: Uint32Array;
  search_killers: Uint32Array;
  search_history: Uint32Array;

  constructor() {
    if (Board.instance) {
      return Board.instance;
    } else {
      Board.instance = this;
    }
    this.init();
  }

  init() {
    this.board = new Uint16Array(128).fill(0);
    this.history = [];
    this.moves = new Uint32Array(64 * 2048);
    this.moves_start = new Uint32Array(64);
    this.key = 0;
    this.side = SIDES.BOTH;
    this.enpassant = Squares.NO_SQUARE;
    this.castling = 0;
    this.fen = '';
    this.ply = 0;
    this.hisply = 0;
    this.moves[this.ply] = 0;
    this.fiftymove = 0;
    this.fullmove = 1;
    this.kings = [Squares.NO_SQUARE, Squares.NO_SQUARE];
    this.moves_start[this.ply] = 0;
    this.key = 0;
    this.mvv_values = [0, 100, 200, 300, 400, 500, 600, 100, 200, 300, 400, 500, 600];
    this.mvv_scores = new Uint32Array(14 * 14);

    this.search_killers = new Uint32Array(3 * MAXDEPTH);
    this.search_history = new Uint32Array(14 * BOARDSQUARES);
  
    this.pieceKeys = new Uint32Array(14 * BOARDSQUARES);
    this.castleKeys = new Uint32Array(16);
    this.move_scores = new Uint32Array(64 * 2048);
    this.init_hash_keys();
    this.init_history();
    this.init_mvv_lva();
  }

  init_mvv_lva() {
    this.mvv_lva = new Uint32Array(14 * 14);
    for (let attacker = Pieces.wP; attacker <= Pieces.bK; attacker++) {
      for (let victim = Pieces.wP; victim <= Pieces.bK; victim++) {
        this.mvv_lva[victim * 14 + attacker] = this.mvv_values[victim] + 6 - (this.mvv_values[attacker] / 100);
      }
    }
  }

  init_history() {
    for (let i = 0; i < 2048; i++) {
      this.history.push({
        move: 0,
        castling: 0,
        enpassant: 0,
        fiftymove: 0,
        key: 0,
      })
    }
  }


  init_hash_keys() {
    for (let i = 0; i < 14 * BOARDSQUARES; i++) {
      this.pieceKeys[i] = rand32();
    }

    this.sideKey = rand32();

    for (let i = 0; i < 16; i++) {
      this.castleKeys[i] = rand32();
    }
  }

  generate_position_key() {
    // called only once at the beginning of the game
    // to generate the initial position key
    let sq = 0;
    let finalKey = 0;
    let piece = PIECES.EMPTY;

    for(sq = 0; sq < BOARDSQUARES; ++sq) {
      if (offboard(sq)) {
        sq += 7;
        continue;
      }
      piece = this.board[sq];
      if(piece) {			
        finalKey ^= this.pieceKeys[(piece * 120) + sq];
      }		
    }

    if(this.side == SIDES.WHITE) {
      finalKey ^= this.sideKey;
    }
    
    if(this.enpassant != SQUARES.NO_SQ) {		
      finalKey ^= this.pieceKeys[this.enpassant];
    }
    
    finalKey ^= this.castleKeys[this.castling];
    
    return finalKey;
  }



  hash_piece(piece: number, square: SQUARES) {
    this.key ^= this.pieceKeys[piece * 120 + square];
  }

  hash_castle() {
    this.key ^= this.castleKeys[this.castling];
  }

  hash_side() {
    this.key ^= this.sideKey;
  }

  hash_enpassant() {
    this.key ^= this.pieceKeys[this.enpassant];
  }


  move_piece(from: SQUARES, to: SQUARES) {
    const piece = this.board[from];
    this.hash_piece(piece, from);
    this.board[from] = 0
    this.hash_piece(piece, to);
    this.board[to] = piece;

    if (Pieces.isKing(piece)) {
      this.kings[sides[piece]] = to;
    }
  }

  clear_piece(square: SQUARES) {
    this.hash_piece(this.board[square], square);
    const piece = this.board[square];
    this.board[square] = 0;
    return piece;
  }

  add_piece(piece: number, square: SQUARES) {
    this.hash_piece(piece, square);
    this.board[square] = piece;
  }

  make_move(move: number) {
    const { from, to, promoted, castling, enpassant, captured } = Move.unbit(move);
    const side = this.side;

    const { WHITE } = SIDES;
    this.history[this.hisply].key = this.key;

    if (enpassant) {
      if (side === WHITE) {
        this.clear_piece(to + 16);
      } else {
        this.clear_piece(to - 16);
      }
    }

    if (castling) {
      if (to === SQUARES.C1) this.move_piece(SQUARES.A1, SQUARES.D1);
      else if (to === SQUARES.C8) this.move_piece(SQUARES.A8, SQUARES.D8);
      else if (to === SQUARES.G1) this.move_piece(SQUARES.H1, SQUARES.F1);
      else if (to === SQUARES.G8) this.move_piece(SQUARES.H8, SQUARES.F8);
    }

    if (this.enpassant !== Squares.NO_SQUARE) this.hash_enpassant();
    this.hash_castle();

    this.history[this.hisply].move = move;
    this.history[this.hisply].enpassant = this.enpassant;
    this.history[this.hisply].castling = this.castling;
    this.history[this.hisply].fiftymove = this.fiftymove;
 
    this.castling &= CastlePerm[from];
    this.castling &= CastlePerm[to];
    this.enpassant = Squares.NO_SQUARE;

    this.hash_castle();

    this.fiftymove++;
   
    if (captured) {
      this.clear_piece(to);
      this.fiftymove = 0;
    }

    this.hisply++;
    this.ply++;

    if (this.board[from] === 1 || this.board[from] === 7) {
      this.fiftymove = 0;
      if (Move.doublepawn(move)) {
        if (side === WHITE) {
          this.enpassant = to + 16;
        } else {
          this.enpassant = to - 16;
        }

        this.hash_enpassant();
      }
    }

    this.move_piece(from, to);

    if (promoted) {
      this.clear_piece(to);
      this.add_piece(promoted, to);
    }

    this.side ^= 1;
    this.hash_side();

    if (this.attacked(this.kings[side], this.side)) {
      this.undo_move();
      return false;
    }
    return true;
  }

  undo_move() {
    this.ply--;
    this.hisply--;

    const {from, to, promoted, captured, enpassant, castling } = Move.unbit(this.history[this.hisply].move);

    if (this.enpassant !== Squares.NO_SQUARE) this.hash_enpassant();
    this.hash_castle();

    this.castling = this.history[this.hisply].castling;
    this.enpassant = this.history[this.hisply].enpassant;
    this.fiftymove = this.history[this.hisply].fiftymove;

    if (this.enpassant !== Squares.NO_SQUARE) this.hash_enpassant();
    this.hash_castle();

    this.side ^= 1;
    this.hash_side();

    if (enpassant) {
      if (this.side === SIDES.WHITE) {
        this.add_piece(PIECES.bP, to + 16);
      } else {
        this.add_piece(PIECES.wP, to - 16);
      }
    }
    
    if (castling) {

      switch (to) {
        case SQUARES.C1: this.move_piece(SQUARES.D1, SQUARES.A1); break;
        case SQUARES.C8: this.move_piece(SQUARES.D8, SQUARES.A8); break;
        case SQUARES.G1: this.move_piece(SQUARES.F1, SQUARES.H1); break;
        case SQUARES.G8: this.move_piece(SQUARES.F8, SQUARES.H8); break;
      }
    }

    this.move_piece(to, from);

    if (captured) {
      this.add_piece(captured, to);
    }

    if (promoted) {
      this.clear_piece(from);
      const pawn = (this.side) === SIDES.WHITE ? PIECES.wP : PIECES.bP;
      this.add_piece(pawn, from);
    }  
  }
  

  print_moves() {
    const groups: any = {};
    const moves = this.get_client_moves();
    
    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      const from = move.from
      const piece = Pieces.unicode(this.board[Squares.string_to_number[from]]);
      if (from in groups) {
        groups[from].push({ piece, ...move});
      } else {
        groups[from] = [{ piece, ...move}];
      }
    }
    const keys = Object.keys(groups);

    for (let i = 0; i < keys.length; i++) {
      const group = groups[keys[i]];
      this.print_move(group);
    }

    return moves;
  }

  move_exists(move: number) {
    if (!move) throw new Error('move is invalid');

    this.generate_moves();
      
    let index;
    let moveFound = 0;
    for(index = this.moves_start[this.ply]; index < this.moves_start[this.ply + 1]; ++index) {
      moveFound = this.moves[index];	
      if(this.make_move(moveFound) === false) {
        continue;
      }				
      this.undo_move();
      if(move == moveFound) {
        return true;
      }
    }
    return false;
  }

  print_move(move: any) {
    let string = '';
    if (Number.isInteger(move)) {
      const { from, to } = Move.pretty(move);
      const piece = Pieces.unicode(this.board[Move.from(move)]);
      string = `${piece}: ${from} -> ${to}`;
    } 
    else if (Array.isArray(move)) {
      string += `${move[0].piece}: ${move[0].from} ->`;
      for (let i = 0; i < move.length; i++) {
        string += ` ${move[i].to}`;
      }
    } 
    else {
      string += `${move.from} -> ${move.to}`;
    }
    // console.log(string)
    return string;
  }

  print_board() {
    let str = '';
    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 16; file++) {
        const square = rank * 16 + file;

        if (file === 0) {
          str += `${8 - rank} `;
        }
        if (!Squares.offboard(square)) {
          str += Pieces.unicode(this.board[square]);
        }
      }
      str += '\n';
    }

    str += '  a b c d e f g h'.split(' ').join(' ');
    str += `\n\nside to move: ${this.side === SIDES.WHITE ? 'white' : 'black'}`;
    str += `\ncastling:     ${CASTLEBIT_TO_STR(this.castling) || '-'}`;
    str += `\nenpassant:    ${Squares.offboard(this.enpassant) ? '-' : Squares.toString(this.enpassant)}`;
    str += `\nkey:          ${this.key}`
    // console.log(str);
    return str;
  }

  reset_board() {
    this.side = SIDES.BOTH;
    this.enpassant = Squares.NO_SQUARE;
    this.castling = 0;
    this.ply = 0;
    this.key = 0;
    this.fiftymove = 0;
    this.moves_start[this.ply] = 0;

    for (let i = 0; i < 128; i++) {
      this.board[i] = 0;
    }
  }

  attacked(sq: SQUARES, side: SIDES): boolean {
    let pce: number;
    let t_sq: number;
    let dir: number;
    const { BISHOP, KING, ROOK, KNIGHT } = OFFSETS;
    let n = side === SIDES.WHITE ? 0 : 6;
    
    for (let i = 0; i < BISHOP.length; i++) {
      dir = BISHOP[i];
      t_sq = sq + dir;
      pce = this.board[t_sq];
      while (!(t_sq & 0x88) && !pce) {
        t_sq += dir;
        pce = this.board[t_sq];
      }
      if (pce === 3 + n || pce === 5 + n) {
        return true;
      }
    }

    for (let i = 0; i < ROOK.length; i++) {
      dir = ROOK[i];
      t_sq = sq + dir;
      pce = this.board[t_sq];
      while (!(t_sq & 0x88) && !pce) {
        t_sq += dir;
        pce = this.board[t_sq];
      }

      if (pce === 4 + n || pce === 5 + n) {
        return true;
      }
    }

    for (let i = 0; i < KNIGHT.length; i++) {
      dir = KNIGHT[i];
      pce = this.board[sq + dir];
      if (pce === 2 + n) {
        return true;
      }
    }

    if (side === SIDES.WHITE) {
      if (this.board[sq + 15] === 1 || this.board[sq + 17] === 1) {
        return true;
      }
    } else {
      if (this.board[sq - 15] === 7 || this.board[sq - 17] === 7) {
        return true;
      }
    }

    for (let i = 0; i < KING.length; i++) {
      dir = KING[i];
      pce = this.board[sq + dir];
      if (pce === 6 + n) {
        return true;
      }
    }

    return false;
  }

  fen_to_board(fen: string) {
    const validation = validate_fen(fen);
    if (validation.error) {
      return console.warn(validation.error);
    }
    this.reset_board();
    const tokens = fen.split(/\s+/);
    const [pieces, side, castling, enpassant, fiftymove, fullmove] = tokens;
    let rank = 0;
    let file = 0;
    let piece = 0;
    let p = 0;
    for (let i = 0; i < pieces.length; i++) {
      const c = pieces[i];
      if (c === '/') {
        rank++;
        file = 0;
      } else if (/^[1-8]$/.test(c)) {
        file += Number(c);
      } else {
        piece = Pieces.getValue(c);
        if (Pieces.isKing(piece)) {
          this.kings[Pieces.side(piece)] = rank * 16 + file;
        }
        this.board[rank * 16 + file] = piece;
        file++;
      }
    }
    this.side = side === 'w' ? SIDES.WHITE : SIDES.BLACK;
    for (let i = 0; i < castling.length; i++) {
      switch (castling[i]) {
        case 'K': this.castling |= CASTLEBIT.K; break;
        case 'Q': this.castling |= CASTLEBIT.Q; break;
        case 'k': this.castling |= CASTLEBIT.k; break;
        case 'q': this.castling |= CASTLEBIT.q; break;
      }
    }
    
    if (enpassant !== '-') {
      this.enpassant = Squares.fromString(enpassant);
    }

    this.fiftymove = Number(fiftymove);
    this.fullmove = Number(fullmove);
    
    this.fen = fen;
    this.key = this.generate_position_key();
    return fen;
  }

  print_squares_attacked() {
    let str = '';
    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 16; file++) {
        const square = rank * 16 + file;

        if (file === 0) {
          str += `${8 - rank} `;
        }
        if (!Squares.offboard(square)) {
          str += this.attacked(square, SIDES.BLACK) ? '.' : ' ';
        }
      }
      str += '\n';
    }

    str += '  abcdefgh';
    console.log(str);
  }

  board_to_fen() {
    let empty = 0;
    let pieces = '';
    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 16; file++) {
        const square = rank * 16 + file;
        if (Squares.offboard(square)) {
          continue;
        }
        const piece = this.board[square];
        if (piece === 0) {
          empty++;
        } else {
          if (empty > 0) {
            pieces += empty;
            empty = 0;
          }
          pieces += Pieces.char(piece);
        }
      }
      if (empty > 0) {
        pieces += empty;
        empty = 0;
      }
      if (rank < 7) {
        pieces += '/';
      }
    }

    const side = this.side === SIDES.WHITE ? 'w' : 'b';
    let castling = this.castling ? '' : '-';
    
    if (this.castling & CASTLEBIT.K) {
      castling += 'K';
    }
    if (this.castling & CASTLEBIT.Q) {
      castling += 'Q';
    }
    if (this.castling & CASTLEBIT.k) {
      castling += 'k';
    }
    if (this.castling & CASTLEBIT.q) {
      castling += 'q';
    }

    const enpassant = this.enpassant !== Squares.NO_SQUARE ? ` ${Squares.toString(this.enpassant)}` : ' -';

    const fen = `${pieces} ${side} ${castling} ${enpassant} ${this.fiftymove} ${this.fullmove}`;
    return fen;
  }

  in_check(): boolean {
    return this.attacked(this.kings[this.side], this.side ^ 1);
  }

  white_turn(): boolean {
    return this.side === SIDES.WHITE;
  }

  black_turn(): boolean {
    return this.side === SIDES.BLACK;
  }

  get_client_moves() {
    const moves = [];
    for (let i = this.moves_start[this.ply]; i < this.moves_start[this.ply + 1]; i++) {
      if (this.make_move(this.moves[i]) === false) continue;
      this.undo_move();
      moves.push(Move.pretty(this.moves[i]));
    }

    return moves;
  }

  get_capture_moves() {
    const moves = [];
    for (let i = this.moves_start[this.ply]; i < this.moves_start[this.ply + 1]; i++) {
      if (this.make_move(this.moves[i]) === false) continue;
      this.undo_move();
      if (Move.is_capture(this.moves[i])) {
        moves.push(this.moves[i]);
      }
    }

    return moves;
  }
  
  generate_moves(onlyCaptures = false): void {
    this.moves_start[this.ply + 1] = this.moves_start[this.ply];

    const side = this.side;

    // loop over all squares
    for (let sq = 0; sq < 120; sq++) {
      if (offboard(sq)) { 
        sq += 7; continue; 
      };
      if (!this.board[sq] || sides[this.board[sq]] !== side) continue;
      const n = side === SIDES.WHITE ? 0 : 6;
      const pce = this.board[sq];  
      const offsets = OFFSETS_BY_PIECE[pce];

      if (pce === 1 + n) {
          const startRank = side === SIDES.WHITE ? 2 : 7;
          const promotionRank = side === SIDES.WHITE ? 7 : 2;
          const [one, two, c1, c2] = offsets;

          if (rank(sq) === promotionRank) {
            // pawn promotions
            const promotions = Pieces.PROMOTIONS[side];
            for (let i = 0; i < promotions.length; i++) {
              const canPromote = !this.board[sq + one] && !onlyCaptures;
              canPromote && this.add_quiet_move(sq, sq + one, 0, promotions[i]);
              
              if (opponents(pce, this.board[sq + c1])) {
                this.add_capture_move(sq, sq + c1, this.board[sq + c1], promotions[i]);
              }
              if (opponents(pce, this.board[sq + c2])) {
                this.add_capture_move(sq, sq + c2, this.board[sq + c2], promotions[i]);
              }
            }
            continue;
          }
        
          // pawn one-square moves
          if (onboard(sq + one) && !this.board[sq + one]) {
            !onlyCaptures && this.add_quiet_move(sq, sq + one);
            // pawn two-square moves
            if (rank(sq) === startRank && !this.board[sq + two]) {
              !onlyCaptures && this.add_quiet_move(sq, sq + two, 0, 0, Move.flags.doublepawn);
            }
          }

          // pawn captures
          if (sides[pce] === (sides[this.board[sq + c1]] ^ 1)) {
            this.add_capture_move(sq, sq + c1, this.board[sq + c1]);
          }

          if (sides[pce] === (sides[this.board[sq + c2]] ^ 1)) {
            this.add_capture_move(sq, sq + c2, this.board[sq + c2]);
          }

          // en passant
          if (this.enpassant !== Squares.NO_SQUARE) {
            if (sq + c1 === this.enpassant) {
              !onlyCaptures && this.add_enpassant_move(sq, sq + c1, 0, 0, Move.flags.enpassant);
            }
            if (sq + c2 === this.enpassant) {
              !onlyCaptures && this.add_enpassant_move(sq, sq + c2, 0, 0, Move.flags.enpassant);
            }
          }
          continue;
        }

        if (pce === 2 + n || pce === 6 + n) {
          // Knight and King
          for (let i = 0; i < offsets.length; i++) {
            const offset = offsets[i];
            const to = sq + offset;
            if (onboard(to)) {
              if (opponents(pce, this.board[to])) {
                this.add_capture_move(sq, to, this.board[to]);
              } else if (!this.board[to] && !onlyCaptures) {
                this.add_quiet_move(sq, to);
              }
            }
          }

          if (pce === 6 + n) {
            // Castling
            if (onlyCaptures) continue;
            if (side === SIDES.WHITE) {
              if (this.castling & CASTLEBIT.K) {
                if (!this.board[F1] && !this.board[G1] && !this.attacked(F1, SIDES.BLACK) && !this.attacked(E1, SIDES.BLACK)) {
                  this.add_quiet_move(E1, G1, 0, 0, Move.flags.castling);
                }
              }

              if (this.castling & CASTLEBIT.Q) {
                if (!this.board[D1] && !this.board[C1] && !this.board[B1] && !this.attacked(D1, SIDES.BLACK) && !this.attacked(E1, SIDES.BLACK)) {
                  this.add_quiet_move(E1, C1, 0, 0, Move.flags.castling);
                }
              }
            } else {
              if (this.castling & CASTLEBIT.k) {
                if (!this.board[F8] && !this.board[G8] && !this.attacked(F8, SIDES.WHITE) && !this.attacked(E8, SIDES.WHITE)) {
                  this.add_quiet_move(E8, G8, 0, 0, Move.flags.castling);
                }

                if (this.castling & CASTLEBIT.q) {
                  if (!this.board[D8] && !this.board[C8] && !this.board[B8] && !this.attacked(D8, SIDES.WHITE) && !this.attacked(E8, SIDES.WHITE)) {
                    this.add_quiet_move(E8, C8, 0, 0, Move.flags.castling);
                  }
                }
              }
            }
          }
          continue;
        }
        if (/B|R|Q/i.test(char[pce])) {
          // Bishop, Rook, Queen
          for (let i = 0; i < offsets.length; i++) {
            const offset = offsets[i];
            let to = sq + offset;
            while (onboard(to)) {
              if (opponents(pce, this.board[to])) {
                this.add_capture_move(sq, to, this.board[to]);
                break;
              } else if (!this.board[to] && !onlyCaptures) {
                this.add_quiet_move(sq, to);
              } else {
                break;
              }
              to += offset;
            }
          }
          continue;
        }
    }

  }

  add_quiet_move(from: number = 0, to: number = 0, captured: number = 0, promoted: number = 0, flag: number = 0) {
    this.move_scores[this.moves_start[this.ply+1]] = 0;
    const move = Move.bit({from, to, captured, promoted, enpassant: +(flag === Move.flags.enpassant), doublepawn: +(flag === Move.flags.doublepawn), castling: +(flag === Move.flags.castling)});
    this.moves[this.moves_start[this.ply+1]] = move;

    if(move == this.search_killers[this.ply]) { 
      this.move_scores[this.moves_start[this.ply+1]] = 900000;
    } else if(move == this.search_killers[this.ply + MAXDEPTH]) {
      this.move_scores[this.moves_start[this.ply+1]] = 800000;
    } else {
      this.move_scores[this.moves_start[this.ply+1]] = this.search_history[this.board[from] * BOARDSQUARES + this.board[to]];
    }

    this.moves_start[this.ply+1]++;
  }

  add_enpassant_move(from: number = 0, to: number = 0, captured: number = 0, promoted: number = 0, flag: number = 0) {
    this.moves[this.moves_start[this.ply+1]] = Move.bit({from, to, captured, promoted, enpassant: +(flag === Move.flags.enpassant), doublepawn: +(flag === Move.flags.doublepawn), castling: +(flag === Move.flags.castling)});
    this.move_scores[this.moves_start[this.ply+1]++] = 105 + 1000000;
  }

  add_capture_move(from: number = 0, to: number = 0, captured: number = 0, promoted: number = 0, flag: number = 0) {
    this.moves[this.moves_start[this.ply+1]] = Move.bit({from, to, captured, promoted, enpassant: +(flag === Move.flags.enpassant), doublepawn: +(flag === Move.flags.doublepawn), castling: +(flag === Move.flags.castling)});
    this.move_scores[this.moves_start[this.ply+1]++] = this.search_history[this.board[from] * BOARDSQUARES + this.board[to]] + 1000000;
  }

  get_moves(): number[] {
    const moves = [];
    for (let i = this.moves_start[this.ply]; i < this.moves_start[this.ply + 1]; i++) {
      moves.push(this.moves[i]);
    }
    return moves;
  }

}
export default Board;
