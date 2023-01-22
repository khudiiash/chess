import { MainPage, JoinPage, InvitePage, SettingsPage, DifficultyPage, PausePage, GameOverPage, Page } from "./pages";
import { Observer } from "@/components";
import { button } from "./elements/button/button";
import { events } from "@/../../globals";
import {boundClass} from 'autobind-decorator'
import './styles/menu.scss';

@boundClass
class Menu {

  pages: Map<string, Page>;
  observer: Observer;
  dom: HTMLDivElement;
  page: Page;
  visible: boolean;
  menuButton: HTMLButtonElement;
  prev: Page;
  current: Page;
  background: HTMLDivElement;

  build() {
    this.dom = document.createElement('div');
    this.dom.classList.add('menu');
    this.createBackground();
    this.createObservers();
    this.createPages();
    this.createMenuButton();
  }

  createBackground() {
    this.background = document.createElement('div');
    this.background.classList.add('background');
    this.dom.appendChild(this.background);
  }

  createObservers() {
    this.observer = new Observer();
    const bindObservers = ([event, callback]: [events, any]) => this.observer.on(event, callback);
    Object.entries({
      [events.loaded]:    this.open,
      [events.start]:     this.close,
      [events.restart]:   this.close,
      [events.restore]:   this.close,
      [events.back]:      this.back,
      [events.goto]:      this.goto,
      [events.checkmate]: () => this.open('gameover'),
    }).forEach(bindObservers);
  }

  createPages() {
    this.pages = new Map();
    this.pages.set('main',       new MainPage())
              .set('join',       new JoinPage())
              .set('invite',     new InvitePage())
              .set('settings',   new SettingsPage())
              .set('difficulty', new DifficultyPage())
              .set('pause',      new PausePage())
              .set('gameover',   new GameOverPage())
    for (const page of this.pages.values()) {
      this.dom.appendChild(page.dom);
    }

    this.current = this.pages.get('main');
  }

  createMenuButton() {
    this.menuButton = button('...', this.pause, ['open-menu-button']);
    this.dom.appendChild(this.menuButton);
  }

  pause() {
    this.observer.emit(events.pause);
    this.open('pause');
  }

  back() {
    this.goto(this.prev.name);
  }

  close() {
    this.current.hide();
    this.dom.classList.remove('active');
    this.background.classList.remove('active');
    this.menuButton.classList.add('active');
    this.observer.emit(events.resume);
  }

  open(page?: string) {
    this.dom.classList.add('active');
    this.menuButton.classList.remove('active');
    this.background.classList.add('active');
    if (this.current.name === page) return;
    this.goto(page || this.current.name);
    this.observer.emit(events.pause);
  }

  goto(name: string) {
    this.current.hide();
    this.observer.emit(events.resume);
    this.prev = this.current;
    this.current = this.pages.get(name);
    this.current.show();
  }
}

export default Menu;