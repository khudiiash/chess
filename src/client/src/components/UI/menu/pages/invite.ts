
import { Page } from "./page";
import { button, text } from "../elements";
import { events } from "@/../../globals";
import {boundClass} from 'autobind-decorator'

@boundClass
export class InvitePage extends Page {

    code: string;
  
    build(): void {
      super.build();
      this.addBackButton();
    }

    createObservers(): void {
      this.observer.on(events.guestJoined, () => this.startGameWithMode('online'));
      this.observer.on(events.gameCreated, this.setGameId);
    }

    get name() {
      return 'invite';
    }

    get structure() {
      return [
        text('Share this code with your friend.\nGame will start when your friend enters the code.'),
        button(game.id, this.copyCode.bind(this), ['code']),
      ]
    }

    setGameId(id: string) {
      this.code = id;
      (this.dom.querySelector('.code') as HTMLElement).innerText = id;
    }

    copyCode() {
      navigator.clipboard.writeText(this.code);
    }
}