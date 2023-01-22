import Board from "./board";
import { Move } from "./move";

class Perft {
    private board: Board;
    private depth: number;
    nodes: number;

    constructor(board: Board, depth: number = 1) {
      this.board = board;
      this.depth = depth;
    }

    public run(depth: number = this.depth): number {
      this.depth = depth;
      // console.log("Starting Test To Depth:" + this.depth);	
      console.time("Perft");
      this.nodes = 0;
      this.board.generate_moves();
      const moves = this.board.get_moves();

      let moveNum = 0;
      for (let i = 0; i < moves.length; i++) {
        const move = moves[i];
        if (this.board.make_move(move) === false) {
          continue;
        }
        moveNum++;
        let cumnodes = this.nodes;
        this.perft(this.depth - 1);
        // if (res === -1) {
        //   return -1;
        // }
        this.board.undo_move();
        let oldnodes = this.nodes - cumnodes;
        console.log(`Move ${moveNum}: ${this.board.print_move(move)} : ${oldnodes}`);
      }

      console.log("Test Complete : " + this.nodes + " leaf nodes visited");
      console.timeEnd("Perft");
      return;
    }

    private perft(depth: number): number {
        if (depth == 0) {
            this.nodes++;
            return;
          }	
      
        this.board.generate_moves();
          
        const moves = this.board.get_moves();
        for (let i = 0; i < moves.length; i++) {
          const move = moves[i];
          const board = this.board.print_board();
          if (this.board.make_move(move) === false) {
            continue;
          }
          this.perft(depth - 1);
          this.board.undo_move();
          const oldBoard = this.board.print_board();
          if (board !== oldBoard) {
            const { from, to, captured, promoted, enpassant } = Move.pretty(move)
            console.error(`Board is not the same after undoing move ${Move.pretty(move)}`);
            console.error(`Board before move:\n${board}`);
            console.error(`Board after move:\n${oldBoard}`);
            console.error(`Move: from: ${from}, to: ${to}, captured: ${captured}, promoted: ${promoted}, enpassant: ${enpassant}`);
            return - 1;
          }
        }
    }
}

export default Perft;