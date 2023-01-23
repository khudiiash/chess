import { Page } from "./page";
import { button, text } from "../elements";
import {boundClass} from 'autobind-decorator'

@boundClass
export class OpponentLeftPage extends Page {

  get name() {
    return 'opponent_left';
  }

  get structure() {
    return [
      text('Your opponent left the game'),
      button('Exit', this.exit),
    ]
  }

}