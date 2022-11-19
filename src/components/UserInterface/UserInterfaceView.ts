import { IView } from "@/interfaces";
import gsap from 'gsap';
import gsapTrial from "gsap-trial";
import './ui.scss';

class UserInterfaceView implements IView {
  container: HTMLDivElement;
  buttonsPanel: any;
  menu: HTMLDivElement;
  menuTimeline: gsap.core.Timeline;
  turnContainer: HTMLDivElement;

  constructor() {

  }

  build() {
    this._createMenu();
    this._createTurnContainer();
  }
 
  private _createTurnContainer() {
    this.turnContainer = document.createElement('div');
    this.turnContainer.classList.add('turn-container');
    const frame = document.createElement('div');
    frame.classList.add('turn-frame');
    this.turnContainer.appendChild(frame);
    document.body.appendChild(this.turnContainer);
  }

  private _createMenu() {
    const menu = document.createElement('div');
    menu.classList.add('menu');
    document.body.appendChild(menu);
    this.menu = menu;
  }

  switchTurn(turn: string) {
    const turnFrame = document.querySelector('.turn-frame');
    gsap.to(turnFrame, { duration: 0.5, x: turn === 'white' ? 0 : 60 });
  }

  hideMenu() {
    this.menuTimeline.reverse();
  }

  showMenu() {
   if (this.menuTimeline) this.menuTimeline.play(0)
   else {
    this.menuTimeline = gsap.timeline()
      .set(this.menu, { display: 'flex' })
      .from(this.menu, { duration: 0.5, opacity: 0 })
      .from(this.menu.children, { duration: 0.5, y: 35, opacity: 0, stagger: 0.1 }, '-=0.2');
   }
  }

  createButton({ text, parent, classes, image, callback }: any) {
    const button = document.createElement('button');
    image && (button.style.backgroundImage = `url(${image})`);
    button.textContent = text;
    classes && button.classList.add(...classes);
    parent.appendChild(button);
    button.addEventListener('click', callback);
  }


}

export default UserInterfaceView;