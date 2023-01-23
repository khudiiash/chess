import { events } from "@/../../globals";
import { button, text } from "../elements";
import { Page } from "./page";
import {boundClass} from 'autobind-decorator'

@boundClass
export class PausePage extends Page {

  build() {
    super.build();
    this.addCloseButton();
  }

  get structure() {
    return [
      text('Pause', ['title']),
      button('Continue', this.close),
      button('Restart', this.restart),
      button('Settings', () => this.goto('settings')),
      button('Exit', this.exit),
    ]
  }

  get name() {
    return 'pause';
  }

  exit() {
    game.online && this.observer.emit(events.leave);
    this.observer.emit(events.exit);
    this.goto('main');
  }

  restart() {
    if (game.online) {
      this.observer.emit(events.restartRequest);
    } else {
      this.observer.emit(events.restart);
    }
  }


}