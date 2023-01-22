import { MAXDEPTH, PVENTRIES } from "./constants";
import Board from "./board";

interface PVEntry {
  move: number;
  key: number;
}

class PV {
  board: Board;
  pvarray: any;

 constructor() {
  this.table = new Array(PVENTRIES);
  this.pvarray = new Array(MAXDEPTH);
  this.board = new Board();
  this.clear();
 }

  clear() {
    for (let i = 0; i < PVENTRIES; i++) {
      this.table[i] = {
        move: 0,
        key: 0
      };
    }
  }

  store(move: number) {
    const index = this.board.key % PVENTRIES;
    this.table[index].key = this.board.key;
    this.table[index].move = move;
  }

  get_move() {
    const key = this.board.key;
    const index = key % PVENTRIES;

    if (this.table[index].key === key) {
      return this.table[index].move;
    }
    return 0;
  }

  table: PVEntry[];

  
}

export default PV;