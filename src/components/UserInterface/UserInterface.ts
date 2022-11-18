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
    this.view.build({ styles: this.model.styles });
    this.observer = new Observer();
    this.createMenuButtons();
    this.createInGameUI();
  }

  createInGameUI() {
    this.view.createButton({
      text: 'Menu',
      style: this.model.styles.openMenuButton,
      parent: document.body,
      className: 'open-menu-button',
      callback: this.onMenuButton.bind(this)
    });
  }

  onMenuButton() {
    this.view.menu.style.display === 'none' ? this.view.showMenu() : this.view.hideMenu();
  }

  createMenuButtons() {

    this.view.createButton({
      text: 'Continue',
      style: this.model.styles.button,
      parent: this.view.menu,
      className: 'menu-button',
      callback: this.onContinue.bind(this)
    });

    this.view.createButton({
      text: 'Restart',
      style: this.model.styles.button,
      parent: this.view.menu,
      className: 'menu-button',
      callback: this.onRestart.bind(this)
    });
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