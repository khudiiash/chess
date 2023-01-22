import { IComponent } from "@/interfaces";
import { Observer } from "@/components";

import UIModel from './UIModel';
import UIView from './UIView';
import Menu from './menu/menu';
import Info from './info/info';
import gsap from 'gsap';
import { events } from "@/../../globals";

class UI implements IComponent {
  
  model: UIModel;
  view: UIView;
  observer: Observer;
  menu: Menu;
  info: Info;
  
  constructor() {
    this.model = new UIModel();
    this.view = new UIView();
  }

  build() {
    this.view.build();
    this.createObservers();
    this.menu = new Menu();
    this.info = new Info();
    this.view.add(this.menu, this.info);
  }

  createObservers() {
    this.observer = new Observer();
  }

}

export default UI;