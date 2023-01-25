import { Page } from "./page";
import { button, text } from "../elements";
import { events } from "@/../../globals";
import {boundClass} from 'autobind-decorator'
import { Side } from "@/types";
import { E } from "@/components/Engine/constants";

@boundClass
export class GameOverPage extends Page {

  createObservers(): void {
    this.observer.on(events.checkmate, this.setResult);
  }

  get structure() {
    return [
      text('Game Over', ['title']),
      text('You win', ['result']),
      button('restart', this.restart),
      button('exit', this.exit),
    ]
  }

  get name() {
    return 'gameover';
  }

  setResult(data: { winner: Side }) {
    const { winner } = data;
    const result = this.dom.querySelector('.result');
    if (game.local) {
      result.textContent = `${winner} wins`;
    } else {
      result.textContent = winner === game.model.sides.user ? 'You win' : 'You lose';
    }
  }

  restart() {
    if (game.online) {
      this.observer.emit(events.restartRequest);
    } else {
      this.observer.emit(events.restart);
    }
  }

}