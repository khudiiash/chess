
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
      this.observer.on(events.guestJoined, this.startGameWithMode.bind(this, 'online'));
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

    copyCode() {
      navigator.clipboard.writeText(game.id);
    }

    async show() {
      const button = this.dom.querySelector('.code') as HTMLElement;
      button.innerText = game.id;
      return super.show();
    }
}