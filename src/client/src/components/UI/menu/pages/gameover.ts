import { Page } from "./page";
import { button, text } from "../elements";
import { events } from "@/../../globals";
import {boundClass} from 'autobind-decorator'
import { Side } from "@/types";

@boundClass
export class GameOverPage extends Page {

  createObservers(): void {
    super.createObservers();
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
    console.log(winner)
    const result = this.dom.querySelector('.result');
    result.textContent = winner === game.model.sides.user ? 'You win' : 'You lose';
  }


  
  restart() {
    this.observer.emit(events.restart);
  }

}