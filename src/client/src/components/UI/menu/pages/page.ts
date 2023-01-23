
import '../styles/page.scss'
import gsap from 'gsap';
import { Observer } from '@/components';
import { events } from '@/../../globals';
import { button } from '../elements';
import {boundClass} from 'autobind-decorator'
import { Mode } from '@/types';

@boundClass
export class Page {

    dom: HTMLDivElement;
    observer: Observer;
    tl: gsap.core.Tween;
    nav: HTMLDivElement;
    
    constructor() {
      this.dom = document.createElement('div');
      this.dom.classList.add('page');
      this.observer = new Observer();
      this.createNav();
      this.createObservers();
      this.build();
      gsap.set(this.dom, { autoAlpha: 0 });
    }

    get name() {
      return 'page';
    }

    createObservers() {}

    show() {
      gsap.timeline()
        .to(this.dom, { autoAlpha: 1, duration: 0.25 })
        .fromTo(this.dom.children, {autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.07 })
    }

    hide() {
      gsap.to(this.dom, { autoAlpha: 0, duration: 0.25 })
    }

    build() {
      this.structure.forEach(element => {
        this.dom.appendChild(element);
      });

      this.dom.classList.add(this.name);
    }

    get structure(): any[] {
      return [];
    }

    startGameWithMode(mode: Mode) {
      this.observer.emit(events.mode, mode);
      this.observer.emit(events.start);
    }

    goto(page: string) {
      this.observer.emit(events.goto, page);
    }

    close() {
      this.observer.emit(events.resume);
    }

    back() {
      this.observer.emit(events.back);
    }

    exit() {
      this.observer.emit(events.exit);
    }

    addBackButton() {
      const backButton = button('←', this.back, ['page-back-button']);
      this.nav.appendChild(backButton);
    }

    addCloseButton() {
      const closeButton = button('×', this.close, ['page-close-button']);
      this.nav.appendChild(closeButton);
    }

    createNav() {
      this.nav = document.createElement('div');
      this.nav.classList.add('page-navigation');
      this.dom.appendChild(this.nav);
    }
}
