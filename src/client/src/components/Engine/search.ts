import Board from "./board";
import { BOARDSQUARES, MATE, MAXDEPTH, sides } from "./constants";
import { Move } from "./move";
import { int8 } from "./utils";
import PV from "./pv";
import { Difficulty } from "@/types";

class Search {
    
  board: Board;
  stop: any;
  killers: Uint32Array;
  history: Uint32Array;
  pv: PV;
  nodes: number;
  start: number;
  firstHighFail: number;
  firstHigh: number;
  time: number;
  depth: number;
  max_depth: number;
  difficulty: string;
  mistake_probability: number;

  constructor() {
    this.board = new Board();
    this.stop = false;
    this.time = 2000;
    this.nodes = 0;
    this.start = 0;
    this.firstHighFail = 0;
    this.firstHigh = 0;
    this.max_depth = MAXDEPTH;
    this.killers = new Uint32Array(MAXDEPTH);
    this.history = new Uint32Array(14 * BOARDSQUARES);
    this.pv = new PV();
    this.mistake_probability = 0;
    this.initEval();
  }

  initEval() {
    const { p, n, b, r, q, k } = this.evaluation.pst;
    this.evaluation.positions = [
      [],
      int8(p), int8(n), int8(b), int8(r), int8(q), int8(k),
      int8(p, true), int8(n, true), int8(b, true), int8(r, true), int8(q, true), int8(k, true),
    ];
  }

  sort_moves(moves: number[], depth: number) {
    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      const score = this.history[move & 0x7fff];
      moves[i] = (score << 16) | move;
    }

    moves.sort((a, b) => b - a);

    for (let i = 0; i < moves.length; i++) {
      moves[i] = moves[i] & 0x7fff;
    }
  }

  get_material(): number {
    this.updateMaterial();
    return this.evaluation.material[0] - this.evaluation.material[1];
  }

  updateMaterial() {
    const { material } = this.evaluation;
    const { board } = this;
    material[0] = 0;
    material[1] = 0;
    
    for (let sq = 0; sq < BOARDSQUARES; sq++) {
      if (sq & 0x88) {
        sq += 7;
        continue;
      }
      const piece = board.board[sq];
      if (piece !== 0) {
        material[sides[piece]] += this.evaluation.weights[piece];
      }
    }
  }

  evaluate(): number {
    const { positions, material } = this.evaluation;
    const { board } = this;
    let score = 0;
    let whiteBishops = 0;
    let blackBishops = 0;

    this.updateMaterial();

    for (let sq = 0; sq < BOARDSQUARES; sq++) {
      if (sq & 0x88) {
        sq += 7;
        continue;
      }

      const piece = board.board[sq];
      if (piece !== 0) {
        score += positions[piece][sq];
        piece === 3 && whiteBishops++;
        piece === 9 && blackBishops++;
      }
    }

    if (board.side === 1) {
      score = -score;
    }

    if (board.in_check()) {
      if (board.side === 1) {
        score -= 100;
      } else {
        score += 100;
      }
    }

    
    if (whiteBishops >= 2) {
      score += 50;
    }

    if (blackBishops >= 2) {
      score -= 50;
    }

    return score + material[board.side] - material[board.side ^ 1];
  }

  checkTime() {
    if (Date.now() - this.start > this.time) {
      this.stop = true;
    }
  }

  pick_next_move(moveIndex: number) {
    let index = 0;
    let bestScore = -1;
    let bestIndex = moveIndex;
    const board = this.board;
    
    for(index = moveIndex; index < board.moves_start[board.ply+1]; ++index) {
      if(board.move_scores[index] > bestScore) {
        bestScore = board.move_scores[index];
        bestIndex = index;			
      }
    } 
    
    if(bestIndex != moveIndex) {
      // swap the moves so the best move is searched first
      [board.move_scores[moveIndex], board.move_scores[bestIndex]] = 
      [board.move_scores[bestIndex], board.move_scores[moveIndex]];
    }
  }

  is_repetition(): boolean {
    const { board } = this;
    // check for draw by repetition
    for (let i = board.hisply - board.fiftymove; i < board.hisply - 1; i++) {
      if (board.history[i].key === board.key) {
        return true;
      }
    }
    return false;
  }

  quiescence(alpha: number, beta: number): number {
    const { board } = this;
    !(this.nodes & 2047) && this.checkTime();

    this.nodes++;
    
    if( (board.fiftymove >= 100) && board.ply != 0) {
      return 0;
    }
    
    if(board.ply > MAXDEPTH - 1) {
      return this.evaluate();
    }	
    
    let score = this.evaluate();
    
    if(score >= beta) {
      return beta;
    }
    
    if(score > alpha) {
      alpha = score;
    }
    
    board.generate_moves(true);
    
    var index = 0;
    var legal = 0;
    var old_alpha = alpha;
    let best_move = 0;
    let move = 0;	

    for(index = board.moves_start[board.ply]; index < board.moves_start[board.ply + 1]; ++index) {
      this.pick_next_move(index);
      move = board.moves[index];	
  
      if(board.make_move(move) === false) {
        continue;
      }		
      legal++;
      score = -this.quiescence( -beta, -alpha);
      
      board.undo_move();
      
      if (this.stop) {
        return 0;
      }
      
      if(score > alpha) {
        if(score >= beta) {
          if(legal == 1) {
            this.firstHighFail++;
          }
          this.firstHigh++;
          return beta;
        }
        alpha = score;
        best_move = move;
      }		
    }
    
    if(alpha != old_alpha) {
      this.pv.store(best_move);
    }
    
    return alpha;
  }

  negamax(alpha: number, beta: number, depth: number): number {
    const { board, pv } = this;
    
    if(depth <= 0) {
      return this.quiescence(alpha, beta);
    }
    
    (this.nodes & 2047) === 0 && this.checkTime();
    
    this.nodes++;
    
    if( (this.is_repetition() || board.fiftymove >= 100) && board.ply !== 0) {
      return 0;
    }
    
    if (board.ply > MAXDEPTH - 1) {
      return this.evaluate();
    }	
    
    const in_check = this.board.in_check();
    in_check && depth++;
    
    let score = -Infinity;
    
    board.generate_moves();

    const old_alpha = alpha;
    let move_index = 0;
    let legal = 0;
    let best_move = 0;
    let move = 0;	
    
    const pvmove = pv.get_move();
    
    if (pvmove) {
      for (move_index = board.moves_start[board.ply]; move_index < board.moves_start[board.ply + 1]; ++move_index) {
        if(board.moves[move_index] === pvmove) {
          board.move_scores[move_index] = 2000000;
          break;
        }
      }
    }
    
    for(move_index = board.moves_start[board.ply]; move_index < board.moves_start[board.ply + 1]; ++move_index) {
      this.pick_next_move(move_index);	
      move = board.moves[move_index];	
      
      if(board.make_move(move) === false) {
        continue;
      }		
      legal++;
      score = -this.negamax( -beta, -alpha, depth-1);
      
      board.undo_move();
      
      if (this.stop) {
        return 0;
      }
      
      if (score > alpha) {
        if(score >= beta) {
          
          if(legal == 1) {
            this.firstHighFail++;
          }
          
          this.firstHigh++;		
          
          if(Move.is_capture(move)) {
            board.search_killers[MAXDEPTH + board.ply] = board.search_killers[board.ply];
            board.search_killers[board.ply] = move;
          }					
          return beta;
        }
        
        if(Move.is_capture(move)) {
          board.search_history[board.board[Move.from(move)] * BOARDSQUARES + Move.to(move)] += depth * depth;
        }
        alpha = score;
        best_move = move;				
      }		
    }	
    
    if (legal === 0) {
      return in_check ? -MATE + board.ply : 0;
    }	
    
    if (alpha !== old_alpha) {
      pv.store(best_move);
    }
    
    return alpha;
  }

  set_difficulty(difficulty: Difficulty): void {
    switch (difficulty) {
      case Difficulty.easy:
        this.mistake_probability = 0.5; break;
      case Difficulty.medium:
        this.mistake_probability = 0.3; break;
      case Difficulty.hard:
        this.mistake_probability = 0.1; break;
      default:
        this.mistake_probability = 0;
    }
  }

  get_best_move(): any {
    let bestMove = 0;
    let currentDepth = 0;
    this.clear();
    const isMistake = Math.random() < this.mistake_probability;

    this.board.generate_moves();
    const legnth = this.board.get_client_moves().length;
    console.log(this.board.ply)
    for (currentDepth = 1; currentDepth <= this.max_depth; ++currentDepth) {	
      this.negamax(-Infinity, Infinity, currentDepth);
      if (this.stop) {
        break;
      }
      bestMove = this.pv.get_move();
    }
   
    if (isMistake) {
      this.board.generate_moves();
      const moves = this.board.get_client_moves();
      const randomMove = moves[Math.floor(Math.random() * moves.length)];
      return randomMove;
    } else {
      return bestMove ? Move.pretty(bestMove) : 0;
    }
  }

  evaluation = {
    positions: new Array(13),
    material: new Array(2),
    weights: [0, 100, 280, 320, 479, 929, 6000, 100, 280, 320, 479, 929, 6000],
    pst: {
      p: [
          100, 100, 100, 100, 105, 100, 100, 100,   
          78, 83, 86, 73, 102, 82, 85, 90,          
          7, 29, 21, 44, 40, 31, 44, 7,             
          -17, 16, 0, 15, 15, 0, 16, -17,          
          -26, 3, 10, 0, 0, 10, 3, -26,            
          -22, 10, 4, -15, -15, 4, 10, -22,        
          -25, 5, 0, 0, 0, 0, 5, -25,              
          -28, 0, 0, 0, 0, 0, 0, -28,              
      ],
      n: [
          -66, -53, -75, -75, -10, -55, -58, -80,  
          -3, -1, -23, 0, 0, -27, -1, -3,          
          1, 27, 0, 29, 29, 0, 27, 1,              
          -12, 12, 16, 23, 23, 16, 12, -12,        
          -22, 2, 13, 20, 20, 13, 2, -22,          
          -23, 0, 10, 17, 17, 10, 0, -23,          
          -26, 0, 0, 0, 0, 0, 0, -26,              
          -66, -53, -75, -75, -10, -55, -58, -80,  
      ],
      b: [
          -59, -78, -82, -76, -23, -107, -37, -50,  
          -11, 20, 36, -42, -39, 31, 2, -22,        
          -9, 39, -32, 41, 52, -10, 29, -14,        
          25, 17, 20, 34, 26, 25, 15, 10,           
          13, 10, 17, 23, 17, 16, 0, 7,             
          14, 25, 24, 15, 8, 25, 20, 15,             
          19, 20, 11, 6, 7, 6, 20, 16,              
          -7, 2, -15, -12, -14, -15, -10, -10,      
      ],
      r: [
        35, 29, 33, 4, 37, 33, 56, 50,              
        55, 29, 56, 67, 55, 62, 34, 60,             
        19, 35, 28, 33, 45, 27, 25, 15,             
        0, 5, 16, 13, 18, -4, -9, -6,               
        -28, -35, -16, -21, -13, -29, -46, -30,     
        -42, -28, -42, -25, -25, -35, -26, -46,     
        -53, -38, -31, -26, -29, -43, -44, -53,     
        -30, -24, -18, 5, -2, -18, -31, -32,        
      ],
      q: [
        6, 1, -8, -104, 69, 24, 88, 26,            
        14, 32, 60, -10, 20, 76, 57, 24,           
        -2, 43, 32, 60, 72, 63, 43, 2,             
        1, -16, 22, 17, 25, 20, -13, -6,           
        -14, -15, -2, -5, -1, -10, -20, -22,       
        -30, -6, -13, -11, -16, -11, -16, -27,     
        -36, -18, 0, -19, -15, -15, -21, -38,      
        -39, -30, -31, -13, -31, -36, -34, -42,    
      ],
      k: [
        4, 54, 47, -99, -99, 60, 83, -62,         
        -32, 10, 55, 56, 56, 55, 10, 3,           
        -62, 12, -57, 44, -67, 28, 37, -31,       
        -55, 50, 11, -4, -19, 13, 0, -49,         
        -55, -43, -52, -28, -51, -47, -8, -50,    
        -47, -42, -43, -79, -64, -32, -29, -32,   
        -4, 3, -14, -50, -57, -18, 13, 4,         
        17, 30, -3, -14, 6, -1, 40, 18,           
      ],
    },
   
  }

  clear() {
    for (let i = 0; i < 14 * BOARDSQUARES;i++) {
      this.board.search_history[i] = 0;
    }

    for (let i = 0; i < 3 * MAXDEPTH; i++) {
      this.board.search_killers[i] = 0;
    }
    this.board.ply = 0;
    this.nodes = 0;
    this.firstHigh = 0;
    this.firstHighFail = 0;
    this.start = new Date().getTime();
    this.stop = 0;
    this.pv.clear();
  }
}

export default Search;