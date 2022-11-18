import { IView } from "@/interfaces";
import gsap from 'gsap';

class UserInterfaceView implements IView {
  container: HTMLDivElement;
  buttonsPanel: any;
  styles: any;
  menu: HTMLDivElement;
  menuTimeline: gsap.core.Timeline;
  constructor() {

  }

  build({ styles }: any) {
    this.styles = styles;
    this._createMenu();
  }


  private _createMenu() {
    const menu = document.createElement('div');
    menu.setAttribute('id', 'menu');
    Object.assign(menu.style, this.styles.menu);
    document.body.appendChild(menu);
    this.menu = menu;
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

  createButton({ text, style, parent, className, callback }: any) {
    const button = document.createElement('button');
    button.textContent = text;
    className && button.classList.add(className);
    style && Object.assign(button.style, style);
    parent.appendChild(button);
    button.addEventListener('click', callback);
  }


}

export default UserInterfaceView;