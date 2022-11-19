import { IComponent } from "@/interfaces";
import { Observer } from "@/components";

import UserInterfaceModel from './UserInterfaceModel';
import UserInterfaceView from './UserInterfaceView';
class UserInterface implements IComponent {
  
  model: UserInterfaceModel;
  view: UserInterfaceView;
  observer: Observer;
  
  constructor() {
    this.model = new UserInterfaceModel();
    this.view = new UserInterfaceView();
  }

  build() {
    this.view.build();
    this.createObservers();
    this.createMenuButtons();
    this.createTurns();
    this.createInGameUI();
  }
  createObservers() {
    this.observer = new Observer();
    const { turn, gameover } = this.observer.events;
    this.observer.subscribe(turn, this.onTurn.bind(this));
    this.observer.subscribe(gameover, this.onGameOver.bind(this));
  }

  onTurn(turn: string) {
    this.view.switchTurn(turn);
  }

  onGameOver(data: any) {
    console.log('game over', data);
  }

  createInGameUI() {
    this.view.createButton({
      text: 'Menu',
      parent: document.body,
      classes: ['open-menu-button'],
      callback: this.onMenuButton.bind(this)
    });
  }

  onMenuButton() {
    this.view.menu.style.display === 'flex' ? this.view.hideMenu() : this.view.showMenu();
  }

  createTurns() {
    this.view.createButton({
      parent: this.view.turnContainer,
      classes: ['turn', 'white'],
      image: '/textures/ui/knight_white.png',
    })

    this.view.createButton({
      parent: this.view.turnContainer,
      classes: ['turn', 'black'],
      image: '/textures/ui/knight_black.png',
    })
  }

  createMenuButtons() {

    this.view.createButton({
      text: 'Continue',
      parent: this.view.menu,
      classes: ['menu-button'],
      callback: this.onContinue.bind(this)
    });

    this.view.createButton({
      text: 'Restart',
      parent: this.view.menu,
      classes: ['menu-button'],
      callback: this.onRestart.bind(this)
    })
  }

  onContinue() {
    this.observer.emit(this.observer.events.continue);
    this.view.hideMenu();
  }

  onRestart() {
    this.observer.emit(this.observer.events.restart);
    this.view.hideMenu();
  }



}

export default UserInterface;