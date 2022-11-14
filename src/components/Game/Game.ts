import { Scene, Board } from '@/components';
import Model from './GameModel';
import View from './GameView';

class Game {

  model: Model;
  view: View;
  scene: Scene;
  board: Board;

  constructor() {
    this.scene = new Scene();
    this.board = new Board();
    this.model = new Model();
    this.view = new View();
  }

  build() {
    (window as any).game = this;
    this.scene.build();
    this.board.build();
    this.scene.add(this.board.view.mesh);
    this.handleClick();
  }

  start() {
    this.build();
    this.board.start();
  }

  handleClick() {
    document.addEventListener( 'pointerdown', this.onClick.bind(this), false );
  }

  onClick(event: any) {
    this.scene.onClick(event);
  }
}

export default Game;