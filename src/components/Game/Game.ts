import { Scene, Board, UserInterface } from '@/components';
import Model from './GameModel';
import View from './GameView';

class Game {

  model: Model;
  view: View;
  scene: Scene;
  board: Board;
  ui: UserInterface;

  constructor() {
    this.scene = new Scene();
    this.board = new Board();
    this.model = new Model();
    this.view = new View();
    this.ui = new UserInterface();
  }

  build() {
    (window as any).game = this;
    this.scene.build(this.onLoad.bind(this));
    this.ui.build();
  }

  onLoad(resources: any) {
    this.board.build(resources);
    this.scene.add(this.board.view.mesh);
    this.handleClick();
  }

  start() {
    this.build();
  }

  handleClick() {
    document.addEventListener( 'pointerdown', this.onClick.bind(this), false );
  }

  fadeMainLight() {
    this.scene.fadeMainLight();
  }

  restoreMainLight() {
    this.scene.restoreMainLight();
  }

  onClick(event: any) {
    this.scene.onClick(event);
  }
}

export default Game;