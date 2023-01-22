import { resolve } from "@/../webpack.common";

export class Engine {
  
  engineWorker: Worker;
  static instance: Engine;
  promises: any;
  
  constructor() {
    if (Engine.instance) {
      return Engine.instance;
    } else {
      Engine.instance = this;
    }
    this.engineWorker = new Worker(new URL('./engine.worker', import.meta.url));
    this.promises = {}
    this.engineWorker.onmessage = (event) => {
      this.on_message(event);
    }
  }

  on_message(event: any) {
    const { method, output } = event.data;
    this.promises[method]?.(output);
  }

  set_difficulty(difficulty: string) {
    return this.request('set_difficulty', difficulty);
  }

  get_material() {
    return this.request('get_material');
  }

  print_board() {
    return this.request('print_board');
  }

  make_move(move: number) {
    return this.request('make_move', move);
  }

  undo_move() {
    return this.request('undo_move');
  }

  get_moves() {
    return this.request('get_moves');
  }

  get_best_move() {
    return this.request('get_best_move');
  }

  generate_moves() {
    return this.request('generate_moves');
  }

  print_moves() {
    return this.request('print_moves');
  }

  perft(depth: number) {
    return this.request('perft', depth);
  }

  set_board(fen: string) {
    return this.request('set_board', fen);
  }

  in_check() {
    return this.request('in_check');
  }

  request(method: string, input?: any) {
    this.engineWorker.postMessage({ method, input });
    return new Promise(res => {
      this.promises[method] = res;
    });
  }
  
}