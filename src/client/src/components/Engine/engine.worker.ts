import Board from './board';
import Perft from './perft';
import Search from './search';

class EngineWorker {

  board: Board;
  perft: Perft;
  search: any;
  
  constructor() {
    this.board = new Board();
    this.search = new Search();
    this.perft = new Perft(this.board);
    this.setup();
  }


  setup() {
    self.onmessage = (event) => {
      let output = null;
      const { method, input } = event.data;

      switch (method) {
        case 'set_board': {this.board.fen_to_board(input); this.board.generate_moves()}; break;
        case 'print_board': output = this.board.print_board(); break;
        case 'get_moves': output = this.board.get_client_moves(); break; 
        case 'generate_moves': output = this.board.generate_moves(); break;
        case 'make_move': output = this.board.make_move(input); break;
        case 'undo_move': output = this.board.undo_move(); break;
        case 'print_moves': output = this.board.print_moves(); break;
        case 'perft': output = this.perft.run(input); break;
        case 'in_check': output = this.board.in_check(); break;
        case 'get_best_move': output = this.search.get_best_move(); break;
        case 'set_difficulty': this.search.set_difficulty(input); break;
        case 'get_material': output = this.search.get_material(); break;
        default: break;
      }

      self.postMessage({ method: event.data.method, output });
    }

  }


  // ...
}

new EngineWorker();

export default EngineWorker;